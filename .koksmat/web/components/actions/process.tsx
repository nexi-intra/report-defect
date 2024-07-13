"use client";

import { https } from "@/app/koksmat/httphelper";
import { MagicboxContext } from "@/app/koksmat/magicbox-context";
import { run } from "@/app/koksmat/magicservices";

import { useMsal, useAccount } from "@azure/msal-react";
import { useContext, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { trace } from "console";
import { set } from "date-fns";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface CaseProps {
  scopes: string[];
  title: string;
  testurl: string;
  token?: string;
}
const UserProfileAPI: CaseProps = {
  scopes: ["User.Read"],
  title: "Read user profile",
  testurl: "https://graph.microsoft.com/v1.0/me",
};

export interface ProcessProps {
  servicename: string;
  processname: string;
  payload: any;
  onError?: (error: any) => void;
  onSuccess?: (response: any) => void;
}
export function Process(props: ProcessProps) {
  const { servicename, processname, payload, onError, onSuccess } = props;
  const { instance, accounts, inProgress } = useMsal();
  const account = useAccount(accounts[0] || {});
  const [latestResponse, setlatestResponse] = useState<any>();
  const [token, settoken] = useState("");
  const [latestError, setlatestError] = useState<any>();

  const magicbox = useContext(MagicboxContext);
  const aquireToken = async (thisCase: CaseProps) => {
    setlatestError(undefined);
    setlatestResponse(undefined);
    if (account && thisCase) {
      try {
        const response = await instance.acquireTokenSilent({
          scopes: thisCase?.scopes ?? [],
          account: account,
        });
        thisCase.token = response.accessToken;
        magicbox.setAuthToken(response.accessToken, "MSAL");
        settoken(response.accessToken);
        const getResponse = await https(
          response.accessToken,
          "GET",
          thisCase.testurl
        );
        setlatestResponse(getResponse);
      } catch (error) {
        try {
          const response = await instance.acquireTokenPopup({
            scopes: thisCase?.scopes ?? [],
            account: account,
          });
          thisCase.token = response.accessToken;
          settoken(response.accessToken);
          magicbox.setAuthToken(response.accessToken, "MSAL");

          const getResponse = await https(
            response.accessToken,
            "GET",
            thisCase.testurl
          );
          setlatestResponse(getResponse);
        } catch (error) {
          setlatestError(error);
        }
      }
    }
  };

  useEffect(() => {
    const load = async () => {
      if (magicbox.authtoken) {
        settoken(magicbox.authtoken);
        return;
      }
      await aquireToken(UserProfileAPI);
    };
    load();
  }, []);
  useEffect(() => {
    const load = async () => {
      if (!token) return;
      const calledTimestamp = new Date();
      const args = ["process", processname, token, JSON.stringify(payload)];

      const result = await https(token, "POST", "/api/run", {
        args,
        channel: servicename,
        timeout: 600,
      });

      //const result = await run(servicename, args, "", 600, "x");

      magicbox.logServiceCall({
        calledTimestamp,
        responedTimestamp: new Date(),
        request: {
          args: ["process", processname, JSON.stringify(payload)],
          body: "",
          channel: servicename,
          timeout: 600,
        },
        servicename,
        response: result,
        transactionId: "x",
      });

      if (result.hasError) {
        onError?.(result.errorMessage ?? "unknown error");
      } else {
        onSuccess?.(result.data);
      }
    };
    load();
  }, [token]);
  return <div></div>;
}

export default function ProcessTransaction(props: {
  processname: string;
  payload: any;
  transactionId: string;
  onSuccess?: (result: any) => void;
  onError?: (error: any) => void;
  options?: { suppressError?: boolean; suppressProgress?: boolean };
}) {
  const { payload, processname, transactionId } = props;
  const [running, setrunning] = useState(false);
  const [error, seterror] = useState("");
  const [result, setresult] = useState("");

  const doShowError = () => {
    if (props.options?.suppressError) {
      return false;
    }
    if (error) {
      return true;
    }
    return false;
  };

  const doShowProgress = () => {
    if (props.options?.suppressProgress) {
      return false;
    }
    if (running) {
      return true;
    }
    return false;
  };

  // hack to ensure that the process will run when the transactionId changes
  useEffect(() => {
    setrunning(true);
  }, [transactionId]);

  const component = (
    <div>
      {doShowError() && <div className="bg-red-500">Error: {error}</div>}
      {running && (
        <div>
          <Process
            servicename="magic-mix.app"
            processname={processname}
            payload={payload}
            onError={(error: any) => {
              setrunning(false);
              seterror(error);
              if (props.onError) {
                props.onError(error);
              }
            }}
            onSuccess={(result: any) => {
              setrunning(false);
              if (result.hasError) {
                seterror(result.errorMessage);
                if (props.onError) {
                  props.onError(result.errorMessage);
                }
              } else {
                setresult(result.data);
                if (props.onSuccess) {
                  props.onSuccess(result.data);
                }
              }
            }}
          />
        </div>
      )}
    </div>
  );
  let wrapper = component;

  if (true) {
    wrapper = (
      <Dialog
        defaultOpen={true}
        onOpenChange={(open) => {
          if (!open) {
            setrunning(false);
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Processing</DialogTitle>
            <DialogDescription>xxx</DialogDescription>
          </DialogHeader>
          {component}
        </DialogContent>
      </Dialog>
    );
  }

  return wrapper;
}
