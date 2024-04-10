import { type FastifyRequest, type FastifyReply } from "fastify"
import { z } from "zod"
import { InvalidCredentialsError } from "@/services/errors/invalid-credentials-error"
import { makeAuthenticateService } from "@/services/factories/make-authenticate-service"

export async function authenticate(
  request: FastifyRequest,
  response: FastifyReply,
): Promise<FastifyReply> {
  const registerBodySchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
  })

  const { email, password } = registerBodySchema.parse(request.body)

  try {
    const authenticateService = makeAuthenticateService()

    const { user } = await authenticateService.execute({
      email,
      password,
    })

    const token = await response.jwtSign(
      {},
      {
        sign: {
          sub: user.id,
        },
      },
    )

    return await response.status(200).send({
      token,
    })
  } catch (error) {
    if (error instanceof InvalidCredentialsError) {
      return await response.status(400).send({ message: error.message })
    }

    throw error
  }
}