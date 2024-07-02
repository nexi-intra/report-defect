"use client";
import { IPublicClientApplication } from "@azure/msal-browser";

import { createContext } from "react";
import { Result } from "./httphelper";
import { MagicRequest } from "./magicservices";
export interface Session {
  user: User;
  expires: string;
  roles: string[];
  accessToken: string;
}

export interface User {
  name: string;
  email: string;
  image: string;
  id: string;
  roles: string[];
}
export type ServiceCallLogEntry = {
  transactionId: string;
  calledTimestamp: Date;
  responedTimestamp: Date;
  request: MagicRequest;
  servicename: string;
  response: Result<any>;
};
export type AuthSource = "MSAL" | "SharePoint" | "";
export type MagicboxContextType = {
  session?: Session;
  version: number;
  user?: User;
  setAccount: (
    username: string,
    email: string,
    image: string,
    id: string,
    roles: string[]
  ) => void;
  registerAuth: (pca: IPublicClientApplication) => void;
  signIn: (scopes: string[], loginHint: string) => Promise<boolean>;
  signOut: () => void;
  refresh: () => void;
  setAuthToken: (token: string, source: AuthSource) => void;
  authtoken: string;
  authSource: AuthSource;
  transactionId: string;
  setTransactionId: (transactionId: string) => void;
  servicecalllog: ServiceCallLogEntry[];
  logServiceCall: (request: ServiceCallLogEntry) => void;
  clearServiceCallLog: () => void;
  showTracer: boolean;
  setShowTracer: (showTracer: boolean) => void;
};
export const MagicboxContext = createContext<MagicboxContextType>({
  session: {
    user: {
      name: "",
      email: "",
      image: "",
      id: "",
      roles: [],
    },
    expires: "",
    roles: [],
    accessToken: "",
  },
  version: 0,
  refresh: () => {},
  signIn: function (scopes: string[], loginHint?: string): Promise<boolean> {
    throw new Error("Function not implemented.");
  },
  signOut: function (): void {
    throw new Error("Function not implemented.");
  },
  setAccount: function (username: string, email: string, image: string): void {
    throw new Error("Function not implemented.");
  },
  registerAuth: function (pca: IPublicClientApplication): void {
    throw new Error("Function not implemented.");
  },
  authtoken: "",
  setAuthToken: function (token: string, source: AuthSource): void {
    throw new Error("Function not implemented.");
  },
  authSource: "",
  transactionId: "",
  setTransactionId: function (transactionId: string): void {
    throw new Error("Function not implemented.");
  },
  servicecalllog: [],

  clearServiceCallLog: function (): void {
    throw new Error("Function not implemented.");
  },
  logServiceCall: function (request: ServiceCallLogEntry): void {
    throw new Error("Function not implemented.");
  },
  showTracer: false,
  setShowTracer: function (showTracer: boolean): void {
    throw new Error("Function not implemented.");
  },
});
