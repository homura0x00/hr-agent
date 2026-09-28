import { LoginForm } from "~/components/login-form";

export function meta() {
  return [
    { title: "Sign in · Acme Admin" },
    { name: "description", content: "Sign in to the Acme admin dashboard." },
  ];
}

export default function Login() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <LoginForm />
      </div>
    </div>
  );
}
