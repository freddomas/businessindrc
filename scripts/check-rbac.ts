import { canAccess } from "../lib/rbac";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) {
    throw new Error(message);
  }
}

assert(canAccess("Admin", "view_console"), "Admin must view console.");
assert(canAccess("Admin", "manage_partners"), "Admin must manage partners.");
assert(canAccess("Reviewer", "view_console"), "Reviewer must view console.");
assert(canAccess("Reviewer", "review_partners"), "Reviewer must review partners.");
assert(!canAccess("Reviewer", "manage_partners"), "Reviewer must not manage partners.");

console.log("RBAC validation passed.");
