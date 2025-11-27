'use client'
import {useRouter} from 'next/navigation'

import Button from '@/components/ui/Button'
import Heading from "@/components/ui/Heading"
import Panel from "@/components/ui/Panel"
import {useServices} from "@/context/ServicesContext"

export default function UserStatusComponent() {
    const {session} = useServices()
    const router = useRouter()

    const handleLogout = async () => {
        try {
            await session.logout()
        } catch (err) {
            console.error(err)
        }
    }

    return (
        <Panel className="fixed items-center top-5 right-5 z-50">
            {session.isAuth ? (
                <>
                    <Heading>{session.username}</Heading>
                    <Button onClick={handleLogout}>Logout</Button>
                </>
            ) : (
                <>
                    <Button onClick={() => router.push('/login')}>Login</Button>
                    <Button onClick={() => router.push('/register')}>Register</Button>
                </>
            )}
        </Panel>
    )
}
