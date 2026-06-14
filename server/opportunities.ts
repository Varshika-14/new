import { getCollection } from "./db";

export interface Opportunity {
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
  verified: boolean;
  lastVerified: Date;
  source: string;
}

export async function getOpportunities(filter?: {
  category?: string;
  state?: string;
  educationLevel?: string;
  limit?: number;
}) {
  const collection = await getCollection<Opportunity>("opportunities");
  const query: any = { verified: true };
  
  if (filter?.category) query.category = filter.category;
  if (filter?.state) query.state = filter.state;
  if (filter?.educationLevel) query.educationLevel = filter.educationLevel;
  
  const cursor = collection.find(query).limit(filter?.limit || 1000);
  return cursor.toArray();
}

export async function getOpportunityById(id: string) {
  const collection = await getCollection<Opportunity>("opportunities");
  return collection.findOne({ id, verified: true });
}

export async function createOpportunity(opportunity: Opportunity) {
  const collection = await getCollection<Opportunity>("opportunities");
  const result = await collection.insertOne(opportunity);
  return result;
}

export async function bulkImportOpportunities(opportunities: Opportunity[]) {
  const collection = await getCollection<Opportunity>("opportunities");
  const result = await collection.insertMany(opportunities);
  return result;
}

export async function updateOpportunity(id: string, updates: Partial<Opportunity>) {
  const collection = await getCollection<Opportunity>("opportunities");
  const result = await collection.updateOne({ id }, { $set: updates });
  return result;
}

export async function deleteOpportunity(id: string) {
  const collection = await getCollection<Opportunity>("opportunities");
  const result = await collection.deleteOne({ id });
  return result;
}

export async function verifyOpportunityUrl(id: string) {
  const collection = await getCollection<Opportunity>("opportunities");
  const opportunity = await collection.findOne({ id });
  if (!opportunity) return null;
  
  // Simple URL verification - check if URL is accessible
  try {
    const response = await fetch(opportunity.officialUrl, { 
      method: 'HEAD',
      signal: AbortSignal.timeout(10000)
    });
    const verified = response.ok;
    
    await collection.updateOne(
      { id },
      { 
        $set: { 
          verified,
          lastVerified: new Date()
        } 
      }
    );
    
    return { verified, statusCode: response.status };
  } catch (error) {
    await collection.updateOne(
      { id },
      { 
        $set: { 
          verified: false,
          lastVerified: new Date()
        } 
      }
    );
    return { verified: false, error: (error as Error).message };
  }
}

export async function getOpportunityStats() {
  const collection = await getCollection<Opportunity>("opportunities");
  const total = await collection.countDocuments();
  const verified = await collection.countDocuments({ verified: true });
  const byCategory = await collection.aggregate([
    { $group: { _id: "$category", count: { $sum: 1 } } },
    { $sort: { count: -1 } }
  ]).toArray();
  
  return { total, verified, byCategory };
}
