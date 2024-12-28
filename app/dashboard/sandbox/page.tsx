"use client";

import React from "react";
import { testServer } from "@/lib/server-test";

export default function SandboxPage() {
  return (
    <>
      <div>
        <button onClick={testServer}>Test Server</button>
      </div>
    </>
  );
}
