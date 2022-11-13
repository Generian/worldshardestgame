import { CollectionReplay } from '@prisma/client';
import prisma from '../../../lib/prisma'

const saveCollectionReplay_Prisma = async (
  collectionId: number | string | string[],
  authorId: number | string | string[],
  deaths: number | string | string[],
) => {
  const res = await prisma.collectionReplay.create({
    data: {
      collectionId: Number(collectionId),
      authorId: Number(authorId),
      deaths: Number(deaths),
    },
  })
  return res
}

export default async function handle(req, res) {
  if (req.method === 'POST') {
    const { collectionId, authorId, deaths } = req.body;
    const result = await saveCollectionReplay_Prisma(collectionId, authorId, deaths)
    res.json(result)
  }
}

export const saveCollectionReplay = async (
  collectionId: number | string | string[],
  authorId: number | string | string[],
  deaths: number | string | string[],
) => {
  try {
    let result = await fetch(`/api/collectionreplays`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        collectionId,
        authorId,
        deaths
      })
    })
    const data: CollectionReplay = await result.json()
    return data
  } catch (error) {
    console.error(error)
  }
}