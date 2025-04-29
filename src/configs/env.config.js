import { configDotenv } from "dotenv";
import { cleanEnv, str, num } from "envalid";

configDotenv();

const env = cleanEnv(process.env, {
  PORT: num({ default: 3000 }),
  JWT_SECRET: str({ default: "jwtsecret" }),
});

export default env;
