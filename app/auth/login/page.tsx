import { AuthForm } from "@/components/auth/AuthForm";
import { getCurrentUserFromCookies } from "@/lib/auth/get-current-user";
import { redirect } from "next/navigation";

export default async function LoginPage() {
  const user = await getCurrentUserFromCookies();
  if (user) redirect("/");

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 md:px-8">
      <AuthForm mode="login" />
    </section>
  );
}
