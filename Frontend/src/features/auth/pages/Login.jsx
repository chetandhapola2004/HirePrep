import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router'
import "../auth.form.css"
import { useAuth } from '../hooks/useAuth'

const Login = () => {
    const { loading, handleLogin } = useAuth()
    const navigate = useNavigate()

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")
    const [submitting, setSubmitting] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError("")
        setSubmitting(true)

        try {
            const result = await handleLogin({ email, password })
            if (result.success) {
                navigate('/')
            } else {
                setError(result.message || "Failed to log in. Please verify your credentials.")
            }
        } finally {
            setSubmitting(false)
        }
    }

    if (loading) {
        return (
            <main className='brand-loader-container'>
                <div className='brand-spinner' />
            </main>
        )
    }

    return (
        <main className='auth-page'>
            <div className="auth-page-brand">
                <span className="auth-page-brand__icon" aria-label="HirePrep Logo">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 2L2 7l10 5 10-5-10-5z" />
                        <path d="M2 17l10 5 10-5" />
                        <path d="M2 12l10 5 10-5" />
                    </svg>
                </span>
                <span className="auth-page-brand__title">HirePrep</span>
                <span className="auth-page-brand__tag">AI</span>
            </div>

            <div className="auth-card">
                <div className="auth-header">
                    <h1>Welcome Back</h1>
                    <p>Log in to access your interview strategies</p>
                </div>

                <form className="auth-form" onSubmit={handleSubmit}>
                    <div className="input-group">
                        <label htmlFor="email">Email Address</label>
                        <input
                            onChange={(e) => setEmail(e.target.value)}
                            value={email}
                            type="email"
                            id="email"
                            name='email'
                            placeholder='name@example.com'
                            required
                        />
                    </div>

                    <div className="input-group">
                        <label htmlFor="password">Password</label>
                        <input
                            onChange={(e) => setPassword(e.target.value)}
                            value={password}
                            type="password"
                            id="password"
                            name='password'
                            placeholder='••••••••'
                            required
                        />
                    </div>

                    {error && (
                        <div className="error-text" role="alert">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="12" cy="12" r="10" />
                                <line x1="12" y1="8" x2="12" y2="12" />
                                <line x1="12" y1="16" x2="12.01" y2="16" />
                            </svg>
                            <span>{error}</span>
                        </div>
                    )}

                    <button
                        type="submit"
                        className='auth-submit-btn'
                        disabled={submitting}
                    >
                        {submitting ? "Signing in..." : "Log In to HirePrep"}
                    </button>
                </form>

                <div className="auth-footer">
                    Don't have an account? <Link to="/register">Create an account</Link>
                </div>
            </div>
        </main>
    )
}

export default Login