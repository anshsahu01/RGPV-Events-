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

// // config/Db.js
// import mongoose from 'mongoose';

// const connectDB = async () => {
//   try {
//     // YEH LINE ADD KAREIN 👇
//     console.log("Connecting to MongoDB with URI:", process.env.MONGO_URI);

//     const conn = await mongoose.connect(process.env.MONGO_URI);
    
//     // Aur yeh line bhi add kar dein 👇
//     console.log(`✅ MongoDB Connected: ${conn.connection.host}, Database: ${conn.connection.name}`);
    
//   } catch (error) {
//     console.error(`❌ Error connecting to MongoDB: ${error.message}`);
//     process.exit(1);
//   }
// };

// export default connectDB;