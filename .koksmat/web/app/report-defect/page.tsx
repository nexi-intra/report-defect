"use client";

import { useRouter } from "next/navigation";
import { APPNAME } from "../global";
import { NewBug } from "@/components/new-bug";

export default function Page() {
  const router = useRouter();
  return (
    <div className="space-x-2 h-[90vh] place-content-center container">
      <NewBug />
    </div>
  );
}
