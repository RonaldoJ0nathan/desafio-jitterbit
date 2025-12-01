// app/api/order/list/route.ts
import { apiHandler } from "@/lib/api-handler";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req) {
    return apiHandler(async () => {
        const user = await getCurrentUser(req);
        if (!user) {
            return NextResponse.json(
                { error: "You are not authenticated" },
                { status: 401 }
            );
        }

        const orders = await prisma.order.findMany({
            include: { items: true },
            orderBy: { creationDate: "asc" },
        });

        const response = orders.map((order) => ({
            orderId: order.orderId,
            value: order.value,
            creationDate: order.creationDate.toISOString(),
            items: order.items.map(({ productId, quantity, price }) => ({
                productId,
                quantity,
                price,
            })),
        }));

        return NextResponse.json({ orders: response }, { status: 200 });
    });
}
