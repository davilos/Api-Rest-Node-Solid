import fastify from "fastify"
import { usersRoutes } from "./http/controllers/users/routes"
import { ZodError } from "zod"
import { env } from "./env"
import fastifyJwt from "@fastify/jwt"
import { gymsRoutes } from "./http/controllers/gyms/routes"

export const app = fastify()

app.register(fastifyJwt, {
  secret: env.JWT_SECRET,
})

app.register(usersRoutes)
app.register(gymsRoutes)

app.setErrorHandler((error, _, response) => {
  if (error instanceof ZodError) {
    return response.status(400).send({
      message: "Validation error.",
      issues: error.format(),
    })
  }

  if (env.NODE_ENV !== "production") {
    console.error(error)
  } else {
    // TODO: Here we should log to an external tool like DataDog/NewRelic/Sentry
  }

  return response.status(500).send({ message: "Internal server error." })
})
