import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
import faker from "faker";

async function main() {
  const alice = await prisma.user.upsert({
    where: { email: faker.internet.email() },
    update: {},
    create: {
      email: faker.internet.email(),
      username: faker.internet.userName(),
      password: faker.internet.password(),
      rhandler: faker.name.middleName(),
      posts: {
        create: {
          title: faker.name.title(),
          body: faker.lorem.text(),
          slug: faker.helpers.slugify(),
          identifier: faker.random.word(),
          subName: faker.random.word(),

          sub: {
            create: {
              author: {
                connect: {
                  email: faker.internet.email(),
                },
              },
              title: faker.name.title(),
              name: faker.name.title(),
              bannerUrn: faker.internet.url(),
              description: faker.lorem.lines(),
              imageUrn: faker.image.imageUrl(),
            },
          },
        },
      },
    },
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
