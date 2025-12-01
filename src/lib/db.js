import { prisma } from "@/lib/prisma";
import { DatabaseError } from "@/lib/errors";

// Database helper function
export async function checkDatabaseConnection() {
    try {
        await prisma.$queryRaw`Select 1`;
        return true;
    } catch (error) {
        throw new DatabaseError("Database connection failed", 503, error);
        return false;
    }
}