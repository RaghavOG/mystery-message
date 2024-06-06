import dbConnect from "@/lib/dbConnect";

import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import UserModel from "@/model/User";
import {User} from "next-auth";

export async function POST(request :Request) {
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
    const useId = user._id;
    const {acceptMessages} = await request.json();

    try {
        
        const updatedUser = await UserModel.findOneAndUpdate(
            {_id: useId}, //
            {isAcceptingMessage: acceptMessages},
            {new: true}
        );
        if(!updatedUser){
            return Response.json({
                success: false,
                message: "User not found",
            },{
                status: 404,
            });
        }
        return Response.json({
            success: true,
            message: "User accept messages updated",
            updatedUser,
        },{
            status: 200,
        });


    } catch (error) {
        console.log("failed to update user accept messages")
        return Response.json({
            success: false,
            message: "Failed to update user accept messages",
        },{
            status: 500,
        });
    }

}

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
    const userId = user._id;
    
try {
    const foundUser = await UserModel.findById(userId);
    if(!foundUser){
        return Response.json({
            success: false,
            message: "User not found",
        },{
            status: 404,
        });
    }

    return Response.json({
        success: true,
        isAcceptingMessage: foundUser.isAcceptingMessage,
        
    },{
        status: 200,
    });

 
        
      
}
catch (error) {
    console.log("failed to get user accept messages")
    return Response.json({
        success: false,
        message: "error in getting user accept messages status",
    },{
        status: 500,
    });
}

}