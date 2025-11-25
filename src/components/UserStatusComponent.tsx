'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Button from '@/components/ui/Button'
import Panel from "@/components/ui/Panel";
import Heading from "@/components/ui/Heading";
import {useServices} from "@/context/ServicesContext";

export default function UserStatusComponent() {
    const {apiClient} = useServices()
    const router = useRouter()
    const [username, setUsername] = useState<string | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        let mounted = true

        async function fetchSession() {
            setLoading(true)
            try {
                const session = await apiClient.session()
                if (mounted) setUsername(session?.username || null)
            } catch {
                if (mounted) setUsername(null)
            } finally {
                if (mounted) setLoading(false)
            }
        }

        void fetchSession()

        return () => {
            mounted = false
        }
    }, [apiClient])

    const handleLogout = async () => {
        try {
            await apiClient.logout()
        } catch (err) {
            console.error(err)
        } finally {
            setUsername(null)
        }
    }

    return (
        <Panel className="fixed items-center top-5 right-5 z-50">
            {loading ? (
                <Heading>Loading...</Heading>
            ) : username ? (
                <>
                    <Heading>{username}</Heading>
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
