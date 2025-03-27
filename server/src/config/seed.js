import mongoose from "mongoose";
import EmployeeUser from "../models/EmployeeUser.js";
import { seedEmployeeUsers } from "./seedData.js";
import connectToDB from "./connection.js";
import bcrypt from 'bcrypt';
import config from "../utility/configs.js";

const seed = async() => {
  try {
    // Connect to MongoDB
    await connectToDB();
    console.log("Connected to MongoDB");

    // Clear existing data
    await EmployeeUser.deleteMany({});
    console.log("Existing data cleared");

    // Hash and insert employee users
    const hashedSeedEmployeeUsers = await Promise.all(
      seedEmployeeUsers.map(async (user) => ({
        ...user,
        password: await bcrypt.hash(user.password, Number(config.SALT)),
      }))
    );
    const insertedUsers = await EmployeeUser.insertMany(hashedSeedEmployeeUsers);
    console.log(insertedUsers.length, "EmployeeUsers seeded");

  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    // Close the MongoDB connection
    await mongoose.connection.close();
    console.log('MongoDB connection closed');
  }
};

// Run seed function
seed();