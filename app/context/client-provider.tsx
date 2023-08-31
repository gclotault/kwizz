'use client'

import {SessionProvider} from "next-auth/react"

export default function Provider({
                                     children,
                                     session, basePath
                                 }: {
    children: React.ReactNode
    session: any
    basePath: string
}): React.ReactNode {
    return <SessionProvider session={session} basePath={basePath}>
        {children}
    </SessionProvider>
}