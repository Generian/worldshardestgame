import { Replay } from '.prisma/client'
import { ReplayData } from '../../../../components/Game'
import prisma from '../../../../lib/prisma'

const getReplay_Prisma = async (rid: number | string) => {
  const data = await prisma.replay.findUnique({
    where: {
      id: Number(rid),
    },
  })
  const json: Replay = JSON.parse(JSON.stringify(data))
  return json
}

export default async function handle(req, res) {
  const { rid } = req.query
  if (req.method === 'GET') {
    const data = await getReplay_Prisma(rid)
    res.json(data)
  }
}

export const getReplay = async (rid: number | string | string[]) => {
  if (!rid) return null
  try {
    const response = await fetch(`/api/replays/${String(rid)}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    })
    const replay: Replay = await response.json()
    return replay
  } catch (error) {
    console.error(error)
    return null
  }
}