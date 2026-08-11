import { SignUp } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-bg-base">
      <SignUp path="/sign-up" />
    </div>
  );
}
