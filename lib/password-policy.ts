export const PASSWORD_MIN_LENGTH = 12;

export function meetsPasswordPolicy(password: string): boolean {
  return (
    password.length >= PASSWORD_MIN_LENGTH &&
    /[A-Z]/.test(password) &&
    /[^A-Za-z0-9]/.test(password)
  );
}
