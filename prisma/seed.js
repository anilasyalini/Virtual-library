const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    // No initial data required
    console.log('Seed skipped - no data to seed.');
    console.log('Seed completed!');
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
