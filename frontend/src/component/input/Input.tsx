"use client";

interface TextInputProps {
  type?: string;
  label?: string;
  placeholder?: string;
  inputMode?: string;
  autoComplete?: string;
  autoFocus?: boolean;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function Input({
  type = "text",
  label,
  placeholder = "",
  value,
  onChange,
}: TextInputProps) {
  return (
    <div className="flex flex-col gap-0.5 w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-3">
          {label}
        </label>
      )}

      <div className="flex items-center border border-gray-300 rounded-md px-3.5 py-2.5 bg-white focus-within:border-[#2B0850] focus-within:ring-[1px] focus-within:ring-[#2B0850] focus-within:bg-[#6d5dd31a]">
        <input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="flex-1 bg-transparent outline-none border-none focus:ring-0 text-sm text-gray-800 placeholder-gray-400"
        />
      </div>
    </div>
  );
}
