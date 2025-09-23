"use client";

import { useState, PropsWithChildren } from "react";
import {
  Home,
  FileText,
  Users,
  Package,
  MessageCircle,
  Settings,
  HelpCircle,
} from "lucide-react";
import Header from "../Dashboard/Header";
import Sidebar from "../Dashboard/Sidebar";

export default function DashboardLayout({ children }: PropsWithChildren) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [active, setActive] = useState<string>("Home");

  const navItems = [
    { name: "Home", icon: Home },
    { name: "Invoices", icon: FileText },
    { name: "Clients", icon: Users },
    { name: "Products", icon: Package },
    { name: "Messages", icon: MessageCircle, badge: 2 },
    { name: "Settings", icon: Settings },
    { name: "Help", icon: HelpCircle },
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

      {dropdownOpen && (
        <div
          className="absolute top-full left-0 w-full bg-white shadow-lg md:hidden border-t border-purple-100 transition-all duration-100"
          style={{ borderTopColor: "#e8e0ff", zIndex: 9999, top: "64px" }}
        >
          <nav className="flex flex-col p-2">
            {navItems.map((item) => (
              <button
                key={item.name}
                onClick={() => {
                  setActive(item.name);
                  setDropdownOpen(false);
                }}
                className={`flex items-center gap-3 p-3 rounded-xl text-left transition-all duration-200
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
                <item.icon className="h-5 w-5" />
                {item.name}
                {item.badge && (
                  <span
                    className="ml-auto text-white text-xs rounded-full w-5 h-5 flex items-center justify-center"
                    style={{
                      backgroundColor:
                        active === item.name ? "#1a0630" : "#2B0850",
                    }}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </div>
      )}

      <div className="flex flex-1 pt-16">
        <Sidebar active={active} setActive={setActive} />
        <main className="flex-1 md:ml-64 p-6 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
