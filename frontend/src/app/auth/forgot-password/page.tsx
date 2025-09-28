"use client";

import { useState } from "react";
import Input from "@/component/Input-icon/Input";
import Image from "next/image";
import Link from "next/link";
import BackgroundImg from "../../../../public/images/authSmall.svg";
import { useRouter } from "next/navigation";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const route = useRouter();
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    route.push("/auth/chage-password");
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
              Forgot Password?
            </h2>
            <p className="text-sm text-gray-500">
              Enter your email and we’ll send you a verification code
            </p>
          </div>

          <form onSubmit={handleSubmit} className="mt-6 space-y-5 w-full">
            <Input
              label="Email"
              placeholder="example@mail.com"
              icon="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <button
              type="submit"
              className="bg-[#2B0850] w-full text-white px-6 py-2 rounded-md shadow-md hover:bg-[#3b0a6a] transition"
            >
              Submit
            </button>

            <p className="text-sm text-gray-600">
              Back to{" "}
              <Link
                href="/auth/login"
                className="text-[#2B0850] font-medium hover:underline"
              >
                Login
              </Link>
            </p>
          </form>
        </section>
      </div>

      <div className="hidden md:block w-[50%]">
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
