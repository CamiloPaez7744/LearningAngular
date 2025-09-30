const { writeFileSync, mkdirSync } = require('fs');
require('dotenv').config();

const targetPath = './src/environments/environment.ts';
const targetPathDev = './src/environments/environment.development.ts';

const mapboxKey = process.env.MAPBOX_KEY;

if (!mapboxKey) {
  throw new Error('MAPBOX_KEY is not set in the environment variables');
}

const envConfigFile = `export const environment = {
  production: false,
  mapboxKey: '${mapboxKey}'
};
`;

mkdirSync('./src/environments', { recursive: true });

writeFileSync(targetPath, envConfigFile);
writeFileSync(targetPathDev, envConfigFile);
