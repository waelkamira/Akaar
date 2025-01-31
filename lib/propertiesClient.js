import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: 'file:../prisma/propertiesDatabase.db',
    },
  },
});

export default prisma;
