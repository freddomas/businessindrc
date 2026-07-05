import { LockKeyhole } from "lucide-react";
import { TopNav } from "../../components/TopNav";

export default function LoginPage() {
  return (
    <>
      <TopNav />
      <main className="auth-shell">
        <form className="auth-panel" action="/api/auth/login" method="post">
          <LockKeyhole aria-hidden="true" size={28} />
          <p>Accès restreint</p>
          <h1>Console de pilotage</h1>
          <label>
            Email
            <input name="email" type="email" autoComplete="email" required />
          </label>
          <label>
            Mot de passe
            <input name="password" type="password" autoComplete="current-password" required />
          </label>
          <button type="submit">Entrer</button>
        </form>
      </main>
    </>
  );
}
