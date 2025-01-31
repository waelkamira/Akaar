import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: 'file:../prisma/favoritesDatabase.db',
    },
  },
});

export default prisma;
