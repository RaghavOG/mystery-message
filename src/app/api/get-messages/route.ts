import dbConnect from "@/lib/dbConnect";

import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import UserModel from "@/model/User";
import {User} from "next-auth";
import mongoose, { mongo } from "mongoose";


export async function GET(request :Request) {
    await dbConnect();
    const session = await getServerSession(authOptions);
    const user : User = session?.user as User;

    if (!session || !session.user){
        return Response.json({
            success: false,
            message: "Unauthorized",
        },{
            status: 401,
        });
    }
    const useId = new mongoose.Types.ObjectId(user._id);
// aggregation pipeline
    try {
        const user = await UserModel.aggregate([
            { $match: {_id: useId}},
            {$unwind: "$messages"},   
            {$sort: {"messages.createdAt": -1}},
            {$group: {
                _id: "$_id",
                messages: {$push: "$messages"}
            }}   
            
        ])
         
        if(!user || user.length === 0){
            return Response.json({
                success: false,
                message: "User not found",
            },{
                status: 404,
            });
        }
        return Response.json({
            success: true,
            message: user[0].messages,
           
        },{
            status: 200,
        });




    } catch (error) {
        console.log("failed to get user messages")
        return Response.json({
            success: false,
            message: "Failed to get user messages",
        },{
            status: 500,
        });
    }

}