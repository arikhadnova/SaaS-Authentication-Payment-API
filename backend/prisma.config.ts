import path from 'path'
import type { PrismaConfig } from 'prisma'

export default {
  schema: path.join('prisma', 'schema.prisma'),
  datasource: {
    url: 'postgresql://postgres@localhost:5432/saas_auth_db',
  },
} satisfies PrismaConfig