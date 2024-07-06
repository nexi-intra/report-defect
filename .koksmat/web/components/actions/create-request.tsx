"use client";

export interface CreateRequestProps {
  application: string;
  body: { [key: string]: any };
  description: string;
  headers: { [key: string]: any };
  method: string;
  name: string;
  route: string;
  /**
   * Search Index is used for concatenating all searchable fields in a single field making in
   * easier to search
   */
  searchindex: string;
  tenant: string;
}

import React, { useEffect, useState } from "react";
import ProcessTransaction from "./process";

export default function CreateRequest(props: {
  transactionid: string;
  request: CreateRequestProps | null | undefined;
}) {
  const { request, transactionid } = props;
  const hasRequestBeenInitialized = () => {
    return request !== null && request !== undefined;
  };
  const [payload, setpayload] = useState<CreateRequestProps | null | undefined>(
    null
  );
  useEffect(() => {
    if (!hasRequestBeenInitialized()) return;

    setpayload(request);
  }, [request]);

  return (
    <div>
      {hasRequestBeenInitialized() && (
        <ProcessTransaction
          payload={payload}
          processname="create_request"
          transactionId={transactionid}
        />
      )}
    </div>
  );
}
