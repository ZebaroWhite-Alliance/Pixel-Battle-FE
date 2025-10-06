'use client'
import { useState, useCallback, FormEvent } from 'react'
import {useApi} from "@/context/ApiContext";
import {useRouter} from "next/navigation";


export default function LoginPage() {
    const apiClient = useApi()
    const router = useRouter()

    const [loginData, setLoginData] = useState({ username: '', password: '' })
    const [authError, setAuthError] = useState('')

    const handleLogin = useCallback(async (e: FormEvent) => {
        e.preventDefault()
        try {
            await apiClient.login(loginData.username, loginData.password)
            setAuthError('')
            router.push('/')
        } catch {
            setAuthError('Неверные учетные данные')
        }
    }, [apiClient, loginData, router])

    return (
        <div className="flex items-center justify-center min-h-screen">
            <form
                onSubmit={handleLogin}
                className="bg-white bg-opacity-90 backdrop-blur-md p-8 rounded-2xl shadow-xl w-96 flex flex-col animate-fadeIn"
            >
                <h2 className="text-3xl font-extrabold mb-6 text-center text-gray-800">
                    Welcome Back
                </h2>

                <input
                    type="text"
                    placeholder="Имя пользователя"
                    value={loginData.username}
                    onChange={e => setLoginData(prev => ({ ...prev, username: e.target.value }))}
                    className="mb-4 px-4 py-3 border border-gray-300 rounded-lg bg-white bg-opacity-80 text-gray-900 placeholder-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                />

                <input
                    type="password"
                    placeholder="Пароль"
                    value={loginData.password}
                    onChange={e => setLoginData(prev => ({ ...prev, password: e.target.value }))}
                    className="mb-4 px-4 py-3 border border-gray-300 rounded-lg bg-white bg-opacity-80 text-gray-900 placeholder-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                />

                <button
                    type="submit"
                    className="mb-4 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-xl shadow-lg hover:scale-105 transform transition"
                >
                    Войти
                </button>

                {authError && (
                    <p className="text-red-500 mt-2 text-center font-medium">{authError}</p>
                )}
            </form>
        </div>
    )
}