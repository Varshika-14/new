import { bulkImportOpportunities } from "./opportunities";
import { JSDOM } from "jsdom";

interface ExternalOpportunity {
  title: string;
  company: string;
  location: string;
  url: string;
  description: string;
  type: "internship" | "job" | "fellowship" | "scholarship";
  category: string;
  deadline?: string;
}

class ExternalAPIIntegration {
  private apiKey: string;
  
  constructor() {
    this.apiKey = process.env.EXTERNAL_API_KEY || "";
  }

  // Generic API fetcher with error handling
  private async fetchAPI(url: string, options: RequestInit = {}) {
    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          "Content-Type": "application/json",
          ...(options.headers || {}),
        },
      });
      
      if (!response.ok) {
        throw new Error(`API request failed: ${response.status} ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error(`Error fetching ${url}:`, error);
      throw error;
    }
  }

  // Transform external data to our Opportunity format
  private transformToOpportunity(data: ExternalOpportunity, source: string) {
    return {
      id: `${source}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name: data.title,
      ministry: data.company,
      category: data.category,
      benefit: this.extractBenefit(data.description),
      benefitDetail: data.description,
      deadline: data.deadline || "Rolling",
      match: 75, // Default match score for external data
      eligibility: this.extractEligibility(data.description),
      documents: ["Resume", "Cover Letter"],
      process: ["Apply online", "Interview process"],
      reason: `External opportunity from ${source}`,
      faqs: [{ q: "How to apply?", a: "Click the apply link to submit your application" }],
      officialUrl: data.url,
      state: this.extractState(data.location),
      educationLevel: this.extractEducationLevel(data.description),
      gender: "Any" as const,
      incomeMax: 9999999,
      description: data.description,
      verified: false, // External data needs verification
      lastVerified: new Date(),
      source: source,
    };
  }

  private extractBenefit(description: string): string {
    // Extract benefit information from description
    const benefitPatterns = [
      /₹[\d,]+/g,
      /\$\d+/g,
      /paid/i,
      /stipend/i,
      /salary/i,
    ];
    
    for (const pattern of benefitPatterns) {
      const match = description.match(pattern);
      if (match) return match[0];
    }
    
    return "Competitive compensation";
  }

  private extractEligibility(description: string): string[] {
    const eligibility = [];
    if (description.toLowerCase().includes("graduate")) eligibility.push("Graduate");
    if (description.toLowerCase().includes("undergraduate")) eligibility.push("Undergraduate");
    if (description.toLowerCase().includes("phd")) eligibility.push("PhD");
    if (description.toLowerCase().includes("experience")) eligibility.push("Relevant experience");
    
    return eligibility.length > 0 ? eligibility : ["Open to all eligible candidates"];
  }

  private extractState(location: string): string {
    if (location.toLowerCase().includes("remote")) return "Remote";
    if (location.toLowerCase().includes("india")) return "All India";
    if (location.toLowerCase().includes("bangalore")) return "Karnataka";
    if (location.toLowerCase().includes("hyderabad")) return "Telangana";
    if (location.toLowerCase().includes("mumbai")) return "Maharashtra";
    if (location.toLowerCase().includes("delhi")) return "Delhi";
    
    return "All India";
  }

  private extractEducationLevel(description: string): string {
    if (description.toLowerCase().includes("phd")) return "Postgraduate";
    if (description.toLowerCase().includes("graduate")) return "Graduate";
    if (description.toLowerCase().includes("undergraduate")) return "Undergraduate";
    if (description.toLowerCase().includes("school")) return "School";
    
    return "Any";
  }

  // Fetch internships from various sources
  async fetchInternships(keyword: string = "software", limit: number = 50) {
    const opportunities: ExternalOpportunity[] = [];
    
    // Try web scraping from Amazon
    try {
      console.log(`🔍 Scraping Amazon jobs for: ${keyword}`);
      const amazonJobs = await this.scrapeAmazonJobs(keyword, Math.floor(limit / 3));
      opportunities.push(...amazonJobs);
      console.log(`✅ Found ${amazonJobs.length} Amazon jobs`);
    } catch (error) {
      console.log("Amazon scraping failed, trying next source");
    }

    // Try web scraping from internship sites
    try {
      console.log(`🔍 Scraping internship sites for: ${keyword}`);
      const internshipJobs = await this.scrapeInternshipSites(keyword, Math.floor(limit / 3));
      opportunities.push(...internshipJobs);
      console.log(`✅ Found ${internshipJobs.length} internship site jobs`);
    } catch (error) {
      console.log("Internship site scraping failed, trying next source");
    }

    // Try generic API (placeholder for actual API integration)
    try {
      console.log(`🔍 Fetching from generic API for: ${keyword}`);
      const apiData = await this.fetchFromGenericAPI(keyword, Math.floor(limit / 3));
      opportunities.push(...apiData);
      console.log(`✅ Found ${apiData.length} API results`);
    } catch (error) {
      console.log("Generic API failed");
    }

    return opportunities;
  }

  // Web scraping for Amazon jobs
  private async scrapeAmazonJobs(keyword: string, limit: number): Promise<ExternalOpportunity[]> {
    try {
      const url = `https://www.amazon.jobs/en/search?base_query=${encodeURIComponent(keyword)}`;
      const response = await fetch(url);
      const html = await response.text();
      const dom = new JSDOM(html);
      const document = dom.window.document;
      
      const opportunities: ExternalOpportunity[] = [];
      const jobCards = document.querySelectorAll('.job-tile');
      
      for (let i = 0; i < Math.min(jobCards.length, limit); i++) {
        const card = jobCards[i];
        const title = card.querySelector('.job-title')?.textContent?.trim() || '';
        const location = card.querySelector('.location')?.textContent?.trim() || 'Remote';
        const url = card.querySelector('a')?.href || '';
        
        if (title && url) {
          opportunities.push({
            title,
            company: 'Amazon',
            location,
            url: url.startsWith('http') ? url : `https://www.amazon.jobs${url}`,
            description: `Amazon ${title} position at ${location}`,
            type: 'internship',
            category: 'Internships',
            deadline: 'Rolling',
          });
        }
      }
      
      return opportunities;
    } catch (error) {
      console.error('Error scraping Amazon jobs:', error);
      return [];
    }
  }

  // Web scraping for general internship sites
  private async scrapeInternshipSites(keyword: string, limit: number): Promise<ExternalOpportunity[]> {
    const opportunities: ExternalOpportunity[] = [];
    
    // Try to scrape from various internship sites
    const sites = [
      { name: 'Internshala', url: `https://internshala.com/internships/keywords-${keyword}` },
      { name: 'LinkedIn', url: `https://www.linkedin.com/jobs/search/?keywords=${keyword}` },
    ];
    
    for (const site of sites) {
      try {
        const response = await fetch(site.url);
        const html = await response.text();
        const dom = new JSDOM(html);
        const document = dom.window.document;
        
        // Generic scraping logic - adjust selectors based on actual site structure
        const jobCards = document.querySelectorAll('.job-card, .job-tile, .internship-card');
        
        for (let i = 0; i < Math.min(jobCards.length, Math.floor(limit / sites.length)); i++) {
          const card = jobCards[i];
          const title = card.querySelector('h3, .title, .job-title')?.textContent?.trim() || '';
          const company = card.querySelector('.company, .organization')?.textContent?.trim() || site.name;
          const location = card.querySelector('.location, .place')?.textContent?.trim() || 'Remote';
          const url = card.querySelector('a')?.href || '';
          
          if (title && url) {
            opportunities.push({
              title,
              company,
              location,
              url: url.startsWith('http') ? url : `https://${site.name}.com${url}`,
              description: `${title} at ${company}`,
              type: 'internship',
              category: 'Internships',
              deadline: 'Rolling',
            });
          }
        }
      } catch (error) {
        console.error(`Error scraping ${site.name}:`, error);
      }
    }
    
    return opportunities;
  }

  // Generic API fetcher (placeholder for actual API)
  private async fetchFromGenericAPI(keyword: string, limit: number): Promise<ExternalOpportunity[]> {
    // This is a placeholder - replace with actual API integration
    // Example: Indeed API, LinkedIn API, etc.
    
    // For now, return mock data to demonstrate the system
    return [
      {
        title: `Software Development Internship - ${keyword}`,
        company: "Tech Company",
        location: "Remote",
        url: "https://example.com/apply",
        description: "Exciting internship opportunity for students interested in software development.",
        type: "internship",
        category: "Internships",
        deadline: "2026-12-31",
      },
    ];
  }

  // Alternative API fetcher (placeholder)
  private async fetchFromAlternativeAPI(keyword: string, limit: number): Promise<ExternalOpportunity[]> {
    // This is a placeholder for another API source
    return [];
  }

  // Search for opportunities using keyword
  async searchOpportunities(keyword: string, category: string = "All"): Promise<ExternalOpportunity[]> {
    const allOpportunities: ExternalOpportunity[] = [];
    
    try {
      const internships = await this.fetchInternships(keyword, 25);
      allOpportunities.push(...internships);
    } catch (error) {
      console.error("Error fetching internships:", error);
    }

    // Filter by category if specified
    if (category !== "All") {
      return allOpportunities.filter(opp => opp.category === category);
    }

    return allOpportunities;
  }

  // Import external opportunities to database
  async importToDatabase(opportunities: ExternalOpportunity[], source: string) {
    console.log(`📥 Importing ${opportunities.length} opportunities from ${source}...`);
    
    try {
      const transformed = opportunities.map(opp => 
        this.transformToOpportunity(opp, source)
      );
      
      const result = await bulkImportOpportunities(transformed);
      console.log(`✅ Successfully imported ${result.insertedCount} opportunities from ${source}`);
      
      return result;
    } catch (error) {
      console.error(`❌ Failed to import from ${source}:`, error);
      throw error;
    }
  }
}

export const externalAPI = new ExternalAPIIntegration();
