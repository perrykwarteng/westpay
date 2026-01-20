"use client";

import { Home, Send, User, ChevronDown, Users } from "lucide-react";
import Link from "next/link";
import { useState, useMemo } from "react";
import { usePathname } from "next/navigation";

type SidebarProps = {
  role: "admin" | "user";
};

type SubNavItem = {
  name: string;
  link: string;
};

type NavItem = {
  name: string;
  icon: React.ElementType;
  link?: string;
  subNav?: SubNavItem[];
};

const userNav: NavItem[] = [
  { name: "Home", icon: Home, link: "/user/dashboard" },
  { name: "Transactions", icon: Send, link: "/user/transaction" },
];

const adminNav: NavItem[] = [
  { name: "Home", icon: Home, link: "/admin/dashboard" },
  { name: "User Management", icon: User, link: "/admin/users" },
  { name: "Transactions", icon: Send, link: "/admin/all-transactions" },
  {
    name: "Support",
    icon: Users,
    subNav: [
      { name: "Help Center", link: "/admin/support/help" },
      // { name: "FAQs", link: "/admin/support/faqs" },
    ],
  },
];

export default function Sidebar({ role }: SidebarProps) {
  const pathname = usePathname();
  const [openSubNav, setOpenSubNav] = useState<string | null>(null);

  const navItems = role === "admin" ? adminNav : userNav;

  const active = useMemo(() => {
    let activeItem = "";
    navItems.forEach((item) => {
      if (item.link && pathname.startsWith(item.link)) {
        activeItem = item.name;
      }
      if (item.subNav) {
        item.subNav.forEach((sub) => {
          if (pathname.startsWith(sub.link)) {
            activeItem = sub.name;
          }
        });
      }
    });
    return activeItem;
  }, [pathname, navItems]);

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
        {navItems.map((item) => {
          const isActiveParent =
            openSubNav === item.name ||
            (item.subNav &&
              item.subNav.some((sub) => pathname.startsWith(sub.link)));

          const isActive = active === item.name;

          return (
            <div key={item.name}>
              {item.subNav ? (
                <button
                  onClick={() =>
                    setOpenSubNav(openSubNav === item.name ? null : item.name)
                  }
                  className={`flex w-full items-center justify-between p-3 rounded-xl text-left transition-all duration-200 ${
                    isActiveParent
                      ? "text-white font-semibold shadow-lg"
                      : "hover:bg-white/70 text-gray-700"
                  }`}
                  style={
                    isActiveParent
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
                  <ChevronDown
                    className={`h-4 w-4 transition-transform duration-200 ${
                      isActiveParent ? "rotate-180" : ""
                    }`}
                  />
                </button>
              ) : (
                <Link href={item.link!}>
                  <button
                    className={`flex w-full items-center gap-3 p-3 rounded-xl text-left transition-all duration-200 ${
                      isActive
                        ? "text-white font-semibold shadow-lg"
                        : "hover:bg-white/70 text-gray-700"
                    }`}
                    style={
                      isActive
                        ? {
                            background:
                              "linear-gradient(135deg, #2B0850 0%, #4a1a7a 100%)",
                          }
                        : {}
                    }
                  >
                    <item.icon className="h-5 w-5" />
                    {item.name}
                  </button>
                </Link>
              )}

              {item.subNav && isActiveParent && (
                <div className="ml-8 mt-1 space-y-1">
                  {item.subNav.map((sub) => {
                    const isSubActive = active === sub.name;
                    return (
                      <Link key={sub.name} href={sub.link}>
                        <button
                          className={`flex w-full items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all duration-200 ${
                            isSubActive
                              ? "text-purple-900 font-semibold bg-purple-100"
                              : "hover:bg-white/70 text-gray-600"
                          }`}
                        >
                          {sub.name}
                        </button>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>
    </aside>
  );
}
