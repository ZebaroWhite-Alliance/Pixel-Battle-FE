'use client'
import {useState, useCallback, FormEvent, ChangeEvent} from 'react'
import {useRouter} from "next/navigation";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import ErrorField from "@/components/ui/ErrorField";
import FormContainer from "@/components/ui/FormContainer";
import useForm from "@/hooks/useForm";
import {useServices} from "@/context/ServicesContext";


export default function LoginPage() {
    const {apiClient} = useServices()
    const router = useRouter()

    const {values: loginData, handleChange} = useForm({username: '', password: ''})
    const [authError, setAuthError] = useState('')

    const handleFieldChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        setAuthError('')
        handleChange(e)
    }, [handleChange])

    const handleLogin = useCallback(async (e: FormEvent) => {
        e.preventDefault()
        try {
            await apiClient.login(loginData.username, loginData.password)
            router.push('/')
        } catch (err: any) {
            setAuthError(err.message || 'Unknown error')
        }

    }, [apiClient, loginData, router])

    return (
        <FormContainer title="Welcome Back" onSubmit={handleLogin}>
            <Input
                type="text"
                label="Username"
                name="username"
                placeholder="Enter your username"
                onChange={handleFieldChange}
            />

            <Input
                type="password"
                label="Password"
                name="password"
                placeholder="Enter your password"
                onChange={handleFieldChange}
            />

            <Button type="submit">
                Log in
            </Button>

            <ErrorField message={authError} className="text-center"/>
        </FormContainer>
    )
}