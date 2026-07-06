import type { Role } from "./types";

type Permission = "view_console" | "manage_partners" | "review_partners";

const permissions: Record<Role, Permission[]> = {
  Admin: ["view_console", "manage_partners", "review_partners"],
  Reviewer: ["view_console", "review_partners"]
};

export function canAccess(role: Role, permission: Permission): boolean {
  return permissions[role]?.includes(permission) ?? false;
}
