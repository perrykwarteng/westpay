"use client";

import { Input } from "@/component/Input-icon/Input";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

import BackgroundImg from "../../../../public/images/authSmall.svg";

export default function Login() {
  const [rememberMe, setRememberMe] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const TEMP_CREDS = {
    admin: {
      email: "admin@westpay.com",
      password: "admin123",
    },
    user: {
      email: "user@westpay.com",
      password: "user123",
    },
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    await new Promise((res) => setTimeout(res, 1200));

    if (
      email === TEMP_CREDS.admin.email &&
      password === TEMP_CREDS.admin.password
    ) {
      localStorage.setItem("role", "admin");
      router.push("/admin/dashboard");
      return;
    }

    if (
      email === TEMP_CREDS.user.email &&
      password === TEMP_CREDS.user.password
    ) {
      localStorage.setItem("role", "user");
      router.push("/user/dashboard");
      return;
    }

    setLoading(false);
  };

  return (
    <div className="flex h-screen bg-white">
      <div className="flex items-center justify-center w-full md:w-[50%] px-6 sm:px-8 md:px-5 lg:px-16 py-6">
        <section className="w-full max-w-md">
          <Link href="/">
            <h1 className="text-[22px] text-[#2B0850] font-semibold">
              WestPay
            </h1>
          </Link>

          <div className="mt-3">
            <h2 className="text-[28px] text-[#2B0850] font-semibold">
              Welcome Back!
            </h2>
            <p className="text-sm text-gray-500">
              Login to continue using WestPay
            </p>
          </div>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4 w-full">
            <Input
              type="email"
              label="Email"
              placeholder="example@mail.com"
              icon="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              validate
            />

            <Input
              type="password"
              label="Password"
              placeholder="Enter your password"
              icon="lock"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              validate
            />

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 text-[#2B0850] border-gray-300 rounded"
                />
                Remember me
              </label>

              <Link
                href="/auth/forgot-password"
                className="text-sm text-[#2B0850] hover:underline"
              >
                Forgot Password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full px-6 py-2 rounded-md shadow-md text-white transition
                ${
                  loading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-[#2B0850] hover:bg-[#3b0a6a]"
                }`}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  Logging in...
                </span>
              ) : (
                "Log In"
              )}
            </button>

            <p className="text-sm text-gray-600 text-center">
              Not registered yet?{" "}
              <Link
                href="/auth/register"
                className="text-[#2B0850] font-medium hover:underline"
              >
                Register
              </Link>
            </p>
          </form>
        </section>
      </div>

      <div className="hidden md:block md:w-[50%]">
        <Image
          src={BackgroundImg}
          alt="WestPay background"
          className="w-full h-full object-cover"
          priority
        />
      </div>
    </div>
  );
}
