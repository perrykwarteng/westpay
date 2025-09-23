"use client";

import { Home, FileText, Users, Settings } from "lucide-react";

interface SidebarProps {
  active: string;
  setActive: (value: string) => void;
}

export default function Sidebar({ active, setActive }: SidebarProps) {
  const navItems = [
    { name: "Home", icon: Home },
    { name: "Orders", icon: FileText },
    { name: "Accounts", icon: Users },
    { name: "Settings", icon: Settings },
    // { name: "Products", icon: Package },
    // { name: "Messages", icon: MessageCircle, badge: 2 },
    // { name: "Help", icon: HelpCircle },
  ];

  return (
    <aside
      className="hidden md:flex md:flex-col w-64 bg-white/50 backdrop-blur-sm text-gray-800 border-r border-purple-100"
      style={{
        position: "fixed",
        top: "64px",
        bottom: 0,
        left: 0,
        borderRightColor: "#e8e0ff",
      }}
    >
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {navItems.map((item) => (
          <button
            key={item.name}
            onClick={() => setActive(item.name)}
            className={`flex w-full items-center gap-3 p-3 rounded-xl text-left transition-all duration-200
              ${
                active === item.name
                  ? "text-white font-semibold shadow-lg"
                  : "hover:bg-white/70 text-gray-700"
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
            {/* {item.badge && (
              <span
                className="ml-auto text-xs rounded-full w-5 h-5 flex items-center justify-center text-white"
                style={{
                  backgroundColor: active === item.name ? "#1a0630" : "#2B0850",
                }}
              >
                {item.badge}
              </span>
            )} */}
          </button>
        ))}
      </nav>
    </aside>
  );
}
