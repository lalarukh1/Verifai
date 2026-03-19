export type Genre =
  | "ai_technology"
  | "technology"
  | "health_medical"
  | "politics_governance"
  | "finance_economics"
  | "science_environment"
  | "humanitarian_conflict"
  | "religion"
  | "sports"
  | "entertainment_culture"
  | "general";

/** Curated authority domains per content genre, used for targeted evidence search */
export const GENRE_AUTHORITY_SITES: Record<Genre, string[]> = {
  ai_technology: [
    "statista.com",
    "salesforce.com",
    "mckinsey.com",
    "hai.stanford.edu",
    "oecd.org",
    "weforum.org",
    "technologyreview.com",
    "venturebeat.com",
    "bloomberg.com",
    "ourworldindata.org",
  ],
  technology: [
    "techcrunch.com",
    "wired.com",
    "theverge.com",
    "arstechnica.com",
    "technologyreview.com",
    "cnet.com",
    "engadget.com",
    "reuters.com",
    "bloomberg.com",
    "9to5mac.com",
  ],
  health_medical: [
    "who.int",
    "cdc.gov",
    "nih.gov",
    "pubmed.ncbi.nlm.nih.gov",
    "nejm.org",
    "thelancet.com",
    "bmj.com",
    "nature.com",
    "mayoclinic.org",
    "healthline.com",
  ],
  politics_governance: [
    "reuters.com",
    "apnews.com",
    "bbc.com",
    "theguardian.com",
    "politico.com",
    "un.org",
    "nytimes.com",
    "washingtonpost.com",
    "council.europa.eu",
    "gov.uk",
  ],
  finance_economics: [
    "bloomberg.com",
    "wsj.com",
    "ft.com",
    "economist.com",
    "reuters.com",
    "imf.org",
    "worldbank.org",
    "forbes.com",
    "cnbc.com",
    "businessinsider.com",
  ],
  science_environment: [
    "nature.com",
    "science.org",
    "pnas.org",
    "arxiv.org",
    "scientificamerican.com",
    "nasa.gov",
    "noaa.gov",
    "ipcc.ch",
    "carbonbrief.org",
    "newscientist.com",
  ],
  humanitarian_conflict: [
    "un.org",
    "unicef.org",
    "unhcr.org",
    "hrw.org",
    "amnesty.org",
    "icrc.org",
    "reuters.com",
    "apnews.com",
    "bbc.com",
    "aljazeera.com",
  ],
  religion: [
    "reuters.com",
    "bbc.com",
    "theguardian.com",
    "britannica.com",
    "pewresearch.org",
    "oxfordbibliographies.com",
  ],
  sports: [
    "espn.com",
    "bbc.com",
    "skysports.com",
    "si.com",
    "theathletic.com",
    "bleacherreport.com",
    "goal.com",
  ],
  entertainment_culture: [
    "variety.com",
    "hollywoodreporter.com",
    "deadline.com",
    "rollingstone.com",
    "imdb.com",
    "rottentomatoes.com",
    "billboard.com",
  ],
  general: [
    "reuters.com",
    "apnews.com",
    "bbc.com",
    "theguardian.com",
    "nytimes.com",
    "britannica.com",
    "wikipedia.org",
  ],
};
