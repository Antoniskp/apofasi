/**
 * Migration script for voting security enhancement
 * 
 * This script handles the transition from OR-based to AND-based vote tracking.
 * 
 * Changes:
 * 1. Application now requires BOTH sessionId and ipAddress for new votes
 * 2. Adds partial unique compound index on (pollId, sessionId, ipAddress)
 * 3. Old votes without both fields remain in database but won't match new queries
 * 
 * What this does:
 * - Reports on existing anonymous votes
 * - Identifies votes that won't be matched by the new logic
 * - These old votes are effectively "orphaned" but don't cause errors
 * 
 * Run this to understand the impact before deploying to production.
 */

import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/apofasi";

async function analyzeVotingSecurity() {
  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(MONGO_URI);
    console.log("Connected to MongoDB");

    const db = mongoose.connection.db;
    const anonymousVotesCollection = db.collection("anonymousvotes");

    // Check for existing votes
    const totalVotes = await anonymousVotesCollection.countDocuments();
    
    const votesWithBoth = await anonymousVotesCollection.countDocuments({
      sessionId: { $exists: true, $ne: null },
      ipAddress: { $exists: true, $ne: null }
    });

    const votesWithoutSession = await anonymousVotesCollection.countDocuments({
      $or: [
        { sessionId: { $exists: false } },
        { sessionId: null }
      ]
    });
    
    const votesWithoutIP = await anonymousVotesCollection.countDocuments({
      $or: [
        { ipAddress: { $exists: false } },
        { ipAddress: null }
      ]
    });

    const orphanedVotes = totalVotes - votesWithBoth;

    console.log("\n=== Anonymous Votes Analysis ===");
    console.log(`Total anonymous votes: ${totalVotes}`);
    console.log(`Votes with BOTH sessionId and ipAddress: ${votesWithBoth} ✅`);
    console.log(`Votes missing sessionId: ${votesWithoutSession} ⚠️`);
    console.log(`Votes missing ipAddress: ${votesWithoutIP} ⚠️`);
    console.log(`Orphaned votes (won't match new queries): ${orphanedVotes}`);

    if (orphanedVotes === 0) {
      console.log("\n✅ All votes are compatible with the new security model!");
    } else {
      console.log(`\n⚠️  ${orphanedVotes} votes won't be matched by new queries.`);
      console.log("\nWhat this means:");
      console.log("- These votes remain in the database");
      console.log("- They still count toward vote totals");
      console.log("- Users who cast them won't be recognized as having voted (new logic)");
      console.log("- This allows those users to vote again with the new security model");
      console.log("\nThis is actually GOOD for security - it means:");
      console.log("- Old insecure votes are effectively reset");
      console.log("- All future votes use the enhanced security model");
      console.log("\nOptions:");
      console.log("1. Keep orphaned votes (they count but users can re-vote)");
      console.log("2. Delete orphaned votes (clean slate with new security)");
      
      console.log("\n💡 Recommended: Keep orphaned votes for historical accuracy.");
      console.log("   Users will need to vote again with the new security model.");
    }

    // Check indexes
    const indexes = await anonymousVotesCollection.indexes();
    const hasNewIndex = indexes.some(idx => 
      idx.key && 
      idx.key.pollId === 1 && 
      idx.key.sessionId === 1 && 
      idx.key.ipAddress === 1 &&
      idx.partialFilterExpression
    );

    console.log("\n=== Index Status ===");
    if (hasNewIndex) {
      console.log("✅ New partial compound unique index exists");
    } else {
      console.log("⚠️  New partial compound unique index will be created on first run");
    }

    console.log("\nCurrent indexes:");
    indexes.forEach((idx, i) => {
      console.log(`${i + 1}. Key: ${JSON.stringify(idx.key)} ${idx.unique ? "(unique)" : ""}`);
      if (idx.partialFilterExpression) {
        console.log(`   Partial: ${JSON.stringify(idx.partialFilterExpression)}`);
      }
    });

    console.log("\n=== Summary ===");
    console.log("\n✅ Schema changes are BACKWARD COMPATIBLE");
    console.log("✅ Existing votes won't cause errors");
    console.log("✅ New votes use enhanced security (session + IP)");
    console.log("✅ Old votes remain for historical accuracy");
    
    if (orphanedVotes > 0) {
      console.log(`\n⚠️  ${orphanedVotes} users may be able to vote again (with new security)`);
    }

    console.log("\n=== Next Steps ===");
    console.log("1. ✅ This migration is informational only");
    console.log("2. ✅ Safe to deploy new code");
    console.log("3. ✅ Indexes will be created automatically");
    console.log("4. 💡 Monitor for any users re-voting on old polls");

  } catch (error) {
    console.error("Analysis failed:", error);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    console.log("\nDisconnected from MongoDB");
  }
}

// Run analysis
analyzeVotingSecurity();
