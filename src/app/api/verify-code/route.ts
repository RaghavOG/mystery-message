import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";

import {z} from "zod";

export async function POST(request :Request) {
    await dbConnect();
    try {
        const {username, code} = await request.json();
        // const {username, code, token} = await request.json();
        
        // if (!token) {
        //     return Response.json({
        //         success: false,
        //         message: "Unauthorized Access",
        //     },{
        //         status: 404,
        //     });
        // }
        // const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const decodedUsername = decodeURIComponent(username);
        const user = await UserModel.findOne({ username: decodedUsername });

        if (!user) {
            return Response.json({
                success: false,
                message: "User not found",
            },{
                status: 404,
            });
        }

        const isCodeValid = user.verifyCode == code;
        const isCodeNotExpired = new Date(user.verifyCodeExpiry) > new Date();
        
        if(isCodeValid && isCodeNotExpired) {
            user.isVerified = true;
            await user.save();

            return Response.json({
                success: true,
                message: "User Verified",
            });
        }
        else if (!isCodeNotExpired) {
            return Response.json({
                success: false,
                message: "Code Expired",
            },{
                status: 400,
            });
        }
        else {
            return Response.json({
                success: false,
                message: "Invalid Code",
            },{
                status: 400,
            });
        }



    } catch (error) {
        console.error("Error Verifying User",error);
        return Response.json({
            success: false,
            message: "Error Verifying User",
        },{
            status: 500,
        });
    }
}
