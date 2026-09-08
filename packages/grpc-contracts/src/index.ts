import { join } from "path";

export const PROTO_PATHS = {
  ANIME: join(__dirname, "../src/proto/anime.proto"),
  AUTH: join(__dirname, "../src/proto/auth.proto"),
  USER: join(__dirname, "../src/proto/user.proto"),
};

export const PROTO_PACKAGES = {
  ANIME: "anime",
  AUTH: "auth",
  USER: "user",
};

export * from "./mapper/gRPCError.mapper";
