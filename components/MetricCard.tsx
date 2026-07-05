type MetricCardProps = {
  label: string;
  value: number | string;
  detail: string;
  tone?: "teal" | "copper" | "gold" | "steel";
};

export function MetricCard({ label, value, detail, tone = "steel" }: MetricCardProps) {
  return (
    <article className={`metric-card metric-card--${tone}`}>
      <p>{label}</p>
      <strong>{value}</strong>
      <span>{detail}</span>
    </article>
  );
}
