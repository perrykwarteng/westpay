"use client";

import React, { useEffect, useMemo, useState, JSX } from "react";
import SelectSearch from "@/component/select/SelectSearch";
import { CreditCard, Building2, Smartphone, XCircle } from "lucide-react";
import Input from "../input/Input";
import { AnimatePresence, motion } from "framer-motion";

type PaymentType = "card" | "bank" | "momo";

interface PaymentPayload {
  method: PaymentType;
  bank: string | null;
  momoProvider: string | null;
  card: {
    cardNumber: string;
    cvv: string;
    expiry: string;
  } | null;
  accountNumber: string | null;
  accountName: string | null;
  amount: number;
  reference: string;
}

interface PaymentFormProps {
  onPay: (data: PaymentPayload) => void;
}

const banks = ["GCB Bank", "Stanbic Bank", "Ecobank", "Absa"];
const momoProviders = ["MTN MoMo", "AirtelTigo Cash", "Vodafone Cash"];

const paymentMethods: {
  value: PaymentType;
  label: string;
  icon: JSX.Element;
}[] = [
  {
    value: "bank",
    label: "Bank Transfer",
    icon: <Building2 className="h-4 w-4" />,
  },
  {
    value: "momo",
    label: "Mobile Money",
    icon: <Smartphone className="h-4 w-4" />,
  },
  {
    value: "card",
    label: "Credit/Debit Card",
    icon: <CreditCard className="h-4 w-4" />,
  },
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
  return mm >= 1 && mm <= 12;
}

export default function MakePaymentForm({ onPay }: PaymentFormProps) {
  const [method, setMethod] = useState<PaymentType>("momo");
  const [bank, setBank] = useState("");
  const [momoProvider, setMomoProvider] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cvv, setCvv] = useState("");
  const [expiry, setExpiry] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [accountName, setAccountName] = useState("");
  const [amount, setAmount] = useState("");
  const [reference, setReference] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  useEffect(() => {
    setBank("");
    setMomoProvider("");
    setCardNumber("");
    setCvv("");
    setExpiry("");
    setAccountNumber("");
    setAccountName("");
  }, [method]);

  const errors = useMemo(() => {
    const e: Record<string, string> = {};

    if (!amount) e.amount = "Enter an amount to pay.";
    if (!reference) e.reference = "Payment reference is required.";

    if (method === "bank") {
      if (!bank) e.bank = "Select a bank.";
      if (!accountNumber) e.accountNumber = "Account number is required.";
    }

    if (method === "momo") {
      if (!momoProvider) e.momoProvider = "Select a MoMo provider.";
      if (!/^\d{10}$/.test(accountNumber))
        e.accountNumber = "Enter a valid 10-digit MoMo number.";
    }

    if (method === "card") {
      const raw = cardNumber.replace(/\s/g, "");
      if (raw.length < 12) e.cardNumber = "Enter a valid card number.";
      if (!/^\d{3,4}$/.test(cvv)) e.cvv = "CVV must be 3–4 digits.";
      if (!isValidExpiry(expiry)) e.expiry = "Use MM/YY format.";
    }

    return e;
  }, [
    method,
    bank,
    momoProvider,
    cardNumber,
    cvv,
    expiry,
    accountNumber,
    amount,
    reference,
  ]);

  const isValid = Object.keys(errors).length === 0;

  const confirmPayment = async () => {
    if (!isValid) return;
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
        amount: Number(amount),
        reference: reference.trim(),
      };

      await new Promise((r) => setTimeout(r, 1000));
      onPay(payload);
      setShowSuccessModal(true);

      setTimeout(() => setShowSuccessModal(false), 3000);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-10">
      <section className="rounded-2xl border flex flex-col sm:flex-row items-center gap-6 border-gray-200 bg-white p-6 shadow-sm">
        <Input
          label="Payment Amount (GHS)"
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Enter amount"
        />
        <Input
          label="Payment Reference"
          type="text"
          value={reference}
          onChange={(e) => setReference(e.target.value)}
          placeholder="e.g. School Fees, Invoice #234"
        />
      </section>

      <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <label className="block text-sm font-semibold text-gray-700 mb-4">
          Choose Payment Method
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {paymentMethods.map((m) => {
            const active = method === m.value;
            return (
              <button
                key={m.value}
                type="button"
                onClick={() => setMethod(m.value)}
                className={`flex items-center justify-center gap-2 rounded-xl border px-4 py-3 text-sm font-medium transition-all ${
                  active
                    ? "border-2 border-[#2B0850] bg-[#2B0850]/10 text-[#2B0850]"
                    : "text-gray-600 border-gray-300 hover:border-[#2B0850]/40"
                }`}
              >
                {m.icon}
                {m.label}
              </button>
            );
          })}
        </div>
      </section>

      <AnimatePresence mode="wait">
        <motion.section
          key={method}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
          className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm space-y-4"
        >
          {method === "bank" && (
            <>
              <SelectSearch
                label="Select Bank"
                options={banks.map((b) => ({ value: b, label: b }))}
                value={bank}
                onChange={(v) => setBank(v)}
                placeholder="Choose a bank"
              />
              <Input
                label="Account Number"
                value={accountNumber}
                onChange={(e) =>
                  setAccountNumber(onlyDigits(e.target.value, 20))
                }
                placeholder="Enter bank account number"
              />
              <Input
                label="Account Name"
                value={accountName}
                onChange={(e) => setAccountName(e.target.value)}
                placeholder="Account holder's name"
              />
            </>
          )}

          {method === "momo" && (
            <>
              <SelectSearch
                label="MoMo Provider"
                options={momoProviders.map((m) => ({ value: m, label: m }))}
                value={momoProvider}
                onChange={(v) => setMomoProvider(v)}
                placeholder="Select MoMo provider"
              />
              <Input
                label="MoMo Number"
                type="tel"
                value={accountNumber}
                onChange={(e) =>
                  setAccountNumber(onlyDigits(e.target.value, 10))
                }
                placeholder="Enter 10-digit MoMo number"
              />
              <Input
                label="Account Name"
                value={accountName}
                onChange={(e) => setAccountName(e.target.value)}
                placeholder="Account holder's name"
              />
            </>
          )}

          {method === "card" && (
            <div className="grid gap-4 sm:grid-cols-2">
              <Input
                label="Card Number"
                value={cardNumber}
                onChange={(e) =>
                  setCardNumber(formatCardNumber(e.target.value))
                }
                placeholder="**** **** **** 1234"
              />
              <Input
                label="Account Name"
                value={accountName}
                onChange={(e) => setAccountName(e.target.value)}
                placeholder="Account holder's name"
              />
              <Input
                label="CVV"
                type="password"
                value={cvv}
                onChange={(e) => setCvv(onlyDigits(e.target.value, 4))}
                placeholder="123"
              />
              <Input
                label="Expiry (MM/YY)"
                value={expiry}
                onChange={(e) => setExpiry(formatExpiry(e.target.value))}
                placeholder="MM/YY"
              />
            </div>
          )}
        </motion.section>
      </AnimatePresence>

      <div className="flex justify-end">
        <button
          onClick={confirmPayment}
          disabled={!isValid || submitting}
          className={`px-6 py-2 rounded-md text-white font-semibold shadow-sm transition ${
            isValid
              ? "bg-[#2B0850] hover:opacity-90"
              : "bg-[#2B0850]/60 cursor-not-allowed"
          }`}
        >
          {submitting ? "Processing..." : "Load Funds"}
        </button>
      </div>

      <AnimatePresence>
        {showSuccessModal && (
          <motion.div
            className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-2xl shadow-lg w-[90%] max-w-md p-6 relative text-center"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
            >
              <XCircle
                onClick={() => setShowSuccessModal(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 cursor-pointer"
              />

              <div className="flex flex-col items-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
                  <svg
                    className="w-10 h-10 text-green-600"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <h2 className="text-xl font-semibold text-green-700">
                  Payment Successful
                </h2>
                <p className="text-gray-600 text-sm">
                  Your payment of <strong>GHS {amount}</strong> via{" "}
                  {method.toUpperCase()} has been processed successfully.
                </p>
                <div className="mt-4">
                  <button
                    onClick={() => setShowSuccessModal(false)}
                    className="px-6 py-2 rounded-md bg-[#2B0850] text-white font-semibold hover:opacity-90"
                  >
                    Close
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
