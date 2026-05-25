"use server";

import axios from "axios";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:8080/api/v1";
const COOKIE_NAME = "auth_token";

type ApiRequestData = Record<string, string | undefined>;

async function apiCall(endpoint: string, data: ApiRequestData) {
  try {
    const response = await axios.post(`${BACKEND_URL}${endpoint}`, data, {
      headers: { "Content-Type": "application/json" }
    });
    
    const setCookieHeader = response.headers["set-cookie"];
    if (setCookieHeader) {
      const cookieStore = await cookies();
      setCookieHeader.forEach((cookieString) => {
        const [nameValue] = cookieString.split("; ");
        const [name, value] = nameValue.split("=");
        cookieStore.set(name, value, {
            path: '/',
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: 'lax',
        });
      });
    }
    
    return { success: true, data: response.data };
  } catch (error) {
    const message = axios.isAxiosError(error)
      ? error.response?.data?.message || error.message
      : "Something went wrong";
    const details = axios.isAxiosError(error) ? error.response?.data || error.message : error;
    console.error(`API Error [${endpoint}]:`, details);
    return { 
      success: false, 
      message,
    };
  }
}

export async function loginAction(formData: FormData) {
  const email = formData.get("email")?.toString();
  const password = formData.get("password")?.toString();

  const result = await apiCall("/auth/login", { email, password });

  if (result.success) {
    const user = result.data.result.user;
    if (!user.isVerified) {
      redirect(`/verify-email?email=${encodeURIComponent(user.email)}`);
    }
    
    redirect("/chat");
  }

  return result;
}

export async function signupAction(formData: {fullName: string; email: string; password: string}) {
  const result = await apiCall("/auth/register", formData);

  if (result.success) {
    redirect(`/verify-email?email=${encodeURIComponent(formData.email)}`);
  }

  return result;
}

export async function verifyOtpAction(email: string, code: string) {
  const result = await apiCall("/auth/verify-otp", { email, code });

  if (result.success) {
    redirect("/chat");
  }

  return result;
}

export async function resendOtpAction(email: string) {
  return await apiCall("/auth/resend-otp", { email });
}

export async function forgotPasswordAction(email: string) {
  const result = await apiCall("/auth/forgot-password", { email });

  if (result.success) {
    const cookieStore = await cookies();
    cookieStore.delete(COOKIE_NAME);
  }

  return result;
}

export async function resetPasswordAction(token: string, newPassword: string) {
  const result = await apiCall("/auth/reset-password", { token, newPassword });

  if (result.success) {
    const cookieStore = await cookies();
    cookieStore.delete(COOKIE_NAME);
  }

  return result;
}

export async function logoutAction() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
  redirect("/login");
}
