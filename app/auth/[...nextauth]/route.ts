import NextAuth, {AuthOptions} from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import {promisify} from "util";
import {scrypt as _scrypt} from "crypto";
import {getUserByEmail} from "@/database/repositories/userRepository";

const scrypt = promisify(_scrypt);

export const authOptions: AuthOptions = {
    providers: [
        CredentialsProvider({
            // The name to display on the sign in form (e.g. 'Sign in with...')
            name: 'Credentials',
            // The credentials is used to generate a suitable form on the sign in page.
            // You can specify whatever fields you are expecting to be submitted.
            // e.g. domain, username, password, 2FA token, etc.
            // You can pass any HTML attribute to the <input> tag through the object.
            credentials: {
                email: {label: "Email", type: "mail", placeholder: "jean@example.com"},
                password: {label: "Password", type: "password"}
            },
            // Need to ignore TypeScript error : https://github.com/nextauthjs/next-auth/issues/2701
            // @ts-ignore
            async authorize(credentials) {
                // You need to provide your own logic here that takes the credentials
                // submitted and returns either a object representing a user or value
                // that is false/null if the credentials are invalid.
                // e.g. return { id: 1, name: 'J Smith', email: 'jsmith@example.com' }
                // You can also use the `req` object to obtain additional parameters
                // (i.e., the request IP address)
                if (!credentials || !credentials.email || !credentials.password) {
                    return null;
                }

                const {email, password} = credentials;

                try {

                    const user = await getUserByEmail(email);
                    const [salt, storedHash] = user.password.split('.');

                    const hash = (await scrypt(password, salt, 32)) as Buffer;

                    if (storedHash !== hash.toString('hex')) {
                        return null;
                    }
                    return user;
                } catch (e: any) {
                    return null
                }

            }
        })
    ],
    callbacks: {
        jwt: async ({token, user}) => {
            // @ts-ignore
            user && (token.user = {id: user.id})
            return token
        },
        session: async ({session, token}) => {
            token.user && (session.user = token.user)
            return session
        }
    },
}

const handler = NextAuth(authOptions)

export {handler as GET, handler as POST}