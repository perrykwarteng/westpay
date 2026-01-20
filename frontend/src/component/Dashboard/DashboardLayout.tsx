"use client";

import { useState, useEffect, PropsWithChildren } from "react";
import { Home, FileText, Users, Settings, ChevronDown } from "lucide-react";
import Header from "../Dashboard/Header";
import Sidebar from "../Dashboard/Sidebar";

export default function DashboardLayout({ children }: PropsWithChildren) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [active, setActive] = useState<string>("Home");
  const [openSubNav, setOpenSubNav] = useState<string | null>(null);
  const [role, setRole] = useState<"admin" | "user">("user");

  useEffect(() => {
    const savedRole = localStorage.getItem("role") as "admin" | "user";
    if (savedRole) setRole(savedRole);
  }, []);

  const navItems = [
    { name: "Home", icon: Home },
    { name: "Transfer", icon: FileText },
    {
      name: "Accounts",
      icon: Users,
      subNav: [
        { name: "Identification" },
        { name: "Security" },
        { name: "Payment" },
      ],
    },
    { name: "Settings", icon: Settings },
  ];

  return (
    <div
      className="min-h-screen flex flex-col bg-gradient-to-br from-purple-50 via-white to-purple-100 text-gray-800"
      style={{
        background:
          "linear-gradient(135deg, #f8f6ff 0%, #ffffff 50%, #f3f0ff 100%)",
      }}
    >
      <Header
        active={active}
        setActive={setActive}
        dropdownOpen={dropdownOpen}
        setDropdownOpen={setDropdownOpen}
      />

      {/* Mobile Nav */}
      {dropdownOpen && (
        <div
          className="absolute top-full left-0 w-full bg-white shadow-lg md:hidden border-t"
          style={{ zIndex: 9999, top: "64px" }}
        >
          <nav className="flex flex-col p-2">
            {navItems.map((item) => (
              <div key={item.name}>
                <button
                  onClick={() => {
                    if (item.subNav) {
                      setOpenSubNav(
                        openSubNav === item.name ? null : item.name
                      );
                    } else {
                      setActive(item.name);
                      setDropdownOpen(false);
                      setOpenSubNav(null);
                    }
                  }}
                  className="flex w-full items-center justify-between p-3 rounded-xl"
                >
                  <div className="flex items-center gap-3">
                    <item.icon className="h-5 w-5" />
                    {item.name}
                  </div>
                  {item.subNav && (
                    <ChevronDown
                      className={`h-4 w-4 ${
                        openSubNav === item.name ? "rotate-180" : ""
                      }`}
                    />
                  )}
                </button>
              </div>
            ))}
          </nav>
        </div>
      )}

      <div className="flex flex-1 pt-16">
        <Sidebar role={role} />

        <main className="flex-1 md:ml-64 p-6 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
