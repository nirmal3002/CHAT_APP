import mongoose from "mongoose";

// function connect to the database 

export const connectDB=async()=>{
    try{
        mongoose.connection.on('connected',()=>console.log('databse connected'));
        await mongoose.connect(`{$process.env.MONGODB_URI}chat-app`)

    }catch(error){
        console.log("database is created this is the msg to show in the browser")
    }
}