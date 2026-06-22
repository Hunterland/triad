import { PrismaClient, RoleName } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // 1) Criar roles básicos, se não existirem
  const roles = Object.values(RoleName); // ['ADMIN', 'ORGANIZER', 'JUDGE', 'STAFF', 'ATHLETE']

  for (const roleName of roles) {
    await prisma.role.upsert({
      where: { name: roleName },
      update: {},
      create: {
        name: roleName,
      },
    });
  }

  // 2) (Opcional) Criar um usuário admin inicial
  const adminEmail = 'admin@triad.local';

  const existingAdmin = await prisma.user.findUnique({
    where: { email: adminEmail },
  });

  if (!existingAdmin) {
    // por enquanto, senha em texto; depois vamos trocar para hash com bcrypt no AuthModule
    const admin = await prisma.user.create({
      data: {
        email: adminEmail,
        password: 'changeme', // será substituída por hash depois
        displayName: 'TRIAD Admin',
        roles: {
          create: [
            {
              role: {
                connect: { name: 'ADMIN' },
              },
            },
            {
              role: {
                connect: { name: 'ORGANIZER' },
              },
            },
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
