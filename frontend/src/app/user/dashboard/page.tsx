"use client";

import DashboardLayout from "../../../component/Dashboard/DashboardLayout";
import sendImg from "../../../../public/images/Send.svg";
import ReceiveImg from "../../../../public/images/Receive.svg";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const route = useRouter();

  const handleSend = () => {
    route.push("/user/sender");
  };

  const handleReceive = () => {
    route.push("/user/receiver");
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Welcome back, Johnson
            </h1>
            <p className="text-gray-600 mt-1">
              Here&apos;s an overview of your dashboard
            </p>
          </div>
        </div>

        <section className="w-full mt-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="group relative overflow-hidden rounded-[20px] border-2 border-dashed border-gray-200 bg-gradient-to-br from-white to-gray-50/50  transition-all duration-300 hover:-translate-y-1">
              <div className="relative p-8 flex flex-col items-center text-center">
                <div className="w-[150px] h-[150px] flex items-center justify-center mb-6 relative">
                  <Image
                    src={sendImg}
                    alt="Send"
                    className="w-full h-full relative z-10"
                  />
                </div>

                <button
                  type="button"
                  onClick={handleSend}
                  className="w-full inline-flex items-center justify-center rounded-md px-6 py-3 font-semibold text-white bg-gradient-to-r from-[#2B0850] to-[#3f0d73] shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500/60 focus-visible:ring-offset-2 hover:from-[#3f0d73] hover:to-[#2B0850]"
                >
                  <span className="mr-2">Send Funds</span>
                  <svg
                    className="w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-300"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                    />
                  </svg>
                </button>
              </div>
            </div>

            <div className="group relative overflow-hidden rounded-[20px] border-2 border-dashed border-gray-200 bg-gradient-to-br from-white to-gray-50/50  transition-all duration-300 hover:-translate-y-1">
              <div className="relative p-8 flex flex-col items-center text-center">
                <div className="w-[150px] h-[150px] flex items-center justify-center mb-6 relative">
                  <Image
                    src={ReceiveImg}
                    alt="Receive"
                    className="w-full h-full relative z-10"
                  />
                </div>

                <button
                  type="button"
                  onClick={handleReceive}
                  className="w-full inline-flex items-center justify-center rounded-md px-6 py-3 font-semibold text-white bg-gradient-to-r from-[#2B0850] to-[#3f0d73] shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500/60 focus-visible:ring-offset-2 hover:from-[#3f0d73] hover:to-[#2B0850]"
                >
                  <svg
                    className="w-5 h-5 mr-2 transform group-hover:-translate-x-1 transition-transform duration-300"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 5l-9-2 9 18 9-18-9 2zm0 0v8"
                    />
                  </svg>
                  <span>Receive Funds</span>
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </DashboardLayout>
  );
}
