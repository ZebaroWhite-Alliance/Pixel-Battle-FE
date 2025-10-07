'use client'
import { useState, useCallback, FormEvent, ChangeEvent } from 'react'
import { useApi } from "@/context/ApiContext";
import { useRouter } from "next/navigation";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import ErrorField from "@/components/ui/ErrorField";
import FormContainer from "@/components/ui/FormContainer";
import useForm from "@/hooks/useForm";

export default function RegistrationPage() {
    const apiClient = useApi()
    const router = useRouter()

    const { values: regData, handleChange } = useForm({ username: '', password: '', confirmPassword: '' })
    const [errorMessage, setErrorMessage] = useState('')

    const handleFieldChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        setErrorMessage('')
        handleChange(e)
    }, [handleChange])

    const handleRegister = useCallback(async (e: FormEvent) => {
        e.preventDefault()

        if (regData.password !== regData.confirmPassword) {
            setErrorMessage('Passwords do not match')
            return
        }

        try {
            await apiClient.register(regData.username, regData.password)
            router.push('/login') // после регистрации редирект на логин
        } catch (err: any){
            setErrorMessage(err.message || 'Unknown error')
        }
    }, [apiClient, regData, router])

    return (
        <FormContainer title="Create Account" onSubmit={handleRegister}>
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

            <Input
                type="password"
                label="Confirm Password"
                name="confirmPassword"
                placeholder="Repeat your password"
                onChange={handleFieldChange}
            />

            <Button type="submit">
                Register
            </Button>

            <ErrorField message={errorMessage} className="text-center"/>
        </FormContainer>
    )
}
