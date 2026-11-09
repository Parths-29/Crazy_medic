// Common disposable and temporary email domains
export const DISPOSABLE_EMAIL_DOMAINS = new Set([
  "10minutemail.com",
  "mailinator.com",
  "tempmail.com",
  "guerrillamail.com",
  "throwawaymail.com",
  "yopmail.com",
  "sharklasers.com",
  "dispostable.com",
  "getnada.com",
  "trashmail.com",
  "fakeinbox.com",
  "temp-mail.org",
  "mohmal.com",
  "crazymailing.com",
]);

export function isDisposableEmail(email: string): boolean {
  if (!email || !email.includes("@")) return false;
  const domain = email.split("@")[1]?.toLowerCase().trim();
  return domain ? DISPOSABLE_EMAIL_DOMAINS.has(domain) : false;
}

