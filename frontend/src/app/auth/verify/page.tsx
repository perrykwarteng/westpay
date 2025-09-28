"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import BackgroundImg from "../../../../public/images/authSmall.svg";
import { useRouter } from "next/navigation";

export default function VerifyEmail() {
  const [code, setCode] = useState(Array(6).fill(""));
  const [touched, setTouched] = useState(Array(6).fill(false)); // track touched state
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const route = useRouter();

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

  const handleBlur = (index: number) => {
    const newTouched = [...touched];
    newTouched[index] = true;
    setTouched(newTouched);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simple validation before submit
    if (code.some((digit) => digit === "")) {
      setTouched(Array(6).fill(true)); // mark all as touched
      return;
    }
    route.push("/auth/login");
  };

  return (
    <div className="flex h-screen bg-white">
      <div className="flex items-center justify-center w-full md:w-[50%] px-4 md:px-10 lg:px-16 py-6">
        <section className="w-full max-w-md">
          <Link href="/">
            <h1 className="text-[22px] text-[#2B0850] font-semibold">
              WestPay
            </h1>
          </Link>

          <div className="mt-3">
            <h2 className="text-[24px] sm:text-[28px] text-[#2B0850] font-semibold">
              Enter Code
            </h2>
            <p className="text-sm text-gray-500">
              Please enter a received code. We sent your verification code to
              your email.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="mt-6 space-y-5 w-full">
            <div className="w-full">
              <div className="flex justify-between gap-x-2 sm:gap-x-3 mt-1">
                {code.map((digit, index) => (
                  <div
                    key={index}
                    className="flex flex-col items-center flex-1"
                  >
                    <input
                      ref={(el) => {
                        inputRefs.current[index] = el;
                      }}
                      type="text"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleCodeChange(e.target.value, index)}
                      onBlur={() => handleBlur(index)}
                      className={`w-10 h-10 md:w-12 md:h-12 text-center text-lg border rounded-md outline-none transition
                        ${
                          touched[index] && !digit
                            ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                            : "border-gray-300 focus:border-[#2B0850] focus:ring-1 focus:ring-[#2B0850] focus-within:bg-[#6d5dd31a]"
                        }`}
                    />
                  </div>
                ))}
              </div>
            </div>

            <button
              type="submit"
              className="bg-[#2B0850] w-full text-white px-6 py-2 rounded-md shadow-md hover:bg-[#3b0a6a] transition"
            >
              Verify & Login
            </button>

            <p className="text-sm text-gray-600 text-center sm:text-left">
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
