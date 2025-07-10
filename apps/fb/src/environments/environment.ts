import devEnv from './environment.dev';
import productionEnv from './environment.prod';
import stagingEnv from './environment.stg';

let environment = devEnv;

if (process.env.NEXT_PUBLIC_APP_STAGE === 'staging') {
  environment = stagingEnv;
}

if (process.env.NEXT_PUBLIC_APP_STAGE === 'production') {
  environment = productionEnv;
}

export default environment;
