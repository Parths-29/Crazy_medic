import { z } from "zod";

const envSchema = z.object({
  // Database
  MONGODB_URI: z.string().default(""),
  // Auth
  NEXTAUTH_URL: z.string().url().default("http://localhost:3000"),
  AUTH_SECRET: z.string().default("dev_secret_only_change_in_production_32chars"),
  // OAuth
  GOOGLE_CLIENT_ID: z.string().default(""),
  GOOGLE_CLIENT_SECRET: z.string().default(""),
  APPLE_ID: z.string().default(""),
  APPLE_TEAM_ID: z.string().default(""),
  APPLE_KEY_ID: z.string().default(""),
  APPLE_PRIVATE_KEY: z.string().default(""),
  ENABLE_APPLE_LOGIN: z.enum(["true", "false"]).default("false"),
  ENABLE_PHONE_LOGIN: z.enum(["true", "false"]).default("true"),
  // Email
  RESEND_API_KEY: z.string().default(""),
  EMAIL_FROM: z.string().default("The Crazy Medic <hello@thecrazymedic.com>"),
  // SMS
  MSG91_AUTH_KEY: z.string().default(""),
  MSG91_TEMPLATE_ID: z.string().default(""),
  // Razorpay
  RAZORPAY_KEY_ID: z.string().default(""),
  RAZORPAY_KEY_SECRET: z.string().default(""),
  RAZORPAY_WEBHOOK_SECRET: z.string().default(""),
  // Cloudflare R2
  R2_ACCOUNT_ID: z.string().default(""),
  R2_ACCESS_KEY_ID: z.string().default(""),
  R2_SECRET_ACCESS_KEY: z.string().default(""),
  R2_BUCKET: z.string().default(""),
  // AI Keys
  GEMINI_API_KEY: z.string().default(""),
  SARVAM_API_KEY: z.string().default(""),
  // Admin
  ADMIN_EMAILS: z.string().default(""),
  // Public
  NEXT_PUBLIC_SITE_NAME: z.string().default("The Crazy Medic"),
  NEXT_PUBLIC_CREATOR_NAME: z.string().default("Vismay Sharma"),
});

const _env = envSchema.safeParse(process.env);

if (!_env.success) {
  console.error("❌ Invalid environment variables:", _env.error.format());
  throw new Error("Invalid environment variables");
}

export const env = _env.data;

