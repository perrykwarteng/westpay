"use client";

import React, { useState, useEffect } from "react";
import { User, FileText, Camera, CheckCircle, Upload } from "lucide-react";
import DashboardLayout from "@/component/Dashboard/DashboardLayout";
import Input from "@/component/input/Input";
import SelectInput from "@/component/select/Select";

interface FormData {
  idFront: File | null;
  idBack: File | null;
  idType: string;
  idNumber: string;
  selfie: File | null;
}

interface SidebarStep {
  id: number;
  title: string;
  subtitle: string;
  icon: React.ComponentType<{ className?: string }>;
}

export default function KycForm(): React.JSX.Element {
  const [step, setStep] = useState<number>(1);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [previewUrls, setPreviewUrls] = useState<{
    idFront: string | null;
    idBack: string | null;
    selfie: string | null;
  }>({
    idFront: null,
    idBack: null,
    selfie: null,
  });
  const [formData, setFormData] = useState<FormData>({
    idFront: null,
    idBack: null,
    idType: "",
    idNumber: "",
    selfie: null,
  });

  const handleNext = (): void => setStep((s: number) => s + 1);
  const handleBack = (): void => setStep((s: number) => s - 1);
  const handleSubmit = (): void => setIsSubmitted(true);

  const updateFormData = (
    field: keyof FormData,
    value: File | string | null
  ): void => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    if (
      value instanceof File &&
      (field === "idFront" || field === "idBack" || field === "selfie")
    ) {
      if (previewUrls[field]) {
        URL.revokeObjectURL(previewUrls[field]!);
      }
      const newUrl = URL.createObjectURL(value);
      setPreviewUrls((prev) => ({ ...prev, [field]: newUrl }));
    } else if (
      !value &&
      (field === "idFront" || field === "idBack" || field === "selfie")
    ) {
      if (previewUrls[field]) {
        URL.revokeObjectURL(previewUrls[field]!);
      }
      setPreviewUrls((prev) => ({ ...prev, [field]: null }));
    }
  };

  const sidebarSteps: SidebarStep[] = [
    {
      id: 1,
      title: "ID Information",
      subtitle: "Browse and info",
      icon: User,
    },
    {
      id: 2,
      title: "ID Verification",
      subtitle: "Browse and upload",
      icon: FileText,
    },
    { id: 3, title: "Selfie", subtitle: "Browse and upload", icon: Camera },
    {
      id: 4,
      title: "Review",
      subtitle: "Browse and review",
      icon: CheckCircle,
    },
  ];

  useEffect(() => {
    return () => {
      Object.values(previewUrls).forEach((url) => {
        if (url) URL.revokeObjectURL(url);
      });
    };
  }, [previewUrls]);

  const handleFileChange =
    (field: keyof FormData) =>
    (event: React.ChangeEvent<HTMLInputElement>): void => {
      const file = event.target.files?.[0] || null;
      updateFormData(field, file);
    };

  const handleInputChange =
    (field: keyof FormData) =>
    (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>): void => {
      updateFormData(field, event.target.value);
    };

  return (
    <DashboardLayout>
      <div className="">
        <h2 className="text-[22px] md:text-[25px] text-[#2B0850] font-semibold">
          Identification
        </h2>
        <div className="flex flex-col md:flex-row h-full mt-6">
          {isSubmitted ? (
            <div className="flex-1 flex items-center justify-center bg-gray-50 p-6 sm:p-10">
              <div className="text-center space-y-8 max-w-2xl px-4 sm:px-6">
                <div
                  className="w-20 h-20 sm:w-24 sm:h-24 rounded-full flex items-center justify-center mx-auto"
                  style={{ backgroundColor: "#2B0850" }}
                >
                  <svg
                    className="w-10 h-10 sm:w-12 sm:h-12 text-white"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                  </svg>
                </div>
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
                    Verification pending
                  </h1>
                  <p className="text-gray-600 leading-relaxed text-base sm:text-lg">
                    In order to protect your identity, we will be confirming
                    your next address through Acuant's KBA Services. We will
                    require an answer shortly and submit "Account KYC Address
                    Verification Request begins to monitor in order to verify.
                    Simply click the link in the email within 24 hours."
                  </p>
                </div>
                <button
                  className="text-white px-6 sm:px-8 py-3 rounded-lg transition-colors font-medium"
                  style={{ backgroundColor: "#2B0850" }}
                >
                  Contact Us
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="w-full md:w-80 p-6 sm:p-8 flex-shrink-0 border-r border-gray-300">
                <div className="mb-10 sm:mb-12">
                  <h1 className="text-xl sm:text-2xl font-bold text-[#2B0850] mb-2">
                    KYC Verification
                  </h1>
                  <p className="text-gray-500 text-sm">
                    Verify your identity and get started
                  </p>
                </div>
                <div>
                  <div className="flex md:hidden items-center justify-between gap-4">
                    {sidebarSteps.map((sidebarStep: SidebarStep) => {
                      const IconComponent = sidebarStep.icon;
                      const isActive: boolean = step === sidebarStep.id;
                      const isCompleted: boolean = step > sidebarStep.id;
                      return (
                        <div
                          key={sidebarStep.id}
                          className="flex flex-col items-center flex-1"
                        >
                          <div
                            className={`w-10 h-10 rounded-full flex items-center justify-center mb-1`}
                            style={{
                              backgroundColor: isActive
                                ? "#2B0850"
                                : isCompleted
                                ? "#10B981"
                                : "#E5E7EB",
                            }}
                          >
                            <IconComponent
                              className={`w-5 h-5 ${
                                isActive || isCompleted
                                  ? "text-white"
                                  : "text-gray-500"
                              }`}
                            />
                          </div>
                          <p
                            className={`text-xs text-center ${
                              isActive
                                ? "text-gray-900 font-medium"
                                : "text-gray-500"
                            }`}
                          >
                            {sidebarStep.title}
                          </p>
                        </div>
                      );
                    })}
                  </div>

                  <div className="hidden md:block space-y-6">
                    {sidebarSteps.map(
                      (sidebarStep: SidebarStep, index: number) => {
                        const IconComponent = sidebarStep.icon;
                        const isActive: boolean = step === sidebarStep.id;
                        const isCompleted: boolean = step > sidebarStep.id;
                        return (
                          <div
                            key={sidebarStep.id}
                            className="flex items-center gap-4 relative"
                          >
                            <div
                              className={`w-12 h-12 rounded-full flex items-center justify-center`}
                              style={{
                                backgroundColor: isActive
                                  ? "#2B0850"
                                  : isCompleted
                                  ? "#10B981"
                                  : "#E5E7EB",
                              }}
                            >
                              <IconComponent
                                className={`w-6 h-6 ${
                                  isActive || isCompleted
                                    ? "text-white"
                                    : "text-gray-500"
                                }`}
                              />
                            </div>
                            <div className="flex-1">
                              <h3
                                className={`font-medium ${
                                  isActive ? "text-gray-900" : "text-gray-700"
                                }`}
                              >
                                {sidebarStep.title}
                              </h3>
                              <p className="text-sm text-gray-500">
                                {sidebarStep.subtitle}
                              </p>
                            </div>
                            {index < sidebarSteps.length - 1 && (
                              <div className="absolute left-6 top-12 w-px h-6 bg-gray-300"></div>
                            )}
                          </div>
                        );
                      }
                    )}
                  </div>
                </div>
              </div>
              <div className="flex-1 p-8">
                <div className="max-w-2xl mx-auto">
                  {/* Step 1 */}
                  {step === 1 && (
                    <div className="space-y-8">
                      <div>
                        <div
                          className="text-sm mb-2"
                          style={{ color: "#2B0850" }}
                        >
                          Step 1/4
                        </div>
                        <h2 className="text-3xl font-bold text-[#2B0850] mb-4">
                          Intermediate Verification
                        </h2>
                        <p className="text-gray-600">
                          Fill in your personal ID details
                        </p>
                      </div>
                      <div className="space-y-6">
                        <SelectInput
                          label="ID Type"
                          value={formData.idType}
                          onChange={handleInputChange("idType")}
                          options={[
                            { value: "passport", label: "Passport" },
                            { value: "driver", label: "Driver's License" },
                            { value: "national", label: "National ID" },
                          ]}
                        />
                        <div>
                          <Input
                            type="text"
                            value={formData.idNumber}
                            placeholder="Please enter ID number"
                            onChange={handleInputChange("idNumber")}
                            label="ID number"
                          />
                        </div>
                      </div>
                      <div className="flex justify-between pt-8">
                        <button
                          className="bg-white border border-gray-300 text-gray-500 px-6 py-2 rounded-lg"
                          disabled
                        >
                          Back
                        </button>
                        <button
                          className="text-white px-8 py-2 rounded-lg"
                          style={{ backgroundColor: "#2B0850" }}
                          onClick={handleNext}
                          disabled={!formData.idNumber || !formData.idType}
                        >
                          Next
                        </button>
                      </div>
                    </div>
                  )}
                  {/* Step 2 */}
                  {step === 2 && (
                    <div className="space-y-8">
                      <div>
                        <div
                          className="text-sm mb-2"
                          style={{ color: "#2B0850" }}
                        >
                          Step 2/4
                        </div>
                        <h2 className="text-3xl font-bold text-[#2B0850] mb-4">
                          ID Verification
                        </h2>
                        <p className="text-gray-600">
                          Upload front and back of your ID document
                        </p>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-3">
                            Front of ID
                          </label>
                          <div className="relative">
                            <input
                              type="file"
                              accept="image/*"
                              onChange={handleFileChange("idFront")}
                              className="hidden"
                              id="id-front"
                            />
                            <label
                              htmlFor="id-front"
                              className="flex flex-col items-center justify-center w-full h-48 bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer"
                            >
                              {previewUrls.idFront ? (
                                <img
                                  src={previewUrls.idFront}
                                  alt="Front ID Preview"
                                  className="w-full h-full object-cover rounded-lg"
                                />
                              ) : (
                                <div className="flex flex-col items-center">
                                  <Upload className="w-8 h-8 text-gray-400 mb-2" />
                                  <span className="text-gray-500 text-sm">
                                    Upload front
                                  </span>
                                </div>
                              )}
                            </label>
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-3">
                            Back of ID
                          </label>
                          <div className="relative">
                            <input
                              type="file"
                              accept="image/*"
                              onChange={handleFileChange("idBack")}
                              className="hidden"
                              id="id-back"
                            />
                            <label
                              htmlFor="id-back"
                              className="flex flex-col items-center justify-center w-full h-48 bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer"
                            >
                              {previewUrls.idBack ? (
                                <img
                                  src={previewUrls.idBack}
                                  alt="Back ID Preview"
                                  className="w-full h-full object-cover rounded-lg"
                                />
                              ) : (
                                <div className="flex flex-col items-center">
                                  <Upload className="w-8 h-8 text-gray-400 mb-2" />
                                  <span className="text-gray-500 text-sm">
                                    Upload back
                                  </span>
                                </div>
                              )}
                            </label>
                          </div>
                        </div>
                      </div>
                      <div className="flex justify-between pt-8">
                        <button
                          onClick={handleBack}
                          className="bg-white border border-gray-300 text-gray-700 px-6 py-2 rounded-lg"
                        >
                          Back
                        </button>
                        <button
                          className="text-white px-8 py-2 rounded-lg"
                          style={{ backgroundColor: "#2B0850" }}
                          onClick={handleNext}
                          disabled={!formData.idFront || !formData.idBack}
                        >
                          Next
                        </button>
                      </div>
                    </div>
                  )}
                  {/* Step 3 */}
                  {step === 3 && (
                    <div className="space-y-8">
                      <div>
                        <div
                          className="text-sm mb-2"
                          style={{ color: "#2B0850" }}
                        >
                          Step 3/4
                        </div>
                        <h2 className="text-3xl font-bold text-[#2B0850] mb-4">
                          Include a photo
                        </h2>
                        <p className="text-gray-600">
                          Upload or take a live selfie
                        </p>
                      </div>
                      <div className="max-w-md mx-auto">
                        <div className="relative">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange("selfie")}
                            className="hidden"
                            id="selfie-upload"
                          />
                          {previewUrls.selfie ? (
                            <div className="relative">
                              <img
                                src={previewUrls.selfie}
                                alt="Selfie Preview"
                                className="w-full h-80 object-cover rounded-lg border-2 border-gray-300"
                              />
                              <label
                                htmlFor="selfie-upload"
                                className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-lg cursor-pointer opacity-0 hover:opacity-100 transition-opacity"
                              >
                                <span
                                  className="text-white px-4 py-2 rounded-lg"
                                  style={{ backgroundColor: "#2B0850" }}
                                >
                                  Change Photo
                                </span>
                              </label>
                            </div>
                          ) : (
                            <div className="flex flex-col items-center justify-center h-80 bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg">
                              <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mb-6">
                                <User className="w-10 h-10 text-gray-400" />
                              </div>
                              <div className="space-y-4">
                                <label
                                  htmlFor="selfie-upload"
                                  className="bg-white border border-gray-300 text-gray-700 px-6 py-2 rounded-lg cursor-pointer inline-block"
                                >
                                  Upload photo
                                </label>
                                <button
                                  className="text-white px-6 py-2 rounded-lg ml-4"
                                  style={{ backgroundColor: "#2B0850" }}
                                >
                                  Take photo
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex justify-between pt-8">
                        <button
                          onClick={handleBack}
                          className="bg-white border border-gray-300 text-gray-700 px-6 py-2 rounded-lg"
                        >
                          Back
                        </button>
                        <button
                          className="text-white px-8 py-2 rounded-lg"
                          style={{ backgroundColor: "#2B0850" }}
                          onClick={handleNext}
                          disabled={!formData.selfie}
                        >
                          Next
                        </button>
                      </div>
                    </div>
                  )}
                  {/* Step 4 */}
                  {step === 4 && (
                    <div className="space-y-8">
                      <div>
                        <div
                          className="text-sm mb-2"
                          style={{ color: "#2B0850" }}
                        >
                          Step 4/4
                        </div>
                        <h2 className="text-3xl font-boldtext-[#2B0850] mb-4">
                          Review Your Submission
                        </h2>
                        <p className="text-gray-600">
                          Please review all your information before submitting
                        </p>
                      </div>
                      <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-6 shadow-sm">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <h3 className="text-lg font-semibold text-[#2B0850] mb-4">
                              ID Information
                            </h3>
                            <div className="space-y-3">
                              <div>
                                <span className="text-sm font-medium text-gray-500">
                                  ID Type:
                                </span>
                                <p className="text-[#2B0850] capitalize">
                                  {formData.idType}
                                </p>
                              </div>
                              <div>
                                <span className="text-sm font-medium text-gray-500">
                                  ID Number:
                                </span>
                                <p className="text-gray-900">
                                  {formData.idNumber}
                                </p>
                              </div>
                            </div>
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold text-[#2B0850] mb-4">
                              Uploaded Documents
                            </h3>
                            <div className="text-sm text-gray-600 space-y-1">
                              <p className="flex items-center">
                                <span
                                  className="mr-2"
                                  style={{ color: "#2B0850" }}
                                >
                                  ✓
                                </span>
                                ID Front: {formData.idFront?.name}
                              </p>
                              <p className="flex items-center">
                                <span
                                  className="mr-2"
                                  style={{ color: "#2B0850" }}
                                >
                                  ✓
                                </span>
                                ID Back: {formData.idBack?.name}
                              </p>
                              <p className="flex items-center">
                                <span
                                  className="mr-2"
                                  style={{ color: "#2B0850" }}
                                >
                                  ✓
                                </span>
                                Selfie: {formData.selfie?.name}
                              </p>
                            </div>
                          </div>
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-[#2B0850] mb-4">
                            Document Preview
                          </h3>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {previewUrls.idFront && (
                              <div>
                                <p className="text-sm font-medium text-gray-500 mb-2">
                                  Front ID
                                </p>
                                <img
                                  src={previewUrls.idFront}
                                  alt="Front ID Preview"
                                  className="w-full h-32 object-cover rounded-lg border border-gray-200"
                                />
                              </div>
                            )}
                            {previewUrls.idBack && (
                              <div>
                                <p className="text-sm font-medium text-gray-500 mb-2">
                                  Back ID
                                </p>
                                <img
                                  src={previewUrls.idBack}
                                  alt="Back ID Preview"
                                  className="w-full h-32 object-cover rounded-lg border border-gray-200"
                                />
                              </div>
                            )}
                            {previewUrls.selfie && (
                              <div>
                                <p className="text-sm font-medium text-gray-500 mb-2">
                                  Selfie
                                </p>
                                <img
                                  src={previewUrls.selfie}
                                  alt="Selfie Preview"
                                  className="w-full h-32 object-cover rounded-lg border border-gray-200"
                                />
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex justify-between pt-8">
                        <button
                          onClick={handleBack}
                          className="bg-white border border-gray-300 text-gray-700 px-6 py-2 rounded-lg"
                        >
                          Back
                        </button>
                        <button
                          onClick={handleSubmit}
                          className="text-white px-8 py-2 rounded-lg"
                          style={{ backgroundColor: "#2B0850" }}
                        >
                          Submit Verification
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
