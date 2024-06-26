import { test, expect, describe, beforeEach } from "vitest"
import { RegisterService } from "./register"
import { compare } from "bcryptjs"
import { InMemoryUsersRepository } from "@/repositories/in-memory/in-memory-users-repository"
import { UserAlreadyExistsError } from "./errors/user-already-exists-error"

let usersRepository: InMemoryUsersRepository
let sut: RegisterService

describe("Register Service", () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    sut = new RegisterService(usersRepository)
  })

  test("Can register a user", async () => {
    const { user } = await sut.execute({
      name: "John Doe",
      email: "johndoe@example.com",
      password: "123456",
    })

    expect(user.id).toEqual(expect.any(String))
  })

  test("Hash user password upon registration", async () => {
    const { user } = await sut.execute({
      name: "John Doe",
      email: "johndoe@example.com",
      password: "123456",
    })

    const isPasswordCorrectlyHashed = await compare(
      "123456",
      user.password_hash,
    )

    expect(isPasswordCorrectlyHashed).toBe(true)
  })

  test("Can not register the same email twice", async () => {
    const email = "johndoe@example.com"

    await sut.execute({
      name: "John Doe",
      email,
      password: "123456",
    })

    await expect(
      async () =>
        await sut.execute({
          name: "John Doe",
          email,
          password: "123456",
        }),
    ).rejects.toBeInstanceOf(UserAlreadyExistsError)
  })
})
