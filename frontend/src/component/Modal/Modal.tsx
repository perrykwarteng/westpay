"use client";

import React, { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
  size?: "sm" | "md" | "lg" | "xl";
  closeOnOverlay?: boolean;
  ariaDescription?: string;
}

export default function Modal({
  isOpen,
  onClose,
  title,
  children,
  footer,
  size = "md",
  closeOnOverlay = true,
  ariaDescription,
}: ModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const titleId = useRef(`modal-title-${Math.random().toString(36).slice(2)}`);
  const descId = useRef(`modal-desc-${Math.random().toString(36).slice(2)}`);

  useEffect(() => {
    if (!isOpen) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = original;
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen) {
      closeBtnRef.current?.focus({ preventScroll: true });
      if (!closeBtnRef.current)
        dialogRef.current?.focus({ preventScroll: true });
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const handleFocus = (e: FocusEvent) => {
      if (!dialogRef.current) return;
      if (!dialogRef.current.contains(e.target as Node)) {
        closeBtnRef.current?.focus();
      }
    };
    document.addEventListener("focusin", handleFocus);
    return () => document.removeEventListener("focusin", handleFocus);
  }, [isOpen]);

  if (!isOpen) return null;

  const sizeClasses = {
    sm: "sm:max-w-sm",
    md: "sm:max-w-lg",
    lg: "sm:max-w-2xl",
    xl: "sm:max-w-4xl",
  }[size];

  const modal = (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      aria-hidden={!isOpen}
      onMouseDown={(e) => {
        if (closeOnOverlay && e.target === overlayRef.current) onClose();
      }}
    >
      <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px] opacity-100 transition-opacity" />

      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? titleId.current : undefined}
        aria-describedby={ariaDescription ? descId.current : undefined}
        tabIndex={-1}
        className={`relative z-10 w-full ${sizeClasses} max-w-full rounded-xl bg-white shadow-2xl outline-none transition
        translate-y-0 opacity-100
        sm:mx-auto`}
        style={{ animation: "modalIn 160ms ease-out" }}
        onMouseDown={(e) => {
          e.stopPropagation();
        }}
      >
        <div className="flex items-start justify-between gap-4 border-b px-6 py-4">
          {title ? (
            <h2
              id={titleId.current}
              className="text-lg font-semibold text-gray-900"
            >
              {title}
            </h2>
          ) : (
            <span className="sr-only" id={titleId.current}>
              Modal
            </span>
          )}
          <button
            ref={closeBtnRef}
            onClick={onClose}
            className="inline-flex h-8 w-8 items-center justify-center rounded-md text-gray-500 outline-none ring-offset-2 transition hover:bg-gray-100 hover:text-gray-700 focus:ring-2 focus:ring-gray-300"
            aria-label="Close dialog"
            type="button"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="max-h-[70vh] overflow-y-auto px-6 py-4">
          {ariaDescription && (
            <p id={descId.current} className="sr-only">
              {ariaDescription}
            </p>
          )}
          {children}
        </div>

        {footer && (
          <div className="sticky bottom-0 flex justify-end gap-2 border-t bg-white px-6 py-3">
            {footer}
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes modalIn {
          from {
            opacity: 0;
            transform: translateY(10px) scale(0.98);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
      `}</style>
    </div>
  );

  return typeof window !== "undefined"
    ? createPortal(modal, document.body)
    : modal;
}
