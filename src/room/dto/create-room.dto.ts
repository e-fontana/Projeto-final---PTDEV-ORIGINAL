import { ZodValidationPipe } from 'nestjs-zod';
import { z } from 'zod';

export const createRoomSchema = z.object({
    name: z.string().min(1, 'Name is required'),

    maxCapacity: z
        .number({ required_error: 'Max Capacity must be a number' })
        .int({ message: 'Max Capacity must be an integer' })
        .min(1, { message: 'Max Capacity must be greater than 0' }),

    description: z.string().min(1, 'Description is required'),

    isActive: z.boolean().default(true),
})

export const CreateRoomValidationPipe = new ZodValidationPipe(createRoomSchema);
export type TCreateRoom = z.infer<typeof createRoomSchema>