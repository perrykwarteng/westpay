"use client";

import DashboardLayout from "@/component/Dashboard/DashboardLayout";
import SelectSearch from "@/component/select/SelectSearch";
import { useState } from "react";

interface ServiceArea {
  label: string;
  value: string;
}

const serviceAreas: ServiceArea[] = [
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

export default function SendFlowPage() {
  const [currentStep, setCurrentStep] = useState<number>(1);

  const [formData, setFormData] = useState<{
    profile: {
      userImage: string | null;
      accountId: string;
    };
    termsAccepted: boolean;
    serviceDescription: {
      serviceArea: string;
      description: string;
    };
    startDate: string;
    endDate: string;
    paymentTerm: string;
    percentage: string;
    fundAmount: string;
    duration: string;
  }>({
    profile: {
      userImage: "/default-profile.png",
      accountId: "USR-123456789",
    },
    termsAccepted: false,
    serviceDescription: {
      serviceArea: "",
      description: "",
    },
    startDate: "",
    endDate: "",
    paymentTerm: "",
    percentage: "",
    fundAmount: "",
    duration: "",
  });

  const nextStep = () => {
    if (currentStep < 7) setCurrentStep((prev) => prev + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep((prev) => prev - 1);
  };

  const updateFormData = (field: keyof typeof formData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return true;
      case 2:
        return formData.termsAccepted;
      case 3:
        return (
          formData.serviceDescription.serviceArea &&
          formData.serviceDescription.description.trim() !== ""
        );
      case 4:
        return formData.startDate && formData.endDate;
      case 5:
        return formData.paymentTerm && formData.percentage;
      case 6:
        return formData.fundAmount && formData.duration;
      default:
        return true;
    }
  };

  const steps = [
    "Profile",
    "Terms",
    "Service",
    "Project Dates",
    "Payment",
    "Funds",
    "Review",
  ];

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-900">
              User Profile & Account
            </h3>
            <div className="flex flex-col items-center space-y-4">
              <div className="w-28 h-28 rounded-full border-4 border-[#2B0850] shadow-lg overflow-hidden">
                <img
                  src={formData.profile.userImage || "/default-profile.png"}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              </div>
              <p className="text-sm text-gray-500">Profile picture</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Account ID
              </label>
              <div className="w-full p-3 border border-gray-300 rounded-lg bg-gray-100 text-gray-700 shadow-inner">
                {formData.profile.accountId}
              </div>
            </div>
          </div>
        );

      case 2:
        return (
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
                <strong>2. Payment Protection:</strong> Funds are held securely
                until completion.
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
            </div>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.termsAccepted}
                onChange={(e) =>
                  updateFormData("termsAccepted", e.target.checked)
                }
                className="w-4 h-4 text-[#2B0850] rounded focus:ring-[#2B0850]"
              />
              <span className="text-sm text-gray-700">
                I accept the terms and conditions
              </span>
            </label>
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-gray-900">
              Service Area & Description
            </h3>
            <SelectSearch
              label="Select Service Area"
              options={serviceAreas}
              value={formData.serviceDescription.serviceArea}
              onChange={(v) =>
                setFormData((prev) => ({
                  ...prev,
                  serviceDescription: {
                    ...prev.serviceDescription,
                    serviceArea: v,
                  },
                }))
              }
              placeholder="Choose a service area..."
              required
            />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Project Description
              </label>
              <textarea
                value={formData.serviceDescription.description}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    serviceDescription: {
                      ...prev.serviceDescription,
                      description: e.target.value,
                    },
                  }))
                }
                placeholder="Describe your project..."
                rows={4}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2B0850] shadow-sm"
              />
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-gray-900">
              Set Project Dates
            </h3>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Start Date
              </label>
              <input
                type="date"
                value={formData.startDate}
                onChange={(e) => updateFormData("startDate", e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-[#2B0850]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                End Date
              </label>
              <input
                type="date"
                value={formData.endDate}
                onChange={(e) => updateFormData("endDate", e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-[#2B0850]"
              />
            </div>
            <p className="text-xs text-gray-500">
              Both parties must agree to these dates before the project starts.
            </p>
          </div>
        );

      case 5:
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-gray-900">
              Payment Terms
            </h3>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Payment Term
              </label>
              <input
                type="text"
                value={formData.paymentTerm}
                onChange={(e) => updateFormData("paymentTerm", e.target.value)}
                placeholder="e.g., Upon delivery"
                className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-[#2B0850]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Percentage (%)
              </label>
              <input
                type="number"
                value={formData.percentage}
                onChange={(e) => updateFormData("percentage", e.target.value)}
                placeholder="Enter percentage"
                className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-[#2B0850]"
              />
            </div>
          </div>
        );

      case 6:
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-gray-900">
              Fund Details
            </h3>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Amount (USD)
              </label>
              <input
                type="number"
                value={formData.fundAmount}
                onChange={(e) => updateFormData("fundAmount", e.target.value)}
                placeholder="Enter amount"
                className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-[#2B0850]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Duration (Days)
              </label>
              <input
                type="number"
                value={formData.duration}
                onChange={(e) => updateFormData("duration", e.target.value)}
                placeholder="Enter duration"
                className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-[#2B0850]"
              />
            </div>
          </div>
        );

      case 7:
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-gray-900">
              Review & Submit
            </h3>
            <div className="bg-gray-50 p-4 rounded-lg shadow-inner space-y-2 text-sm">
              <p>
                <strong>Account ID:</strong> {formData.profile.accountId}
              </p>
              <p>
                <strong>Service Area:</strong>{" "}
                {formData.serviceDescription.serviceArea}
              </p>
              <p>
                <strong>Description:</strong>{" "}
                {formData.serviceDescription.description}
              </p>
              <p>
                <strong>Start Date:</strong> {formData.startDate}
              </p>
              <p>
                <strong>End Date:</strong> {formData.endDate}
              </p>
              <p>
                <strong>Payment Term:</strong> {formData.paymentTerm}
              </p>
              <p>
                <strong>Percentage:</strong> {formData.percentage}%
              </p>
              <p>
                <strong>Amount:</strong> ${formData.fundAmount}
              </p>
              <p>
                <strong>Duration:</strong> {formData.duration} days
              </p>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              After submission, the receiver must confirm the start and end
              dates before the project begins.
            </p>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <DashboardLayout>
      <div className="flex gap-8">
        {/* Sidebar Steps */}
        <div className="w-56 space-y-4">
          {steps.map((step, idx) => {
            const stepNum = idx + 1;
            return (
              <div
                key={step}
                className={`flex items-center gap-3 p-2 rounded-md cursor-pointer ${
                  stepNum === currentStep
                    ? "bg-[#2B0850] text-white"
                    : stepNum < currentStep
                    ? "bg-green-100 text-green-700"
                    : "bg-gray-100 text-gray-500"
                }`}
                onClick={() => setCurrentStep(stepNum)}
              >
                <div className="w-7 h-7 flex items-center justify-center rounded-full font-medium text-sm bg-white text-gray-700">
                  {stepNum < currentStep ? "✓" : stepNum}
                </div>
                <span className="text-sm font-medium">{step}</span>
              </div>
            );
          })}
        </div>

        {/* Content */}
        <div className="flex-1 bg-white rounded-lg shadow-md p-6">
          {renderStepContent()}

          <div className="flex justify-between mt-6">
            {currentStep > 1 && currentStep < 7 && (
              <button
                onClick={prevStep}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 text-sm"
              >
                Back
              </button>
            )}
            <div className="flex-1" />
            {currentStep < 7 && (
              <button
                onClick={nextStep}
                disabled={!isStepValid()}
                className={`px-4 py-2 rounded-md text-sm ${
                  isStepValid()
                    ? "bg-[#2B0850] text-white hover:bg-[#3c1070]"
                    : "bg-gray-200 text-gray-400 cursor-not-allowed"
                }`}
              >
                {currentStep === 6 ? "Submit" : "Next"}
              </button>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
