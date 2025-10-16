"use client";

import { useState, useRef, useEffect } from "react";
import { Menu, Search, User, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

// interface UserProps {
//   name: string;
//   initials: string;
// }

interface HeaderProps {
  active: string;
  setActive: (value: string) => void;
  dropdownOpen: boolean;
  setDropdownOpen: (value: boolean) => void;
}

export default function Header({ dropdownOpen, setDropdownOpen }: HeaderProps) {
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  const router = useRouter();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target as Node)
      ) {
        setProfileDropdownOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleProfileClick = () => {
    setProfileDropdownOpen(!profileDropdownOpen);
  };

  const handleLogout = () => {
    setProfileDropdownOpen(false);
    router.push("/auth/login");
  };

  const handleProfile = () => {
    setProfileDropdownOpen(false);
    router.push("/user/settings/profile");
  };

  return (
    <header
      className="fixed top-0 left-0 right-0 z-40 flex items-center justify-between bg-white/80 backdrop-blur-sm p-4 px-6 shadow-sm border-b border-purple-100"
      style={{ borderBottomColor: "#e8e0ff" }}
    >
      <div className="flex items-center gap-3">
        <span className="font-bold text-xl text-gray-800">WESTPAY.</span>
      </div>

      <div className="hidden md:flex items-center bg-gray-50 rounded-xl px-4 py-2 w-80">
        <Search className="w-4 h-4 text-gray-400 mr-2" />
        <input
          type="text"
          placeholder="Type to search..."
          className="bg-transparent border-none outline-none text-sm text-gray-600 w-full"
        />
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3 relative" ref={profileRef}>
          <button
            onClick={handleProfileClick}
            className="w-8 h-8 rounded-full flex items-center justify-center hover:ring-2 hover:ring-purple-200 transition-all duration-200"
            style={{ backgroundColor: "#2B0850" }}
          >
            <span className="text-white text-sm font-medium">JK</span>
          </button>
          <span className="hidden md:block text-sm font-medium text-gray-700">
            Johnson Kwaku
          </span>

          {profileDropdownOpen && (
            <div
              className="absolute top-full right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-purple-100 py-2"
              style={{
                borderColor: "#e8e0ff",
                zIndex: 9999,
              }}
            >
              <button
                onClick={handleProfile}
                className="flex items-center gap-3 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200"
              >
                <User className="w-4 h-4" />
                Profile
              </button>
              <hr className="my-1 border-gray-100" />
              <button
                onClick={handleLogout}
                className="flex items-center gap-3 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors duration-200"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          )}
        </div>

        <button
          className="md:hidden"
          onClick={() => setDropdownOpen(!dropdownOpen)}
        >
          <Menu className="h-6 w-6 text-gray-700" />
        </button>
      </div>
    </header>
  );
}
