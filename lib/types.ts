export type Platform = "instagram" | "tiktok" | "unknown";

export type ExtractionSource = "caption" | "audio" | "web" | "manual";

export interface ExtractedContent {
  text: string;
  source: ExtractionSource;
  platform: Platform;
  accountHandle?: string;
  accountFollowers?: number;
  postUrl: string;
  rawCaption?: string;
  transcript?: string;
  thumbnailUrl?: string;
  postTimestamp?: string; // ISO date string
}

export type ClaimVerdict =
  | "TRUE"
  | "FALSE"
  | "MISLEADING"
  | "UNVERIFIED"
  | "NO_EVIDENCE";

export interface Claim {
  text: string;
  verdict: ClaimVerdict;
  confidence: number;
  explanation: string;
  sources: { name: string; url: string; date?: string; snippet?: string }[];
  category: string;
}

/** Intermediate type: a raw claim paired with search evidence, used between Pass 1 and Pass 2 */
export interface ClaimWithEvidence {
  text: string;
  category: string;
  evidence: { name: string; url: string; snippet: string; date?: string }[];
}

export type OverallVerdict =
  | "TRUSTWORTHY"
  | "MISLEADING"
  | "FALSE"
  | "UNVERIFIED";

export interface AnalysisResult {
  overallVerdict: OverallVerdict;
  verdictReason: string;
  claims: Claim[];
  credibilityScore: number;
  accountSummary: string;
  extractedContent: ExtractedContent;
  processingTimeMs: number;
}

export interface CheckRequest {
  url: string;
}

export interface CheckResponse {
  success: boolean;
  result?: AnalysisResult;
  error?: string;
  rateLimited?: boolean;
  paywalled?: boolean;
  checksRemaining?: number;
}
