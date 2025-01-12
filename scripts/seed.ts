const { PrismaClient } =  require("@prisma/client");

const db = new PrismaClient();

async function main() {
    try {
        await db.category.createMany({
            data: [
                {name: "Famous"},
                {name: "Movies & TV"},
                {name: "Anime"},
                {name: "Games"},
                {name: "Philosophy"},
                {name: "Scientists"},
                {name: "History"},
                {name: "Horror"},
                {name: "Books"},
                {name: "Comedy"},
                {name: "Musicians"},
            ]
        })
    } catch (error) {
        console.error("Error seeding default categories", error)
    }
    finally {
        await db.$disconnect();
    }
}

main();
