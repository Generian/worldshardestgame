import { Level } from '.prisma/client'
import prisma from '../../../../lib/prisma'

export const getLevel = async (lid: number | string) => {
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
    const data = await getLevel(lid)
    res.json(data)
  }
}