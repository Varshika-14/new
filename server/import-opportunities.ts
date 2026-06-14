import "dotenv/config";
import { opportunities } from "../src/lib/mock-data";
import { bulkImportOpportunities } from "./opportunities";

async function importOpportunities() {
  console.log("📥 Starting import of opportunities...");
  
  try {
    // Add verification metadata to each opportunity
    const opportunitiesWithMeta = opportunities.map((opp) => ({
      ...opp,
      verified: true,
      lastVerified: new Date(),
      source: "manual",
    }));
    
    const result = await bulkImportOpportunities(opportunitiesWithMeta);
    console.log(`✅ Successfully imported ${result.insertedCount} opportunities`);
    console.log(`📊 Database now has ${result.insertedCount} opportunities`);
    
    process.exit(0);
  } catch (error) {
    console.error("❌ Import failed:", error);
    process.exit(1);
  }
}

importOpportunities();
