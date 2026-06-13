export type Opportunity = {
  id: string;
  name: string;
  ministry: string;
  category: string;
  benefit: string;
  benefitDetail: string;
  deadline: string;
  match: number;
  eligibility: string[];
  documents: string[];
  process: string[];
  reason: string;
  faqs: { q: string; a: string }[];
  officialUrl: string;
  state: string;
  educationLevel: string;
  gender: "Any" | "Female" | "Male";
  incomeMax: number;
  description: string;
};

export const categories = [
  "Scholarships",
  "Government Schemes",
  "Women Empowerment",
  "Startup Grants",
  "Skill Development",
  "Internships",
  "Fellowships",
  "Jobs",
  "Research Grants",
  "Education Loans",
  "Agriculture Schemes",
  "Health Schemes",
  "Housing Schemes",
  "Business Loans",
  "Training Programs",
] as const;

export const opportunities: Opportunity[] = [
  {
    id: "pmrf-2024",
    name: "PM Research Fellowship (PMRF)",
    ministry: "Ministry of Education",
    category: "Fellowships",
    benefit: "₹80,000 / month",
    benefitDetail: "Monthly stipend up to ₹80,000 + ₹2L annual research grant for 5 years.",
    deadline: "2025-03-31",
    match: 94,
    eligibility: [
      "B.Tech / M.Tech / MSc final year or completed",
      "CGPA 8.0+ from CFTI / IIT / NIT / IISc",
      "Indian citizen",
    ],
    documents: [
      "Aadhaar card",
      "Latest mark sheets",
      "Research proposal (max 1000 words)",
      "Two recommendation letters",
    ],
    process: [
      "Register on pmrf.in",
      "Upload academic & ID documents",
      "Submit research proposal",
      "Faculty endorsement",
      "Selection interview at host institute",
    ],
    reason: "Matches your education level and CGPA threshold for STEM fellowships.",
    faqs: [
      { q: "Can I apply in final year?", a: "Yes — final year B.Tech/M.Tech students are eligible." },
      { q: "Is there a written exam?", a: "No, selection is via proposal + interview." },
    ],
    officialUrl: "https://pmrf.in",
    state: "All India",
    educationLevel: "Graduate",
    gender: "Any",
    incomeMax: 9999999,
    description: "India's flagship doctoral fellowship for STEM scholars.",
  },
  {
    id: "nsp-post-matric",
    name: "Post-Matric Scholarship (SC)",
    ministry: "Ministry of Social Justice",
    category: "Scholarships",
    benefit: "Up to ₹45,000 / year",
    benefitDetail: "Tuition fees + maintenance allowance for SC students pursuing post-matric studies.",
    deadline: "2025-02-15",
    match: 88,
    eligibility: [
      "SC category, Indian citizen",
      "Family income ≤ ₹2.5L per year",
      "Pursuing post-matriculation course",
    ],
    documents: ["Caste certificate", "Income certificate", "Aadhaar", "Bonafide from institute"],
    process: [
      "Register on scholarships.gov.in (NSP)",
      "Fill application + upload documents",
      "Institute verification",
      "State / district verification",
      "Disbursement to Aadhaar-linked bank account",
    ],
    reason: "Your income range and education match this scheme's bracket.",
    faqs: [
      { q: "Is renewal automatic?", a: "No, renew on NSP each academic year." },
    ],
    officialUrl: "https://scholarships.gov.in",
    state: "All India",
    educationLevel: "Undergraduate",
    gender: "Any",
    incomeMax: 250000,
    description: "Central scholarship covering tuition + allowances for SC students.",
  },
  {
    id: "startup-india-seed",
    name: "Startup India Seed Fund",
    ministry: "DPIIT",
    category: "Startup Grants",
    benefit: "Up to ₹50 Lakh",
    benefitDetail: "Grant up to ₹20L for validation + up to ₹50L for market entry via convertible debentures.",
    deadline: "Rolling",
    match: 76,
    eligibility: [
      "DPIIT-recognised startup",
      "Incorporated ≤ 2 years ago",
      "Indian promoter holding ≥ 51%",
    ],
    documents: ["DPIIT certificate", "Pitch deck", "CA-certified financials", "Founder KYC"],
    process: [
      "Apply on seedfund.startupindia.gov.in",
      "Pick incubator",
      "Pitch to incubator selection committee",
      "Sign grant / debenture agreement",
    ],
    reason: "Suitable if you have a DPIIT-recognised early-stage startup.",
    faqs: [{ q: "Is it equity-free?", a: "Grant component is equity-free; debenture component is convertible." }],
    officialUrl: "https://seedfund.startupindia.gov.in",
    state: "All India",
    educationLevel: "Any",
    gender: "Any",
    incomeMax: 9999999,
    description: "Seed funding for early-stage Indian startups through approved incubators.",
  },
  {
    id: "mahila-coir-yojana",
    name: "Mahila Coir Yojana",
    ministry: "MSME — Coir Board",
    category: "Women Empowerment",
    benefit: "75% subsidy on equipment",
    benefitDetail: "Subsidy + 2-month training stipend for women artisans setting up coir spinning units.",
    deadline: "2025-04-30",
    match: 71,
    eligibility: ["Indian woman aged 18+", "Coir-producing state resident"],
    documents: ["Aadhaar", "Bank passbook", "Residence proof"],
    process: [
      "Approach nearest Coir Board office",
      "Complete 2-month training",
      "Submit subsidy claim with vendor invoice",
    ],
    reason: "Women-only artisan scheme with full equipment subsidy.",
    faqs: [{ q: "Open to non-coir states?", a: "Currently limited to coir-producing states." }],
    officialUrl: "https://coirboard.gov.in",
    state: "Andhra Pradesh",
    educationLevel: "Any",
    gender: "Female",
    incomeMax: 500000,
    description: "Skill + capital support for women entering the coir industry.",
  },
  {
    id: "pmkvy-4",
    name: "PMKVY 4.0 Skill Certification",
    ministry: "Ministry of Skill Development",
    category: "Skill Development",
    benefit: "Free certification + ₹8,000 reward",
    benefitDetail: "Free short-term training, post-placement support and monetary reward on certification.",
    deadline: "2025-06-30",
    match: 82,
    eligibility: ["Indian citizen aged 15–45", "School dropout or unemployed youth"],
    documents: ["Aadhaar", "Bank account", "Education proof (if any)"],
    process: [
      "Register on skillindiadigital.gov.in",
      "Pick a job-role aligned course",
      "Complete training + assessment",
      "Receive certificate + reward",
    ],
    reason: "Open to most youth profiles; strong placement track record.",
    faqs: [{ q: "Is training online?", a: "Most are in-person at PMKVY centres; some hybrid." }],
    officialUrl: "https://skillindiadigital.gov.in",
    state: "All India",
    educationLevel: "Any",
    gender: "Any",
    incomeMax: 9999999,
    description: "India's flagship skill certification & placement programme.",
  },
  {
    id: "swayam-intern",
    name: "AICTE Internship Programme",
    ministry: "Ministry of Education — AICTE",
    category: "Internships",
    benefit: "₹6,000–₹15,000 / month",
    benefitDetail: "Paid internships with industry & government departments for technical students.",
    deadline: "Rolling",
    match: 79,
    eligibility: ["Enrolled in AICTE-approved institute", "Final-year preferred"],
    documents: ["College ID", "Resume", "Bonafide letter"],
    process: [
      "Sign up on internship.aicte-india.org",
      "Apply to listed roles",
      "Employer shortlist + interview",
    ],
    reason: "Matches engineering / technical undergraduate profiles.",
    faqs: [{ q: "Can I do multiple internships?", a: "Yes, one at a time." }],
    officialUrl: "https://internship.aicte-india.org",
    state: "All India",
    educationLevel: "Undergraduate",
    gender: "Any",
    incomeMax: 9999999,
    description: "Centralised platform for paid internships across India.",
  },
  {
    id: "inspire-she",
    name: "INSPIRE Scholarship for Higher Education",
    ministry: "Department of Science & Technology",
    category: "Scholarships",
    benefit: "₹80,000 / year",
    benefitDetail: "Scholarship for students pursuing basic & natural sciences at B.Sc/M.Sc level.",
    deadline: "2025-10-15",
    match: 85,
    eligibility: [
      "Top 1% in 12th board exams",
      "Pursuing B.Sc/M.Sc in natural sciences",
      "Indian citizen",
    ],
    documents: ["12th mark sheet", "Aadhaar", "College admission proof", "Income certificate"],
    process: [
      "Apply on inspire-dst.gov.in",
      "Upload academic documents",
      "Institute verification",
      "Selection based on merit",
    ],
    reason: "For top performers in science stream pursuing higher education.",
    faqs: [{ q: "What courses are eligible?", a: "Physics, Chemistry, Mathematics, Biology, etc." }],
    officialUrl: "https://online-inspire.gov.in",
    state: "All India",
    educationLevel: "Undergraduate",
    gender: "Any",
    incomeMax: 9999999,
    description: "DST scholarship for meritorious students in basic sciences.",
  },
  {
    id: "ugc-net-jrf",
    name: "UGC NET JRF Fellowship",
    ministry: "University Grants Commission",
    category: "Fellowships",
    benefit: "₹31,000 / month",
    benefitDetail: "Junior Research Fellowship for NET qualified candidates pursuing PhD/NET.",
    deadline: "2025-06-30",
    match: 80,
    eligibility: [
      "Qualified UGC NET",
      "Enrolled in PhD or NET eligible",
      "Indian citizen",
      "Age ≤ 30 years",
    ],
    documents: ["NET score card", "Aadhaar", "PhD enrollment proof", "Research proposal"],
    process: [
      "Qualify UGC NET exam",
      "Apply for JRF on UGC portal",
      "Submit research proposal",
      "Interview selection",
    ],
    reason: "For NET qualified candidates pursuing research in humanities/social sciences.",
    faqs: [{ q: "Is there an age limit?", a: "Yes, 30 years for general, 35 for OBC/SC/ST." }],
    officialUrl: "https://ugcnet.nta.ac.in",
    state: "All India",
    educationLevel: "Postgraduate",
    gender: "Any",
    incomeMax: 9999999,
    description: "UGC fellowship for NET qualified researchers.",
  },
  {
    id: "pm-kisan",
    name: "PM Kisan Samman Nidhi",
    ministry: "Ministry of Agriculture",
    category: "Agriculture Schemes",
    benefit: "₹6,000 / year",
    benefitDetail: "Direct income support of ₹6,000 per year in three installments to farmer families.",
    deadline: "Rolling",
    match: 90,
    eligibility: [
      "Farmer family with cultivable land",
      "Landholding ≤ 2 hectares",
      "Indian citizen",
    ],
    documents: ["Aadhaar", "Land documents", "Bank account", "Mobile number"],
    process: [
      "Register on pmkisan.gov.in",
      "Upload land documents",
      "Aadhaar verification",
      "Direct benefit transfer",
    ],
    reason: "Income support for small and marginal farmers.",
    faqs: [{ q: "Who is eligible?", a: "All farmer families with cultivable land up to 2 hectares." }],
    officialUrl: "https://pmkisan.gov.in",
    state: "All India",
    educationLevel: "Any",
    gender: "Any",
    incomeMax: 9999999,
    description: "Direct income support scheme for farmers.",
  },
  {
    id: "ayushman-bharat",
    name: "Ayushman Bharat Pradhan Mantri Jan Arogya Yojana",
    ministry: "Ministry of Health",
    category: "Health Schemes",
    benefit: "₹5 Lakh health cover",
    benefitDetail: "Health insurance coverage of ₹5 lakh per family per year for secondary and tertiary care.",
    deadline: "Rolling",
    match: 92,
    eligibility: [
      "Deprived rural families",
      "Identified occupational categories of urban workers",
      "Indian citizen",
    ],
    documents: ["Aadhaar", "Ration card", "Income proof", "Bank account"],
    process: [
      "Check eligibility on pmjay.gov.in",
      "Visit empaneled hospital",
      "Get treatment cashless",
      "Government pays directly",
    ],
    reason: "Health coverage for vulnerable families.",
    faqs: [{ q: "Is it free?", a: "Yes, fully government-funded health insurance." }],
    officialUrl: "https://pmjay.gov.in",
    state: "All India",
    educationLevel: "Any",
    gender: "Any",
    incomeMax: 9999999,
    description: "National health protection scheme for poor families.",
  },
  {
    id: "pm-awas",
    name: "Pradhan Mantri Awas Yojana (Urban)",
    ministry: "Ministry of Housing",
    category: "Housing Schemes",
    benefit: "₹2.67 Lakh subsidy",
    benefitDetail: "Interest subsidy on home loans for EWS/LIG/MIG categories.",
    deadline: "2025-12-31",
    match: 78,
    eligibility: [
      "EWS/LIG/MIG category",
      "No pucca house in family",
      "Indian citizen",
      "Income ≤ ₹18 Lakh (MIG-II)",
    ],
    documents: ["Aadhaar", "Income proof", "Property documents", "Bank loan details"],
    process: [
      "Apply on pmaymis.gov.in",
      "Upload income and property documents",
      "Subsidy approval",
      "Loan disbursement with subsidy",
    ],
    reason: "Housing for all urban poor and middle class.",
    faqs: [{ q: "What is the income limit?", a: "Up to ₹18 lakh for MIG-II category." }],
    officialUrl: "https://pmaymis.gov.in",
    state: "All India",
    educationLevel: "Any",
    gender: "Any",
    incomeMax: 1800000,
    description: "Housing for all urban scheme with interest subsidy.",
  },
  {
    id: "mudra-loan",
    name: "PMMY Mudra Loan",
    ministry: "Ministry of Finance",
    category: "Business Loans",
    benefit: "Up to ₹10 Lakh",
    benefitDetail: "Loans for micro enterprises in manufacturing, trading, and services sectors.",
    deadline: "Rolling",
    match: 75,
    eligibility: [
      "Indian citizen",
      "Micro/small enterprise",
      "Business plan required",
      "No collateral for loans up to ₹10 lakh",
    ],
    documents: ["Aadhaar", "PAN", "Business registration", "Bank account", "Project report"],
    process: [
      "Apply at any bank/MFI",
      "Submit business plan",
      "Loan approval",
      "Disbursement to bank account",
    ],
    reason: "Funding for micro and small enterprises.",
    faqs: [{ q: "Is collateral required?", a: "No collateral for loans up to ₹10 lakh." }],
    officialUrl: "https://mudra.org.in",
    state: "All India",
    educationLevel: "Any",
    gender: "Any",
    incomeMax: 9999999,
    description: "Micro Units Development and Refinance Agency loan scheme.",
  },
  {
    id: "national-apprenticeship",
    name: "National Apprenticeship Promotion Scheme",
    ministry: "Ministry of Skill Development",
    category: "Training Programs",
    benefit: "Stipend + training",
    benefitDetail: "Apprenticeship training with stipend support for youth.",
    deadline: "Rolling",
    match: 83,
    eligibility: [
      "Indian citizen aged 14-40",
      "Minimum educational qualification varies by trade",
      "Willing to undergo training",
    ],
    documents: ["Aadhaar", "Educational certificates", "Bank account"],
    process: [
      "Register on apprenticeshipindia.gov.in",
      "Apply for apprenticeship positions",
      "Selection by employer",
      "Start training with stipend",
    ],
    reason: "On-the-job training with stipend support.",
    faqs: [{ q: "What is the stipend?", a: "Varies by trade and year of training." }],
    officialUrl: "https://apprenticeshipindia.gov.in",
    state: "All India",
    educationLevel: "Any",
    gender: "Any",
    incomeMax: 9999999,
    description: "Government apprenticeship training scheme.",
  },
  {
    id: "vidya-lakshmi",
    name: "Vidya Lakshmi Portal",
    ministry: "Ministry of Finance",
    category: "Education Loans",
    benefit: "Education loan access",
    benefitDetail: "Single portal for education loan applications from multiple banks.",
    deadline: "Rolling",
    match: 77,
    eligibility: [
      "Indian citizen",
      "Admitted to recognized institution",
      "Co-borrower required",
    ],
    documents: ["Aadhaar", "PAN", "Admission letter", "Income proof", "Academic records"],
    process: [
      "Register on vidyalakshmi.co.in",
      "Apply to multiple banks",
      "Bank processes application",
      "Loan disbursement",
    ],
    reason: "Easy access to education loans from multiple banks.",
    faqs: [{ q: "Is it a loan provider?", a: "No, it's a portal connecting students to banks." }],
    officialUrl: "https://vidyalakshmi.co.in",
    state: "All India",
    educationLevel: "Any",
    gender: "Any",
    incomeMax: 9999999,
    description: "Education loan portal for students.",
  },
  {
    id: "sbi-po",
    name: "SBI Probationary Officer Recruitment",
    ministry: "State Bank of India",
    category: "Jobs",
    benefit: "₹40,000+ / month",
    benefitDetail: "Bank PO job with SBI with career growth opportunities.",
    deadline: "2025-04-30",
    match: 72,
    eligibility: [
      "Graduate in any discipline",
      "Indian citizen",
      "Age 21-30 years",
    ],
    documents: ["Graduation certificate", "Aadhaar", "PAN", "Photograph", "Signature"],
    process: [
      "Apply on sbi.co.in/careers",
      "Online exam (Prelims + Mains)",
      "Group discussion + interview",
      "Final selection",
    ],
    reason: "Banking job opportunity with India's largest bank.",
    faqs: [{ q: "What is the selection process?", a: "Prelims, Mains, GD, and Interview." }],
    officialUrl: "https://sbi.co.in/careers",
    state: "All India",
    educationLevel: "Graduate",
    gender: "Any",
    incomeMax: 9999999,
    description: "SBI PO recruitment for banking sector jobs.",
  },
  {
    id: "serb-purse",
    name: "SERB PURSE Grant",
    ministry: "Department of Science & Technology",
    category: "Research Grants",
    benefit: "Up to ₹50 Lakh",
    benefitDetail: "Research grant for faculty in basic sciences for equipment and consumables.",
    deadline: "2025-08-31",
    match: 68,
    eligibility: [
      "Faculty in basic sciences",
      "Regular position in academic institution",
      "PhD degree",
      "Indian citizen",
    ],
    documents: ["PhD certificate", "Employment proof", "Research proposal", "Institute endorsement"],
    process: [
      "Apply on serb.gov.in",
      "Submit detailed research proposal",
      "Peer review",
      "Grant approval",
    ],
    reason: "Research funding for faculty in basic sciences.",
    faqs: [{ q: "What can the grant be used for?", a: "Equipment, consumables, travel, manpower." }],
    officialUrl: "https://serb.gov.in",
    state: "All India",
    educationLevel: "Postgraduate",
    gender: "Any",
    incomeMax: 9999999,
    description: "Science and Engineering Research Board grant for researchers.",
  },
];

export const notifications = [
  { id: "n1", title: "New scholarship added: INSPIRE-SHE", time: "2h ago", kind: "new" as const },
  { id: "n2", title: "Deadline approaching — Post-Matric Scholarship (Feb 15)", time: "5h ago", kind: "deadline" as const },
  { id: "n3", title: "Your eligibility match jumped to 82%", time: "Yesterday", kind: "update" as const },
  { id: "n4", title: "PMKVY 4.0 enrollments open in your district", time: "2 days ago", kind: "new" as const },
];

export const stats = {
  schemes: "4,200+",
  fund: "₹850 Cr+",
  verified: "100%",
  assisted: "1.2M",
};

export type TrustLevel = "verified" | "unofficial" | "unsafe";

export function classifyDomain(input: string): {
  url: string;
  level: TrustLevel;
  score: number;
  reason: string;
} {
  const raw = input.trim();
  let url = raw;
  if (!/^https?:\/\//i.test(url)) url = "https://" + url;
  let host = "";
  try {
    host = new URL(url).hostname.toLowerCase();
  } catch {
    return { url: raw, level: "unsafe", score: 5, reason: "Could not parse this URL." };
  }

  const suspiciousTlds = [".tk", ".ml", ".ga", ".cf", ".xyz", ".top"];
  const suspiciousWords = ["free-reg", "registration-2024", "apply-now-india", "pm-scheme", "scholarship-official"];

  if (/(^|\.)(gov\.in|nic\.in|gov\.bharat|rbi\.org\.in|india\.gov\.in)$/.test(host)) {
    return {
      url,
      level: "verified",
      score: 96,
      reason: `Domain ${host} belongs to an official Government of India network (NIC / gov.in).`,
    };
  }

  if (suspiciousTlds.some((t) => host.endsWith(t)) || suspiciousWords.some((w) => host.includes(w))) {
    return {
      url,
      level: "unsafe",
      score: 12,
      reason: "Domain uses suspicious TLD / keywords commonly seen in phishing of government schemes.",
    };
  }

  if (/\.(edu|ac\.in|org|com|in)$/.test(host)) {
    return {
      url,
      level: "unofficial",
      score: 58,
      reason: "Likely informational / educational source. Not an official government portal — do not submit personal data.",
    };
  }

  return {
    url,
    level: "unsafe",
    score: 25,
    reason: "Could not verify against any known government registry.",
  };
}