"use client";

const FREE_LIMIT = Number(process.env.NEXT_PUBLIC_FREE_CHECK_LIMIT ?? 10);
const PAYMENT_LINK = process.env.NEXT_PUBLIC_STRIPE_PAYMENT_LINK ?? "";

interface Props {
  email: string;
}

export default function PaywallModal({ email }: Props) {
  const checkoutUrl = email
    ? `${PAYMENT_LINK}?prefilled_email=${encodeURIComponent(email)}`
    : PAYMENT_LINK;

  return (
    /* Backdrop — no onClick close, non-dismissable */
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4"
      style={{ backgroundColor: "rgba(7, 7, 17, 0.92)", backdropFilter: "blur(10px)" }}
    >
      {/* Card */}
      <div
        className="w-full max-w-md rounded-[24px] border p-8 text-center"
        style={{
          backgroundColor: "#0f0f1f",
          borderColor: "#1e1e3a",
        }}
      >
        {/* Icon */}
        <div
          className="mx-auto mb-5 w-12 h-12 rounded-full flex items-center justify-center"
          style={{ backgroundColor: "#1a1a2e", border: "1px solid #2e2e50" }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#a78bfa"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          </svg>
        </div>

        {/* Logo */}
        <span
          className="text-2xl font-bold font-mono tracking-tight block mb-1"
          style={{ color: "#e2e8f0" }}
        >
          Verif<span style={{ color: "#a78bfa" }}>AI</span>
        </span>

        {/* Headline */}
        <h2
          className="text-xl font-semibold mt-4 mb-2 tracking-tight"
          style={{ color: "#e2e8f0" }}
        >
          You&apos;ve used your {FREE_LIMIT} free checks
        </h2>
        <p
          className="text-sm mb-8 leading-relaxed"
          style={{ color: "#64748b", fontFamily: "var(--font-lora), serif" }}
        >
          Upgrade to VerifAI to keep fact-checking unlimited Instagram Reels
          and TikToks.
        </p>

        {/* Price pill */}
        <div
          className="inline-flex items-center gap-2 rounded-full px-4 py-2 mb-6 text-sm font-semibold"
          style={{
            backgroundColor: "#1a1033",
            border: "1px solid #3b2f78",
            color: "#a78bfa",
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 1v22M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
          </svg>
          £4.99 / month
        </div>

        {/* Features list */}
        <ul className="space-y-2.5 mb-8 text-left">
          {[
            "Unlimited fact-checks",
            "Instagram Reels & TikToks",
            "Full claim-by-claim breakdown",
            "Source verification",
          ].map((feature) => (
            <li key={feature} className="flex items-center gap-3 text-sm" style={{ color: "#94a3b8" }}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#a78bfa"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
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
          className="block w-full rounded-[12px] py-3.5 text-sm font-semibold transition-opacity hover:opacity-90"
          style={{
            backgroundColor: "#7c6fe0",
            color: "#ffffff",
          }}
        >
          Upgrade for £4.99 / month →
        </a>

        <p
          className="mt-4 text-xs leading-relaxed"
          style={{ color: "#3a3a55" }}
        >
          Already paid?{" "}
          <button
            onClick={() => window.location.reload()}
            className="underline hover:opacity-80 transition-opacity"
            style={{ color: "#64748b" }}
          >
            Refresh the page
          </button>{" "}
          to unlock access.
        </p>
      </div>
    </div>
  );
}
