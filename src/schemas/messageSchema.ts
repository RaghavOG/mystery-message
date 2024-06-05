import {z} from 'zod';

export const messageSchema = z.object({

    content: z.string()
    .min(10, {message: "Message must contain atleast 10 character"})
    .max(300, {message: "Message must contain atmost 500 characters"})
 
})
