import { z } from 'zod';

export const configurationSchema = z.object({
    url: z.string().url().refine(url => url.startsWith('https://github.com') || url.startsWith('https://gitlab.com')),
    directory: z.string().min(1),
    install: z.string().min(1),
    build: z.string().min(1),
    output: z.string().min(1)
})