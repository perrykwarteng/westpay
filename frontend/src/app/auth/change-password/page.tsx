"use client";

import { useState } from "react";
import { Input } from "@/component/Input-icon/Input";
import Image from "next/image";
import BackgroundImg from "../../../../public/images/authSmall.svg";
import Link from "next/link";

export default function ChangePassword() {
  const [newPassword, setNewPassword] = useState("");

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

  const strength = getPasswordStrength(newPassword);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Password changed successfully");
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
              Change Password
            </h2>
            <p className="text-sm text-gray-500">
              Enter new password to update your account
            </p>
          </div>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4 w-full">
            <div>
              <Input
                type="password"
                label="New Password"
                placeholder="Enter new password"
                icon="lock"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
              {strength.label && (
                <p className={`text-xs mt-1 ${strength.color}`}>
                  Password Strength: {strength.label}
                </p>
              )}
            </div>

            <Input
              type="password"
              label="Confirm New Password"
              placeholder="Re-enter new password"
              icon="lock"
            />

            <button
              type="submit"
              className="bg-[#2B0850] w-full text-white px-6 py-2 rounded-md shadow-md hover:bg-[#3b0a6a] transition"
            >
              Update Password
            </button>
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
