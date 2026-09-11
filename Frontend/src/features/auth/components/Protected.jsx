import React from 'react'
import { useAuth } from "../hooks/useAuth";
import { Navigate } from "react-router";

const Protected = ({ children }) => {
    const { loading, user } = useAuth()

    if (loading) {
        return (
            <main className='brand-loader-container'>
                <div className='brand-spinner' />
            </main>
        )
    }

    if (!user) {
        return <Navigate to={'/login'} replace />
    }

    return children
}

export default Protected