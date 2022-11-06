import Fastify from 'fastify';
import cors from '@fastify/cors';
import jwt from '@fastify/jwt';

import { authRoutes } from './routes/auth';
import { userRoutes } from './routes/user';
import { pollRoutes } from './routes/poll';
import { gameRoutes } from './routes/game';
import { guessRoutes } from './routes/guess';

import Env, { EnvKeys} from '@lib/env';

async function bootstrap() {
  const fastify = Fastify({
    logger: true
  })

  await fastify.register(cors, {
    origin: true
  })

  //Em produção criar variavel ambiente para chave secret
  await fastify.register(jwt, {
    secret: Env.str(EnvKeys.TOKEN_SECRET_JWT)
  })

  await fastify.register(authRoutes)
  await fastify.register(userRoutes)
  await fastify.register(pollRoutes)
  await fastify.register(gameRoutes)
  await fastify.register(guessRoutes)

  //await fastify.listen({port: 3333})
  await fastify.listen({port: Number(Env.str(EnvKeys.API_PORT_SERVER)), host: '0.0.0.0'})
}

bootstrap();