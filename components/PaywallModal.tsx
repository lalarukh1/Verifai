"use client";

const FREE_LIMIT = Number(process.env.NEXT_PUBLIC_FREE_CHECK_LIMIT ?? 10);
const PAYMENT_LINK = process.env.NEXT_PUBLIC_STRIPE_PAYMENT_LINK ?? "";

interface Props { email: string; }

export default function PaywallModal({ email }: Props) {
  const checkoutUrl = email ? `${PAYMENT_LINK}?prefilled_email=${encodeURIComponent(email)}` : PAYMENT_LINK;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
      style={{ backgroundColor: "rgba(6,14,26,0.88)", backdropFilter: "blur(16px)" }}
    >
      <div
        className="animate-scale-in w-full sm:max-w-md rounded-t-[24px] sm:rounded-[14px] relative overflow-hidden text-center"
        style={{
          background: "linear-gradient(160deg, rgba(255,255,255,0.07) 0%, rgba(255,255,255,0.03) 100%)",
          border: "1px solid rgba(255,255,255,0.1)",
          backdropFilter: "blur(32px)",
          boxShadow: "0 32px 80px rgba(0,0,0,0.6)",
        }}
      >
        {/* Gradient strip */}
        <div
          className="h-[2px] w-full animate-ocean"
          style={{ background: "linear-gradient(90deg, #2DD4BF, #22D3EE, #60A5FA, #A78BFA, #2DD4BF)", backgroundSize: "300% auto" }}
        />

        <div className="px-7 pt-9 pb-10 sm:px-10">
          {/* Shield icon */}
          <div
            className="mx-auto mb-5 w-14 h-14 rounded-2xl flex items-center justify-center"
            style={{ background: "rgba(45,212,191,0.1)", border: "1px solid rgba(45,212,191,0.2)" }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
              fill="none" stroke="#2DD4BF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
          </div>

          <span className="text-2xl font-bold font-mono block mb-1">
            <span className="gradient-text">Verif</span>
            <span style={{ background: "linear-gradient(135deg, #22D3EE, #60A5FA)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>AI</span>
          </span>

          <h2 className="text-xl font-bold mt-4 mb-2" style={{ color: "#F0F9FF" }}>
            You&apos;ve used your {FREE_LIMIT} free checks
          </h2>
          <p className="text-sm mb-8 leading-relaxed" style={{ color: "rgba(255,255,255,0.45)" }}>
            Upgrade to keep fact-checking unlimited Instagram Reels and TikToks.
          </p>

          {/* Price pill */}
          <div
            className="inline-flex items-center gap-2 rounded-full px-5 py-2 mb-7 text-sm font-bold"
            style={{ background: "linear-gradient(135deg, #2DD4BF22, #60A5FA22)", border: "1px solid rgba(45,212,191,0.3)", color: "#2DD4BF" }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24"
              fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 1v22M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
            £4.99 / month
          </div>

          {/* Features */}
          <ul className="space-y-2.5 mb-8 text-left">
            {["Unlimited fact-checks", "Instagram Reels & TikToks", "Full claim-by-claim breakdown", "Source verification"].map((feature) => (
              <li key={feature} className="flex items-center gap-3 text-sm" style={{ color: "rgba(255,255,255,0.7)" }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24"
                  fill="none" stroke="#2DD4BF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                {feature}
              </li>
            ))}
          </ul>

          {/* CTA */}
          <a
            href={checkoutUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full rounded-2xl py-4 text-sm font-bold transition-all active:scale-[0.98] active:opacity-90"
            style={{
              background: "linear-gradient(135deg, #2DD4BF 0%, #22D3EE 50%, #60A5FA 100%)",
              backgroundSize: "200% auto",
              animation: "shimmer 3s linear infinite",
              color: "#060E1A",
              boxShadow: "0 8px 32px rgba(45,212,191,0.3)",
            }}
          >
            Upgrade for £4.99 / month →
          </a>

          <p className="mt-5 text-xs" style={{ color: "rgba(255,255,255,0.25)" }}>
            Already paid?{" "}
            <button onClick={() => window.location.reload()}
              className="underline transition-colors active:opacity-75"
              style={{ color: "rgba(255,255,255,0.35)" }}>
              Refresh the page
            </button>{" "}
            to unlock access.
          </p>
        </div>
      </div>
    </div>
  );
}
