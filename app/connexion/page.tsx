import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { LoginForm } from "../../components/LoginForm";
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
        <Link href="/" className="login-logo" aria-label="OCTOPUS Mining">
          <Image src="/media/octopus-logo.png" alt="Logo OCTOPUS Mining" width={214} height={66} priority unoptimized />
        </Link>
        <p className="eyebrow">Accès réservé</p>
        <h1 id="login-title">Console de pilotage</h1>
        <p className="login-intro">
          Authentification requise pour consulter et mettre à jour le registre des partenaires qualifiés.
        </p>
        <LoginForm initialError={hasError} />
      </section>
    </main>
  );
}
