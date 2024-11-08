import env from 'env-var';

export const mainConfig = {
  host: env.get('BACKEND_HOST').required().asString(),
  port: env.get('BACKEND_PORT').required().asPortNumber()
}