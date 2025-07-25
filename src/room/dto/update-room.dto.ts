import { createRoomSchema } from './create-room.dto';
import { ZodValidationPipe } from 'nestjs-zod';
import { z } from 'zod';

export const updateRoomSchema = createRoomSchema.partial();

export const UpdateRoomValidationPipe = new ZodValidationPipe(createRoomSchema);
export type TUpdateRoom = z.infer<typeof updateRoomSchema>;