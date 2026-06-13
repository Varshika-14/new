export function expandQuery(q: string): string[] {
  const baseQuery = q.trim();
  const queries: string[] = [
    baseQuery,
    `${baseQuery} government scheme apply`,
    `${baseQuery} official portal india`,
    `${baseQuery} scholarship apply link`,
    `${baseQuery} ministry scheme`,
    `${baseQuery} internship india apply`,
    `${baseQuery} fellowship application`,
    `${baseQuery} startup grant india`,
    `${baseQuery} skill development scheme`,
    `${baseQuery} women empowerment scheme`,
    `${baseQuery} state government scheme`,
  ];
  
  // Remove duplicates while preserving order
  return Array.from(new Set(queries));
}

export function getCategoryQueries(category: string): string[] {
  const categoryQueries: Record<string, string[]> = {
    "Scholarships": [
      "scholarship apply india",
      "government scholarship portal",
      "national scholarship portal",
      "post matric scholarship",
      "merit scholarship scheme",
      "minority scholarship india",
      "pre matric scholarship",
      "central sector scholarship",
    ],
    "Fellowships": [
      "research fellowship india",
      "PMRF fellowship apply",
      "UGC fellowship",
      "CSIR fellowship",
      "DBT fellowship",
      "ICMR fellowship",
      "INSPIRE fellowship",
      "SERB fellowship",
    ],
    "Startup Grants": [
      "startup india seed fund",
      "DPIIT startup grant",
      "MSME startup scheme",
      "biotech startup grant",
      "agriculture startup subsidy",
      "technology startup fund",
      "women startup scheme",
    ],
    "Internships": [
      "government internship india",
      "AICTE internship portal",
      "paid internship government",
      "ministry internship programme",
      "PSU internship",
      "summer internship government",
      "research internship india",
    ],
    "Skill Development": [
      "PMKVY skill certification",
      "skill india registration",
      "NSDC training programme",
      "apprenticeship scheme india",
      "technical skill training",
      "vocational training government",
      "digital skill programme",
    ],
    "Women Empowerment": [
      "women empowerment scheme",
      "mahila samridhi yojana",
      "women entrepreneurship scheme",
      "women skill development",
      "women scholarship india",
      "mahila coir yojana",
      "women self help group",
    ],
    "Government Schemes": [
      "government scheme apply",
      "central government scheme",
      "state government scheme",
      "welfare scheme india",
      "public welfare programme",
      "social security scheme",
      "rural development scheme",
    ],
    "Jobs": [
      "government job apply india",
      "sarkari naukri",
      "PSU recruitment",
      "government vacancy",
      "central government job",
      "state government job",
      "public sector job",
    ],
    "Research Grants": [
      "research grant india",
      "scientific research funding",
      "academic research grant",
      "innovation grant india",
      "phd research funding",
      "science research scheme",
    ],
    "Education Loans": [
      "education loan government",
      "student loan scheme india",
      "vidya lakshmi portal",
      "interest subsidy education loan",
      "professional education loan",
    ],
    "Agriculture Schemes": [
      "agriculture scheme india",
      "farmer subsidy scheme",
      "PM Kisan samman nidhi",
      "agriculture loan subsidy",
      "crop insurance scheme",
      "farming equipment subsidy",
    ],
    "Health Schemes": [
      "health scheme india",
      "Ayushman Bharat",
      "government health insurance",
      "medical subsidy scheme",
      "public health programme",
      "hospital subsidy scheme",
    ],
    "Housing Schemes": [
      "housing scheme india",
      "PM Awas Yojana",
      "government housing subsidy",
      "low income housing",
      "rural housing scheme",
      "urban housing mission",
    ],
    "Business Loans": [
      "business loan government",
      "MSME loan scheme",
      "mudra loan apply",
      "small business subsidy",
      "entrepreneur loan scheme",
      "startup loan government",
    ],
    "Training Programs": [
      "government training programme",
      "skill training scheme",
      "vocational training government",
      "technical training programme",
      "apprenticeship training",
      "capacity building programme",
    ],
  };

  return categoryQueries[category] || [`${category.toLowerCase()} scheme india`];
}

export function getStateQueries(state: string, category?: string): string[] {
  const stateLower = state.toLowerCase().replace(/\s+/g, "-");
  const baseQueries = category 
    ? getCategoryQueries(category).map(q => `${q} ${state}`)
    : [
        `${state} government scheme`,
        `${state} scholarship`,
        `${state} internship`,
        `${state} startup grant`,
        `${state} skill development`,
      ];
  
  return baseQueries;
}
