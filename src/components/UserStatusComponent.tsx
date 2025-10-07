'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useApi } from '@/context/ApiContext'
import Button from '@/components/ui/Button'

export default function UserStatusComponent() {
    const apiClient = useApi()
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
        <div className="fixed top-4 right-4 bg-white bg-opacity-80 backdrop-blur-md shadow-md rounded-xl px-4 py-2 flex items-center gap-3 z-50">
            {loading ? (
                <span className="text-gray-600 text-sm">Loading...</span>
            ) : username ? (
                <>
                    <span className="font-semibold text-gray-800">{username}</span>
                    <Button onClick={handleLogout} className="text-sm py-1 px-3">
                        Logout
                    </Button>
                </>
            ) : (
                <>
                    <Button onClick={() => router.push('/login')} className="text-sm py-1 px-3">
                        Login
                    </Button>
                    <Button onClick={() => router.push('/register')} className="text-sm py-1 px-3">
                        Register
                    </Button>
                </>
            )}
        </div>
    )
}
