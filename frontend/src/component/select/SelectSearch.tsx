"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";

export interface Option {
  label: string;
  value: string;
  icon?: React.ReactNode;
}

interface SelectSearchProps {
  label?: string;
  options: Option[];
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
}

export default function SelectSearch({
  label,
  options,
  value,
  onChange,
  placeholder = "Select",
  required,
  disabled,
}: SelectSearchProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeIdx, setActiveIdx] = useState<number>(-1);
  const id = React.useMemo(() => Math.random().toString(36).slice(2), []);
  const containerRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const filtered = useMemo(
    () =>
      options.filter((o) =>
        o.label.toLowerCase().includes(query.toLowerCase())
      ),
    [options, query]
  );

  const selected = useMemo(
    () => options.find((o) => o.value === value),
    [options, value]
  );

  // Close on outside click
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (!containerRef.current) return;
      if (!containerRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  useEffect(() => {
    if (!open) return;
    setActiveIdx(-1);
    setQuery("");
  }, [open]);

  function openList() {
    if (disabled) return;
    setOpen(true);
  }

  function handleButtonKey(e: React.KeyboardEvent<HTMLButtonElement>) {
    if (
      !open &&
      (e.key === "ArrowDown" || e.key === "Enter" || e.key === " ")
    ) {
      openList();
      e.preventDefault();
      setTimeout(() => listRef.current?.focus(), 0);
      return;
    }
  }

  return (
    <div ref={containerRef} className="relative w-full">
      {label && (
        <label
          htmlFor={`sel-${id}`}
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          {label} {required && <span className="text-red-600">*</span>}
        </label>
      )}

      <button
        ref={buttonRef}
        id={`sel-${id}`}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        disabled={disabled}
        onKeyDown={handleButtonKey}
        onClick={() => setOpen((o) => !o)}
        className={`w-full bg-white border border-gray-300 rounded-lg px-3.5 py-2.5 cursor-pointer flex items-center justify-between text-left focus:outline-none focus:ring-2 focus:ring-[#2B0850] ${
          disabled ? "opacity-60 cursor-not-allowed" : ""
        }`}
      >
        <span
          className={`text-[14px] truncate ${
            selected ? "text-gray-900" : "text-gray-400"
          }`}
        >
          {selected ? selected.label : placeholder}
        </span>
        <svg
          className={`w-5 h-5 text-gray-500 transition-transform ${
            open ? "rotate-180" : ""
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {open && (
        <div
          ref={listRef}
          role="listbox"
          tabIndex={-1}
          aria-activedescendant={
            activeIdx >= 0 ? `opt-${id}-${activeIdx}` : undefined
          }
          className="absolute z-50 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg"
        >
          <input
            autoFocus
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search..."
            className="w-full border-b border-gray-200 px-3.5 py-2.5 text-gray-600 text-[14px] outline-none"
          />

          <ul className="max-h-60 overflow-y-auto z-50">
            {filtered.length ? (
              filtered.map((opt, i) => {
                const isActive = i === activeIdx;
                const isSelected = value === opt.value;
                return (
                  <li
                    id={`opt-${id}-${i}`}
                    key={opt.value}
                    role="option"
                    aria-selected={isSelected}
                    onMouseEnter={() => setActiveIdx(i)}
                    onClick={() => {
                      onChange(opt.value);
                      setOpen(false);
                      buttonRef.current?.focus();
                    }}
                    className={`flex items-center gap-2 px-4 py-2 text-[15px] text-gray-500 cursor-pointer hover:bg-[#6d5dd31a] ${
                      isSelected ? "bg-[#2f26671a] font-medium" : ""
                    } ${isActive ? "ring-1 ring-gray-200" : ""}`}
                  >
                    {opt.icon}
                    <span className="truncate">{opt.label}</span>
                  </li>
                );
              })
            ) : (
              <li className="px-4 py-2 text-[15px] text-gray-400">
                No results
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
