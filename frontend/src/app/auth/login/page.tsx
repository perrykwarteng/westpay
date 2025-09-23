"use client";

import Input from "@/component/Input-icon/Input";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import BackgroundImg from "../../../../public/images/authSmall.svg";

export default function Login() {
  const [rememberMe, setRememberMe] = useState(false);

  return (
    <div className="flex h-screen">
      <div className="flex items-center justify-center w-[50%] px-12">
        <section className="w-full max-w-md">
          <div>
            <Link href="/">
              <h1 className="text-[22px] text-[#2B0850] font-semibold">
                WestPay
              </h1>
            </Link>
          </div>

          <div className="mt-3">
            <h2 className="text-[28px] text-[#2B0850] font-semibold">
              Welcome Back!
            </h2>
            <p className="text-sm text-gray-500">
              Login to continue using WestPay
            </p>
          </div>

          <form className="mt-6 space-y-4 w-full">
            <Input label="Email" placeholder="example@mail.com" icon="email" />

            <Input
              type="password"
              label="Password"
              placeholder="Enter your password"
              icon="lock"
            />

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 text-[#2B0850] border-gray-300 rounded focus:ring-[#2B0850]"
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
              className="bg-[#2B0850] w-full text-white px-6 py-2 rounded-md shadow-md hover:bg-[#3b0a6a] transition"
            >
              Log In
            </button>

            <p className="text-sm text-gray-600">
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

      <div className="w-[50%]">
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
