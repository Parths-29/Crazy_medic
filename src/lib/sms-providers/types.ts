export interface SendOtpParams {
  phone: string;
  otp: string;
}

export interface ISmsProvider {
  name: string;
  sendOtp(params: SendOtpParams): Promise<{ success: boolean; messageId?: string; error?: string }>;
}

