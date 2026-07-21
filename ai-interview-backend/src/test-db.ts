// import { neon } from "@neondatabase/serverless";
// import { PrismaNeon } from "@prisma/adapter-neon";
// import { PrismaClient } from "../generated/prisma/client";

// const sql = neon(process.env.DATABASE_URL!);

// const adapter = new PrismaNeon(sql);

// export const prisma = new PrismaClient({
//   adapter,
// });

// import { Pool } from "@neondatabase/serverless";
// import { PrismaNeon } from "@prisma/adapter-neon";
// import { PrismaClient } from "../generated/prisma/client";

// const pool = new Pool({
//   connectionString: process.env.DATABASE_URL,
// });

// const adapter = new PrismaNeon(pool);

// export const prisma = new PrismaClient({
//   adapter,
// });

// async function main() {
//   const user = await prisma.user.create({
//     data: {
//       email: "testemail@gmail.com",
//       FirebaseUid: 'test123'
//     },
//   });

//   console.log("Created user:", user);
// }

// main()
//   .catch(console.error)
//   .finally(async () => {
//     await prisma.$disconnect();
//   });

import "dotenv/config";

import { PrismaNeon } from "@prisma/adapter-neon";
import { PrismaClient } from "../generated/prisma/client";

const adapter = new PrismaNeon({
  connectionString: process.env.DATABASE_URL!,
});

export const prisma = new PrismaClient({
  adapter,
});

async function main() {
  const user = await prisma.user.create({
    data: {
      email: "testemail1213123123@gmail.com",
      FirebaseUid: "test123we131",
    },
  });

  console.log(user);
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });

