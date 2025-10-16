"use client";

import { useParams, useRouter } from "next/navigation";
import { getTransactionById } from "@/data/mockTransactions";
import DashboardLayout from "@/component/Dashboard/DashboardLayout";
import { ArrowLeft, Banknote, User } from "lucide-react";
import Link from "next/link";
import RatingDisplay from "@/component/Rating/RatingDisplay";

export default function TransactionDetailPage() {
  const { transactionId } = useParams();
  const router = useRouter();

  const transaction = getTransactionById(transactionId as string);

  if (!transaction) {
    return (
      <DashboardLayout>
        <div className="max-w-3xl mx-auto text-center py-20">
          <h2 className="text-2xl font-semibold text-gray-800 mb-3">
            Transaction Not Found
          </h2>
          <p className="text-gray-600 mb-6">
            The transaction you’re looking for doesn’t exist or has been
            removed.
          </p>
          <button
            onClick={() => router.back()}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#2B0850] text-white rounded-lg hover:bg-[#3c1070] transition"
          >
            <ArrowLeft className="w-4 h-4" />
            Go Back
          </button>
        </div>
      </DashboardLayout>
    );
  }

  const escrowAmount =
    (transaction.amount * transaction.escrowPercentage) / 100;
  const releaseAmount = transaction.amount - escrowAmount;

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-[#2B0850]">
            Transaction Details
          </h1>
          <Link
            href="/transactions"
            className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-[#2B0850]"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to List
          </Link>
        </div>

        <div className="bg-white rounded-xl shadow border border-gray-100 p-6 space-y-5">
          <div className="flex flex-wrap justify-between items-center gap-3">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                {transaction.senderName}
              </h2>
              <p className="text-sm text-gray-500">
                {transaction.senderAccountId}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Transaction ID</p>
              <p className="font-mono text-sm text-gray-800">
                {transaction.transactionId}
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4 pt-3 border-t">
            <InfoItem
              label="Receiver Account"
              value={transaction.receiverAccountId}
            />
            <InfoItem label="Service Area" value={transaction.serviceArea} />
            <InfoItem label="Payment Term" value={transaction.paymentTerm} />
            <InfoItem
              label="Percentage Range"
              value={transaction.percentageRange}
            />
            <InfoItem
              label="Total Amount"
              value={`$${transaction.amount.toLocaleString()}`}
              highlight
            />
            <InfoItem
              label="Escrow Percentage"
              value={`${transaction.escrowPercentage}%`}
            />
          </div>

          <div className="pt-4 border-t">
            <h3 className="text-sm font-semibold text-gray-700 mb-1">
              Description
            </h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              {transaction.description}
            </p>
          </div>
        </div>

        <div className="bg-gray-50 border border-gray-100 rounded-xl p-6 grid sm:grid-cols-2 gap-4">
          <div className="flex items-center gap-3">
            <Banknote className="w-6 h-6 text-[#2B0850]" />
            <div>
              <p className="text-sm text-gray-500">Amount in Escrow</p>
              <p className="text-lg font-bold text-[#2B0850]">
                ${escrowAmount.toLocaleString()}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Banknote className="w-6 h-6 text-green-500" />
            <div>
              <p className="text-sm text-gray-500">Release Amount</p>
              <p className="text-lg font-bold text-green-600">
                ${releaseAmount.toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        {/* Rating Section */}
        <div className="bg-white rounded-xl shadow border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2 mb-3">
            <User className="w-5 h-5 text-[#2B0850]" />
            Sender Rating
          </h3>
          <div className="flex items-center gap-4">
            <RatingDisplay
              value={transaction.senderRating ?? 0}
              max={5}
              size={26}
            />
          </div>
          <p className="mt-3 text-sm text-gray-500">
            This rating reflects the sender’s credibility and previous
            performance within the platform.
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
}

function InfoItem({
  label,
  value,
  highlight = false,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div>
      <p className="text-xs text-gray-500">{label}</p>
      <p
        className={`text-sm font-medium ${
          highlight ? "text-[#2B0850] font-semibold" : "text-gray-800"
        }`}
      >
        {value}
      </p>
    </div>
  );
}
