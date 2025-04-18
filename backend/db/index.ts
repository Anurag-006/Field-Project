import mongoose from "mongoose";

const connectDB = async () => {
    try {
       const connectionName = process.env.MONGODB_URL + "/" + process.env.DB_NAME;
       const connectionInstance = await mongoose.connect(connectionName);
       console.log(`\n MONGODB CONNECTED!! AND THE DB HOST IS: ${connectionInstance.connection.host}`);
       
    } catch (error) {
        console.log("MONGODB CONNECTION FAILED: ", error);
        process.exit(1);
    }
}

export default connectDB;