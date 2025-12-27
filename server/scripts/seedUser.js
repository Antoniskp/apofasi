import mongoose from "mongoose";
import readline from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";
import crypto from "node:crypto";
import User from "../models/User.js";

const hashPassword = (password) => {
  const salt = crypto.randomBytes(16).toString("hex");
  const derivedKey = crypto.scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${derivedKey}`;
};

const normalizeEmail = (email) => String(email || "").trim().toLowerCase();

const askUntilValid = async (rl, prompt, validate) => {
  while (true) {
    const answer = (await rl.question(prompt)).trim();
    const validation = validate(answer);
    if (validation === true) return answer;
    console.log(validation);
  }
};

const ensureConnection = async () => {
  const uri = process.env.MONGO_URI || "mongodb://localhost:27017/apofasi";
  await mongoose.connect(uri, { dbName: "apofasi" });
  return uri;
};

const main = async () => {
  const rl = readline.createInterface({ input, output });

  try {
    const uri = await ensureConnection();
    console.log(`Connected to ${uri}`);

    const email = await askUntilValid(rl, "User email: ", (value) => {
      const normalized = normalizeEmail(value);
      if (!normalized) return "Email is required.";
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalized)) return "Please enter a valid email.";
      return true;
    });

    const displayName = await rl.question("Display name (optional): ");

    const password = await askUntilValid(
      rl,
      "Password (min 8 chars): ",
      (value) => (value.length >= 8 ? true : "Password must be at least 8 characters.")
    );

    const normalizedEmail = normalizeEmail(email);
    const existing = await User.findOne({ email: normalizedEmail });

    if (existing) {
      console.log("A user with this email already exists.");
      return;
    }

    const user = await User.create({
      provider: "local",
      email: normalizedEmail,
      displayName: displayName.trim() || normalizedEmail.split("@")[0],
      password: hashPassword(password)
    });

    console.log(`User created with id: ${user._id}`);
  } catch (error) {
    console.error("Failed to create user:", error.message);
  } finally {
    await mongoose.disconnect();
    rl.close();
  }
};

main();
