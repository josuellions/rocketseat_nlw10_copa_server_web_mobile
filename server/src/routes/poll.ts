import { FastifyInstance } from "fastify";
import ShortUniqueId from "short-unique-id";
import { prisma } from "../lib/prisma";
import { z } from 'zod';
import { authenticate } from "../plugins/authenticate";

export async function pollRoutes(fastify: FastifyInstance) {
  fastify.get('/polls/count', async () => {

    /*const pools = await prisma.pool.findMany({
      where: {
        code: {
          startsWith: 'N'
        }
      }
    })

    return {pools}*/
    const count = await prisma.pool.count();

    return {count}
  })

  fastify.post('/polls', async (request, replay) => {
    const createPoolBody = z.object({
      title:  z.string(),
    })
    const { title } = createPoolBody.parse(request.body);

    const generete = new ShortUniqueId({ length: 6 })
    const code = String(generete()).toUpperCase();

    try {
      await request.jwtVerify();
      //console.log('>>TRY', request.user.sub)
      await prisma.pool.create({
        data: {
          title,
          code,
          ownerId: request.user.sub,

          participants: {
            create: {
              userId: request.user.sub
            }
          }
        }
      })
    } catch {
      await prisma.pool.create({
        data: {
          title,
          code
        }
      })
    }

    return replay.status(201).send({code})
  })

  /* Route para participar de um bolão */
  fastify.post('/polls/join',{
    onRequest: [authenticate]
  }, async (request, replay) => {
    const joinPollBody = z.object({
      code: z.string()
    })

    const { code } = joinPollBody.parse(request.body);

    const poll = await prisma.pool.findUnique({
      where: {
        code,
      },
      include: {
        participants: {
          where: {
            userId: request.user.sub
          }
        }
      }
    })
    
    if(!poll) {
      return replay.status(400).send({
        message: 'Poll not found!'
      })
    }

    if(poll.participants.length > 0) {
      return replay.status(400).send({
        message: 'You already joined this poll.'
      })
    }

    /*Atualiza o bolão que não tem dono, para o primeiro usuário que acessar bolão */
    if(!poll.ownerId) {
      await prisma.pool.update({
        where: {
          id: poll.id
        },
        data: {
          ownerId: request.user.sub
        }
      })
    }

    await prisma.participant.create({
      data: {
        poolId: poll.id,
        userId: request.user.sub
      }
    })

    return replay.status(201).send();
  })

  /* Route de listagem dos bolões */
  fastify.get('/polls', {
    onRequest: [authenticate]
  }, async (request) => {
    
    const polls = await prisma.pool.findMany({
      where:{
        participants: {
          some: { //busca por pelo menos um participante que tenha usuário logado
            userId: request.user.sub
          }
        }
      },
      include: {
        //owner: true //Retorna todos os dados
        owner: {
          select: {
            id: true,
            name: true
          }
        },
        _count: {
          select: {
            participants: true
          }
        },
        participants: {
          select: {
            id: true,

            user: {
              select: {
                avatarUrl: true,
              }
            }
          },
          take: 4, //Retorna o primeiros quatro participantes da lista
        }
      }
    })

    return { polls }
  })

  /* Route para retornar detalhes do bolões */
  fastify.get('/polls/:id', {
    onRequest: [authenticate]
  }, async (request) => {
    const getPollParams = z.object({
      id: z.string(),
    })

    const { id } = getPollParams.parse(request.params)

    const poll = await prisma.pool.findFirst({
      where:{
        id,
      },
      include: {
        //owner: true //Retorna todos os dados
        owner: {
          select: {
            id: true,
            name: true
          }
        },
        _count: {
          select: {
            participants: true
          }
        },
        participants: {
          select: {
            id: true,

            user: {
              select: {
                name: true,
                avatarUrl: true,
              }
            }
          },
          take: 4, //Retorna o primeiros quatro participantes da lista
        }
      }
    })

    return { poll }
  })
}
