import {FormEvent, ReactNode} from "react";

interface FormContainerProps {
    title: string;
    children: ReactNode;
    onSubmit?: (e: FormEvent<HTMLFormElement>) => void;
    className?: string;
}

export default function FormContainer({title, children, onSubmit, className = ""}: FormContainerProps) {
    return (
        <div className="flex items-center justify-center min-h-screen">
            <form
                onSubmit={onSubmit}
                className={`bg-white bg-opacity-90 backdrop-blur-md p-8 rounded-2xl shadow-xl w-96 flex flex-col animate-fadeIn ${className}`}
            >
                <h2 className="text-3xl font-extrabold mb-6 text-center text-gray-800">{title}</h2>
                {children}
            </form>
        </div>
    );
}
