import { issuer } from "@aryalabs/openauth"
import { MemoryStorage } from "@aryalabs/openauth/storage/memory"
import { PasswordUI } from "@aryalabs/openauth/ui/password"
import { serve } from "@hono/node-server"
import { subjects } from "../../subjects"
import { PasswordProvider } from "@aryalabs/openauth/provider/password"

async function getUser(email: string) {
  // Get user from database
  // Return user ID
  return "123"
}

const app = issuer({
  subjects,
  storage: MemoryStorage({
    persist: "./persist.json",
  }),
  providers: {
    password: PasswordProvider(
      PasswordUI({
        sendCode: async (email, code) => {
          console.log(email, code)
        },
      }),
    ),
  },
  success: async (ctx, value) => {
    if (value.provider === "password") {
      return ctx.subject("user", {
        id: await getUser(value.email),
      })
    }
    throw new Error("Invalid provider")
  },
})

serve(app)
