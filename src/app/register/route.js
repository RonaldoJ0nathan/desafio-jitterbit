import { apiHandler } from "@/lib/api-handler";
import { generateToken, hashPassword } from "@/lib/auth";
import { ValidationError } from "@/lib/errors";
import { prisma } from "@/lib/prisma";
import { CreateUserSchema } from "@/lib/validators/user";
import { NextResponse } from "next/server";
import z from "zod";

export async function POST(req) {
    return apiHandler(async () => {
        const body = await req.json();

        const result = CreateUserSchema.safeParse(body);

        if (!result.success) 
            throw new ValidationError("Invalid data", 400, z.treeifyError(result.error))

        const existingUser = await prisma.user.findUnique({
            where: { email: result.data.email }
        });
        if (existingUser)
            return NextResponse.json({ error: "User already exists" }, { status: 409});

        const hashedPassword = await hashPassword(result.data.password)

        const user = await prisma.user.create({
            data: {
                name: result.data.name,
                email: result.data.email,
                password: hashedPassword
            }
        });

        const token = generateToken(user.id);

        return NextResponse.json({
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                token: token,
            },
        });
    });
}