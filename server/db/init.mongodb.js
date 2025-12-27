// MongoDB initialization script for the apofasi server.
// Run with: mongosh < server/db/init.mongodb.js

// Connect to the target database (change URI via environment if needed).
const uri = process.env.MONGO_URI || "mongodb://localhost:27017/apofasi";
const db = connect(uri);
const dbName = db.getName();
print(`Connected to ${uri} (db: ${dbName})`);

// Ensure collections exist.
const ensureCollection = (name) => {
  const existing = db.getCollectionNames();
  if (!existing.includes(name)) {
    db.createCollection(name);
  }
};

ensureCollection("users");
ensureCollection("polls");
ensureCollection("news");

// Users indexes
db.users.createIndex({ provider: 1, providerId: 1 }, { unique: true, sparse: true });
db.users.createIndex({ username: 1 }, { unique: true, sparse: true });
db.users.createIndex({ email: 1 }, { unique: true, sparse: true });

// Polls indexes (helper for ownership and vote lookups).
db.polls.createIndex({ createdBy: 1 });
db.polls.createIndex({ votedUsers: 1 });

// News indexes (helper for author lookups).
db.news.createIndex({ author: 1 });

print("Database initialization complete.");
