import { Suspense } from "react";
import ResetPasswordPage from "./ResetPassword";

export default function Page() {
  return (
    <Suspense fallback={<div className="p-8 text-center">Loading...</div>}>
      <ResetPasswordPage />
    </Suspense>
  );
}
