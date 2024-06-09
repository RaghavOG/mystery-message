import { create } from "domain";
import mongoose , { Schema , Document} from "mongoose";

// data ka type define krte hai general defination likhte hai data ka

export interface Message extends Document{ // mongoose ke document ka part hai
    content: string;
    createdAt: Date;
} // custom type define krte hai

const MessageSchema: Schema<Message> = new Schema({
    // sirf ye syntax type safety de rha hai 

    content:{
        type: String,
        required: true
    },
    createdAt:{
        type: Date,
        required: true,
        default: Date.now
    }
});


export interface User extends Document{ // mongoose ke document ka part hai
    username: string;
    email: string;
    password: string;
    verifyCode: string;
    verifyCodeExpiry: Date;
    isVerified: boolean;
    isAcceptingMessage: boolean;
    messages: Message[];
}

const UserSchema: Schema<User> = new Schema({
    // sirf ye syntax type safety de rha hai 

    username:{
        type: String,
        required: [true, "Username is required"],
        trim: true,
        unique: true
    },
    email:{
        type: String,
        required: [true, "Email is required"],
        unique: true,
        match: [/.+\@.+\..+/, "Please enter a valid email address"]
    },
    password:{
        type: String,
        required: [true, "Password is required"],
    },
    verifyCode:{
        type: String,
        required: [true, "Verification code is required"]
    },
    isVerified:{
        type: Boolean,
        default: false
    },
    verifyCodeExpiry:{
        type: Date,
        required: [true, "Verification code expiry is required"]
    },
    isAcceptingMessage:{
        type: Boolean,
        // required: true
        default: true
    },
    messages:[MessageSchema]
});


const UserModel = (mongoose.models.User as mongoose.Model<User>) || mongoose.model<User>("User", UserSchema);

export default UserModel;


// model user hai and data type User hai

// jo return data type aane wala hai wo mongoonse ke model ke type ka aayega jiska type User hona chahiye    