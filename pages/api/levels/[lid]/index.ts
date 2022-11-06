import { Level } from '.prisma/client'
import prisma from '../../../../lib/prisma'

export const getLevel_Prisma = async (lid: number | string) => {
  const data = await prisma.level.findUnique({
    where: {
      id: Number(lid),
    },
  })
  const json: Level = JSON.parse(JSON.stringify(data))
  return json
}

export default async function handle(req, res) {
  const { lid } = req.query
  if (req.method === 'GET') {
    const data = await getLevel_Prisma(lid)
    res.json(data)
  }
}

export const getLevel = async (lid: number | string | string[]) => {
  if (!lid) return null
  try {
    const response = await fetch(`/api/levels/${String(lid)}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    })
    const level: Level = await response.json()
    return level
  } catch (error) {
    console.error(error)
    return null
  }
}