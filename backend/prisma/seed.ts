import { PrismaClient, RoleName, RegistrationStatus } from '@prisma/client';
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
            { role: { connect: { name: RoleName.ADMIN } } },
            { role: { connect: { name: RoleName.ORGANIZER } } },
          ],
        },
      },
    });

    console.log('Admin criado:', admin.email);
  } else {
    console.log('Admin já existe:', existingAdmin.email);
  }

  const event = await prisma.event.upsert({
    where: { slug: 'triad-mock-event' },
    update: {
      name: 'TRIAD Mock Event',
      description: 'Evento de teste para geração de brackets',
      location: 'Ambiente local',
      startDate: new Date('2026-08-01T10:00:00.000Z'),
      endDate: new Date('2026-08-02T22:00:00.000Z'),
      isActive: true,
    },
    create: {
      slug: 'triad-mock-event',
      name: 'TRIAD Mock Event',
      description: 'Evento de teste para geração de brackets',
      location: 'Ambiente local',
      startDate: new Date('2026-08-01T10:00:00.000Z'),
      endDate: new Date('2026-08-02T22:00:00.000Z'),
      isActive: true,
    },
  });

  const top8Category = await prisma.category.upsert({
    where: {
      eventId_slug: {
        eventId: event.id,
        slug: 'breaking-top8',
      },
    },
    update: {
      name: 'Breaking Top 8',
      description: 'Categoria de teste para bracket TOP8',
      level: 'OPEN',
      isTeam: false,
      isActive: true,
    },
    create: {
      eventId: event.id,
      name: 'Breaking Top 8',
      slug: 'breaking-top8',
      description: 'Categoria de teste para bracket TOP8',
      level: 'OPEN',
      isTeam: false,
      isActive: true,
    },
  });

  const top16Category = await prisma.category.upsert({
    where: {
      eventId_slug: {
        eventId: event.id,
        slug: 'popping-top16',
      },
    },
    update: {
      name: 'Popping Top 16',
      description: 'Categoria de teste para bracket TOP16',
      level: 'OPEN',
      isTeam: false,
      isActive: true,
    },
    create: {
      eventId: event.id,
      name: 'Popping Top 16',
      slug: 'popping-top16',
      description: 'Categoria de teste para bracket TOP16',
      level: 'OPEN',
      isTeam: false,
      isActive: true,
    },
  });

  const insufficientTop8Category = await prisma.category.upsert({
    where: {
      eventId_slug: {
        eventId: event.id,
        slug: 'breaking-insufficient-top8',
      },
    },
    update: {
      name: 'Breaking Insufficient Top 8',
      description:
        'Categoria de teste com participantes insuficientes para TOP8',
      level: 'OPEN',
      isTeam: false,
      isActive: true,
    },
    create: {
      eventId: event.id,
      name: 'Breaking Insufficient Top 8',
      slug: 'breaking-insufficient-top8',
      description:
        'Categoria de teste com participantes insuficientes para TOP8',
      level: 'OPEN',
      isTeam: false,
      isActive: true,
    },
  });

  const insufficientTop16Category = await prisma.category.upsert({
    where: {
      eventId_slug: {
        eventId: event.id,
        slug: 'popping-insufficient-top16',
      },
    },
    update: {
      name: 'Popping Insufficient Top 16',
      description:
        'Categoria de teste com participantes insuficientes para TOP16',
      level: 'OPEN',
      isTeam: false,
      isActive: true,
    },
    create: {
      eventId: event.id,
      name: 'Popping Insufficient Top 16',
      slug: 'popping-insufficient-top16',
      description:
        'Categoria de teste com participantes insuficientes para TOP16',
      level: 'OPEN',
      isTeam: false,
      isActive: true,
    },
  });

  for (let i = 1; i <= 16; i++) {
    const padded = String(i).padStart(2, '0');

    await prisma.athlete.upsert({
      where: { email: `athlete${padded}@triad.local` },
      update: {
        name: `Athlete ${padded}`,
        stageName: `ATK ${padded}`,
        country: 'Brasil',
        city: 'Rio de Janeiro',
        isActive: true,
      },
      create: {
        name: `Athlete ${padded}`,
        stageName: `ATK ${padded}`,
        email: `athlete${padded}@triad.local`,
        country: 'Brasil',
        city: 'Rio de Janeiro',
        isActive: true,
      },
    });
  }

  const athleteRecords = await prisma.athlete.findMany({
    where: {
      email: {
        in: Array.from({ length: 16 }, (_, index) => {
          const padded = String(index + 1).padStart(2, '0');
          return `athlete${padded}@triad.local`;
        }),
      },
    },
    orderBy: { email: 'asc' },
  });

  for (let i = 0; i < 8; i++) {
    const athlete = athleteRecords[i];

    await prisma.eventParticipant.upsert({
      where: {
        eventId_categoryId_athleteId: {
          eventId: event.id,
          categoryId: top8Category.id,
          athleteId: athlete.id,
        },
      },
      update: {
        status: RegistrationStatus.APPROVED,
        isActive: true,
      },
      create: {
        eventId: event.id,
        categoryId: top8Category.id,
        athleteId: athlete.id,
        status: RegistrationStatus.APPROVED,
        isActive: true,
      },
    });
  }

  for (let i = 0; i < 16; i++) {
    const athlete = athleteRecords[i];

    await prisma.eventParticipant.upsert({
      where: {
        eventId_categoryId_athleteId: {
          eventId: event.id,
          categoryId: top16Category.id,
          athleteId: athlete.id,
        },
      },
      update: {
        status: RegistrationStatus.APPROVED,
        isActive: true,
      },
      create: {
        eventId: event.id,
        categoryId: top16Category.id,
        athleteId: athlete.id,
        status: RegistrationStatus.APPROVED,
        isActive: true,
      },
    });
  }

  for (let i = 0; i < 7; i++) {
    const athlete = athleteRecords[i];

    await prisma.eventParticipant.upsert({
      where: {
        eventId_categoryId_athleteId: {
          eventId: event.id,
          categoryId: insufficientTop8Category.id,
          athleteId: athlete.id,
        },
      },
      update: {
        status: RegistrationStatus.APPROVED,
        isActive: true,
      },
      create: {
        eventId: event.id,
        categoryId: insufficientTop8Category.id,
        athleteId: athlete.id,
        status: RegistrationStatus.APPROVED,
        isActive: true,
      },
    });
  }

  for (let i = 0; i < 15; i++) {
    const athlete = athleteRecords[i];

    await prisma.eventParticipant.upsert({
      where: {
        eventId_categoryId_athleteId: {
          eventId: event.id,
          categoryId: insufficientTop16Category.id,
          athleteId: athlete.id,
        },
      },
      update: {
        status: RegistrationStatus.APPROVED,
        isActive: true,
      },
      create: {
        eventId: event.id,
        categoryId: insufficientTop16Category.id,
        athleteId: athlete.id,
        status: RegistrationStatus.APPROVED,
        isActive: true,
      },
    });
  }

  console.log('Seed de teste concluído.');
  console.log('Event ID:', event.id);
  console.log('Top8 Category ID:', top8Category.id);
  console.log('Top16 Category ID:', top16Category.id);
  console.log('Insufficient Top8 Category ID:', insufficientTop8Category.id);
  console.log('Insufficient Top16 Category ID:', insufficientTop16Category.id);
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
