import mongoose from "mongoose";

const MONGO_URI = process.env.MONGO_URI!;

if (!MONGO_URI) {
    throw new Error("Please define the MONGO_URI environment variable");
}

let cached = (global as any).mongoose;

if (!cached) {
    cached = (global as any).mongoose = { conn: null, promise: null };
}

export async function connect() {
    if (cached.conn) {
        return cached.conn;
    }

    if (!cached.promise) {
        cached.promise = mongoose.connect(MONGO_URI, {
            bufferCommands: false,
            serverSelectionTimeoutMS: 5000, 
        });
    }

    try {
        cached.conn = await cached.promise;
        console.log("MongoDB connected");
        return cached.conn;
    } catch (error) {
        console.error("MongoDB connection error:", error);
        cached.promise = null;
        throw error;
    }
}