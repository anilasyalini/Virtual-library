const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const resources = await prisma.resource.findMany();
    console.log('--- DATABASE RESOURCES ---');
    resources.forEach(r => console.log(`- [${r.category}] ${r.title}`));
    console.log('---------------------------');
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
