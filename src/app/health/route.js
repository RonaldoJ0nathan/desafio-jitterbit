import { apiHandler } from "@/lib/api-handler";
import { checkDatabaseConnection } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
    return apiHandler(async () => {
        const isConnected = await checkDatabaseConnection();

        if (!isConnected) {
            return NextResponse.json({ status: "error", message: "Database connection failed" }, { status: 503 });
        }
        return NextResponse.json({ status: "ok", message: "Database connected successfully" }, { status: 200 });
    });
}