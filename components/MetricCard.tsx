type MetricCardProps = {
  label: string;
  value: string | number;
  detail: string;
  tone?: "teal" | "copper" | "gold" | "steel";
};

export function MetricCard({ label, value, detail, tone = "teal" }: MetricCardProps) {
  return (
    <article className={`metric-card metric-card--${tone}`}>
      <span>{label}</span>
      <strong>{value}</strong>
      <small>{detail}</small>
    </article>
  );
}
