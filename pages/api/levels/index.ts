import { Level } from '.prisma/client'
import prisma from '../../../lib/prisma'

// export const getUsers = async (): Promise<User[]> => {
//   const users = await prisma.user.findMany()
//   const json = JSON.parse(JSON.stringify(users))
//   return json
// }

// export const createUser = async (
//   firstName: string,
//   lastName: string,
//   email: string,
// ) => {
//   const result = await prisma.user.create({
//     data: {
//       firstName,
//       lastName,
//       email,
//     }
//   });
//   return result
// }

// export default async function handle(req, res) {
//   if (req.method === 'GET') {
//     const notes = await getUsers()
//     res.json(notes)
//   } else if (req.method === 'POST') {
//     const { firstName, lastName, email } = req.body
//     const result = await createUser(firstName, lastName, email)
//     res.json(result)
//   }
// }