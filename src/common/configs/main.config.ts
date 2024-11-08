import env from 'env-var';
import 'dotenv/config';

export const mainConfig = {
  port: env.get('BACKEND_PORT').required().asPortNumber(),
  ml_url: env.get('ML_URL').asString(),
};
