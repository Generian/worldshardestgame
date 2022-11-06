import { Level, Replay } from "@prisma/client"

// Levels

// export const getUsers = async () => {
//   try {
//     const response = await fetch('/api/users', {
//       method: 'GET',
//       headers: { 'Content-Type': 'application/json' }
//     })
//     const body: User[] = await response.json()
//     return body
//   } catch (error) {
//     console.error(error)
//     return []
//   }
// }

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

// export const getReplay = async (rid: number | string | string[]) => {
//   if (!rid) return null
//   try {
//     const response = await fetch(`/api/replays/${String(rid)}`, {
//       method: 'GET',
//       headers: { 'Content-Type': 'application/json' }
//     })
//     const replay: Replay = await response.json()
//     return replay
//   } catch (error) {
//     console.error(error)
//     return null
//   }
// }