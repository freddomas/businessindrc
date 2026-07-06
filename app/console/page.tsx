import { redirect } from "next/navigation";
import { AdminConsole } from "../../components/AdminConsole";
import { getSessionUser } from "../../lib/auth";
import { getDashboardStats, getSectors, listPartners } from "../../lib/repository";

export default async function ConsolePage() {
  const user = await getSessionUser();

  if (!user) {
    redirect("/connexion");
  }

  const [partners, stats] = await Promise.all([listPartners(), getDashboardStats()]);

  return (
    <main className="console-page">
      <AdminConsole initialPartners={partners} initialStats={stats} sectors={getSectors()} user={user} />
    </main>
  );
}
