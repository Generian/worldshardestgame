import { Level } from '.prisma/client'
import prisma from '../../../lib/prisma'

export type LevelWithAuthor = (Level & {
  author: {
      name: string;
  };
})

const getLevels_Prisma = async (): Promise<LevelWithAuthor[]> => {
  const data = await prisma.level.findMany({
    include: {
      author: {
        select: {
          name: true
        },
      },
    },
  })
  const json = JSON.parse(JSON.stringify(data))
  return json
}

const createLevel_Prisma = async (levelData: Level): Promise<Level> => {
  const newLevel = await prisma.level.create({
    data: levelData
  })
  return newLevel
}

export default async function handle(req, res) {
  if (req.method === 'GET') {
    const notes = await getLevels_Prisma()
    res.json(notes)
  } else if (req.method === 'POST') {
    if (req.body) {
      const result = await createLevel_Prisma(req.body)
      res.json(result)
    } else {
      res.status(500).send({ error: 'failed to fetch data' })
    }
  }
}

export const getLevels = async () => {
  try {
    const response = await fetch('/api/levels', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    })
    const data: LevelWithAuthor[] = await response.json()
    return data
  } catch (error) {
    console.error(error)
    return error
  }
}

export const createLevel = async (levelData: Omit<Level, "id">) => {
  try {
    const response = await fetch('/api/levels', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(levelData)
    })
    const data: Level = await response.json()
    return data
  } catch (error) {
    console.error(error)
    return error
  }
}