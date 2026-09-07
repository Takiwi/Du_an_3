import { join } from "path";

export const PROTO_PATHS = {
  ANIME: join(__dirname, "../src/anime.proto"),
  AUTH: join(__dirname, "../src/auth.proto"),
  USER: join(__dirname, "../src/user.proto"),
};

export const PROTO_PACKAGES = {
  ANIME: "anime",
  AUTH: "auth",
  USER: "user",
};
