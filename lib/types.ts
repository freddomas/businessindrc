export type Role = "Admin" | "Reviewer";

export type PartnerStatus = "Qualifié" | "En analyse" | "Sous réserve" | "Suspendu";

export type RiskLevel = "Bas" | "Modéré" | "Élevé";

export type Partner = {
  id: string;
  companyName: string;
  sector: string;
  city: string;
  province: "Lualaba" | "Haut-Katanga";
  contactName: string;
  contactTitle: string;
  phone: string;
  email: string;
  status: PartnerStatus;
  riskLevel: RiskLevel;
  readinessScore: number;
  workforce: number;
  annualCapacity: string;
  zoneCoverage: string[];
  services: string[];
  certifications: string[];
  lastAssessment: string;
  notes: string;
};

export type PartnerInput = Omit<Partner, "id"> & {
  id?: string;
};

export type PartnerFilters = {
  sector?: string;
  city?: string;
  status?: PartnerStatus | "";
  query?: string;
};

export type DashboardStats = {
  total: number;
  qualified: number;
  underReview: number;
  averageReadiness: number;
  sectors: number;
  cities: number;
};

export type SessionUser = {
  username: string;
  email: string;
  name: string;
  role: Role;
  organization: string;
};

export type MediaAsset = {
  id: string;
  file: string;
  title: string;
  source: "provided" | "generated";
  sourceDetail: string;
  license: string;
  alt: string;
  approved: boolean;
};
