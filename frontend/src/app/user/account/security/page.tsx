"use client";

import React from "react";
import {
  Mail,
  Phone,
  SquareAsterisk,
  UserRoundMinus,
  UserRoundX,
  CheckCircle,
  XCircle,
  AlertTriangle,
} from "lucide-react";
import DashboardLayout from "@/component/Dashboard/DashboardLayout";

interface SecurityOption {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  status: "enabled" | "disabled" | "warning";
  value?: string;
  hasAction: boolean;
}
interface SecurityOverview {
  id: string;
  title: string;
  status: "enabled" | "disabled" | "warning";
  value?: string;
  hasAction: boolean;
}

export default function SecurityPage(): React.JSX.Element {
  const securityOverview: SecurityOverview[] = [
    {
      id: "twoFactor",
      title: "Two-Factor Authentication (2FA)",
      status: "disabled",
      hasAction: false,
    },
    {
      id: "identity",
      title: "Identity Verification",
      status: "disabled",
      hasAction: false,
    },
  ];

  const twoFactorOptions: SecurityOption[] = [
    {
      id: "email",
      title: "Email",
      description: "Use your email to protect your account and transactions.",
      icon: Mail,
      status: "enabled",
      value: "na****d23@gmail.com",
      hasAction: true,
    },
    {
      id: "phone",
      title: "Phone Number",
      description:
        "Use your phone number to protect your account and transactions.",
      icon: Phone,
      status: "enabled",
      value: "297***489",
      hasAction: true,
    },
    {
      id: "password",
      title: "Login Password",
      description: "Login password is used to log in to your account.",
      icon: SquareAsterisk,
      status: "enabled",
      hasAction: true,
    },
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "enabled":
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case "disabled":
        return <XCircle className="w-4 h-4 text-gray-400" />;
      case "warning":
        return <AlertTriangle className="w-4 h-4 text-yellow-600" />;
      default:
        return <XCircle className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "enabled":
        return <span className="text-green-600 font-medium text-sm">On</span>;
      case "disabled":
        return <span className="text-gray-500 font-medium text-sm">Off</span>;
      case "warning":
        return (
          <span className="text-yellow-600 font-medium text-sm">Warning</span>
        );
      default:
        return <span className="text-gray-500 font-medium text-sm">Off</span>;
    }
  };

  return (
    <DashboardLayout>
      <div className="min-h-screen">
        <div className="max-w-6xl mx-auto space-y-12 p-4 sm:p-6 lg:p-8">
          <section className="border border-gray-200 rounded-xl p-6 bg-white">
            <h1 className="text-2xl sm:text-3xl font-bold text-[#2B0850] mb-6">
              Security Checkup
            </h1>
            <div className="flex flex-col sm:flex-row sm:items-center gap-6">
              {securityOverview.map((option) => (
                <div
                  key={option.id}
                  className="flex items-center gap-2 sm:flex-1"
                >
                  <div>{getStatusIcon(option.status)}</div>
                  <h3 className="font-semibold text-[#2B0850] text-base sm:text-md">
                    {option.title}
                  </h3>
                </div>
              ))}
            </div>
          </section>

          <section className="border border-gray-200 rounded-xl p-6 bg-white">
            <h2 className="text-xl sm:text-2xl font-bold text-[#2B0850] mb-6">
              Two-Factor Authentication (2FA)
            </h2>
            <div className="space-y-6">
              {twoFactorOptions.map((option) => {
                const IconComponent = option.icon;
                return (
                  <div
                    key={option.id}
                    className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
                  >
                    <div className="flex items-start sm:items-start gap-3">
                      <IconComponent className="w-4 h-4 text-gray-600 flex-shrink-0 mt-1" />
                      <div>
                        <h3 className="font-semibold text-[#2B0850] text-base">
                          {option.title}
                        </h3>
                        <p className="text-gray-600 text-sm mb-1">
                          {option.description}
                        </p>
                        {option.value && (
                          <p className="text-[#2B0850] font-medium text-sm">
                            {option.value}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      {getStatusText(option.status)}
                      <button className="px-3 py-1.5 rounded-md bg-[#2B0850] text-white text-sm font-medium">
                        {option.status === "enabled" ? "Manage" : "Enable"}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          <section className="border border-gray-200 rounded-xl p-6 bg-white">
            <h2 className="text-xl sm:text-2xl font-bold text-[#2B0850] mb-6">
              Account Management
            </h2>
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-start gap-3">
                  <UserRoundMinus className="w-4 h-4 flex-shrink-0 mt-1 text-[#2B0850]" />
                  <div>
                    <h3 className="font-semibold text-[#2B0850] text-base">
                      Disable Account
                    </h3>
                    <p className="text-sm text-gray-600">
                      Once the account is disabled, most of your actions will be
                      restricted (e.g. logging in, trading). You can unblock at
                      any time. This does not delete your account.
                    </p>
                  </div>
                </div>
                <button className="px-3 py-1.5 rounded-md text-white bg-[#2B0850] text-sm font-medium">
                  Disable
                </button>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-start gap-3">
                  <UserRoundX className="w-4 h-4 text-red-600 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-[#2B0850] text-base">
                      Delete Account
                    </h3>
                    <p className="text-sm text-gray-600">
                      Account deletion is irreversible. Once deleted, you will
                      lose all access and transaction history.
                    </p>
                  </div>
                </div>
                <button className="px-3 py-1.5 rounded-md bg-red-600 text-white text-sm font-medium">
                  Delete
                </button>
              </div>
            </div>
          </section>
        </div>
      </div>
    </DashboardLayout>
  );
}
