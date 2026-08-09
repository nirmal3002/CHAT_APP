import express from "express";
import "dotenv/config";
import cors from "cors";
import http from "http";
import { connectDB } from "./lib/db";
import userRouter from "./routes/userRoutes";
import messageRouter from "./routes/messageRoutes";
import { server }from "socket.io"
import { use } from "react";

const app=express();
const server=http.createServer(app)
//initialize socket.io server
export const io=new server(server, {cors:{origin:"*"}
})

//store online users
export const userSocketMap={};

//socket.io connection handler

io.on("connection",(socket)=>{
    const userId=socket.handshake.query.userId;
    console.log(userId);

    if(userId) userSocketMap[userId]=socket.id;


    io.emit("getOnlineUsers",Object.keys(UserSocketMap));

    socket.on("disconnect",()=>{
          console.log("user disconnected ",userId);
          delete userSocketMap[userId]
          io.emit("getOnlineUsers",Object.keys(userSocketMap))
    })
})

//middleware setup
app.use(express.json({limit:"4mb"}));
app.use(cors());
//routes setup
app.use("/api/status",(req,res)=>res.send("server is live"));
app.use("/api/auth",userRouter);
app.use("/api/messages",messageRouter)
//connect to mongodb

await connectDB();

const PORT=process.env.PORT||5000;
server.listen(PORT,()=>console.log("aerver is running on the port:"+PORT));