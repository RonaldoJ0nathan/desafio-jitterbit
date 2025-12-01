import z from "zod";

const CreateItemSchema = z.object({
    idItem: z.string().nonempty(),
    quantidadeItem: z.number().int().positive(),
    valorItem: z.number().positive(),
});

export const CreateOrderSchema = z.object ({
    numeroPedido: z.string().nonempty(),
    valorTotal: z.number().positive(),
    dataCriacao: z.string().refine(
    (val) => !isNaN(Date.parse(val)),
    { message: "Data inválida" }
    ),
    items: z.array(CreateItemSchema).nonempty(),
});

const ItemResponse = z.object ({
    productId: z.string(),
    quantity: z.number(),
    price: z.number(),
});

export const OrderResponse = z.object ({
    orderId: z.string(),
    value: z.number(),
    creationDate: z.string(),
    items: z.array(ItemResponse),
});

export const UpdateOrderSchema = z.object({
    valorTotal: z.number().optional(),
    dataCriacao: z.string().optional(), // ISO date
    items: z.array(
        z.object({
            idItem: z.string(),
            quantidadeItem: z.number(),
            valorItem: z.number(),
        })
    )
    .optional(),
});