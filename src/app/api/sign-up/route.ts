import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";
import { hash } from "crypto";

export async function POST(reqest :Request) {
    await dbConnect();
    
    try {
        const {username , email, password}= await reqest.json();

      const existingUserVerifiedByUsername = await UserModel.findOne({username, isVerified: true});

      if (existingUserVerifiedByUsername){
            return Response.json({
                success: false,
                message: "Username already exists. Please try another one.",
            },
            {
                status: 400,
            }
            );
      }

      const existingUserByEmail =  await UserModel.findOne({email});

      const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();

      let user;


        if(existingUserByEmail){
                if(existingUserByEmail.isVerified){
                    return Response.json({
                        success: false,
                        message: "Email already exists. Please try another one.",
                    },
                    {
                        status: 400,
                    }
                    );
                }
                else{

                    const hashedPassword = await bcrypt.hash(password, 12);
                    existingUserByEmail.password = hashedPassword;
                    existingUserByEmail.verifyCode = verifyCode;
                    existingUserByEmail.verifyCodeExpiry = new Date();
                    existingUserByEmail.verifyCodeExpiry.setHours(existingUserByEmail.verifyCodeExpiry.getHours() + 1);
                    await existingUserByEmail.save();
                    let user;
                }
     
      }
      else{
            const hashedPassword = await bcrypt.hash(password, 12);

            const expiryDate = new Date();
            expiryDate.setHours(expiryDate.getHours() + 1);

            const newUser = new UserModel({
                username,
                email,
                password: hashedPassword,
                verifyCode,
                verifyCodeExpiry: expiryDate,
                isVerified: false,
                isAcceptingMessages: true,
                messages: [],

            });
            
            await newUser.save();
            user = newUser;
      }

      const token = jwt.sign({ userId: user._id }, "process.env.JWT_SECRET", { expiresIn: '1h' });

        // send verification email
        const emailResponse = await sendVerificationEmail(email, username, verifyCode);

        if(!emailResponse.success){
            return Response.json({
                success: false,
                message: emailResponse.message,
            },
            {
                status: 500,
            }
            );
        }
          
        return Response.json({
            success: true,
            message: "User created successfully. Please verify your email to login.",
        },
        {
            status: 201,
        }
        );


    } catch (error) {
        console.error("Error in sign-up route: ", error);
        return Response.json({
           success: false,
              message: "An error occurred. Please try again later.",
        },
        {
            status: 500,
        
        }
    );
    }

}


// jab bhi deta request json se to AWAIT lgana hi lgana pdega