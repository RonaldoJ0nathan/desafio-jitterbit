import { apiHandler } from "@/lib/api-handler";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { CreateOrderSchema } from "@/lib/validators/order";
import { NextResponse } from "next/server";

export async function POST(req) {
    return apiHandler(async () => {

        const user = await getCurrentUser(req);
        if (!user)
            return NextResponse.json({
                error: "You are not authenticated",
            },
            { status: 401 }
            );

        const body = await req.json();
        const result = CreateOrderSchema.safeParse(body);

        if (!result.success) 
            throw new ValidationError("Invalid data", 400, z.treeifyError(result.error))

        const order = await prisma.order.create({
            data: {
                orderId: result.data.numeroPedido,
                value: result.data.valorTotal,
                creationDate: new Date(result.data.dataCriacao),
                items: {
                    create: result.data.items.map(item => ({
                        productId: parseInt(item.idItem),
                        quantity: item.quantidadeItem,
                        price: item.valorItem,
                    })),
                },
            },
            include: { items: true }
        });

        const response = {
            order: {
                orderId: order.orderId,
                value: order.value,
                creationDate: order.creationDate.toISOString(),
                items: order.items.map(({ productId, quantity, price }) => ({
                    productId,
                    quantity,
                    price,
                })),
            },
        };

        return NextResponse.json(response, { status:  201});
    });
}