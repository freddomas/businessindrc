import type { FeatureFlags } from "./types";

function flag(name: keyof FeatureFlags, fallback: boolean): boolean {
  const value = process.env[name];

  if (value == null || value === "") {
    return fallback;
  }

  return value.toLowerCase() === "true";
}

export function getFeatureFlags(): FeatureFlags {
  return {
    PUBLIC_API_ENABLED: flag("PUBLIC_API_ENABLED", false),
    WEBHOOKS_ENABLED: flag("WEBHOOKS_ENABLED", false),
    EXTERNAL_INTEGRATIONS_ENABLED: flag("EXTERNAL_INTEGRATIONS_ENABLED", false),
    PAYMENTS_ENABLED: flag("PAYMENTS_ENABLED", false),
    PRESENTATION_SEED_ENABLED: flag("PRESENTATION_SEED_ENABLED", true),
    AI_PHOTO_GENERATION_ENABLED: flag("AI_PHOTO_GENERATION_ENABLED", false),
    MEDIA_REVIEW_REQUIRED: flag("MEDIA_REVIEW_REQUIRED", true),
    INVESTOR_MODE_ENABLED: flag("INVESTOR_MODE_ENABLED", true)
  };
}
