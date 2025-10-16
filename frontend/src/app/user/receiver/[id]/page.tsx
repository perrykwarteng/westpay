"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { notFound, useParams, useRouter } from "next/navigation";
import {
  ShieldCheck,
  Calendar,
  CheckCircle2,
  AlertCircle,
  FileText,
} from "lucide-react";
import DashboardLayout from "@/component/Dashboard/DashboardLayout";
import { getTransactionById } from "@/data/mockTransactions";
import Modal from "@/component/Modal/Modal";

type StepIndex = 1 | 2 | 3 | 4;
const stepMeta = [
  { label: "Transaction", icon: FileText },
  { label: "Terms", icon: ShieldCheck },
  { label: "Dates", icon: Calendar },
  { label: "Review", icon: CheckCircle2 },
] as const;
const totalSteps = stepMeta.length as 4;

interface FormData {
  termsAccepted: boolean;
  commencementDate: string;
  completionDate: string;
  uploadedDocs: string;
  status: "pending" | "accepted" | "declined";
}
interface FormErrors {
  termsAccepted?: string;
  commencementDate?: string;
  completionDate?: string;
  uploadedDocs?: string;
}

export default function ReceiverFlowDetailPage() {
  const params = useParams<{ id: string }>();
  const mockTransaction = getTransactionById(params.id);
  if (!mockTransaction) notFound();

  const [currentStep, setCurrentStep] = useState<StepIndex>(1);
  const [touched, setTouched] = useState<Set<string>>(new Set());
  const [submitting, setSubmitting] = useState(false);
  const [showTerms, setShowTerms] = useState(false);

  const [showAcceptModal, setShowAcceptModal] = useState(false);
  const [showDeclineConfirm, setShowDeclineConfirm] = useState(false);
  const [showDeclinedModal, setShowDeclinedModal] = useState(false);
  const route = useRouter();

  const [formData, setFormData] = useState<FormData>({
    termsAccepted: false,
    commencementDate: "",
    completionDate: "",
    uploadedDocs: "",
    status: "pending",
  });

  const setField = <K extends keyof FormData>(key: K, value: FormData[K]) =>
    setFormData((prev) => ({ ...prev, [key]: value }));

  const markTouched = (name: string) =>
    setTouched((t) => new Set([...t, name]));

  const escrowAmount =
    (mockTransaction.amount * mockTransaction.escrowPercentage) / 100;
  const releaseAmount = mockTransaction.amount - escrowAmount;

  const errors: FormErrors = useMemo(() => {
    const e: FormErrors = {};
    if (!formData.termsAccepted) e.termsAccepted = "You must accept the terms.";

    if (!formData.commencementDate) {
      e.commencementDate = "Select a commencement date.";
    } else {
      const commDate = new Date(formData.commencementDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (commDate < today)
        e.commencementDate = "Commencement date cannot be in the past.";
    }

    if (!formData.completionDate) {
      e.completionDate = "Select a completion date.";
    } else if (formData.commencementDate) {
      const commDate = new Date(formData.commencementDate);
      const compDate = new Date(formData.completionDate);
      if (compDate <= commDate)
        e.completionDate = "Completion date must be after commencement date.";
    }

    return e;
  }, [formData]);

  const isStepValid = (step: StepIndex) => {
    switch (step) {
      case 1:
        return true;
      case 2:
        return !errors.termsAccepted;
      case 3:
        return !errors.commencementDate && !errors.completionDate;
      case 4:
        return true;
      default:
        return true;
    }
  };

  const canGoNext = isStepValid(currentStep);
  const goNext = () => {
    if (currentStep < totalSteps && canGoNext)
      setCurrentStep((s) => (s + 1) as StepIndex);
  };
  const goPrev = () => {
    if (currentStep > 1) setCurrentStep((s) => (s - 1) as StepIndex);
  };
  const jumpToStep = (s: StepIndex) => {
    if (s <= currentStep) return setCurrentStep(s);
    for (let i = 1 as StepIndex; i < s; i = (i + 1) as StepIndex) {
      if (!isStepValid(i)) return;
    }
    setCurrentStep(s);
  };

  const handleAccept = async () => {
    for (let i = 1 as StepIndex; i <= totalSteps; i = (i + 1) as StepIndex) {
      if (!isStepValid(i)) {
        setCurrentStep(i);
        return;
      }
    }

    setSubmitting(true);
    try {
      await new Promise((res) => setTimeout(res, 800));
      console.log("Receiver acceptance payload", {
        ...mockTransaction,
        ...formData,
        status: "accepted",
      });
      setField("status", "accepted");
      setShowAcceptModal(true);
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handledoneModal = () => {
    setShowAcceptModal(false);
    route.push("/user/dashboard");
  };

  const handleDecline = () => {
    setShowDeclineConfirm(true);
  };

  const confirmDecline = () => {
    setField("status", "declined");
    setShowDeclineConfirm(false);
    setShowDeclinedModal(true);
  };

  const progress = ((currentStep - 1) / (totalSteps - 1)) * 100;

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-7">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-[#2B0850] mb-2">
              Transaction Review
            </h1>
            <p className="text-sm text-gray-600">
              Review and respond to escrow transaction from{" "}
              {mockTransaction.senderName}
            </p>
          </div>
          <Link
            href="/user/receiver"
            className="px-4 py-2 text-sm bg-gray-100 rounded-md hover:bg-gray-200 text-gray-700"
          >
            Back to list
          </Link>
        </div>

        <nav aria-label="Progress">
          <ol className="flex items-center gap-3 flex-wrap">
            {stepMeta.map((s, idx) => {
              const stepNum = (idx + 1) as StepIndex;
              const isActive = stepNum === currentStep;
              const isDone = stepNum < currentStep;
              const Icon: React.ComponentType<React.SVGProps<SVGSVGElement>> =
                s.icon;
              const circleClass = isDone
                ? "bg-green-100 text-green-700 border-green-300"
                : isActive
                ? "bg-[#2B0850] text-white border-[#2B0850]"
                : "bg-white text-gray-600 border-gray-300";
              const labelClass = isActive
                ? "text-gray-900"
                : isDone
                ? "text-green-800"
                : "text-gray-600";

              return (
                <li key={s.label} className="flex items-center gap-3">
                  <div
                    onClick={() => jumpToStep(stepNum)}
                    className={`flex items-center gap-2 select-none cursor-pointer`}
                    aria-current={isActive ? "step" : undefined}
                  >
                    <span
                      className={`w-9 h-9 inline-flex items-center justify-center rounded-full border shadow-sm ${circleClass}`}
                    >
                      {isDone ? (
                        <CheckCircle2 className="w-5 h-5" />
                      ) : (
                        <Icon className="w-5 h-5" />
                      )}
                    </span>
                    <span className={`text-sm font-medium ${labelClass}`}>
                      {s.label}
                    </span>
                  </div>
                  {idx < stepMeta.length - 1 && (
                    <div
                      className={`h-0.5 w-5 md:w-10 rounded transition-colors ${
                        stepNum < currentStep ? "bg-green-400" : "bg-gray-200"
                      }`}
                    />
                  )}
                </li>
              );
            })}
          </ol>
        </nav>

        <div className="mt-2">
          <div className="w-full h-1 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-1 bg-[#2B0850] transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex justify-end">
            <span className="text-[11px] text-gray-500 mt-1">
              Step {currentStep} of {totalSteps}
            </span>
          </div>
        </div>

        <section className="bg-white p-6 rounded-2xl shadow-md border border-gray-100">
          {currentStep === 1 && (
            <div className="space-y-6">
              <h3 className="text-2xl font-semibold text-[#2B0850] border-b pb-3">
                Transaction Details
              </h3>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-xs text-gray-500 mb-1">Transaction ID</p>
                  <p className="font-semibold text-gray-900">
                    {mockTransaction.transactionId}
                  </p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-xs text-gray-500 mb-1">From</p>
                  <p className="font-semibold text-gray-900">
                    {mockTransaction.senderName}
                  </p>
                  <p className="text-xs text-gray-600 mt-1">
                    {mockTransaction.senderAccountId}
                  </p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-xs text-gray-500 mb-1">Service Area</p>
                  <p className="font-semibold text-gray-900">
                    {mockTransaction.serviceArea}
                  </p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-xs text-gray-500 mb-1">Payment Term</p>
                  <p className="font-semibold text-gray-900">
                    {mockTransaction.paymentTerm}
                  </p>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-xs text-gray-500 mb-2">
                  Project Description
                </p>
                <p className="text-sm text-gray-700 leading-relaxed">
                  {mockTransaction.description}
                </p>
              </div>

              <div className="bg-gradient-to-br from-[#2B0850] to-[#3c1070] text-white p-6 rounded-xl shadow-lg">
                <div className="grid md:grid-cols-3 gap-6">
                  <div>
                    <p className="text-xs opacity-80 mb-1">Total Amount</p>
                    <p className="text-3xl font-bold">
                      ${mockTransaction.amount.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs opacity-80 mb-1">Escrow (50%)</p>
                    <p className="text-2xl font-semibold">
                      ${escrowAmount.toLocaleString()}
                    </p>
                    <p className="text-xs opacity-70 mt-1">
                      Held until completion
                    </p>
                  </div>
                  <div>
                    <p className="text-xs opacity-80 mb-1">Initial Release</p>
                    <p className="text-2xl font-semibold">
                      ${releaseAmount.toLocaleString()}
                    </p>
                    <p className="text-xs opacity-70 mt-1">Upon agreement</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-4">
              <h3 className="text-2xl font-semibold text-[#2B0850] border-b pb-3">
                Terms and Conditions
              </h3>
              <div className="bg-gray-50 p-4 rounded-lg shadow-inner max-h-60 overflow-y-auto text-sm text-gray-700 space-y-2">
                <p>
                  <strong>1. Service Agreement:</strong> You agree to deliver
                  the services as described in the transaction details.
                </p>
                <p>
                  <strong>2. Escrow Protection:</strong> 50% of funds will be
                  held in escrow until project completion is confirmed.
                </p>
                <p>
                  <strong>3. Timeline Commitment:</strong> You commit to the
                  commencement and completion dates you specify.
                </p>
                <p>
                  <strong>4. Quality Standards:</strong> Work must meet agreed
                  specifications and industry standards.
                </p>
                <p>
                  <strong>5. Dispute Resolution:</strong> Any disputes will be
                  resolved through WestPay mediation.
                </p>

                <button
                  type="button"
                  aria-haspopup="dialog"
                  onClick={() => setShowTerms(true)}
                  className="text-[#2B0850] font-semibold text-sm hover:underline"
                >
                  Read full terms & conditions
                </button>
              </div>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.termsAccepted}
                  onChange={(e) => {
                    markTouched("termsAccepted");
                    setField("termsAccepted", e.target.checked);
                  }}
                  className="w-4 h-4 text-[#2B0850] rounded focus:ring-[#2B0850]"
                />
                <span className="text-sm text-gray-700">
                  I accept the terms and conditions and agree to deliver the
                  services as described
                </span>
              </label>
              {touched.has("termsAccepted") && errors.termsAccepted && (
                <p className="text-xs text-red-600">{errors.termsAccepted}</p>
              )}

              <div className="flex gap-3 mt-6 pt-4 border-t">
                <button
                  type="button"
                  onClick={handleDecline}
                  className="px-6 py-2 bg-red-100 text-red-700 rounded-md hover:bg-red-200 text-sm font-medium"
                >
                  Decline Transaction
                </button>
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-6">
              <h3 className="text-2xl font-semibold text-[#2B0850] border-b pb-3">
                Project Timeline
              </h3>

              <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg flex gap-3">
                <Calendar className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-blue-800">
                  <p className="font-semibold mb-1">Set Your Timeline</p>
                  <p>
                    Choose realistic dates for project start and completion.
                    These dates will be shared with the sender and used to track
                    escrow milestones.
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Commencement Date
                  </label>
                  <input
                    type="date"
                    value={formData.commencementDate}
                    onChange={(e) => {
                      markTouched("commencementDate");
                      setField("commencementDate", e.target.value);
                    }}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2B0850] shadow-sm"
                  />
                  {touched.has("commencementDate") &&
                    errors.commencementDate && (
                      <p className="text-xs text-red-600 mt-1">
                        {errors.commencementDate}
                      </p>
                    )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Completion Date
                  </label>
                  <input
                    type="date"
                    value={formData.completionDate}
                    onChange={(e) => {
                      markTouched("completionDate");
                      setField("completionDate", e.target.value);
                    }}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2B0850] shadow-sm"
                  />
                  {touched.has("completionDate") && errors.completionDate && (
                    <p className="text-xs text-red-600 mt-1">
                      {errors.completionDate}
                    </p>
                  )}
                </div>
              </div>

              {formData.commencementDate &&
                formData.completionDate &&
                !errors.commencementDate &&
                !errors.completionDate && (
                  <div className="bg-green-50 p-4 rounded-lg">
                    <p className="text-sm text-green-800">
                      <strong>Project Duration:</strong>{" "}
                      {Math.ceil(
                        (new Date(formData.completionDate).getTime() -
                          new Date(formData.commencementDate).getTime()) /
                          (1000 * 60 * 60 * 24)
                      )}{" "}
                      days
                    </p>
                  </div>
                )}

              {/* <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Additional Documents (Optional)
                </label>
                <input
                  type="text"
                  value={formData.uploadedDocs}
                  onChange={(e) => setField("uploadedDocs", e.target.value)}
                  placeholder="e.g., Contract.pdf, Specifications.docx"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2B0850] shadow-sm"
                />
                <p className="text-xs text-gray-500 mt-1">
                  List any relevant documents or references
                </p>
              </div> */}
            </div>
          )}

          {currentStep === 4 && (
            <div className="space-y-6">
              <h3 className="text-2xl font-semibold text-[#2B0850] border-b pb-3">
                Final Review
              </h3>

              <div className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-3">
                    Transaction Summary
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Transaction ID:</span>
                      <span className="font-medium">
                        {mockTransaction.transactionId}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Sender:</span>
                      <span className="font-medium">
                        {mockTransaction.senderName}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Service:</span>
                      <span className="font-medium">
                        {mockTransaction.serviceArea}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total Amount:</span>
                      <span className="font-medium text-lg">
                        ${mockTransaction.amount.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-3">
                    Your Commitments
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Commencement:</span>
                      <span className="font-medium">
                        {new Date(
                          formData.commencementDate
                        ).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Completion:</span>
                      <span className="font-medium">
                        {new Date(formData.completionDate).toLocaleDateString()}
                      </span>
                    </div>
                    {formData.uploadedDocs && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Documents:</span>
                        <span className="font-medium">
                          {formData.uploadedDocs}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 p-4 rounded-lg">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <div className="text-sm">
                      <p className="font-semibold text-green-900 mb-1">
                        Ready to Accept
                      </p>
                      <p className="text-green-800">
                        By accepting, you confirm all details are correct and
                        agree to complete the project by the specified
                        completion date. The sender will be notified
                        immediately.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-between mt-6 pt-6 border-t">
            {currentStep > 1 && formData.status === "pending" && (
              <button
                type="button"
                onClick={goPrev}
                className="px-8 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 text-sm"
              >
                Back
              </button>
            )}
            <div className="flex-1" />

            {currentStep < totalSteps && (
              <button
                type="button"
                onClick={goNext}
                disabled={!canGoNext}
                className={`px-8 py-2 rounded-md text-sm transition-colors ${
                  canGoNext
                    ? "bg-[#2B0850] text-white hover:bg-[#3c1070]"
                    : "bg-gray-200 text-gray-400 cursor-not-allowed"
                }`}
              >
                Next
              </button>
            )}

            {currentStep === totalSteps && formData.status === "pending" && (
              <button
                type="button"
                onClick={handleAccept}
                disabled={submitting}
                className={`px-8 py-2 rounded-md text-sm text-white transition-colors ${
                  submitting ? "bg-gray-400" : "bg-green-600 hover:bg-green-700"
                }`}
              >
                {submitting ? "Accepting…" : "Accept & Confirm"}
              </button>
            )}
          </div>
        </section>

        {/* {formData.status !== "pending" && (
          <div
            className={`p-6 rounded-xl shadow-lg text-white ${
              formData.status === "accepted"
                ? "bg-gradient-to-r from-green-600 to-emerald-600"
                : "bg-gradient-to-r from-red-600 to-rose-600"
            }`}
          >
            <div className="flex items-center gap-3">
              {formData.status === "accepted" ? (
                <CheckCircle2 className="w-8 h-8" />
              ) : (
                <AlertCircle className="w-8 h-8" />
              )}
              <div>
                <h3 className="text-xl font-bold">
                  Transaction{" "}
                  {formData.status === "accepted" ? "Accepted" : "Declined"}
                </h3>
                <p className="text-sm opacity-90 mt-1">
                  {formData.status === "accepted"
                    ? "The sender has been notified. Escrow is now active and funds are secured."
                    : "The sender has been notified of your decision."}
                </p>
              </div>
            </div>
          </div>
        )} */}
      </div>

      <Modal
        isOpen={showTerms}
        onClose={() => setShowTerms(false)}
        title="WestPay Escrow Terms & Conditions"
        size="lg"
        footer={
          <>
            <button
              className="px-4 py-2 rounded-md bg-gray-200 text-gray-800 hover:bg-gray-300"
              onClick={() => setShowTerms(false)}
              type="button"
            >
              Close
            </button>
            <button
              className="px-4 py-2 rounded-md bg-[#2B0850] text-white hover:bg-[#3c1070]"
              onClick={() => {
                setField("termsAccepted", true);
                markTouched("termsAccepted");
                setShowTerms(false);
              }}
              type="button"
            >
              Accept Terms
            </button>
          </>
        }
      >
        <div className="max-h-[60vh] overflow-y-auto pr-1 text-gray-700 text-sm leading-relaxed space-y-4">
          <section>
            <h3 className="font-semibold text-lg">1. Introduction</h3>
            <p>
              These Escrow Terms govern all transactions conducted through the
              WestPay Escrow System. By accepting a transaction, you agree to be
              bound by these Terms.
            </p>
          </section>

          <section>
            <h3 className="font-semibold text-lg">2. Receiver Obligations</h3>
            <ul className="list-disc pl-6 space-y-1">
              <li>Deliver services as described in the transaction details</li>
              <li>Meet all agreed specifications and quality standards</li>
              <li>Complete work by the specified completion date</li>
              <li>Maintain professional communication with the sender</li>
            </ul>
          </section>

          <section>
            <h3 className="font-semibold text-lg">3. Escrow Process</h3>
            <p>
              50% of the transaction amount is held in escrow until project
              completion. The remaining 50% may be released upon milestones or
              commencement, depending on payment terms.
            </p>
          </section>

          <section>
            <h3 className="font-semibold text-lg">4. Payment Release</h3>
            <p>
              Funds are released when both parties confirm completion and
              WestPay verifies deliverables meet agreed specifications.
            </p>
          </section>

          <section>
            <h3 className="font-semibold text-lg">5. Disputes</h3>
            <p>
              Any disputes must be resolved through WestPay mediation. Evidence
              may be required to support claims.
            </p>
          </section>

          <section>
            <h3 className="font-semibold text-lg">6. Cancellation</h3>
            <p>
              If you cancel after acceptance, penalties may apply based on
              project progress and sender losses.
            </p>
          </section>
        </div>
      </Modal>

      <Modal
        isOpen={showAcceptModal}
        onClose={() => setShowAcceptModal(false)}
        title="Transaction Accepted"
        size="sm"
        footer={
          <button
            className="px-4 py-2 rounded-md bg-[#2B0850] text-white hover:bg-[#3c1070]"
            onClick={handledoneModal}
          >
            Done
          </button>
        }
      >
        <p className="text-sm text-gray-700">
          The sender has been notified. Escrow is now active and funds are
          secured.
        </p>
      </Modal>

      <Modal
        isOpen={showDeclineConfirm}
        onClose={() => setShowDeclineConfirm(false)}
        title="Decline Transaction?"
        size="sm"
        footer={
          <>
            <button
              className="px-4 py-2 rounded-md bg-gray-200 text-gray-800 hover:bg-gray-300"
              onClick={() => setShowDeclineConfirm(false)}
            >
              Cancel
            </button>
            <button
              className="px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700"
              onClick={confirmDecline}
            >
              Decline
            </button>
          </>
        }
      >
        <p className="text-sm text-gray-700">
          Are you sure you want to decline this transaction? This action cannot
          be undone.
        </p>
      </Modal>

      <Modal
        isOpen={showDeclinedModal}
        onClose={() => setShowDeclinedModal(false)}
        title="Transaction Declined"
        size="sm"
        footer={
          <button
            className="px-4 py-2 rounded-md bg-[#2B0850] text-white hover:bg-[#3c1070]"
            onClick={() => {
              setShowDeclinedModal(false);
            }}
          >
            Done
          </button>
        }
      >
        <p className="text-sm text-gray-700">
          The sender has been notified of your decision.
        </p>
      </Modal>
    </DashboardLayout>
  );
}
