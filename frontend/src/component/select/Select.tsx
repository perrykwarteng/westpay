import { useRef, useState } from "react";

interface CustomSelectProps {
  label: string;
  value: string;
  onChange: (val: string) => void;
  options: { value: string; label: string }[];
}
export default function CustomSelect({
  label,
  value,
  onChange,
  options,
}: CustomSelectProps) {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedLabel =
    options.find((opt) => opt.value === value)?.label || "Select";

  function handleSelect(val: string) {
    onChange(val);
    setOpen(false);
  }

  return (
    <div ref={dropdownRef} className="relative w-full">
      <label className="block text-sm font-medium text-gray-700 mb-0.5">
        {label}
      </label>

      <div
        className="w-full bg-white border border-gray-300 rounded-lg px-3.5 py-2.5 cursor-pointer flex items-center justify-between"
        onClick={() => setOpen(!open)}
      >
        <span className="text-[14px]">{selectedLabel}</span>
        <svg
          className={`w-5 h-5 text-gray-500 transition-transform ${
            open ? "rotate-180" : ""
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </div>

      {open && (
        <ul className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
          {options.map((opt) => (
            <li
              key={opt.value}
              onClick={() => handleSelect(opt.value)}
              className={`px-4 py-2 text-[15px] cursor-pointer hover:bg-[#6d5dd31a] ${
                value === opt.value ? "bg-[#6d5dd31a] font-medium" : ""
              }`}
            >
              {opt.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
