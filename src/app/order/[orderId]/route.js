import { apiHandler } from "@/lib/api-handler";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { UpdateOrderSchema } from "@/lib/validators/order";
import { NextResponse } from "next/server";
import z from "zod";

export async function GET(req, { params }) {
    return await apiHandler(async () => {
        const { orderId } = await params;

        const user = await getCurrentUser(req);
        if (!user)
            return NextResponse.json({
                error: "You are not authenticated",
            },
            { status: 401 }
            );

        const order = await prisma.order.findUnique({
            where: { orderId },
            include: { items: true },
        });

        if (!order)
            return NextResponse.json({ error: "Pedido não encontrado" }, { status: 404 });
        
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

        return NextResponse.json(response, { status: 200 });
    });
}

export async function PUT(req, { params }) {
    return apiHandler(async () => {
        const { orderId } = await params;

        const user = await getCurrentUser(req);
        if (!user) {
        return NextResponse.json(
            { error: "You are not authenticated" },
            { status: 401 }
        );
        }

        const body = await req.json();
        const result = UpdateOrderSchema.safeParse(body);

        if (!result.success) {
        return NextResponse.json(
            { error: "Invalid data", details: z.treeifyError(result.error) },
            { status: 400 }
        );
        }

        const dataToUpdate = {};

        if (result.data.valorTotal !== undefined) {
        dataToUpdate.value = result.data.valorTotal;
        }

        if (result.data.dataCriacao !== undefined) {
        dataToUpdate.creationDate = new Date(result.data.dataCriacao);
        }

        if (result.data.items !== undefined) {
            dataToUpdate.items = {
                deleteMany: {}, // apaga todos os itens antigos
                create: result.data.items.map((item) => ({
                productId: parseInt(item.idItem),
                quantity: item.quantidadeItem,
                price: item.valorItem,
                })),
            };
        }

        const updatedOrder = await prisma.order.update({
        where: { orderId },
        data: dataToUpdate,
        include: { items: true },
        });

        const response = {
            order: {
                orderId: updatedOrder.orderId,
                value: updatedOrder.value,
                creationDate: updatedOrder.creationDate.toISOString(),
                items: updatedOrder.items.map(({ productId, quantity, price }) => ({
                productId,
                quantity,
                price,
                })),
            },
        }

        return NextResponse.json(response, { status: 200 });
    });
}

export async function DELETE(req, { params }) {
    return apiHandler(async () => {
        const { orderId } = await params;

        const user = await getCurrentUser(req);
        if (!user) {
        return NextResponse.json(
            { error: "You are not authenticated" },
            { status: 401 }
        );
        }

        const order = await prisma.order.findUnique({
            where: { orderId },
        });

        if (!order) {
        return NextResponse.json(
            { error: "Order not found" },
            { status: 404 }
        );
        }

        await prisma.item.deleteMany({
            where: { orderId },
        });

        await prisma.order.delete({
            where: { orderId },
        });

        return NextResponse.json(
            { message: `Pedido ${orderId} deletado com sucesso.` },
            { status: 200 }
        );
    });
}