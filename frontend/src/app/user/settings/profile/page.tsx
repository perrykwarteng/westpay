"use client";

import React, { useMemo, useState } from "react";
import DashboardLayout from "@/component/Dashboard/DashboardLayout";
import Modal from "@/component/Modal/Modal";
import {
  Camera,
  Mail,
  Phone,
  User,
  MapPin,
  KeyRound,
  Edit,
  Check,
  X,
} from "lucide-react";
import Image from "next/image";

interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  country?: string;
  city?: string;
  address?: string;
  avatarUrl?: string;
  twoFAEnabled?: boolean;
  marketingEmails?: boolean;
}

function classNames(...xs: (string | false | null | undefined)[]) {
  return xs.filter(Boolean).join(" ");
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile>({
    id: "usr_001",
    firstName: "johnson",
    lastName: "Mensah",
    email: "johnson@example.com",
    phone: "0241234567",
    country: "Ghana",
    city: "Accra",
    address: "Madina",
    avatarUrl: "",
    twoFAEnabled: false,
    marketingEmails: true,
  });

  const [saving, setSaving] = useState(false);
  const [pwdOpen, setPwdOpen] = useState(false);
  const [form, setForm] = useState<UserProfile>(profile);
  const [editMode, setEditMode] = useState(false);

  const fullName = useMemo(
    () => `${form.firstName} ${form.lastName}`.trim(),
    [form.firstName, form.lastName]
  );

  const onChange = <K extends keyof UserProfile>(k: K, v: UserProfile[K]) =>
    setForm((s) => ({ ...s, [k]: v }));

  const onSave = async () => {
    setSaving(true);
    try {
      await new Promise((r) => setTimeout(r, 600));
      setProfile(form);
      setEditMode(false);
    } finally {
      setSaving(false);
    }
  };

  const onCancel = () => {
    setForm(profile);
    setEditMode(false);
  };

  const [oldPwd, setOldPwd] = useState("");
  const [newPwd, setNewPwd] = useState("");
  const [confirmPwd, setConfirmPwd] = useState("");
  const canChangePwd =
    newPwd.length >= 8 && newPwd === confirmPwd && oldPwd.length > 0;

  const handlePasswordChange = () => {
    setOldPwd("");
    setNewPwd("");
    setConfirmPwd("");
    setPwdOpen(false);
  };

  return (
    <DashboardLayout>
      <div className="h-full">
        <div className="mx-auto max-w-4xl">
          {/* Simple Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Profile</h1>
            <p className="text-gray-600">Manage your profile</p>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden mb-6">
            <div className="bg-gradient-to-r from-[#2B0850] to-[#4a1a7a] px-8 py-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <div className="w-20 h-20 rounded-full bg-white/10 backdrop-blur-sm border-2 border-white/20 overflow-hidden">
                      {form.avatarUrl ? (
                        <Image
                          src={form.avatarUrl}
                          alt="Profile"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <User className="w-8 h-8 text-white/70" />
                        </div>
                      )}
                    </div>
                    <label className="absolute bottom-0 right-0 w-7 h-7 bg-[#4a1a7a] rounded-full flex items-center justify-center cursor-pointer hover:bg-[#3f0e71] transition-colors">
                      <Camera className="w-4 h-4 text-white" />
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const f = e.target.files?.[0];
                          if (!f) return;
                          const url = URL.createObjectURL(f);
                          onChange("avatarUrl", url);
                        }}
                      />
                    </label>
                  </div>

                  <div className="text-white">
                    <h2 className="text-xl font-semibold">{fullName}</h2>
                    <p className="text-white/80">{form.email}</p>
                    <p className="text-white/70 text-sm">{form.phone}</p>
                  </div>
                </div>

                <div className="flex gap-2">
                  {!editMode ? (
                    <button
                      onClick={() => setEditMode(true)}
                      className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                    >
                      <Edit className="w-4 h-4" />
                      Edit Profile
                    </button>
                  ) : (
                    <div className="flex gap-2">
                      <button
                        onClick={onCancel}
                        className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                      >
                        <X className="w-4 h-4" />
                        Cancel
                      </button>
                      <button
                        onClick={onSave}
                        disabled={saving}
                        className="bg-white text-[#4a1a7a] hover:bg-gray-100 px-4 py-2 rounded-lg flex items-center gap-2 transition-colors disabled:opacity-50"
                      >
                        {saving ? (
                          <div className="w-4 h-4 border-2 border-blue-600/30 border-t-[#4a1a7a] rounded-full animate-spin" />
                        ) : (
                          <Check className="w-4 h-4" />
                        )}
                        {saving ? "Saving..." : "Save Changes"}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="p-8">
              <div className="grid gap-8 lg:grid-cols-2">
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <User className="w-5 h-5 text-gray-500" />
                    <h3 className="text-lg font-semibold text-gray-900">
                      Personal Information
                    </h3>
                  </div>

                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          First Name
                        </label>
                        <input
                          type="text"
                          value={form.firstName}
                          onChange={(e) =>
                            onChange("firstName", e.target.value)
                          }
                          disabled={!editMode}
                          className={classNames(
                            "w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors",
                            editMode
                              ? "border-gray-300 bg-white"
                              : "border-gray-200 bg-gray-50 text-gray-600"
                          )}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Last Name
                        </label>
                        <input
                          type="text"
                          value={form.lastName}
                          onChange={(e) => onChange("lastName", e.target.value)}
                          disabled={!editMode}
                          className={classNames(
                            "w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors",
                            editMode
                              ? "border-gray-300 bg-white"
                              : "border-gray-200 bg-gray-50 text-gray-600"
                          )}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                          type="email"
                          value={form.email}
                          onChange={(e) => onChange("email", e.target.value)}
                          disabled={!editMode}
                          className={classNames(
                            "w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors",
                            editMode
                              ? "border-gray-300 bg-white"
                              : "border-gray-200 bg-gray-50 text-gray-600"
                          )}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phone Number
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                          type="tel"
                          value={form.phone || ""}
                          onChange={(e) =>
                            onChange(
                              "phone",
                              e.target.value.replace(/[^\d+]/g, "").slice(0, 15)
                            )
                          }
                          disabled={!editMode}
                          className={classNames(
                            "w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors",
                            editMode
                              ? "border-gray-300 bg-white"
                              : "border-gray-200 bg-gray-50 text-gray-600"
                          )}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <MapPin className="w-5 h-5 text-gray-500" />
                    <h3 className="text-lg font-semibold text-gray-900">
                      Address
                    </h3>
                  </div>

                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Country
                        </label>
                        <input
                          type="text"
                          value={form.country || ""}
                          onChange={(e) => onChange("country", e.target.value)}
                          disabled={!editMode}
                          className={classNames(
                            "w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors",
                            editMode
                              ? "border-gray-300 bg-white"
                              : "border-gray-200 bg-gray-50 text-gray-600"
                          )}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          City
                        </label>
                        <input
                          type="text"
                          value={form.city || ""}
                          onChange={(e) => onChange("city", e.target.value)}
                          disabled={!editMode}
                          className={classNames(
                            "w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors",
                            editMode
                              ? "border-gray-300 bg-white"
                              : "border-gray-200 bg-gray-50 text-gray-600"
                          )}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Street Address
                      </label>
                      <textarea
                        rows={3}
                        value={form.address || ""}
                        onChange={(e) => onChange("address", e.target.value)}
                        disabled={!editMode}
                        className={classNames(
                          "w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none",
                          editMode
                            ? "border-gray-300 bg-white"
                            : "border-gray-200 bg-gray-50 text-gray-600"
                        )}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Modal
        isOpen={pwdOpen}
        onClose={() => setPwdOpen(false)}
        title={
          <div className="flex items-center gap-2">
            <KeyRound className="h-5 w-5 text-blue-600" />
            <span>Change Password</span>
          </div>
        }
        footer={
          <div className="flex gap-3">
            <button
              onClick={() => setPwdOpen(false)}
              className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-900 py-2 px-4 rounded-lg font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              disabled={!canChangePwd}
              onClick={handlePasswordChange}
              className={classNames(
                "flex-1 py-2 px-4 rounded-lg font-medium transition-colors",
                canChangePwd
                  ? "bg-blue-600 hover:bg-blue-700 text-white"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              )}
            >
              Update Password
            </button>
          </div>
        }
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Current Password
            </label>
            <input
              type="password"
              value={oldPwd}
              onChange={(e) => setOldPwd(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter current password"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                New Password
              </label>
              <input
                type="password"
                value={newPwd}
                onChange={(e) => setNewPwd(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="At least 8 characters"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Confirm Password
              </label>
              <input
                type="password"
                value={confirmPwd}
                onChange={(e) => setConfirmPwd(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Repeat new password"
              />
            </div>
          </div>

          {newPwd && newPwd.length < 8 && (
            <p className="text-sm text-red-600">
              Password must be at least 8 characters
            </p>
          )}
          {newPwd && confirmPwd && newPwd !== confirmPwd && (
            <p className="text-sm text-red-600">Passwords do not match</p>
          )}
        </div>
      </Modal>
    </DashboardLayout>
  );
}
