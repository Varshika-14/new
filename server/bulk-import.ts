import "dotenv/config";
import { bulkImportOpportunities } from "./opportunities";
import { readFileSync } from "fs";
import { join } from "path";

async function bulkImportFromFile(filePath: string) {
  console.log(`📥 Starting bulk import from ${filePath}...`);
  
  try {
    const fileContent = readFileSync(filePath, "utf-8");
    const data = JSON.parse(fileContent);
    
    if (!data.opportunities || !Array.isArray(data.opportunities)) {
      throw new Error("Invalid file format. Expected JSON with 'opportunities' array.");
    }
    
    // Add verification metadata to each opportunity
    const opportunitiesWithMeta = data.opportunities.map((opp: any) => ({
      ...opp,
      verified: true,
      lastVerified: new Date(),
      source: opp.source || "bulk-import",
    }));
    
    const result = await bulkImportOpportunities(opportunitiesWithMeta);
    console.log(`✅ Successfully imported ${result.insertedCount} opportunities`);
    console.log(`📊 Database now has ${result.insertedCount} new opportunities`);
    
    return result;
  } catch (error) {
    console.error("❌ Bulk import failed:", error);
    throw error;
  }
}

// Command line interface
const args = process.argv.slice(2);
if (args.length === 0) {
  console.log("Usage: npx tsx server/bulk-import.ts <path-to-json-file>");
  console.log("Example: npx tsx server/bulk-import.ts server/data-collection-template.json");
  process.exit(1);
}

const filePath = args[0];
bulkImportFromFile(filePath)
  .then(() => process.exit(0))
  .catch(() => process.exit(1));
