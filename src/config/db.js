import mongoose from "mongoose";

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("MongoDB Connected successfully!");
    } catch (err) {
        console.error(err,"db error");
    }
};

export default connectDB;