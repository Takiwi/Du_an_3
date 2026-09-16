import z from "zod";

export const createdAnimeEventSchema = (version: number) => {
  return z.object({
    event: z.literal("anime.created"),
    version: z.literal(version),
    data: {
      id: z.uuidv4(),
      title: z.string(),
      season: z.enum(["Spring", "Summer", "Fall", "Winter"]),
      categories: z.array(z.string()),
      status: z.enum(["COMING_SOON", "CURRENT_SHOWING", "COMPLETED"]),
      type: z.enum(["TV_SHOW", "MOVIE", "OVE", "SPECIAL"]),
      views: z.number(),
      rating: z.number(),
      releaseDate: z.date(),
      isPublished: z.boolean(),
    },
  });
};

export type CreatedAnimeEvent = z.infer<typeof createdAnimeEventSchema>;
