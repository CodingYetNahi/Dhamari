export type BlogPost = {
  slug: string;
  date: string;
  category: string;
  title: string;
  marathiTitle?: string;
  summary: string;
  sourceUrl?: string;
};

export const blogPosts: BlogPost[] = [
  {
    slug: "pabal-dhamari-midc-status-august-2026",
    date: "30 August 2026",
    category: "Development",
    title: "What the proposed Pabal–Dhamari MIDC means today",
    marathiTitle: "प्रस्तावित पाबळ–धामारी एमआयडीसीची सद्यस्थिती",
    summary: "A careful separation of what has been notified, what is reportedly under acquisition, and what has not yet been confirmed.",
    sourceUrl: "https://sarkarnama.esakal.com/pune/another-big-midc-for-pune-not-chakan-or-ranjangaon-new-743-hectare-industrial-hub-to-come-up-in-this-area-aau85-sm89"
  },
  {
    slug: "gangasagar-talav-open-questions",
    date: "30 August 2026",
    category: "Water heritage",
    title: "Gangasagar Talav: a map record and open questions",
    marathiTitle: "गंगासागर तलाव: नकाशातील नोंद आणि अनुत्तरित प्रश्न",
    summary: "The reservoir is mapped, but its construction date, capacity and documented irrigation history still need primary records.",
    sourceUrl: "https://www.openstreetmap.org/way/989003631"
  },
  {
    slug: "how-the-dhamari-archive-checks-history",
    date: "30 August 2026",
    category: "Archive notes",
    title: "How this archive separates records from memory",
    marathiTitle: "नोंदी आणि लोकस्मृती यांतील फरक कसा जपला जातो",
    summary: "Why census records, field studies, oral history and current news carry different evidence labels."
  }
];

// Add future posts as new objects above. Keep claims sourced and use YYYY-style dated evidence.
