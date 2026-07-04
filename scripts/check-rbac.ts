import { canAccess } from "../lib/rbac";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) {
    throw new Error(message);
  }
}

assert(canAccess("SuperAdmin", "review_media"), "SuperAdmin must review media.");
assert(canAccess("SourcingManager", "manage_rfq"), "SourcingManager must manage RFQ.");
assert(!canAccess("SupplierMember", "view_console"), "SupplierMember must not view console.");
assert(!canAccess("InvestorViewer", "manage_rfq"), "InvestorViewer must not manage RFQ.");
assert(!canAccess("MediaReviewer", "manage_suppliers"), "MediaReviewer must not manage suppliers.");

console.log("RBAC validation passed.");
