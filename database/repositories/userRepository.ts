import {db} from "@/database/config";
import {User} from "@/database/models/public/User";

export const getUserById = async (id: number): Promise<User> => {
    return await db.selectFrom('user')
        .where('id', '=', id)
        .selectAll()
        .executeTakeFirstOrThrow()
}

export const getUserByEmail = async (email: string): Promise<User> => {
    return await db.selectFrom('user')
        .where('email', '=', email)
        .selectAll()
        .executeTakeFirstOrThrow()
}

export const getAllUsers = async (): Promise<User[]> => {
    return await db.selectFrom('user')
        .selectAll()
        .execute()
}