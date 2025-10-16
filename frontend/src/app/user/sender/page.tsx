"use client";

import { useMemo, useState } from "react";
import DashboardLayout from "@/component/Dashboard/DashboardLayout";
import Input from "@/component/input/Input";
import SelectSearch from "@/component/select/SelectSearch";
import Profile from "../../../../public/images/profileImg.jpg";
import Image, { StaticImageData } from "next/image";
import {
  User,
  ShieldCheck,
  Briefcase,
  CreditCard,
  PiggyBank,
  CheckCircle2,
} from "lucide-react";
import MakePaymentForm from "@/component/Payment/MakePayment";
import Modal from "@/component/Modal/Modal";
import RatingDisplay from "@/component/Rating/RatingDisplay";
import { useRouter } from "next/navigation";

interface ServiceAreaOption {
  label: string;
  value: string;
}

const serviceAreas: ServiceAreaOption[] = [
  { label: "Goods", value: "goods" },
  { label: "Services", value: "services" },
  { label: "Products", value: "products" },
  { label: "Rentals", value: "rentals" },
  { label: "Consulting", value: "consulting" },
  { label: "Construction", value: "construction" },
  { label: "Transportation", value: "transportation" },
  { label: "Events & Entertainment", value: "events" },
  { label: "Healthcare", value: "healthcare" },
  { label: "Education & Training", value: "education" },
];

const paymentTermOptions = [
  { label: "Upon Delivery", value: "upon_delivery" },
  { label: "Milestones", value: "milestones" },
  { label: "50/50 (Upfront/Completion)", value: "fifty_fifty" },
  { label: "Net 7", value: "net7" },
  { label: "Net 14", value: "net14" },
  { label: "Net 30", value: "net30" },
];

const percentageRangeOptions = Array.from({ length: 10 }).map((_, i) => {
  const start = i * 10;
  const end = start + 10;
  return { label: `${start}–${end}%`, value: `${start}-${end}` };
});

interface ProfileInfo {
  userImage: StaticImageData;
  accountId: string;
  name: string;
  receiverAccountId: string;
}

interface ServiceDescription {
  serviceArea: string;
  description: string;
}

interface FormData {
  profile: ProfileInfo;
  termsAccepted: boolean;
  serviceDescription: ServiceDescription;
  paymentTerm: string;
  percentageRange: string;
}

interface FormErrors {
  termsAccepted?: string;
  serviceArea?: string;
  description?: string;
  paymentTerm?: string;
  percentageRange?: string;
  fundAmount?: string;
  receiverAccountId?: string;
}

const stepMeta = [
  { label: "Profile", icon: User },
  { label: "Terms", icon: ShieldCheck },
  { label: "Service", icon: Briefcase },
  { label: "Payment", icon: CreditCard },
  { label: "Funds", icon: PiggyBank },
  { label: "Waiting", icon: CheckCircle2 },
] as const;

type StepIndex = 1 | 2 | 3 | 4 | 5 | 6;
const totalSteps = stepMeta.length as 6;

export default function SendFlowPage() {
  const [currentStep, setCurrentStep] = useState<StepIndex>(1);
  const [touched, setTouched] = useState<Set<string>>(new Set());
  const [submitting, setSubmitting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const router = useRouter();

  const [formData, setFormData] = useState({
    profile: {
      name: "Johnson Kwaku",
      userImage: Profile,
      accountId: "WSP-123456789-A",
      receiverAccountId: "",
    },
    serviceDescription: {
      serviceArea: "",
      description: "",
    },
    termsAccepted: false,
    paymentTerm: "",
    percentageRange: "",
    receiverAccepted: true,
    receiverUploads: "",
    commencementDate: "",
    completionDate: "",
    senderConfirmed: true,
  });

  const setField = <K extends keyof FormData>(key: K, value: FormData[K]) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const setNested = <
    K extends keyof FormData,
    V extends FormData[K] extends object ? FormData[K] : never,
    SK extends keyof V
  >(
    key: K,
    subkey: SK,
    value: V[SK]
  ): void => {
    setFormData((prev) => ({
      ...prev,
      [key]: {
        ...(prev[key] as unknown as V),
        [subkey]: value,
      },
    }));
  };

  const markTouched = (name: string) =>
    setTouched((t) => new Set([...t, name]));

  const descriptionChars = formData.serviceDescription.description.length;
  const descriptionMax = 600;

  const errors: FormErrors = useMemo(() => {
    const e: FormErrors = {};

    if (
      !/^WSP-[0-9]{10,}-[A-Z]$/.test(formData.profile.receiverAccountId.trim())
    ) {
      e.receiverAccountId = "Use format: WSP-0093735238-A";
    }

    if (!formData.termsAccepted) e.termsAccepted = "You must accept the terms.";

    if (!formData.serviceDescription.serviceArea)
      e.serviceArea = "Select a service area.";
    if (!formData.serviceDescription.description.trim()) {
      e.description = "Provide a short project description.";
    } else if (descriptionChars > descriptionMax) {
      e.description = `Description is too long (max ${descriptionMax} chars).`;
    }

    if (!formData.paymentTerm) e.paymentTerm = "Select a payment term.";
    if (!formData.percentageRange)
      e.percentageRange = "Select a percentage range.";

    return e;
  }, [formData, descriptionChars]);

  const isStepValid = (step: StepIndex) => {
    switch (step) {
      case 1:
        return !errors.receiverAccountId;
      case 2:
        return !errors.termsAccepted;
      case 3:
        return !errors.serviceArea && !errors.description;
      case 4:
        return !errors.paymentTerm && !errors.percentageRange;
      case 5:
        return !errors.fundAmount;
      case 6:
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

  const handleSubmit = async () => {
    for (let i = 1 as StepIndex; i <= totalSteps; i = (i + 1) as StepIndex) {
      if (!isStepValid(i)) {
        setCurrentStep(i);
        return;
      }
    }

    setSubmitting(true);
    try {
      await new Promise((res) => setTimeout(res, 800)); // simulate API delay
      console.log("Escrow submission payload", formData);
      setIsModalOpen(true); // open success modal
    } catch (err) {
      console.error(err);
      alert("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    router.push("/user/dashboard"); // redirect to dashboard after modal close
  };

  const progress = ((currentStep - 1) / (totalSteps - 1)) * 100;

  const [showTerms, setShowTerms] = useState(false);

  return (
    <DashboardLayout>
      <div className="space-y-7">
        <nav aria-label="Progress">
          <ol className="flex items-center gap-3 flex-wrap">
            {stepMeta.map((s, idx) => {
              const stepNum = (idx + 1) as StepIndex;
              const isActive = stepNum === currentStep;
              const isDone = stepNum < currentStep;
              const Icon = s.icon;
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
                    aria-label={`Go to ${s.label}`}
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
              aria-hidden
            />
          </div>
          <div className="flex justify-end">
            <span className="text-[11px] text-gray-500 mt-1">
              Step {currentStep} of {totalSteps}
            </span>
          </div>
        </div>

        <section className="p-6">
          {currentStep === 1 && (
            <div className="space-y-8 bg-white p-6 rounded-2xl shadow-md border border-gray-100">
              <h3 className="text-2xl font-semibold text-[#2B0850] border-b pb-3">
                User Profile & Account
              </h3>

              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
                <div className="relative w-28 h-28 rounded-full border-4 border-[#2B0850]/80 shadow-lg overflow-hidden group">
                  <Image
                    src={formData.profile.userImage}
                    alt="Profile"
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>

                <div className="text-center sm:text-left space-y-1">
                  <h4 className="text-lg font-semibold text-gray-900">
                    {formData.profile.name}
                  </h4>
                  <p className="text-sm text-gray-600">
                    Account ID:
                    <span className="ml-2 font-medium text-[#2B0850]">
                      {formData.profile.accountId}
                    </span>
                  </p>
                  <RatingDisplay value={3.5} />
                </div>
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="receiverAccountId"
                  className="text-[15px] text-[#2B0850] font-semibold block"
                >
                  Enter Receiver&apos;s Account No
                </label>
                <Input
                  type="text"
                  placeholder="WSP-0093735238-A"
                  value={formData.profile.receiverAccountId}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    markTouched("receiverAccountId");
                    setNested("profile", "receiverAccountId", e.target.value);
                  }}
                />
                {touched.has("receiverAccountId") &&
                  errors.receiverAccountId && (
                    <p className="text-xs text-red-600 mt-1">
                      {errors.receiverAccountId}
                    </p>
                  )}
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <>
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-gray-900">
                  Terms and Conditions
                </h3>
                <div className="bg-gray-50 p-4 rounded-lg shadow-inner max-h-60 overflow-y-auto text-sm text-gray-700 space-y-2">
                  <p>
                    <strong>1. Service Agreement:</strong> Use our secure escrow
                    service for transaction protection.
                  </p>
                  <p>
                    <strong>2. Payment Protection:</strong> Funds are held
                    securely until completion.
                  </p>
                  <p>
                    <strong>3. Dispute Resolution:</strong> Disputes resolved
                    through mediation.
                  </p>
                  <p>
                    <strong>4. Transaction Fees:</strong> Standard fees apply.
                  </p>
                  <p>
                    <strong>5. Cancellation Policy:</strong> Full refund if
                    cancelled before acceptance.
                  </p>

                  <button
                    type="button"
                    onClick={() => setShowTerms(true)}
                    className="text-[#2B0850] font-semibold text-sm hover:underline"
                  >
                    Read full escrow terms
                  </button>
                </div>
                <label className="flex items-center gap-2">
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
                    I accept the terms and conditions
                  </span>
                </label>
                {touched.has("termsAccepted") && errors.termsAccepted && (
                  <p className="text-xs text-red-600">{errors.termsAccepted}</p>
                )}
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
                    >
                      Close
                    </button>
                  </>
                }
              >
                <div className="space-y-4 text-gray-700 text-sm leading-relaxed max-h-[70vh] overflow-y-auto">
                  <h3 className="font-semibold text-lg">1. Introduction</h3>
                  <p>
                    These Escrow Terms (“Terms”) govern all transactions
                    conducted through the WestPay Escrow System (“the
                    Platform”). By initiating or accepting a transaction, both
                    the Sender and Receiver agree to be bound by these Terms.
                  </p>

                  <h3 className="font-semibold text-lg">2. Role of WestPay</h3>
                  <p>
                    WestPay acts as a neutral third-party escrow agent. Funds
                    are held securely until the agreed service or product is
                    completed and both parties fulfill their obligations.
                  </p>

                  <h3 className="font-semibold text-lg">
                    3. Transaction Process
                  </h3>
                  <ul className="list-disc pl-6 space-y-1">
                    <li>
                      <strong>Initiation:</strong> The Sender creates a
                      transaction and deposits funds into the escrow account.
                    </li>
                    <li>
                      <strong>Receiver Confirmation:</strong> The Receiver
                      reviews and either Agrees or Declines.
                    </li>
                    <li>
                      <strong>Commencement:</strong> The project officially
                      starts on the Commencement Date and ends on the Completion
                      Date.
                    </li>
                    <li>
                      <strong>Escrow Allocation:</strong> 50% of the transaction
                      amount is held in escrow. Remaining 50% may be released
                      upon milestones or completion.
                    </li>
                    <li>
                      <strong>Completion & Verification:</strong> Both parties
                      confirm deliverables before release.
                    </li>
                  </ul>

                  <h3 className="font-semibold text-lg">4. Release of Funds</h3>
                  <p>
                    Funds are released when both parties confirm completion,
                    WestPay verifies delivery, or mutual agreement is reached.
                  </p>

                  <h3 className="font-semibold text-lg">5. Disputes</h3>
                  <p>
                    Both parties must attempt in-app resolution first. WestPay
                    may hold funds until verification is complete and make a
                    final decision based on evidence.
                  </p>

                  <h3 className="font-semibold text-lg">
                    6. Refunds & Cancellations
                  </h3>
                  <p>
                    If declined before commencement, Sender gets full refund
                    (minus fees). After partial progress, refunds are prorated.
                  </p>

                  <h3 className="font-semibold text-lg">7. Fees</h3>
                  <p>Service fees apply and are shown before confirmation.</p>

                  <h3 className="font-semibold text-lg">8. Responsibilities</h3>
                  <ul className="list-disc pl-6 space-y-1">
                    <li>Sender must ensure accurate transaction details.</li>
                    <li>Receiver must deliver services as agreed.</li>
                    <li>WestPay holds and releases funds securely.</li>
                  </ul>

                  <h3 className="font-semibold text-lg">9. Liability</h3>
                  <p>
                    WestPay is not liable for service quality, delays, or losses
                    beyond the escrowed amount.
                  </p>

                  <h3 className="font-semibold text-lg">10. Acceptance</h3>
                  <p>
                    By clicking “Agree & Confirm,” both parties acknowledge they
                    have read and accepted these Escrow Terms.
                  </p>
                </div>
              </Modal>
            </>
          )}

          {currentStep === 3 && (
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-gray-900">
                Service Area & Description
              </h3>
              <SelectSearch
                label="Select Service Area"
                options={serviceAreas}
                value={formData.serviceDescription.serviceArea}
                onChange={(v: string) => {
                  markTouched("serviceArea");
                  setNested("serviceDescription", "serviceArea", v);
                }}
                placeholder="Choose a service area..."
                required
              />
              {touched.has("serviceArea") && errors.serviceArea && (
                <p className="text-xs text-red-600">{errors.serviceArea}</p>
              )}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Project Description
                </label>
                <textarea
                  value={formData.serviceDescription.description}
                  onChange={(e) => {
                    markTouched("description");
                    setNested(
                      "serviceDescription",
                      "description",
                      e.target.value
                    );
                  }}
                  placeholder="Describe your project..."
                  rows={4}
                  maxLength={descriptionMax + 1}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2B0850] shadow-sm"
                />
                <div className="flex items-center justify-between mt-1">
                  {touched.has("description") && errors.description ? (
                    <p className="text-xs text-red-600">{errors.description}</p>
                  ) : (
                    <span className="text-xs text-gray-500">
                      {descriptionChars}/{descriptionMax}
                    </span>
                  )}
                </div>
              </div>
            </div>
          )}

          {currentStep === 4 && (
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-gray-900">
                Payment Terms
              </h3>
              <div>
                <SelectSearch
                  label="Payment Term"
                  options={paymentTermOptions}
                  value={formData.paymentTerm}
                  onChange={(v: string) => {
                    markTouched("paymentTerm");
                    setField("paymentTerm", v);
                  }}
                  placeholder="Select a payment term..."
                  required
                />
                {touched.has("paymentTerm") && errors.paymentTerm && (
                  <p className="text-xs text-red-600 mt-1">
                    {errors.paymentTerm}
                  </p>
                )}
              </div>
              <div>
                <SelectSearch
                  label="Percentage Range"
                  options={percentageRangeOptions}
                  value={formData.percentageRange}
                  onChange={(v: string) => {
                    markTouched("percentageRange");
                    setField("percentageRange", v);
                  }}
                  placeholder="Select a percentage range..."
                  required
                />
                {touched.has("percentageRange") && errors.percentageRange && (
                  <p className="text-xs text-red-600 mt-1">
                    {errors.percentageRange}
                  </p>
                )}
              </div>
            </div>
          )}

          {currentStep === 5 && (
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-gray-900">
                Fund Details
              </h3>
              <div>
                <MakePaymentForm onPay={() => {}} />
              </div>
            </div>
          )}

          {currentStep === 6 && (
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-gray-900">
                {formData.receiverAccepted
                  ? "Review Receivers Confirmation"
                  : "Waiting Receivers Confirmation"}
              </h3>

              <div className="bg-gray-50 p-4 rounded-lg shadow-inner space-y-2 text-sm">
                <p>
                  <strong>Account ID:</strong> {formData.profile.accountId}
                </p>
                <p>
                  <strong>Receiver Account:</strong>{" "}
                  {formData.profile.receiverAccountId || "—"}
                </p>
                <p>
                  <strong>Service Area:</strong>{" "}
                  {formData.serviceDescription.serviceArea || "—"}
                </p>
                <p>
                  <strong>Description:</strong>{" "}
                  {formData.serviceDescription.description || "—"}
                </p>
                <p>
                  <strong>Payment Term:</strong>{" "}
                  {paymentTermOptions.find(
                    (o) => o.value === formData.paymentTerm
                  )?.label || "—"}
                </p>
                <p>
                  <strong>Percentage:</strong>{" "}
                  {percentageRangeOptions.find(
                    (o) => o.value === formData.percentageRange
                  )?.label || "—"}
                </p>

                {formData.receiverAccepted && (
                  <>
                    <hr className="my-2" />
                    <p>
                      <strong>Receiver Acceptance:</strong>{" "}
                      <span className="text-green-700 font-semibold">
                        Accepted Terms
                      </span>
                    </p>
                    <p>
                      <strong>Uploaded Documents:</strong>{" "}
                      {formData.receiverUploads || "—"}
                    </p>
                    <p>
                      <strong>Commencement Date:</strong>{" "}
                      {formData.commencementDate || "—"}
                    </p>
                    <p>
                      <strong>Completion Date:</strong>{" "}
                      {formData.completionDate || "—"}
                    </p>

                    {/* {!formData.senderConfirmed ? (
                      <button
                        className="mt-3 px-4 py-2 bg-[#2B0850] text-white rounded-md hover:opacity-90"
                        onClick={() =>
                          setFormData((prev) => ({
                            ...prev,
                            senderConfirmed: true,
                          }))
                        }
                      >
                        Confirm & Submit
                      </button>
                    ) : (
                      <p className="text-green-700 font-medium mt-2">
                        You have confirmed the receiver’s acceptance. Submission
                        complete.
                      </p>
                    )} */}
                  </>
                )}
              </div>

              {!formData.receiverAccepted && (
                <p className="text-xs text-gray-500 mt-2">
                  Waiting receiver&apos;s confirmation of the start and end
                  dates. We&apos;ll notify you as soon as they respond.
                </p>
              )}
            </div>
          )}

          <div className="flex justify-between mt-6">
            {currentStep > 1 && (
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

            {currentStep === totalSteps && (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={submitting}
                className={`px-8 py-2 rounded-md text-sm text-white transition-colors ${
                  submitting ? "bg-gray-400" : "bg-[#2B0850] hover:bg-[#3c1070]"
                }`}
              >
                {submitting ? "Submitting…" : "Agree and Submit"}
              </button>
            )}
          </div>
        </section>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title="Submission Received"
        size="sm"
        footer={
          <button
            onClick={handleCloseModal}
            className="bg-[#2B0850] text-white px-4 py-2 rounded-md hover:bg-[#3b0a6a] transition"
          >
            Track Project
          </button>
        }
      >
        <div className="text-center space-y-3">
          <div className="flex justify-center">
            <div className="flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
              <svg
                className="h-6 w-6 text-green-600"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
          </div>
          <p className="text-gray-700">
            Your submission has been received. We&apos;ll notify the receiver to
            Start the start and end dates.
          </p>
        </div>
      </Modal>
    </DashboardLayout>
  );
}
