"use client";

import { useState } from "react";
import { User, Mail } from "lucide-react";
import { Input, FileUpload } from "@/component/Input-icon/Input";
import BackgroundImg from "../../../../public/images/authSmall.svg";
import { useRouter } from "next/navigation";
import Image from "next/image";
import CustomSelect from "@/component/select/Select";

interface FormData {
  // Step 1
  firstName: string;
  lastName: string;
  country: string;
  phoneNumber: string;
  idDocument: File | null;
  idWithPicture: File | null;

  // Step 2
  email: string;
  gpsAddress: string;
  residenceAddress: string;
  password: string;
  confirmPassword: string;
  agreeTerms: boolean;
}

interface StepConfig {
  id: number;
  title: string;
  subtitle: string;
  icon: React.ComponentType<{ className?: string }>;
}

export default function TwoStepRegistration() {
  const [currentStep, setCurrentStep] = useState(1);
  const [userId, setUserId] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    country: "",
    phoneNumber: "",
    idDocument: null,
    idWithPicture: null,
    email: "",
    gpsAddress: "",
    residenceAddress: "",
    password: "",
    confirmPassword: "",
    agreeTerms: false,
  });

  const router = useRouter();

  const steps: StepConfig[] = [
    {
      id: 1,
      title: "Personal Information",
      subtitle: "Basic details & verification",
      icon: User,
    },
    {
      id: 2,
      title: "Account Setup",
      subtitle: "Address & security",
      icon: Mail,
    },
  ];

  const countries = [
    { value: "ghana", label: "Ghana" },
    { value: "nigeria", label: "Nigeria" },
    { value: "kenya", label: "Kenya" },
    { value: "south_africa", label: "South Africa" },
    { value: "cote_divoire", label: "Côte d'Ivoire" },
    { value: "senegal", label: "Senegal" },
    { value: "mali", label: "Mali" },
    { value: "burkina_faso", label: "Burkina Faso" },
  ];

  const updateFormData = (field: keyof FormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const getPasswordStrength = (password: string) => {
    if (!password) return { label: "", color: "" };

    let strengthPoints = 0;
    if (password.length >= 8) strengthPoints++;
    if (/[A-Z]/.test(password)) strengthPoints++;
    if (/[0-9]/.test(password)) strengthPoints++;
    if (/[^A-Za-z0-9]/.test(password)) strengthPoints++;

    if (strengthPoints <= 1) return { label: "Weak", color: "text-red-500" };
    if (strengthPoints === 2)
      return { label: "Fair", color: "text-yellow-500" };
    if (strengthPoints === 3) return { label: "Good", color: "text-blue-500" };
    return { label: "Strong", color: "text-green-600" };
  };

  const isStep1Valid = () => {
    return (
      formData.firstName.trim() &&
      formData.lastName.trim() &&
      formData.country &&
      formData.phoneNumber.trim() &&
      formData.idDocument &&
      formData.idWithPicture
    );
  };

  const isStep2Valid = () => {
    return (
      formData.email.trim() &&
      formData.gpsAddress.trim() &&
      formData.residenceAddress.trim() &&
      formData.password &&
      formData.confirmPassword &&
      formData.password === formData.confirmPassword &&
      formData.agreeTerms
    );
  };

  // ✅ Submit Step 1 (create user first)
  const handleStep1Submit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      console.log("Submitting Step 1 data:", formData);

      // fake userId from backend
      const createdUserId = "user_" + Date.now();
      setUserId(createdUserId);

      setCurrentStep(2);
    } catch (error) {
      console.error(error);
      alert("Failed to submit Step 1");
    }
  };

  // ✅ Submit Step 2 (update existing user)
  const handleStep2Submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) {
      return;
    }
    try {
      router.push("/auth/verify");
    } catch (error) {
      console.error(error);
      alert("Failed to complete Step 2");
    }
  };

  const strength = getPasswordStrength(formData.password);

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-white">
      <div className="flex items-center justify-center w-full md:w-[60%] px-6 sm:px-8 md:px-5 lg:px-16 py-6 overflow-y-auto">
        <section className="w-full max-w-2xl h-full">
          <div>
            <h1 className="text-xl sm:text-2xl text-[#2B0850] font-semibold">
              WestPay
            </h1>
          </div>

          <div className="mt-3">
            <h2 className="text-2xl sm:text-[28px] text-[#2B0850] font-semibold leading-snug">
              Hi, Welcome to WestPay!
            </h2>
            <p className="text-sm text-gray-500">
              Create an account and start enjoying WestPay
            </p>
          </div>

          {/* Progress Steps */}
          <div className="mt-4 mb-4">
            <div className="flex items-center justify-between max-w-md">
              {steps.map((step, index) => {
                const isActive = currentStep === step.id;
                const isCompleted = currentStep > step.id;
                const StepIcon = step.icon;

                return (
                  <div key={step.id} className="flex items-center">
                    <div className="flex flex-col items-center">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${
                          isActive
                            ? "bg-[#2B0850]"
                            : isCompleted
                            ? "bg-green-500"
                            : "bg-gray-200"
                        }`}
                      >
                        <StepIcon
                          className={`w-5 h-5 ${
                            isActive || isCompleted
                              ? "text-white"
                              : "text-gray-500"
                          }`}
                        />
                      </div>
                      <div className="text-center">
                        <p
                          className={`text-xs font-medium ${
                            isActive ? "text-[#2B0850]" : "text-gray-500"
                          }`}
                        >
                          {step.title}
                        </p>
                        <p className="text-xs text-gray-400">{step.subtitle}</p>
                      </div>
                    </div>
                    {index < steps.length - 1 && (
                      <div
                        className={`w-20 h-0.5 mx-4 md:ms-16 ${
                          isCompleted ? "bg-green-500" : "bg-gray-200"
                        }`}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Step 1 */}
          {currentStep === 1 && (
            <form onSubmit={handleStep1Submit} className="space-y-4">
              <h3 className="text-lg font-semibold text-[#2B0850] mb-1.5">
                Personal Information & Verification
              </h3>
              <p className="text-sm text-gray-600 mb-2">
                Please provide your basic information and upload required
                documents for KYC verification.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="First Name"
                  placeholder="John"
                  value={formData.firstName}
                  onChange={(e) => updateFormData("firstName", e.target.value)}
                  icon="user"
                  validate
                />
                <Input
                  label="Last Name"
                  placeholder="Smith"
                  value={formData.lastName}
                  onChange={(e) => updateFormData("lastName", e.target.value)}
                  icon="user"
                  validate
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <CustomSelect
                  label="Country"
                  value={formData.country}
                  onChange={(val) => updateFormData("country", val)}
                  options={countries}
                />
                <Input
                  label="Phone Number"
                  type="tel"
                  placeholder="+233 55 123 4567"
                  value={formData.phoneNumber}
                  onChange={(e) =>
                    updateFormData("phoneNumber", e.target.value)
                  }
                  icon="phone"
                  validate
                />
              </div>

              <h4 className="text-md font-medium text-[#2B0850]">
                KYC Verification Documents
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-2">
                <FileUpload
                  label="ID (Front Picture)"
                  file={formData.idDocument}
                  onChange={(file: any) => updateFormData("idDocument", file)}
                />
                <FileUpload
                  label="Picture with ID"
                  file={formData.idWithPicture}
                  onChange={(file: any) =>
                    updateFormData("idWithPicture", file)
                  }
                />
              </div>

              <div className="flex justify-between mt-4">
                <button
                  type="button"
                  disabled
                  className="bg-white border border-gray-300 text-gray-400 px-6 py-2 rounded-lg cursor-not-allowed"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={!isStep1Valid()}
                  className={`px-6 py-2 rounded-lg text-white transition-colors ${
                    isStep1Valid()
                      ? "bg-[#2B0850] hover:bg-[#3b0a6a]"
                      : "bg-gray-400 cursor-not-allowed"
                  }`}
                >
                  Save & Continue
                </button>
              </div>
            </form>
          )}

          {/* Step 2 */}
          {currentStep === 2 && (
            <form onSubmit={handleStep2Submit} className="space-y-4">
              <h3 className="text-lg font-semibold text-[#2B0850] mb-4">
                Account Setup & Security
              </h3>
              <p className="text-sm text-gray-600 mb-6">
                Complete your account setup with address information and create
                a secure password.
              </p>

              <Input
                label="Email"
                type="email"
                placeholder="example@mail.com"
                value={formData.email}
                onChange={(e) => updateFormData("email", e.target.value)}
                icon="email"
                validate
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="GPS Address"
                  placeholder="GA-123-4567"
                  value={formData.gpsAddress}
                  onChange={(e) => updateFormData("gpsAddress", e.target.value)}
                  icon="map"
                  validate
                />
                <Input
                  label="Residence Address"
                  placeholder="123 Main Street, Accra"
                  value={formData.residenceAddress}
                  onChange={(e) =>
                    updateFormData("residenceAddress", e.target.value)
                  }
                  icon="home"
                  validate
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Input
                    label="Password"
                    type="password"
                    placeholder="Enter your password, Min. 8 characters"
                    value={formData.password}
                    onChange={(e) => updateFormData("password", e.target.value)}
                    icon="lock"
                  />
                  {strength.label && (
                    <p className={`text-[11px] mt-1 ${strength.color}`}>
                      Password Strength: {strength.label}
                    </p>
                  )}
                </div>
                <Input
                  label="Confirm Password"
                  type="password"
                  placeholder="Re-enter your password"
                  value={formData.confirmPassword}
                  onChange={(e) =>
                    updateFormData("confirmPassword", e.target.value)
                  }
                  icon="lock"
                />
              </div>

              {formData.password &&
                formData.confirmPassword &&
                formData.password !== formData.confirmPassword && (
                  <p className="text-red-500 text-sm">Passwords do not match</p>
                )}

              <div className="flex items-center gap-2">
                <input
                  id="terms"
                  type="checkbox"
                  checked={formData.agreeTerms}
                  onChange={(e) =>
                    updateFormData("agreeTerms", e.target.checked)
                  }
                  className="w-4 h-4 text-[#2B0850] border-gray-300 rounded focus:ring-[#2B0850]"
                />
                <label htmlFor="terms" className="text-sm text-gray-600">
                  I agree to the{" "}
                  <a
                    href="/terms"
                    className="text-[#2B0850] font-medium hover:underline"
                  >
                    Terms & Conditions
                  </a>
                </label>
              </div>

              <div className="flex justify-between mt-4">
                <button
                  type="button"
                  onClick={() => setCurrentStep(1)}
                  className="bg-white border border-gray-300 text-gray-700 px-8 py-2 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={!isStep2Valid()}
                  className={`px-6 md:px-10 py-2 rounded-lg text-white transition-colors ${
                    isStep2Valid()
                      ? "bg-[#2B0850] hover:bg-[#3b0a6a]"
                      : "bg-gray-400 cursor-not-allowed"
                  }`}
                >
                  Save & Verify
                </button>
              </div>

              <div className="pt-4">
                <p className="text-sm text-gray-600">
                  Already have an account?{" "}
                  <a
                    href="/auth/login"
                    className="text-[#2B0850] font-medium hover:underline"
                  >
                    Login
                  </a>
                </p>
              </div>
            </form>
          )}
        </section>
      </div>

      {/* Right Side */}
      <div className="hidden md:block md:w-[40%] h-screen fixed right-0 top-0">
        <Image
          src={BackgroundImg}
          alt="WestPay background"
          className="w-full h-full object-cover"
          priority
        />
      </div>
    </div>
  );
}
