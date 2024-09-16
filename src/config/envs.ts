import 'dotenv/config';
import * as joi from 'joi';
import { IEnvs } from './interfaces';

const envSchema = joi
  .object({
    STAGE: joi.string().required(),
    APP_VERSION: joi.string().required(),
    PORT: joi.number().required(),
    DB_HOST: joi.string().required(),
    DB_PORT: joi.number().required(),
    DB_USER: joi.string().required(),
    DB_PASSWORD: joi.string().required(),
    DB_NAME: joi.string().required(),
    DB_SYNCHRONIZE: joi.boolean().required(),
  })
  .unknown(true);

const { error, value } = envSchema.validate(process.env);

if (error) throw new Error(`Config validation error: ${error.message}`);

const envVars: IEnvs = value;

export const envs = {
  stage: envVars.STAGE,
  appVersion: envVars.APP_VERSION,
  port: envVars.PORT,
  dbHost: envVars.DB_HOST,
  dbPort: envVars.DB_PORT,
  dbUser: envVars.DB_USER,
  dbPassword: envVars.DB_PASSWORD,
  dbName: envVars.DB_NAME,
  dbSynchronize: envVars.DB_SYNCHRONIZE,
};
