"use client";

import Input from "@/component/Input-icon/Input";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import BackgroundImg from "../../../../public/images/authSmall.svg";
import { useRouter } from "next/navigation";

export default function Register() {
  const [agree, setAgree] = useState(false);

  const [password, setPassword] = useState("");

  const route = useRouter();

  const getPasswordStrength = (password: string) => {
    if (!password) return { label: "", color: "" };

    let strengthPoints = 0;

    if (password.length >= 8) strengthPoints++;
    if (/[A-Z]/.test(password)) strengthPoints++;
    if (/[0-9]/.test(password)) strengthPoints++;
    if (/[^A-Za-z0-9]/.test(password)) strengthPoints++;

    if (strengthPoints <= 1) return { label: "Weak", color: "text-red-500" };
    if (strengthPoints === 2)
      return { label: "Fair", color: "text-yellow-500" };
    if (strengthPoints === 3) return { label: "Good", color: "text-blue-500" };
    return { label: "Strong", color: "text-green-600" };
  };

  const strength = getPasswordStrength(password);

  return (
    <div className="flex flex-col md:flex-row h-screen">
      <div className="flex items-center justify-center w-full md:w-[60%] px-6 sm:px-8 md:px-5 lg:px-16 py-6 ">
        <section className="w-full max-w-md md:max-w-none">
          <div>
            <Link href="/">
              <h1 className="text-xl sm:text-2xl text-[#2B0850] font-semibold">
                WestPay
              </h1>
            </Link>
          </div>

          <div className="mt-3">
            <h2 className="text-2xl sm:text-[28px] text-[#2B0850] font-semibold leading-snug">
              Hi, Welcome to WestPay!
            </h2>
            <p className="text-sm text-gray-500">
              Create an account and start enjoying WestPay
            </p>
          </div>

          <form
            className="mt-3 space-y-2 w-full"
            onSubmit={(e) => {
              e.preventDefault();
              route.push("/auth/verify");
            }}
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Input label="First Name" placeholder="John" icon="user" />
              <Input label="Last Name" placeholder="Smith" icon="user" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Input
                label="Email"
                placeholder="example@mail.com"
                icon="email"
              />
              <Input
                label="Phone"
                placeholder="+233 55 123 4567"
                icon="phone"
              />
            </div>

            <Input label="GPS Address" placeholder="GA-123-4567" icon="map" />
            <Input label="City of Residence" placeholder="Accra" icon="home" />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <Input
                  type="password"
                  label="Password"
                  placeholder="Enter your password, Min. 8 characters"
                  icon="lock"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                {strength.label && (
                  <p className={`text-[11px] mt-0.5 ${strength.color}`}>
                    Password Strength: {strength.label}
                  </p>
                )}
              </div>
              <Input
                type="password"
                label="Confirm Password"
                placeholder="Re-enter your password"
                icon="lock"
              />
            </div>

            <div className="flex items-center gap-2 mt-2">
              <input
                id="terms"
                type="checkbox"
                checked={agree}
                onChange={(e) => setAgree(e.target.checked)}
                className="w-4 h-4 text-[#2B0850] border-gray-300 rounded focus:ring-[#2B0850]"
              />
              <label htmlFor="terms" className="text-sm text-gray-600">
                I agree to the{" "}
                <Link
                  href="/terms"
                  className="text-[#2B0850] font-medium hover:underline"
                >
                  Terms & Conditions
                </Link>
              </label>
            </div>

            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between pt-2">
              <p className="flex-1 order-2 sm:order-1 text-sm text-gray-600 text-center sm:text-left">
                Already have an account?{" "}
                <Link
                  href="/auth/login"
                  className="text-[#2B0850] font-medium hover:underline"
                >
                  Login
                </Link>
              </p>
              <button
                type="submit"
                className="flex-1 order-1 sm:order-2 w-full sm:w-auto px-6 py-2 rounded-md shadow-md transition cursor-pointer text-white bg-[#2B0850] hover:bg-[#3b0a6a]"
              >
                Register
              </button>
            </div>
          </form>
        </section>
      </div>

      <div className="hidden md:block md:w-[40%]">
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
