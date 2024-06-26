import { CheckIN, Prisma } from "@prisma/client"
import { CheckInsRepository } from "../check-ins-repository"
import { prisma } from "@/lib/prisma"
import dayjs from "dayjs"

export class PrismaCheckInsRepository implements CheckInsRepository {
  async create(data: Prisma.CheckINUncheckedCreateInput) {
    const checkIn = await prisma.checkIN.create({
      data,
    })

    return checkIn
  }
  async save(data: CheckIN) {
    const checkIn = await prisma.checkIN.update({
      where: {
        id: data.id,
      },
      data,
    })

    return checkIn
  }
  async findById(id: string) {
    const checkIn = await prisma.checkIN.findUnique({
      where: {
        id,
      },
    })

    return checkIn
  }
  async findByUserIdOnDdate(userId: string, date: Date) {
    const startOfTheDay = dayjs(date).startOf("date")
    const endOfTheDay = dayjs(date).endOf("date")

    const checkIn = await prisma.checkIN.findFirst({
      where: {
        user_id: userId,
        created_at: { gte: startOfTheDay.toDate(), lte: endOfTheDay.toDate() },
      },
    })

    return checkIn
  }
  async findManyByUserId(userId: string, page: number) {
    const checkIns = await prisma.checkIN.findMany({
      where: {
        user_id: userId,
      },
      take: 20,
      skip: (page - 1) * 20,
    })

    return checkIns
  }
  async countByUserId(userId: string) {
    const count = await prisma.checkIN.count({
      where: {
        user_id: userId,
      },
    })

    return count
  }
}
