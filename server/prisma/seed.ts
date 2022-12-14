/* Popular tabela com dados iniciais */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.create({
    data: {
      name: 'John Doe',
      email: 'john.doe@email.com',
      avatarUrl: 'https://github.com/josuellions.png'
    }
  })

  const pool = await prisma.pool.create({
    data: {
      title: 'Example Pool',
      code: 'BOL123',
      ownerId: user.id,

      participants: { //Criar participante ao criar o POOL
        create: {
          userId: user.id
        }
      }
    }
  })

  await prisma.game.create({
    data: {
      date: '2022-11-02T12:00:00.201Z',
      firstTeamCountryCode: 'BR',
      secondTeamCountryCode: 'DE'
    }
  })

  await prisma.game.create({
    data: {
      date: '2022-11-03T16:00:00.201Z',
      firstTeamCountryCode: 'BR',
      secondTeamCountryCode: 'AR',

      guesses: {
        create: {
         firstTeamPoints: 2,
         secondTeamPoints: 1,
         
         participant: {
          connect: {
            userId_poolId: {
              userId: user.id,
              poolId: pool.id
            }
          }
         }
        }
      }
    }
  })
}

main();