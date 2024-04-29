import { z } from "zod";

export const formLoginSchema = z.object({
    email: z.string().email('Please enter a valid email'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const formRegisterSchema = formLoginSchema.extend({
    username: z.string().min(3, 'Username must be at least 3 characters'),
})

export const createVideoSchema = z.object({
    title: z.string().min(3, 'Title must be at least 6 characters long'),
    prompt: z.string().min(3, 'Prompt must be at least 6 characters long'),
})
