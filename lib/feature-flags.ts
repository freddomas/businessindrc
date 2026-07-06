export const featureFlags = {
  publicApiEnabled: process.env.PUBLIC_API_ENABLED === "true",
  webhooksEnabled: process.env.WEBHOOKS_ENABLED === "true",
  externalIntegrationsEnabled: process.env.EXTERNAL_INTEGRATIONS_ENABLED === "true",
  paymentsEnabled: process.env.PAYMENTS_ENABLED === "true"
};
