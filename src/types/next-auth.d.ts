import 'next-auth'
import 'next-auth/jwt'

declare module 'next-auth' {
  interface User {
    id: string
    role: string
    profile?: any
  }

  interface Session {
    user: {
      id: string
      email: string
      name?: string | null
      role: string
      profile?: any
    }
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string
    role: string
    profile?: any
  }
}