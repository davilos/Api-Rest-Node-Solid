import { type CheckIN, type Prisma } from "@prisma/client"

export interface CheckInsRepository {
  create(data: Prisma.CheckINUncheckedCreateInput): Promise<CheckIN>
  save(checkIn: CheckIN): Promise<CheckIN>
  findById(id: string): Promise<CheckIN | null>
  findByUserIdOnDdate(userId: string, date: Date): Promise<CheckIN | null>
  findManyByUserId(userId: string, page: number): Promise<CheckIN[]>
  countByUserId(userId: string): Promise<number>
}
