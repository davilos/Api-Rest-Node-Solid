import { env } from "./env"
import { app } from "./app"

void app
  .listen({
    host: "0.0.0.0",
    port: env.PORT,
  })
  .then(() => {
    console.log(`✔ HTTP Server is running on http://localhost:${env.PORT}`)
  })
