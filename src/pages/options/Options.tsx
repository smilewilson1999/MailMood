import React from "react";
import { ApiSettings } from "./components/ApiSettings";

export default function Options() {
  return (
    <div className="flex items-center justify-center min-h-screen w-full">
      <div className="container mx-auto p-6 max-w-2xl bg-white shadow-md rounded-lg">
        <h1 className="text-2xl font-bold mb-6">MailMood Settings</h1>
        <div className="space-y-6">
          <ApiSettings />
        </div>
      </div>
    </div>
  );
}
