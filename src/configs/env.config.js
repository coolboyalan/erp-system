import { configDotenv } from "dotenv";
import { cleanEnv, str, num } from "envalid";

configDotenv();

const env = cleanEnv(process.env, {
  PORT: num({ default: 3000 }),
  JWT_SECRET: str({ default: "jwtsecret" }),
  DB_NAME: str(),
  DB_USER: str(),
  DB_PASS: str(),
  DB_HOST: str(),
  DB_DIALECT: str(),
});

export default env;
