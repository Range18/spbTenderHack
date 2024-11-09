import env from 'env-var';
import 'dotenv/config';

export const mainConfig = {
  port: env.get('BACKEND_PORT').required().asPortNumber(),
  mlUrl: env.get('ML_URL').asString(),
  apiBaseUrl: env.get('API_BASE_URL').required().asString(),
};
