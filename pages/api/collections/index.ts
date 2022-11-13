import { Collection } from '@prisma/client'
import prisma from '../../../lib/prisma'

const getCollections_Prisma = async (): Promise<Collection[]> => {
  const data = await prisma.collection.findMany()
  const json = JSON.parse(JSON.stringify(data))
  return json
}

export default async function handle(req, res) {
  if (req.method === 'GET') {
    const data = await getCollections_Prisma()
    res.json(data)
  }
}

export const getCollections = async () => {
  try {
    const response = await fetch('/api/collections', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    })
    const data: Collection[] = await response.json()
    return data
  } catch (error) {
    console.error(error)
    return error
  }
}