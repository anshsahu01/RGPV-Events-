import mongoose, { mongo } from "mongoose";

console.log("url", process.env.MONGO_DB_URL);



 const connectDB = async ()=>{
    try {
        mongoose.connection.on('connected',()=>console.log("Database Connected"))
      const conn = await mongoose.connect(process.env.MONGO_DB_URL, { dbName: "EvenMDB" });
       console.log(`MongoDB Connected: ${conn.connection.host}, Database: ${conn.connection.name}`);
    } catch (error) {
        console.log(error.message);
        throw error; 
    }
}

export default connectDB;

