export type Origin =
  | "synthetic_seed"
  | "public_market"
  | "user_submitted"
  | "verified_real";

export type Visibility = "staging_only" | "public" | "private";
export type ReviewStatus = "draft" | "reviewed" | "approved" | "rejected";
export type RfqStatus =
  | "draft"
  | "submitted"
  | "qualified"
  | "suppliers_invited"
  | "responses_received"
  | "shortlisted"
  | "closed_won"
  | "closed_lost"
  | "cancelled";

export type Role =
  | "SuperAdmin"
  | "PlatformAdmin"
  | "SourcingManager"
  | "VerificationOfficer"
  | "MediaReviewer"
  | "SupplierOwner"
  | "SupplierMember"
  | "BuyerAdmin"
  | "BuyerRequester"
  | "InvestorViewer"
  | "Auditor";

export type FeatureFlags = {
  PUBLIC_API_ENABLED: boolean;
  WEBHOOKS_ENABLED: boolean;
  EXTERNAL_INTEGRATIONS_ENABLED: boolean;
  PAYMENTS_ENABLED: boolean;
  PRESENTATION_SEED_ENABLED: boolean;
  AI_PHOTO_GENERATION_ENABLED: boolean;
  MEDIA_REVIEW_REQUIRED: boolean;
  INVESTOR_MODE_ENABLED: boolean;
};

export type Supplier = {
  slug: string;
  name: string;
  city: string;
  sector: string;
  verificationTier: number;
  verificationLabel: string;
  availability: string;
  score: number;
  services: string[];
  capacity: {
    crew: number;
    fleet: number;
    serviceRadiusKm: number;
    responseTimeHours: number;
  };
  documents: string[];
  origin: Origin;
  visibility: Visibility;
  reviewStatus: ReviewStatus;
};

export type Rfq = {
  id: string;
  title: string;
  city: string;
  sector: string;
  status: RfqStatus;
  urgency: "standard" | "priority" | "critical";
  deadline: string;
  lines: string[];
  origin: Origin;
  visibility: Visibility;
  reviewStatus: ReviewStatus;
};

export type Opportunity = {
  id: string;
  title: string;
  city: string;
  sector: string;
  deadline: string;
  accessLevel: "open" | "qualified" | "managed";
  status: "active" | "screening" | "shortlist";
  origin: Origin;
  visibility: Visibility;
  reviewStatus: ReviewStatus;
};

export type MediaAsset = {
  id: string;
  title: string;
  reviewStatus: "APPROVED" | "REJECTED" | "PENDING";
  licenseStatus: "VALID" | "INVALID" | "PENDING";
  isAiLike: boolean;
  allowedUse: string[];
  alt: string;
};

export type DashboardStats = {
  suppliers: number;
  rfqs: number;
  opportunities: number;
  verifiedSuppliers: number;
  cities: number;
  approvedMedia: number;
};

export type SessionUser = {
  email: string;
  name: string;
  role: Role;
  organization: string;
};
