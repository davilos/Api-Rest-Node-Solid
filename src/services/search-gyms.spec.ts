import { test, expect, describe, beforeEach } from "vitest"
import { InMemoryGymsRepository } from "@/repositories/in-memory/in-memory-gyms-repository"
import { SearchGymsService } from "./search-gyms"

let gymsRepository: InMemoryGymsRepository
let sut: SearchGymsService

describe("Search Gyms Service", () => {
  beforeEach(async () => {
    gymsRepository = new InMemoryGymsRepository()
    sut = new SearchGymsService(gymsRepository)
  })

  test("Can search for gyms.", async () => {
    await gymsRepository.create({
      title: "JavaScript Gym",
      description: null,
      phone: null,
      latitude: -8.0084992,
      longitude: -34.9241344,
    })

    await gymsRepository.create({
      title: "TypeScript Gym",
      description: null,
      phone: null,
      latitude: -8.0084992,
      longitude: -34.9241344,
    })

    const { gyms } = await sut.execute({
      query: "JavaScript",
      page: 1,
    })

    expect(gyms).toHaveLength(1)
    expect(gyms).toEqual([expect.objectContaining({ title: "JavaScript Gym" })])
  })

  test("Can fetch paginated gyms search.", async () => {
    for (let i = 1; i <= 22; i++) {
      await gymsRepository.create({
        title: `JavaScript Gym ${i}`,
        description: null,
        phone: null,
        latitude: -8.0084992,
        longitude: -34.9241344,
      })
    }

    const { gyms } = await sut.execute({
      query: "JavaScript",
      page: 2,
    })

    expect(gyms).toHaveLength(2)
    expect(gyms).toEqual([
      expect.objectContaining({ title: "JavaScript Gym 21" }),
      expect.objectContaining({ title: "JavaScript Gym 22" }),
    ])
  })
})
