import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { prisma } from "./prisma";
import { TokenError } from "./errors";

const JWT_SECRET = process.env.JWT_SECRET;


export const hashPassword = async (password) => {
    return bcrypt.hash(password, 12);
}

export const verifyPassword = async (password, hashedPassword) => {
    return bcrypt.compare(password, hashedPassword);
}

export const generateToken = (userId) => {
    return jwt.sign({userId}, JWT_SECRET, { expiresIn: "7d" });
}

export const verifyToken = (token) => {
    return jwt.verify(token, JWT_SECRET);
}

export const getCurrentUser = async(req) => {
    try {
        const authHeader = req.headers.get("Authorization");
        if (!authHeader || !authHeader.startsWith("Bearer ")) return null;

        const token = authHeader.split(" ")[1];
        if (!token) return null;

        const decode = verifyToken(token);

        const userFromDb = await prisma.user.findUnique({
            where: { id: decode.userId }
        });
        if (!userFromDb) return null;

        const { password, ...user } = userFromDb;
        return user;
    } catch (error) {
        throw new TokenError("Invalid token", 401, error);
    }
}

