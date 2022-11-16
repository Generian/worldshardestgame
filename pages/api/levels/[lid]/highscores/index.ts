import { Replay } from '.prisma/client'
import prisma from '../../../../../lib/prisma'

export type Highscore = (Replay & {
  author: {
      name: string;
  };
})

const getHighscores_Prisma = async (lid: number | string, limit: number | string = 10): Promise<Highscore[]> => {
  const notes = await prisma.replay.findMany({
    where: {
      levelId: Number(lid)
    },
    orderBy: [
      {
        length: 'asc',
      },
    ],
    take: Number(limit),
    include: {
      author: {
        select: {
          name: true
        },
      },
    },
  });
  const json = JSON.parse(JSON.stringify(notes))
  return json
}

export default async function handle(req, res) {
  const { lid, limit } = req.query
  if (req.method === 'GET') {
    const data = await getHighscores_Prisma(lid, limit)
    res.json(data)
  }
}

export const getHighscores = async (lid: number | string | string[], limit?: number | string | string[]) => {
  if (!lid) return null
  try {
    const response = await fetch(`/api/levels/${String(lid)}/highscores?limit=${limit}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    })
    const data = await response.json()
    return data as Highscore[]
  } catch (error) {
    console.error(error)
    return null
  }
}