import mongoose from "mongoose";

type ConnectionObject = {   
    isConnected?: number;
}

const connection: ConnectionObject = {};

// void means matlab nhi hai kis type ka data return hoga

async function dbConnect() : Promise<void> {
    if (connection.isConnected) {
        console.log("Already connected to MongoDB");
        return;
    }
    // connection check krna hai ki kya already connection hai ya nahi

    try {
        const db = await mongoose.connect(process.env.MONGODB_URI ||" ", {});
    
        connection.isConnected = db.connections[0].readyState;
        console.log("Connected to MongoDB");


    } catch (error) {
        console.log("Error connecting to MongoDB: ", error);
        process.exit(1);
    }
}


export default dbConnect;