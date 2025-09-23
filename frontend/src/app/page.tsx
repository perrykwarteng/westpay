import Image from "next/image";

import HImg from "../../public/images/hero-portrait.jpg";
import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-white flex items-center justify-center p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 items-center">
        <div className="flex items-center justify-center">
          <div className="w-[450px] h-[450px] rounded-2xl overflow-hidden flex items-center justify-center">
            <Image
              src={HImg}
              alt="person holding phone"
              className="w-full h-full object-cover"
              priority
            />
          </div>
        </div>

        <div className="space-y-6">
          <p className="text-sm uppercase text-slate-400">
            WESTPAY ESCROW SYSTEM
          </p>
          <h1 className="text-3xl md:text-4xl font-extrabold text-[#2B0850] leading-tight">
            Powering Secure{" "}
            <span className="text-[#6607cb]">Cross-Border Trade</span> with
            WestPay
          </h1>
          <p className="text-slate-600 max-w-xl">
            The WestPay Escrow System is built on a robust architecture designed
            to deliver secure, transparent, and efficient commerce between Ghana
            and Nigeria. Its framework directly addresses three key challenges
            in West African trade payment security, trust, and cross-border
            transaction efficiency ensuring smooth and reliable business
            interactions.
          </p>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/auth/register"
              className="inline-flex items-center justify-center px-7 py-2 rounded-md bg-[#2B0850] text-white font-semibold shadow-sm hover:opacity-95"
            >
              Register
            </Link>
            <Link
              href="/auth/login"
              className="inline-flex items-center justify-center px-7 py-2 rounded-md border border-slate-200 text-slate-800 font-semibold hover:bg-slate-50"
            >
              Login
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
