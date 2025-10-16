"use client";

import { useRef, useState } from "react";
import {
  User,
  Mail,
  Lock,
  Map,
  Home,
  Phone,
  Search,
  Eye,
  EyeOff,
  Upload,
} from "lucide-react";
import Image from "next/image";

interface TextInputProps {
  type?: "text" | "password" | "email" | "tel" | "number";
  label?: string;
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  icon?: "user" | "email" | "lock" | "map" | "phone" | "home" | "search";
  className?: string;
  validate?: boolean;
  maxLength?: number;
  minLength?: number;
}

export const Input = ({
  type = "text",
  label,
  placeholder = "",
  value = "",
  onChange,
  icon = "user",
  className = "",
  validate = false,
  maxLength,
  minLength,
}: TextInputProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string>("");
  const [touched, setTouched] = useState(false);

  const isPassword = type === "password";
  const inputType = isPassword && !showPassword ? "password" : "text";

  const iconMap = {
    user: User,
    email: Mail,
    lock: Lock,
    map: Map,
    home: Home,
    phone: Phone,
    search: Search,
  };

  const LeftIcon = iconMap[icon] || User;

  const validateInput = (val: string) => {
    if (!validate) return "";

    if (!val) return `${label || "Field"} is required`;

    if (type === "email") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(val)) return "Enter a valid email address";
    }

    if (type === "tel") {
      const phoneRegex = /^[0-9+\-\s]{7,15}$/;
      if (!phoneRegex.test(val)) return "Enter a valid phone number";
    }

    if (type === "password") {
      if (val.length < 8) return "Password must be at least 8 characters";
    }

    return "";
  };

  const handleBlur = () => {
    setTouched(true);
    const err = validateInput(value || "");
    setError(err);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (onChange) onChange(e);
    if (touched && validate) {
      setError(validateInput(e.target.value));
    }
  };

  return (
    <div className={`flex flex-col gap-1 w-full ${className}`}>
      {label && (
        <label className="text-sm font-medium text-gray-700">{label}</label>
      )}

      <div
        className={`flex items-center border rounded-md px-3.5 py-2.5 bg-white transition-all
          ${
            error
              ? "border-red-500 focus-within:border-red-600 focus-within:ring-red-400"
              : "border-gray-300 focus-within:border-[#2B0850] focus-within:ring-[#2B0850]"
          } focus-within:ring-[1px] focus-within:bg-[#6d5dd31a]`}
      >
        <LeftIcon
          className={`w-5 h-5 mr-2 ${error ? "text-red-500" : "text-gray-400"}`}
        />

        <input
          type={inputType}
          value={value}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder={placeholder}
          maxLength={maxLength}
          minLength={minLength}
          className="flex-1 bg-transparent outline-none border-none focus:ring-0 text-sm text-gray-800 placeholder-gray-400"
        />

        {isPassword && (
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              setShowPassword((prev) => !prev);
            }}
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

      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
};

export const FileUpload = ({
  label,
  file,
  onChange,
  accept = "image/*",
  preview = true,
  className = "",
}: {
  label: string;
  file: File | null;
  onChange: (file: File | null) => void;
  accept?: string;
  preview?: boolean;
  className?: string;
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    onChange(selectedFile);

    if (selectedFile && preview) {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
      const url = URL.createObjectURL(selectedFile);
      setPreviewUrl(url);
    } else {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
      setPreviewUrl(null);
    }
  };

  return (
    <div className={`flex flex-col gap-1 w-full ${className}`}>
      {label && (
        <label className="text-sm font-medium text-gray-700">{label}</label>
      )}

      <div className="relative">
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          onChange={handleFileChange}
          className="hidden"
        />

        <div
          onClick={() => inputRef.current?.click()}
          className="flex flex-col items-center justify-center w-full h-32 bg-gray-50 border-2 border-dashed border-gray-300 rounded-md cursor-pointer hover:bg-gray-100 transition-colors"
        >
          {previewUrl ? (
            <div className="relative w-full h-full">
              {/* ✅ FIX: use layout="fill" instead of width/height */}
              <Image
                src={previewUrl}
                alt="Preview"
                fill
                className="object-cover rounded-md"
                sizes="100vw"
                unoptimized // ✅ allow blob URL rendering
              />
              <div className="absolute inset-0 bg-black/0 hover:bg-black/40 transition-all rounded-md flex items-center justify-center">
                <span className="text-white opacity-0 hover:opacity-100 transition-opacity bg-[#2B0850] px-3 py-1 rounded text-sm">
                  Change Image
                </span>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <Upload className="w-6 h-6 text-gray-400 mb-2" />
              <span className="text-gray-500 text-sm text-center">
                {file ? file.name : `Click to upload ${label.toLowerCase()}`}
              </span>
              <span className="text-gray-400 text-xs mt-1">
                PNG, JPG up to 10MB
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
