import "dotenv/config";
import { externalAPI } from "./external-apis";

async function testExternalAPI() {
  console.log("🧪 Testing External API Integration...\n");
  
  try {
    // Test 1: Fetch internships with keyword
    console.log("Test 1: Fetching internships for 'software'...");
    const internships = await externalAPI.fetchInternships("software", 10);
    console.log(`✅ Found ${internships.length} internships`);
    
    if (internships.length > 0) {
      console.log("\nSample internship:");
      console.log(JSON.stringify(internships[0], null, 2));
    }
    
    // Test 2: Search opportunities
    console.log("\n\nTest 2: Searching opportunities for 'engineering'...");
    const opportunities = await externalAPI.searchOpportunities("engineering", "Internships");
    console.log(`✅ Found ${opportunities.length} opportunities`);
    
    // Test 3: Import to database
    if (opportunities.length > 0) {
      console.log("\n\nTest 3: Importing to database...");
      const result = await externalAPI.importToDatabase(opportunities.slice(0, 3), "test-api");
      console.log(`✅ Imported ${result.insertedCount} opportunities`);
    }
    
    console.log("\n\n✅ All tests completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("\n❌ Test failed:", error);
    process.exit(1);
  }
}

testExternalAPI();
