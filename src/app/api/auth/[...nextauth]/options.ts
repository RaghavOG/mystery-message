import { NextAuthOptions } from 'next-auth';
// import Credentials from 'next-auth/providers/credentials';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import GitHubProvider from 'next-auth/providers/github';


import bcrypt from 'bcryptjs';
import dbConnect from '@/lib/dbConnect';
import UserModel from '@/model/User';

export const authOptions : NextAuthOptions = {
    providers:[
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        }),
        GitHubProvider({
            clientId: process.env.GITHUB_CLIENT_ID!,
            clientSecret: process.env.GITHUB_CLIENT_SECRET!,
        }),
        CredentialsProvider({
            id: 'credentials',
            name: 'Credentials',
            credentials:{
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials:any) :Promise<any>{
                await dbConnect();
               try{
                const user = await UserModel.findOne({$or:[
                    {
                        email: credentials.email
                    },
                    {
                        username: credentials.email
                    }
                ]})

                if(!user){
                    throw new Error("No user found with this email");

                }

                if (!user.isVerified){
                    throw new Error("User not verified");
                }

                const isPasswordCorrect = await bcrypt.compare(credentials.password, user.password);
                  
                if (isPasswordCorrect){
                    return user;

                }
                else{
                    throw new Error("Password is incorrect");
                }

            }
            catch(err :any){
                console.log(err);
                return null;
            }
        }}),
    ],

    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token._id = user._id?.toString();
                token.isVerified = user.isVerified;
                token.isAcceptingMessages = user.isAcceptingMessages;
                token.username = user.username;
            }
            return token;
        },
    // ab sessions and tokesn dono me data hai user ka baar baar query nahi karni padegi
        async session({ session, token }) {
            
            if(token){
                session.user._id = token._id;
                session.user.isVerified = token.isVerified;
                session.user.isAcceptingMessages = token.isAcceptingMessages;
                session.user.username = token.username;
            }
            return session;
        },
      
    },

    pages: {
        signIn: '/sign-in',
        
    },
    session: {
        strategy: 'jwt',
        
    }
};