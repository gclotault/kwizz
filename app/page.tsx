import Link from 'next/link'

export default async function Home() {
    return (
        <main>
           <ul>
               <li><Link href={"/themes"}>Themes</Link></li>
           </ul>
        </main>
    )
}
