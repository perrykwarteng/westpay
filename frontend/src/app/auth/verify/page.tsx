"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import BackgroundImg from "../../../../public/images/authSmall.svg";

export default function VerifyEmail() {
  const [code, setCode] = useState(Array(6).fill(""));
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleCodeChange = (value: string, index: number) => {
    if (/^[0-9]?$/.test(value)) {
      const newCode = [...code];
      newCode[index] = value;
      setCode(newCode);

      if (value && index < 5) {
        inputRefs.current[index + 1]?.focus();
      }
      if (!value && index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Verification Code:", code.join(""));
  };

  return (
    <div className="flex h-screen">
      <div className="flex items-center justify-center w-[50%] px-12">
        <section className="w-full max-w-md">
          <Link href="/">
            <h1 className="text-[22px] text-[#2B0850] font-semibold">
              WestPay
            </h1>
          </Link>
          <div className="mt-3">
            <h2 className="text-[28px] text-[#2B0850] font-semibold">
              Enter Code
            </h2>
            <p className="text-sm text-gray-500">
              Please enter a received code. We sent your verification code to
              your email.{" "}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="mt-6 space-y-5 w-full">
            <div className="w-full">
              <div className="flex gap-x-4.5 mt-1">
                {code.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => {
                      inputRefs.current[index] = el;
                    }}
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleCodeChange(e.target.value, index)}
                    className="w-15 h-15 text-center text-lg border border-gray-300 rounded-md focus:border-[#2B0850] focus:ring-1 focus:ring-[#2B0850] focus-within:bg-[#6d5dd31a] outline-none"
                  />
                ))}
              </div>
            </div>

            <button
              type="submit"
              className="bg-[#2B0850] w-full text-white px-6 py-2 rounded-md shadow-md hover:bg-[#3b0a6a] transition"
            >
              Verify & Continue
            </button>

            <p className="text-sm text-gray-600">
              Didn’t get the code?{" "}
              <button
                type="button"
                className="text-[#2B0850] font-medium hover:underline"
              >
                Resend
              </button>
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
