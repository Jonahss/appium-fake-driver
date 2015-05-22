// transpile:main

import yargs from 'yargs';
import { asyncify } from 'asyncbox';
import { FakeDriver } from './lib/driver';
import { startServer } from './lib/server';

const DEFAULT_HOST = "localhost";
const DEFAULT_PORT = 4774;

async function main () {
  let port = yargs.argv.port || DEFAULT_PORT;
  let host = yargs.argv.host || DEFAULT_HOST;
  return startServer(port, host);
}

if (require.main === module) {
  asyncify(main);
}

export { FakeDriver, startServer };

