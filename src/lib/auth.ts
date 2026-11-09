import NextAuth, { type DefaultSession } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import { connectDB } from "@/lib/db";
import { User } from "@/models/User";
import { verifyPassword } from "@/lib/password";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: "user" | "admin";
      phone?: string | null;
      isEmailVerified?: boolean;
    } & DefaultSession["user"];
  }

  interface User {
    role?: "user" | "admin";
    phone?: string | null;
  }
}

const adminEmails = (process.env.ADMIN_EMAILS || "")
  .split(",")
  .map((e) => e.trim().toLowerCase())
  .filter(Boolean);

export const { handlers, signIn, signOut, auth } = NextAuth({
  debug: process.env.NODE_ENV === "development",
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  // Only Google OAuth and Credentials (Email + Password / Phone OTP)
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID || process.env.AUTH_GOOGLE_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || process.env.AUTH_GOOGLE_SECRET || "",
    }),
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
        isPhoneOtp: { label: "isPhoneOtp", type: "text" },
      },
      async authorize(credentials) {
        if (!credentials?.email) {
          throw new Error("Email or phone is required");
        }

        const identifier = String(credentials.email).toLowerCase().trim();
        await connectDB();

        // Phone OTP verification flow
        if (credentials.isPhoneOtp === "true") {
          const phone = identifier.replace(/[^0-9]/g, "");
          const user = await User.findOne({ phone });
          if (!user) {
            throw new Error("No user registered with this phone number");
          }
          if (user.blocked) {
            throw new Error("Your account has been suspended.");
          }
          return {
            id: user._id.toString(),
            name: user.name,
            email: user.email,
            image: user.image,
            role: user.role,
            phone: user.phone,
            emailVerified: user.emailVerified,
          };
        }

        // Email + Password flow
        if (!credentials.password) {
          throw new Error("Password is required");
        }

        const user = await User.findOne({ email: identifier });
        if (!user) {
          throw new Error("No user registered with this email");
        }
        if (user.blocked) {
          throw new Error("Your account has been suspended.");
        }
        if (!user.passwordHash) {
          throw new Error("This account uses Google login. Please sign in with Google.");
        }

        const isValid = await verifyPassword(String(credentials.password), user.passwordHash);
        if (!isValid) {
          throw new Error("Incorrect password");
        }

        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          image: user.image,
          role: user.role,
          phone: user.phone,
          emailVerified: user.emailVerified,
        };
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (!user.email) return false;
      const email = user.email.toLowerCase().trim();

      await connectDB();
      let existingUser = await User.findOne({ email });
      const shouldBeAdmin = adminEmails.includes(email);

      if (!existingUser) {
        existingUser = await User.create({
          name: user.name || "Student Medico",
          email,
          image: user.image,
          emailVerified: account?.provider === "google" ? new Date() : null,
          role: shouldBeAdmin ? "admin" : "user",
          providers: account?.provider ? [account.provider] : ["credentials"],
        });
      } else {
        if (account?.provider && !existingUser.providers.includes(account.provider)) {
          existingUser.providers.push(account.provider);
        }
        if (account?.provider === "google" && !existingUser.emailVerified) {
          existingUser.emailVerified = new Date();
        }
        if (shouldBeAdmin && existingUser.role !== "admin") {
          existingUser.role = "admin";
        }
        await existingUser.save();
      }

      if (existingUser.blocked) {
        return false;
      }

      return true;
    },
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id;
        token.role = (user as any).role || (adminEmails.includes((user.email || "").toLowerCase()) ? "admin" : "user");
        token.phone = (user as any).phone;
        token.emailVerified = !!(user as any).emailVerified;
      }

      if (trigger === "update" && session) {
        token.name = session.name || token.name;
        token.phone = session.phone || token.phone;
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = (token.id as string) || (token.sub as string);
        session.user.role = (token.role as "user" | "admin") || "user";
        session.user.phone = token.phone as string | null;
        session.user.isEmailVerified = !!token.emailVerified;
      }
      return session;
    },
  },
});
