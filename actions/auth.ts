"use server";

import axios from "axios";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:8080/api/v1";

async function apiCall(endpoint: string, data: any) {
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
  } catch (error: any) {
    console.error(`API Error [${endpoint}]:`, error.response?.data || error.message);
    return { 
      success: false, 
      message: error.response?.data?.message || "Something went wrong" 
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

export async function signupAction(formData: {fullName: string, email: string, password: string}) {
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
