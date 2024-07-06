"use client";

import { useRouter } from "next/navigation";
import { NewBug } from "@/components/new-bug";
import { useState } from "react";
import CreateRequest, {
  CreateRequestProps,
} from "@/components/actions/create-request";

export default function Page() {
  const router = useRouter();
  const [bug, setbug] = useState<CreateRequestProps>();

  return (
    <div className="space-x-2 h-[90vh] place-content-center container">
      <NewBug
        onSubmit={(data) => {
          const bug: CreateRequestProps = {
            application: "koksmat",
            body: data,
            description: "Report a defect",
            headers: {},
            method: "POST",
            name: "report-defect",
            route: "/defects",
            searchindex: "koksmat",
            tenant: "koksmat",
          };
          setbug(bug);
        }}
      />
      {bug && <CreateRequest transactionid={"newbug"} request={bug} />}
      {/* <pre>{JSON.stringify(bug, null, 2)}</pre> */}
    </div>
  );
}
