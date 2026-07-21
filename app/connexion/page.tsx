import Link from "next/link";
import { redirect } from "next/navigation";
import { LoginForm } from "../../components/LoginForm";
import { BrandLockup } from "../../components/BrandLockup";
import { getSessionUser } from "../../lib/auth";

export default async function LoginPage({
  searchParams
}: {
  searchParams?: Promise<{ error?: string }>;
}) {
  const user = await getSessionUser();

  if (user) {
    redirect("/console");
  }

  const params = await searchParams;
  const hasError = Boolean(params?.error);

  return (
    <main className="login-page">
      <section className="login-panel" aria-labelledby="login-title">
        <BrandLockup className="login-logo" priority />
        <p className="signal-label"><span /> Espace sécurisé</p>
        <h1 id="login-title">Reprendre le fil d&apos;une décision.</h1>
        <p className="login-intro">
          Connectez-vous pour consulter les flux RFQ, qualifier les partenaires et suivre les décisions en cours.
        </p>
        <LoginForm initialError={hasError} />
      </section>
    </main>
  );
}
