"use client";

import { useState } from "react";
import { User, Mail, Eye, EyeOff, Lock, Map, Home, Phone } from "lucide-react";

interface TextInputProps {
  type?: "text" | "password";
  label?: string;
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  icon?: "user" | "email" | "lock" | "map" | "phone" | "home";
}

export default function Input({
  type = "text",
  label,
  placeholder = "",
  value,
  onChange,
  icon = "user",
}: TextInputProps) {
  const [showPassword, setShowPassword] = useState(false);

  const isPassword = type === "password";
  const inputType = isPassword && !showPassword ? "password" : "text";

  const iconMap = {
    user: User,
    email: Mail,
    lock: Lock,
    map: Map,
    home: Home,
    phone: Phone,
  };

  const LeftIcon = iconMap[icon] || User;

  return (
    <div className="flex flex-col gap-0.5 w-full">
      {label && (
        <label className="text-sm font-medium text-gray-700">{label}</label>
      )}

      <div className="flex items-center border border-gray-300 rounded-md px-3.5 py-2.5 bg-white focus-within:border-[#2B0850] focus-within:ring-[1px] focus-within:ring-[#2B0850] focus-within:bg-[#6d5dd31a]">
        <LeftIcon className="w-5 h-5 text-gray-400 mr-2" />

        <input
          type={inputType}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="flex-1 bg-transparent outline-none border-none focus:ring-0 text-sm text-gray-800 placeholder-gray-400"
        />

        {isPassword && (
          <button
            onClick={() => setShowPassword(!showPassword)}
            type="button"
            className="ml-2 text-gray-500 hover:text-gray-700 focus:outline-none"
          >
            {showPassword ? (
              <EyeOff className="w-5 h-5" />
            ) : (
              <Eye className="w-5 h-5" />
            )}
          </button>
        )}
      </div>
    </div>
  );
}
