import { z } from "zod";
import { prisma } from "../lib/prisma";
import { FastifyInstance } from "fastify";
import { authenticate } from "../plugins/authenticate";

export async function gameRoutes(fastify: FastifyInstance) {
  fastify.get('/polls/:id/games',{
    onRequest: [authenticate],
  }, async (request) => {
    const getPollParams = z.object({
      id: z.string()
    })

    const { id } = getPollParams.parse(request.params)

    const games = await prisma.game.findMany({
      orderBy: {
        date: 'desc'
      },
      include: {
        guesses: {
          where: {
            participant: {
              userId: request.user.sub,
              poolId: id
            }
          }
        }
      }
    })

    const formatGames = games.map(game => {
      return {
        ...game,
        guess: game.guesses.length > 0 ? game.guesses[0] : null,
        guesses: undefined
      }
    })

    return { games: formatGames }
  })
}