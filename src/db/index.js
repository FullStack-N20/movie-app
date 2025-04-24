import { connect } from "mongoose";

export const connectDB = async () => {
    try {
        await connect(process.env.MONGO_URL);
        console.log("Database connect")
    } catch (e) {
        console.log("Error connection to MongoDB");
    }
}