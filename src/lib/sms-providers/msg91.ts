import { ISmsProvider, SendOtpParams } from "./types";

export class Msg91SmsProvider implements ISmsProvider {
  name = "MSG91";
  private authKey: string;
  private templateId: string;

  constructor() {
    this.authKey = process.env.MSG91_AUTH_KEY || "";
    this.templateId = process.env.MSG91_TEMPLATE_ID || "";
  }

  async sendOtp({ phone, otp }: SendOtpParams): Promise<{ success: boolean; messageId?: string; error?: string }> {
    // If running in development without live keys, log to console for instant developer testing
    if (!this.authKey || !this.templateId) {
      console.log(`\n==========================================`);
      console.log(`[MSG91 DEV SIMULATOR]`);
      console.log(`To: +91${phone}`);
      console.log(`Your The Crazy Medic OTP is: ${otp}`);
      console.log(`Valid for 5 minutes.`);
      console.log(`==========================================\n`);
      return { success: true, messageId: `mock-${Date.now()}` };
    }

    try {
      const formattedPhone = phone.startsWith("91") ? phone : `91${phone}`;
      const url = `https://control.msg91.com/api/v5/otp?template_id=${this.templateId}&mobile=${formattedPhone}&authkey=${this.authKey}&otp=${otp}`;

      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      const data = await res.json();
      if (res.ok && data.type === "success") {
        return { success: true, messageId: data.message };
      }

      return { success: false, error: data.message || "Failed to send OTP via MSG91" };
    } catch (err: any) {
      return { success: false, error: err.message || "MSG91 network error" };
    }
  }
}

export const smsProvider: ISmsProvider = new Msg91SmsProvider();

