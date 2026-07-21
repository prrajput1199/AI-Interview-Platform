
import { PrismaNeon } from "@prisma/adapter-neon";
import { PrismaClient } from "../generated/prisma/client";
import { auth } from "../config/firebase";
import jwt from "jsonwebtoken"

const adapter = new PrismaNeon({
    connectionString: process.env.DATABASE_URL!,
});

export const prisma = new PrismaClient({
    adapter,
});

export class AuthService {

    async verifyFirebaseToken(idToken: string) {
        try {
            const decodedToken = await auth.verifyIdToken(idToken);
            return decodedToken;
        } catch (err) {
            throw new Error("Invalid Firebase Token")
        }
    }

    async findOrCreateUser(firebaseUser: any) {
        const { uid, email, name, picture } = firebaseUser;

        let user = await prisma.user.findUnique({
            where: {
                FirebaseUid: uid
            }
        })


        if (!user) {
            user = await prisma.user.create({
                data: {
                    email: email || "",
                    name: name || "",
                    avatarUrl: picture || "",
                    FirebaseUid: uid,

                    creditWallet: {
                        create: {
                            balance: 0
                        }
                    }
                }
            })
        }

        return user;
    }

    generateJWT(user: any) {
        const token = jwt.sign(
            {
                userId: user.id,
                email: user.email
            },
            process.env.JWT_SECERET!,
            { expiresIn: (process.env.JWT_EXPIRY || "7d") as jwt.SignOptions["expiresIn"] }
        );

        return token;
    }
}