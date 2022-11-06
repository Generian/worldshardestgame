import { Level } from '.prisma/client'
import prisma from '../../../lib/prisma'

export const getLevels_Prisma = async (): Promise<Level[]> => {
  const data = await prisma.level.findMany()
  const json = JSON.parse(JSON.stringify(data))
  return json
}

export default async function handle(req, res) {
  if (req.method === 'GET') {
    const notes = await getLevels_Prisma()
    res.json(notes)
  }
}

export const getLevels = async () => {
  try {
    const response = await fetch('/api/levels', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    })
    const data: Level[] = await response.json()
    return data
  } catch (error) {
    console.error(error)
    return null
  }
}