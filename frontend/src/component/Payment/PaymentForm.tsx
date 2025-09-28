"use client";

import React, { JSX, useEffect, useMemo, useState } from "react";
import Modal from "@/component/Modal/Modal";
import SelectSearch from "@/component/select/SelectSearch";
import { CreditCard, Building2, Smartphone } from "lucide-react";
import Input from "../input/Input";

type PaymentType = "card" | "bank" | "momo";

interface PaymentFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: PaymentPayload) => void;
  initialData?: Partial<PaymentPayload>;
}

interface PaymentPayload {
  method: PaymentType;
  bank: string | null;
  momoProvider: string | null;
  card: {
    cardNumber: string;
    cvv: string;
    expiry: string;
  } | null;
  accountNumber: string | null; // null for cards
  accountName: string | null; // shown for bank/momo, hidden for cards
}

const banks = ["GCB Bank", "Stanbic Bank", "Ecobank", "Absa"];
const momoProviders = ["MTN MoMo", "AirtelTigo Cash", "Vodafone Cash"];
const paymentMethods: {
  value: PaymentType;
  label: string;
  icon: JSX.Element;
}[] = [
  { value: "bank", label: "Bank", icon: <Building2 className="h-4 w-4" /> },
  { value: "momo", label: "MoMo", icon: <Smartphone className="h-4 w-4" /> },
  { value: "card", label: "Card", icon: <CreditCard className="h-4 w-4" /> },
];

function formatCardNumber(v: string) {
  return v
    .replace(/\D/g, "")
    .slice(0, 16)
    .replace(/(\d{4})(?=\d)/g, "$1 ")
    .trim();
}
function formatExpiry(v: string) {
  const digits = v.replace(/\D/g, "").slice(0, 4);
  if (digits.length <= 2) return digits;
  return `${digits.slice(0, 2)}/${digits.slice(2)}`;
}
function onlyDigits(v: string, max = 30) {
  return v.replace(/\D/g, "").slice(0, max);
}
function isValidExpiry(mmYY: string) {
  const m = mmYY.match(/^(\d{2})\/(\d{2})$/);
  if (!m) return false;
  const mm = Number(m[1]);
  if (mm < 1 || mm > 12) return false;
  return true;
}

export default function PaymentForm({
  isOpen,
  onClose,
  onSave,
  initialData,
}: PaymentFormProps) {
  const [method, setMethod] = useState<PaymentType>(
    initialData?.method || "bank"
  );
  const [bank, setBank] = useState(initialData?.bank || "");
  const [momoProvider, setMomoProvider] = useState(
    initialData?.momoProvider || ""
  );
  const [cardNumber, setCardNumber] = useState(
    initialData?.card?.cardNumber || ""
  );
  const [cvv, setCvv] = useState(initialData?.card?.cvv || "");
  const [expiry, setExpiry] = useState(initialData?.card?.expiry || "");
  const [accountNumber, setAccountNumber] = useState(
    initialData?.accountNumber || ""
  );
  const [accountName, setAccountName] = useState(
    initialData?.accountName || ""
  );
  const [submitting, setSubmitting] = useState(false);
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (accountNumber && !initialData?.accountName) {
      try {
        const stored = localStorage.getItem(accountNumber);
        if (stored && !accountName) setAccountName(stored);
      } catch {}
    }
  }, [accountNumber, initialData?.accountName, accountName]);

  useEffect(() => {
    if (method === "card") {
      setAccountNumber("");
      setAccountName("");
      setBank("");
      setMomoProvider("");
    } else if (method === "bank") {
      setMomoProvider("");
    } else if (method === "momo") {
      setBank("");
    }
  }, [method]);

  const errors = useMemo(() => {
    const e: Record<string, string> = {};

    if (method === "bank") {
      if (!bank) e.bank = "Please select a bank.";
      if (!accountNumber) e.accountNumber = "Account number is required.";
    }

    if (method === "momo") {
      if (!momoProvider) e.momoProvider = "Please select a MoMo provider.";
      if (!accountNumber) {
        e.accountNumber = "MoMo number is required.";
      } else if (!/^\d{10}$/.test(accountNumber)) {
        e.accountNumber = "Enter a valid 10-digit MoMo number.";
      }
    }

    if (method === "card") {
      const raw = cardNumber.replace(/\s/g, "");
      if (raw.length < 12) e.cardNumber = "Enter a valid card number.";
      if (!/^\d{3,4}$/.test(cvv)) e.cvv = "CVV must be 3–4 digits.";
      if (!isValidExpiry(expiry)) e.expiry = "Use MM/YY format.";
    }

    return e;
  }, [method, bank, momoProvider, cardNumber, cvv, expiry, accountNumber]);

  const isValid = Object.keys(errors).length === 0;

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const payload: PaymentPayload = {
        method,
        bank: method === "bank" ? bank : null,
        momoProvider: method === "momo" ? momoProvider : null,
        card:
          method === "card"
            ? { cardNumber: cardNumber.replace(/\s/g, ""), cvv, expiry }
            : null,
        accountNumber: method === "card" ? null : accountNumber || null,
        accountName: accountName?.trim() || null,
      };

      onSave(payload);

      try {
        if (payload.accountNumber && payload.accountName) {
          localStorage.setItem(payload.accountNumber, payload.accountName);
        }
      } catch {}

      setMethod("bank");
      setBank("");
      setMomoProvider("");
      setCardNumber("");
      setCvv("");
      setExpiry("");
      setAccountNumber("");
      setAccountName("");

      onClose();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div className="flex items-center gap-2">
          <span>
            {initialData ? "Edit Payment Method" : "Add Payment Method"}
          </span>
        </div>
      }
      footer={
        <div className="flex w-full items-center justify-end gap-2">
          <button
            className="px-4 py-2 rounded-lg border text-gray-500 border-gray-300 bg-white hover:bg-gray-50 transition"
            onClick={onClose}
            type="button"
          >
            Cancel
          </button>
          <button
            className={`px-4 py-2 rounded-lg text-white transition ${
              isValid
                ? "bg-[#2B0850] hover:opacity-95"
                : "bg-[#2B0850]/60 cursor-not-allowed"
            }`}
            onClick={handleSubmit}
            disabled={!isValid || submitting}
            type="button"
          >
            {submitting ? "Saving..." : "Save"}
          </button>
        </div>
      }
    >
      <div className="space-y-5">
        <section className="rounded-xl border border-gray-200 bg-white p-3.5 shadow-sm">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Payment Method
          </label>
          <div className="grid grid-cols-3 gap-2">
            {paymentMethods.map((m) => {
              const active = method === m.value;
              return (
                <button
                  key={m.value}
                  type="button"
                  onClick={() => setMethod(m.value)}
                  className={`flex items-center justify-center gap-2 rounded-lg border px-3 py-2 text-sm transition ${
                    active
                      ? "border-2 border-[#2B0850] bg-[#2B0850]/5 text-[#2B0850] font-medium"
                      : "text-gray-500 border-gray-300 hover:border-gray-400"
                  }`}
                >
                  {m.icon}
                  {m.label}
                </button>
              );
            })}
          </div>
        </section>

        <section className="rounded-xl border border-gray-200 bg-white p-3.5 shadow-sm">
          <div className="space-y-4">
            {method === "bank" && (
              <div>
                <SelectSearch
                  label="Bank"
                  options={banks.map((b) => ({ value: b, label: b }))}
                  value={bank}
                  onChange={(v) => setBank(v)}
                  placeholder="Select Bank"
                  required
                />
                {touched.bank && errors.bank && (
                  <p className="mt-1 text-xs text-red-600">{errors.bank}</p>
                )}
              </div>
            )}

            {method === "momo" && (
              <div>
                <SelectSearch
                  label="MoMo Provider"
                  options={momoProviders.map((m) => ({ value: m, label: m }))}
                  value={momoProvider}
                  onChange={(v) => setMomoProvider(v)}
                  placeholder="Select MoMo Provider"
                  required
                />
                {touched.momoProvider && errors.momoProvider && (
                  <p className="mt-1 text-xs text-red-600">
                    {errors.momoProvider}
                  </p>
                )}
              </div>
            )}

            {method === "card" && (
              <div className="grid gap-4 sm:grid-cols-2">
                {/* Account Name */}
                <div className="sm:col-span-2">
                  <Input
                    type="text"
                    label=" Account Name"
                    value={accountName}
                    onChange={(e) => setAccountName(e.target.value)}
                    placeholder="(Optional)"
                  />
                </div>
                {/* Card number */}
                <div className="sm:col-span-2">
                  <Input
                    type="text"
                    label="Card Number"
                    inputMode="numeric"
                    autoComplete="cc-number"
                    value={cardNumber}
                    onBlur={() =>
                      setTouched((t) => ({ ...t, cardNumber: true }))
                    }
                    onChange={(e) =>
                      setCardNumber(formatCardNumber(e.target.value))
                    }
                    placeholder="**** **** **** 1234"
                  />
                  {touched.cardNumber && errors.cardNumber && (
                    <p className="mt-1 text-xs text-red-600">
                      {errors.cardNumber}
                    </p>
                  )}
                </div>

                <div>
                  <Input
                    type="password"
                    inputMode="numeric"
                    autoComplete="cc-csc"
                    label="CVV"
                    value={cvv}
                    onBlur={() => setTouched((t) => ({ ...t, cvv: true }))}
                    onChange={(e) => setCvv(onlyDigits(e.target.value, 4))}
                    placeholder="123"
                  />

                  {touched.cvv && errors.cvv && (
                    <p className="mt-1 text-xs text-red-600">{errors.cvv}</p>
                  )}
                </div>

                <div>
                  <Input
                    label="  Expiry Date"
                    type="text"
                    inputMode="numeric"
                    autoComplete="cc-exp"
                    value={expiry}
                    onBlur={() => setTouched((t) => ({ ...t, expiry: true }))}
                    onChange={(e) => setExpiry(formatExpiry(e.target.value))}
                    placeholder="MM/YY"
                  />
                  {touched.expiry && errors.expiry && (
                    <p className="mt-1 text-xs text-red-600">{errors.expiry}</p>
                  )}
                </div>
              </div>
            )}
          </div>
        </section>

        {method !== "card" && (
          <section className="rounded-xl border border-gray-200 bg-white p-3.5 shadow-sm">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-1">
                <Input
                  label={method === "momo" ? "MoMo Number" : "Account Number"}
                  type="text"
                  inputMode={method === "momo" ? "tel" : "numeric"}
                  value={accountNumber}
                  onBlur={() =>
                    setTouched((t) => ({ ...t, accountNumber: true }))
                  }
                  onChange={(e) =>
                    setAccountNumber(
                      onlyDigits(e.target.value, method === "momo" ? 10 : 20)
                    )
                  }
                  placeholder={
                    method === "momo"
                      ? "Enter 10-digit MoMo number"
                      : "Enter account number"
                  }
                />
                {touched.accountNumber && errors.accountNumber && (
                  <p className="mt-1 text-xs text-red-600">
                    {errors.accountNumber}
                  </p>
                )}
              </div>

              {/* Account Name */}
              <div className="sm:col-span-1">
                <Input
                  type="text"
                  label=" Account Name"
                  value={accountName}
                  onChange={(e) => setAccountName(e.target.value)}
                  placeholder="(Optional)"
                />
              </div>
            </div>
          </section>
        )}
      </div>
    </Modal>
  );
}
