import { z } from 'zod';

export const emailSchema = z.object({
  email: z
    .string({
      required_error: 'Email is required',
      invalid_type_error: 'Email must be a string',
    })
    .email({ message: 'Invalid email address' }),
});

export const messageSchema = z.object({
  id: z.string(),
  senderId: z.string(),
  text: z.string(),
  timeStamp: z.number(),
});

export const messageListSchema = z.array(messageSchema);

export type Message = z.infer<typeof messageSchema>;
