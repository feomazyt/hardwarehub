"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useState } from "react";

import { Button } from "@/components/ui/button";

type AuthMode = "login" | "register";

type AuthFormProps = {
  mode: AuthMode;
};

export function AuthForm({ mode }: AuthFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);

  const isRegister = mode === "register";

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setIsPending(true);

    try {
      const response = await fetch(
        isRegister ? "/api/auth/register" : "/api/auth/login",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(
            isRegister ? { name, email, password } : { email, password }
          ),
        }
      );

      const payload = (await response.json()) as { error?: string };
      if (!response.ok) {
        setError(payload.error ?? "Wystapil blad.");
        return;
      }

      const nextParam = searchParams.get("next");
      const redirectTo =
        nextParam && nextParam.startsWith("/") ? nextParam : "/";
      router.push(redirectTo);
      router.refresh();
    } catch {
      setError("Nie udalo sie polaczyc z serwerem.");
    } finally {
      setIsPending(false);
    }
  }

  return (
    <div className="mx-auto w-full max-w-md rounded-xl border border-outline-variant/20 bg-surface-container-low p-8 shadow-sm">
      <h1 className="headline-font mb-2 text-2xl font-bold text-on-surface">
        {isRegister ? "Utworz konto" : "Zaloguj sie"}
      </h1>
      <p className="mb-8 text-sm text-on-surface-variant">
        {isRegister
          ? "Podaj dane, aby zalozyc konto w HardwareHub."
          : "Wpisz dane, aby kontynuowac zakupy."}
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        {isRegister ? (
          <label className="block">
            <span className="mb-1 block text-xs font-medium uppercase tracking-wide text-on-surface-variant">
              Imie
            </span>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-md border border-outline-variant/20 bg-surface px-3 py-2 text-sm text-on-surface outline-none focus:border-primary"
              placeholder="np. Jan"
            />
          </label>
        ) : null}

        <label className="block">
          <span className="mb-1 block text-xs font-medium uppercase tracking-wide text-on-surface-variant">
            Email
          </span>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full rounded-md border border-outline-variant/20 bg-surface px-3 py-2 text-sm text-on-surface outline-none focus:border-primary"
            placeholder="jan@przyklad.pl"
          />
        </label>

        <label className="block">
          <span className="mb-1 block text-xs font-medium uppercase tracking-wide text-on-surface-variant">
            Haslo
          </span>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            minLength={8}
            required
            className="w-full rounded-md border border-outline-variant/20 bg-surface px-3 py-2 text-sm text-on-surface outline-none focus:border-primary"
            placeholder="min. 8 znakow"
          />
        </label>

        {error ? (
          <p className="rounded-md bg-error-container px-3 py-2 text-sm text-error">
            {error}
          </p>
        ) : null}

        <Button
          type="submit"
          disabled={isPending}
          className="h-10 w-full justify-center p-0 font-semibold"
        >
          {isPending
            ? "Przetwarzanie..."
            : isRegister
              ? "Utworz konto"
              : "Zaloguj sie"}
        </Button>
      </form>

      <p className="mt-6 text-sm text-on-surface-variant">
        {isRegister ? "Masz juz konto?" : "Nie masz konta?"}{" "}
        <Link
          href={isRegister ? "/auth/login" : "/auth/register"}
          className="font-semibold text-primary hover:underline"
        >
          {isRegister ? "Zaloguj sie" : "Zarejestruj sie"}
        </Link>
      </p>
    </div>
  );
}
