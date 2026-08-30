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
    date: "३० ऑगस्ट २०२६",
    category: "विकास",
    title: "प्रस्तावित पाबळ–धामारी एमआयडीसीची आजची स्थिती",
    marathiTitle: "प्रस्तावित पाबळ–धामारी एमआयडीसीची सद्यस्थिती",
    summary: "काय अधिसूचित झाले, कोणत्या बाबतीत भूसंपादन सुरू असल्याचे वृत्त आहे आणि काय अद्याप निश्चित झालेले नाही यांची स्पष्ट विभागणी.",
    sourceUrl: "https://sarkarnama.esakal.com/pune/another-big-midc-for-pune-not-chakan-or-ranjangaon-new-743-hectare-industrial-hub-to-come-up-in-this-area-aau85-sm89"
  },
  {
    slug: "gangasagar-talav-open-questions",
    date: "३० ऑगस्ट २०२६",
    category: "जलवारसा",
    title: "गंगासागर तलाव: नकाशातील नोंद आणि अनुत्तरित प्रश्न",
    marathiTitle: "गंगासागर तलाव: नकाशातील नोंद आणि अनुत्तरित प्रश्न",
    summary: "जलाशय नकाशावर नोंदलेला आहे; मात्र बांधकाम वर्ष, क्षमता आणि दस्तऐवजीकृत सिंचन इतिहासासाठी प्राथमिक नोंदी आवश्यक आहेत.",
    sourceUrl: "https://www.openstreetmap.org/way/989003631"
  },
  {
    slug: "how-the-dhamari-archive-checks-history",
    date: "३० ऑगस्ट २०२६",
    category: "अभिलेख नोंदी",
    title: "हा अभिलेख नोंदी आणि लोकस्मृती वेगळ्या कशा ठेवतो",
    marathiTitle: "नोंदी आणि लोकस्मृती यांतील फरक कसा जपला जातो",
    summary: "जनगणना नोंदी, क्षेत्रअभ्यास, मौखिक इतिहास आणि चालू वृत्तांना वेगवेगळी पुरावा-स्थिती का दिली जाते."
  }
];

// Add future posts as new objects above. Keep claims sourced and use YYYY-style dated evidence.
