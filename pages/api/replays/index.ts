import { Replay } from '.prisma/client'
import { ReplayData } from '../../../components/Game'
import prisma from '../../../lib/prisma'

const saveReplay_Prisma = async (replayInstructions: string, length: number | string, levelId: number | string, authorId: number | string) => {
  const res = await prisma.replay.create({
    data: {
      replayInstructions: replayInstructions,
      length: Number(length),
      levelId: Number(levelId),
      authorId: Number(authorId),
    },
  })
  return res
}

export default async function handle(req, res) {
  if (req.method === 'POST') {
    const { replayInstructions, length, levelId, authorId } = req.body;
    const result = await saveReplay_Prisma(replayInstructions, length, levelId, authorId)
    res.json(result)
  }
}

export const saveReplay = async (
  replayInstructions: ReplayData[],
  length: number | string,
  levelId: number | string,
  authorId: number | string,
) => {
  try {
    let result = await fetch(`/api/replays`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        replayInstructions,
        length,
        levelId,
        authorId,
      })
    })
    const data: Replay = await result.json()
    return data
  } catch (error) {
    console.error(error)
  }
}