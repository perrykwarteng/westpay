"use client";

import { useState, PropsWithChildren } from "react";
import { Home, FileText, Users, Settings, ChevronDown } from "lucide-react";
import Header from "../Dashboard/Header";
import Sidebar from "../Dashboard/Sidebar";

export default function DashboardLayout({ children }: PropsWithChildren) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [active, setActive] = useState<string>("Home");
  const [openSubNav, setOpenSubNav] = useState<string | null>(null);

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
          className="absolute top-full left-0 w-full bg-white shadow-lg md:hidden border-t border-purple-100 transition-all duration-100"
          style={{ borderTopColor: "#e8e0ff", zIndex: 9999, top: "64px" }}
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
                  className={`flex w-full items-center justify-between gap-3 p-3 rounded-xl text-left transition-all duration-200
                    ${
                      active === item.name
                        ? "text-white font-semibold shadow-lg"
                        : "hover:bg-gray-50 text-gray-700"
                    }`}
                  style={
                    active === item.name
                      ? {
                          background:
                            "linear-gradient(135deg, #2B0850 0%, #4a1a7a 100%)",
                        }
                      : {}
                  }
                >
                  <div className="flex items-center gap-3">
                    <item.icon className="h-5 w-5" />
                    {item.name}
                  </div>
                  {item.subNav && (
                    <ChevronDown
                      className={`h-4 w-4 transition-transform duration-200 ${
                        openSubNav === item.name ? "rotate-180" : ""
                      }`}
                    />
                  )}
                </button>

                {/* Sub Nav for Mobile */}
                {item.subNav && openSubNav === item.name && (
                  <div className="ml-8 mt-1 space-y-1">
                    {item.subNav.map((sub) => (
                      <button
                        key={sub.name}
                        onClick={() => {
                          setActive(sub.name);
                          setDropdownOpen(false);
                        }}
                        className={`flex w-full items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all duration-200
                          ${
                            active === sub.name
                              ? "text-purple-900 font-semibold bg-purple-100"
                              : "hover:bg-gray-50 text-gray-600"
                          }`}
                      >
                        {sub.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>
        </div>
      )}

      <div className="flex flex-1 pt-16">
        <Sidebar />
        <main className="flex-1 md:ml-64 p-6 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
