
import { NextResponse } from "next/server";
import { DatabaseError, TokenError, ValidationError } from "./errors";
import { Prisma } from "@/generated/prisma/client";

export async function apiHandler(callback) {
    try {
        return await callback();
    } catch (error) {
        if (error instanceof TokenError){
            return NextResponse.json({ status: "Token error", message: error.message, cause: error.cause }, { status: error.status });
        }

        if (error instanceof DatabaseError) {
            return NextResponse.json({ status: "Database error", message: error.message, cause: error.cause }, { status: error.status });
        }

        if (error instanceof ValidationError) {
            return NextResponse.json({ status: "Validation error", message: error.message, details: error.details }, { status: error.status });
        }

        if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
            return NextResponse.json(
                { error: "Order or item already exists in the database." },
                { status: 409 }
            );
        }

        console.log(error.message)

        return NextResponse.json({ status: "error", message: "Internal server error" }, { status: 500 });
    }
}