import { apiHandler } from "@/lib/api-handler";
import { generateToken, hashPassword, verifyPassword } from "@/lib/auth";
import { ValidationError } from "@/lib/errors";
import { prisma } from "@/lib/prisma";
import { LoginSchema } from "@/lib/validators/user";
import { NextResponse } from "next/server";
import z from "zod";

export async function POST(req) {
    return apiHandler(async () => {
        const body = await req.json();

        const result = LoginSchema.safeParse(body);

        if (!result.success) 
            throw new ValidationError("Invalid data", 400, z.treeifyError(result.error))

        const userFromDb = await prisma.user.findUnique({
            where: { email: result.data.email }
        });

        if (!userFromDb)
            return NextResponse.json({
                error: "Email or password is incorrect.",
            },
            { status: 401 }
            );

        const isValidPassword = await verifyPassword(result.data.password, userFromDb.password)

        if (!isValidPassword)
            return NextResponse.json({
                error: "Email or password is incorrect.",
            },
            { status: 401 }
            );

        const token = generateToken(userFromDb.id);

        return NextResponse.json({
            acess_token: token,
            token_type: "Bearer",
            expires_in: 604800
        });
    });
}