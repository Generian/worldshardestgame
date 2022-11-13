import { Collection, LevelsOnCollection } from '@prisma/client'
import prisma from '../../../../lib/prisma'

export const getCollection_Prisma = async (cid: number | string) => {
  const data = await prisma.levelsOnCollection.findMany({
    where: {
      collectionId: Number(cid),
    }
  })
  const json: LevelsOnCollection[] = JSON.parse(JSON.stringify(data))
  return json
}

export default async function handle(req, res) {
  const { cid } = req.query
  if (req.method === 'GET') {
    const data = await getCollection_Prisma(cid)
    res.json(data)
  }
}

export const getCollection = async (cid: number | string | string[]) => {
  if (!cid) return null
  try {
    const response = await fetch(`/api/collections/${String(cid)}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    })
    const collection: LevelsOnCollection[] = await response.json()
    return collection
  } catch (error) {
    console.error(error)
    return null
  }
}