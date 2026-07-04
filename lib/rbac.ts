import type { Role } from "./types";

export type Capability =
  | "view_console"
  | "manage_suppliers"
  | "manage_rfq"
  | "review_media"
  | "verify_supplier"
  | "view_audit"
  | "submit_rfq"
  | "manage_own_supplier";

const roleCapabilities: Record<Role, Capability[]> = {
  SuperAdmin: [
    "view_console",
    "manage_suppliers",
    "manage_rfq",
    "review_media",
    "verify_supplier",
    "view_audit",
    "submit_rfq",
    "manage_own_supplier"
  ],
  PlatformAdmin: [
    "view_console",
    "manage_suppliers",
    "manage_rfq",
    "review_media",
    "verify_supplier",
    "view_audit"
  ],
  SourcingManager: ["view_console", "manage_rfq", "submit_rfq"],
  VerificationOfficer: ["view_console", "verify_supplier"],
  MediaReviewer: ["view_console", "review_media"],
  SupplierOwner: ["manage_own_supplier", "submit_rfq"],
  SupplierMember: ["submit_rfq"],
  BuyerAdmin: ["submit_rfq", "manage_rfq"],
  BuyerRequester: ["submit_rfq"],
  InvestorViewer: ["view_console"],
  Auditor: ["view_console", "view_audit"]
};

export function canAccess(role: Role, capability: Capability): boolean {
  return roleCapabilities[role].includes(capability);
}

export function requireCapability(role: Role, capability: Capability): void {
  if (!canAccess(role, capability)) {
    throw new Error(`Role ${role} cannot ${capability}`);
  }
}
