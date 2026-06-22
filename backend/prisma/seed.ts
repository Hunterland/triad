import { PrismaClient, RoleName } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const roles = Object.values(RoleName);

  for (const roleName of roles) {
    await prisma.role.upsert({
      where: { name: roleName },
      update: {},
      create: { name: roleName },
    });
  }

  const adminEmail = 'admin@triad.local';

  const existingAdmin = await prisma.user.findUnique({
    where: { email: adminEmail },
  });

  if (!existingAdmin) {
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash('changeme', saltRounds);

    const admin = await prisma.user.create({
      data: {
        email: adminEmail,
        password: passwordHash,
        displayName: 'TRIAD Admin',
        roles: {
          create: [
            { role: { connect: { name: 'ADMIN' } } },
            { role: { connect: { name: 'ORGANIZER' } } },
          ],
        },
      },
    });

    console.log('Admin criado:', admin.email);
  } else {
    console.log('Admin já existe:', existingAdmin.email);
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
