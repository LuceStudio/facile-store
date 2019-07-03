import Hapi from '@hapi/hapi';
import Inert from '@hapi/inert';
import Vision from '@hapi/vision';
import HapiSwagger from 'hapi-swagger';
import routes from './parts/routes.js';
import pj from './pj.cjs';

//Keeping these in as a reference to support http2
// import http2 from 'http2';
// import {readFileSync} from 'fs';

// const options = {
//     key: readFileSync('server.key'),
//     cert: readFileSync('server.crt')
// }

const server = Hapi.server({
  // listener: http2.createServer(options),
  port: process.env.PORT || 8001,
  routes: {
    cors: {
      origin: ['http://localhost:8000']
    }
  }
});

const init = async () => {
  await server.register([
    Inert,
    Vision,
    {
      plugin: HapiSwagger,
      options: {
        info: {
          title: 'Facile APIs',
          version: pj.version
        }
      }
    }
  ]);
  routes(server);
  await server.start();
  console.log(`Server running at: ${server.info.uri}`);
};

process.on('unhandledRejection', err => {
  console.error(err);
  process.exit(1);
});

init();
