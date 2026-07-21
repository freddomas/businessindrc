import { hash } from "bcryptjs";
import { resolveUser } from "../lib/auth";
import { meetsPasswordPolicy, PASSWORD_MIN_LENGTH } from "../lib/password-policy";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

async function main() {
  assert(PASSWORD_MIN_LENGTH === 12, "Password minimum must remain 12 characters.");
  assert(!meetsPasswordPolicy("Short1!"), "Short passwords must be rejected.");
  assert(!meetsPasswordPolicy("lowercase-only!"), "An uppercase character is required.");
  assert(!meetsPasswordPolicy("UppercaseOnly12"), "A special character is required.");

  const strongPassword = `Strong!${Date.now()}X`;
  const user = {
    username: "controlled-admin",
    email: "controlled-admin@octopus.local",
    name: "Controlled admin",
    role: "Admin" as const,
    organization: "Octopus Expertise",
    passwordHash: await hash(strongPassword, 10)
  };

  assert((await resolveUser(user.username, "Weak1!", user)) === null, "Weak database passwords must fail.");
  assert((await resolveUser(user.username, strongPassword, user))?.username === user.username, "Strong database credentials must pass.");

  delete process.env.LOCAL_ADMIN_ENABLED;
  assert((await resolveUser(user.username, strongPassword, null)) === null, "Local admin must be disabled by default.");

  process.env.LOCAL_ADMIN_ENABLED = "true";
  process.env.LOCAL_ADMIN_USERNAME = user.username;
  process.env.LOCAL_ADMIN_EMAIL = user.email;
  process.env.LOCAL_ADMIN_PASSWORD_HASH = user.passwordHash;
  assert((await resolveUser(user.username, strongPassword, null))?.username === user.username, "Explicit controlled local credentials must pass.");
  assert((await resolveUser(user.username, `${strongPassword}wrong`, null)) === null, "Incorrect local credentials must fail.");

  console.log("Authentication policy validation passed.");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
