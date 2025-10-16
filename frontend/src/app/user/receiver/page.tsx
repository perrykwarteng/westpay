"use client";

import Link from "next/link";
import DashboardLayout from "@/component/Dashboard/DashboardLayout";
import { FileText } from "lucide-react";
import { mockTransactions } from "@/data/mockTransactions";
import RatingDisplay from "@/component/Rating/RatingDisplay";

export default function ReceiverListPage() {
  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold text-[#2B0850] mb-2">
          Pending Transactions
        </h1>
        <p className="text-sm text-gray-600">
          You have {mockTransactions.length} pending transaction
          {mockTransactions.length !== 1 ? "s" : ""} awaiting your review
        </p>

        <div className="grid gap-4">
          {mockTransactions.map((transaction) => {
            const escrowAmt =
              (transaction.amount * transaction.escrowPercentage) / 100;
            const releaseAmt = transaction.amount - escrowAmt;

            return (
              <div
                key={transaction.transactionId}
                className="bg-white p-6 rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition-shadow"
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div className="flex-1 space-y-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          {transaction.senderName}
                        </h3>
                        <p className="text-xs text-gray-500 mt-1">
                          {transaction.senderAccountId}
                        </p>
                      </div>
                      <span className="px-3 py-1 bg-amber-100 text-amber-700 text-xs font-medium rounded-full">
                        Pending Review
                      </span>
                    </div>

                    {/* Rating Section */}
                    <div className="flex flex-wrap items-center gap-4">
                      <div>
                        <p className="text-xs text-gray-500">Sender Rating</p>
                        <RatingDisplay
                          value={transaction.senderRating}
                          size={18}
                        />
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-3">
                      <div>
                        <p className="text-xs text-gray-500">Transaction ID</p>
                        <p className="text-sm font-medium text-gray-900">
                          {transaction.transactionId}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Service Area</p>
                        <p className="text-sm font-medium text-gray-900">
                          {transaction.serviceArea}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Payment Term</p>
                        <p className="text-sm font-medium text-gray-900">
                          {transaction.paymentTerm}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Total Amount</p>
                        <p className="text-lg font-bold text-[#2B0850]">
                          ${transaction.amount.toLocaleString()}
                        </p>
                      </div>
                    </div>

                    <p className="text-sm text-gray-600 line-clamp-2">
                      {transaction.description}
                    </p>

                    <div className="flex gap-4 text-xs">
                      <div className="bg-blue-50 px-3 py-1.5 rounded">
                        <span className="text-blue-600 font-medium">
                          Escrow: ${escrowAmt.toLocaleString()}
                        </span>
                      </div>
                      <div className="bg-green-50 px-3 py-1.5 rounded">
                        <span className="text-green-600 font-medium">
                          Release: ${releaseAmt.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="lg:pl-6 lg:border-l">
                    <Link
                      href={`/user/receiver/${transaction.transactionId}`}
                      className="w-full lg:w-auto inline-flex justify-center px-6 py-3 bg-[#2B0850] text-white rounded-lg hover:bg-[#3c1070] transition-colors font-medium"
                    >
                      Review Transaction
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {mockTransactions.length === 0 && (
          <div className="bg-white p-12 rounded-xl shadow-md border border-gray-100 text-center">
            <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No Pending Transactions
            </h3>
            <p className="text-gray-600">
              You don&apos;t have any transactions awaiting your review at the
              moment.
            </p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
