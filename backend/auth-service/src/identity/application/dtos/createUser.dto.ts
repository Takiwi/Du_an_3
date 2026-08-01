import zod from 'zod';

export const CreateUserSchema = zod.object({
  email: zod.email(),
  username: zod.string().min(2),
  password: zod.string().min(6),
});

export type CreateUserDto = zod.infer<typeof CreateUserSchema>;
