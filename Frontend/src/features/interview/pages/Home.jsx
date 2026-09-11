import React, { useState, useRef, useEffect } from 'react'
import "../style/home.css"
import { useInterview } from '../hooks/useInterview.js'
import { useAuth } from '../../auth/hooks/useAuth.js'
import { useNavigate } from 'react-router'

const QUICK_TEMPLATES = [
    {
        title: "Full Stack Engineer",
        description: "Senior Full Stack Engineer (React, Node.js, Express, MongoDB, Docker, AWS). Responsibilities include designing scalable RESTful APIs, building responsive frontend components, optimizing database performance, and implementing CI/CD pipelines."
    },
    {
        title: "Frontend React Specialist",
        description: "Staff Frontend Engineer specializing in React 19, TypeScript, Next.js, and high-performance web applications. Requires strong mastery of state management, design systems, Web Vitals optimization, and micro-frontend architecture."
    },
    {
        title: "Backend Cloud Engineer",
        description: "Senior Backend Engineer with deep expertise in Node.js/Go, distributed systems, PostgreSQL, Redis caching, message queues (Kafka/RabbitMQ), and Kubernetes cloud deployment."
    }
]

const LOADING_MESSAGES = [
    "Analyzing target job competencies & requirements...",
    "Parsing candidate background & tech stack alignment...",
    "Calibrating objective match score...",
    "Generating deep scenario-based technical questions...",
    "Synthesizing STAR-method behavioral interview answers...",
    "Crafting day-by-day targeted preparation roadmap..."
]

const Home = () => {
    const { loading, generateReport, reports } = useInterview()
    const { user, handleLogout } = useAuth()
    const [jobDescription, setJobDescription] = useState("")
    const [selfDescription, setSelfDescription] = useState("")
    const [selectedFile, setSelectedFile] = useState(null)
    const [dragActive, setDragActive] = useState(false)
    const [error, setError] = useState("")
    const [loadingStep, setLoadingStep] = useState(0)
    const resumeInputRef = useRef(null)

    const navigate = useNavigate()

    // Rotate loading messages while generation is in progress
    useEffect(() => {
        if (!loading) {
            setLoadingStep(0)
            return
        }

        const interval = setInterval(() => {
            setLoadingStep(prev => (prev + 1) % LOADING_MESSAGES.length)
        }, 3500)

        return () => clearInterval(interval)
    }, [loading])

    const handleFileChange = (e) => {
        const file = e.target.files?.[0]
        if (file) {
            if (file.type !== "application/pdf") {
                setError("Please upload a PDF file only.")
                return
            }
            setSelectedFile(file)
            setError("")
        }
    }

    const handleDragOver = (e) => {
        e.preventDefault()
        e.stopPropagation()
        setDragActive(true)
    }

    const handleDragLeave = (e) => {
        e.preventDefault()
        e.stopPropagation()
        setDragActive(false)
    }

    const handleDrop = (e) => {
        e.preventDefault()
        e.stopPropagation()
        setDragActive(false)

        const file = e.dataTransfer.files?.[0]
        if (file) {
            if (file.type !== "application/pdf") {
                setError("Only PDF resumes are supported.")
                return
            }
            setSelectedFile(file)
            setError("")
            if (resumeInputRef.current) {
                // Transfer file to input ref
                const dataTransfer = new DataTransfer()
                dataTransfer.items.add(file)
                resumeInputRef.current.files = dataTransfer.files
            }
        }
    }

    const handleRemoveFile = (e) => {
        e.stopPropagation()
        setSelectedFile(null)
        if (resumeInputRef.current) {
            resumeInputRef.current.value = ""
        }
    }

    const handleApplyTemplate = (template) => {
        setJobDescription(template.description)
        setError("")
    }

    const handleGenerateReport = async () => {
        setError("")

        if (!jobDescription.trim()) {
            setError("Please provide a target job description.")
            return
        }

        const resumeFile = selectedFile || resumeInputRef.current?.files?.[0]

        if (!resumeFile && !selfDescription.trim()) {
            setError("Please upload a resume (PDF) or enter a quick self-description.")
            return
        }

        const data = await generateReport({
            jobDescription,
            selfDescription,
            resumeFile
        })

        if (!data) {
            setError("Failed to generate interview strategy. Please try again.")
            return
        }

        navigate(`/interview/${data._id}`)
    }

    const handleLogoutClick = async () => {
        await handleLogout()
        navigate('/login')
    }

    const formatFileSize = (bytes) => {
        if (!bytes) return ""
        const kb = bytes / 1024
        if (kb < 1024) return `${kb.toFixed(1)} KB`
        return `${(kb / 1024).toFixed(1)} MB`
    }

    if (loading) {
        return (
            <main className='ai-loading-container'>
                <div className='ai-orb-wrapper'>
                    <div className='ai-orb-ring' />
                    <div className='ai-orb-ring ai-orb-ring--reverse' />
                    <div className='ai-orb'>
                        <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M12 3l7 7-7 7-7-7 7-7z" />
                            <path d="M3 14l7 7 7-7" />
                            <path d="M14 3l7 7" />
                        </svg>
                    </div>
                </div>

                <div className='ai-loading-text'>
                    <h2>Generating Your Interview Strategy</h2>
                    <p>{LOADING_MESSAGES[loadingStep]}</p>
                    <div className='ai-progress-steps'>
                        {LOADING_MESSAGES.map((_, i) => (
                            <span key={i} className={`ai-progress-dot ${i === loadingStep ? 'active' : ''}`} />
                        ))}
                    </div>
                </div>
            </main>
        )
    }

    return (
        <div className='home-page'>
            {/* Topbar */}
            <header className='home-topbar'>
                <div className='home-brand'>
                    <span className='home-brand__icon' aria-label='HirePrep icon'>
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M12 2L2 7l10 5 10-5-10-5z" />
                            <path d="M2 17l10 5 10-5" />
                            <path d="M2 12l10 5 10-5" />
                        </svg>
                    </span>
                    <span className='home-brand__title'>HirePrep</span>
                    <span className='home-brand__tag'>AI</span>
                </div>

                <div className='topbar-right'>
                    {user && (
                        <div className='user-pill'>
                            <span className='user-pill__avatar'>
                                {(user.name || user.email || 'U')[0].toUpperCase()}
                            </span>
                            <span>{user.name || user.email}</span>
                        </div>
                    )}
                    <button onClick={handleLogoutClick} className='topbar-logout' title='Log out of your account'>
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                            <polyline points="16 17 21 12 16 7" />
                            <line x1="21" y1="12" x2="9" y2="12" />
                        </svg>
                        Logout
                    </button>
                </div>
            </header>

            {/* Hero Section */}
            <section className='page-header'>
                <div className='hero-pill'>
                    <span className='hero-pill__pulse' />
                    AI Interview Intelligence
                </div>
                <h1>Craft Your Winning <span className='highlight'>Interview Strategy</span></h1>
                <p>Upload your resume and target job description. Our AI evaluates role alignment, creates deep technical questions, prepares STAR behavioral guidance, and charts your preparation roadmap.</p>
            </section>

            {/* Error Notification Banner */}
            {error && (
                <div className='error-banner' role='alert'>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10" />
                        <line x1="12" y1="8" x2="12" y2="12" />
                        <line x1="12" y1="16" x2="12.01" y2="16" />
                    </svg>
                    <span>{error}</span>
                </div>
            )}

            {/* Main Interactive Card */}
            <div className='interview-card'>
                <div className='interview-card__body'>

                    {/* Left Panel: Target Job Description */}
                    <div className='panel panel--left'>
                        <div className='panel__header'>
                            <span className='panel__icon'>
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                                    <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                                </svg>
                            </span>
                            <h2>Target Job Description</h2>
                            <span className='badge badge--required'>Required</span>
                        </div>

                        {/* Quick Autofill Templates */}
                        <div className='quick-fill-row'>
                            <span className='quick-fill-label'>Quick Fill:</span>
                            {QUICK_TEMPLATES.map((tmpl, index) => (
                                <button
                                    key={index}
                                    type='button'
                                    className='quick-fill-btn'
                                    onClick={() => handleApplyTemplate(tmpl)}
                                >
                                    {tmpl.title}
                                </button>
                            ))}
                        </div>

                        <div className='panel__textarea-container'>
                            <textarea
                                value={jobDescription}
                                onChange={(e) => setJobDescription(e.target.value)}
                                className='panel__textarea'
                                placeholder="Paste the job description here (responsibilities, required tech stack, seniority requirements)..."
                                maxLength={5000}
                            />
                            <div className={`char-counter ${jobDescription.length > 4500 ? 'warning' : ''}`}>
                                {jobDescription.length} / 5000
                            </div>
                        </div>
                    </div>

                    {/* Divider */}
                    <div className='panel-divider' />

                    {/* Right Panel: Candidate Profile */}
                    <div className='panel panel--right'>
                        <div className='panel__header'>
                            <span className='panel__icon'>
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                                    <circle cx="12" cy="7" r="4" />
                                </svg>
                            </span>
                            <h2>Your Profile</h2>
                        </div>

                        {/* Resume Dropzone */}
                        <div className='upload-section'>
                            <div className='section-label'>
                                <span>Upload Resume</span>
                                <span className='badge badge--best'>Recommended</span>
                            </div>

                            {selectedFile ? (
                                <div className='selected-file-card'>
                                    <div className='selected-file-info'>
                                        <svg className='file-icon' xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                                            <polyline points="14 2 14 8 20 8" />
                                            <line x1="16" y1="13" x2="8" y2="13" />
                                            <line x1="16" y1="17" x2="8" y2="17" />
                                        </svg>
                                        <div>
                                            <p className='file-name'>{selectedFile.name}</p>
                                            <span className='file-size'>{formatFileSize(selectedFile.size)}</span>
                                        </div>
                                    </div>
                                    <button
                                        type='button'
                                        className='file-remove-btn'
                                        onClick={handleRemoveFile}
                                        title="Remove attached resume"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <line x1="18" y1="6" x2="6" y2="18" />
                                            <line x1="6" y1="6" x2="18" y2="18" />
                                        </svg>
                                    </button>
                                </div>
                            ) : (
                                <label
                                    className={`dropzone ${dragActive ? 'drag-active' : ''}`}
                                    htmlFor='resume-input'
                                    onDragOver={handleDragOver}
                                    onDragLeave={handleDragLeave}
                                    onDrop={handleDrop}
                                >
                                    <span className='dropzone__icon'>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <polyline points="16 16 12 12 8 16" />
                                            <line x1="12" y1="12" x2="12" y2="21" />
                                            <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3" />
                                        </svg>
                                    </span>
                                    <p className='dropzone__title'>Click to browse or drag & drop</p>
                                    <p className='dropzone__subtitle'>PDF only (Max 3MB)</p>
                                    <input
                                        ref={resumeInputRef}
                                        onChange={handleFileChange}
                                        hidden
                                        type='file'
                                        id='resume-input'
                                        name='resume'
                                        accept='.pdf'
                                    />
                                </label>
                            )}
                        </div>

                        {/* OR Divider */}
                        <div className='or-divider'>
                            <span>OR SPECIFY SUMMARY</span>
                        </div>

                        {/* Self Description Box */}
                        <div className='self-description'>
                            <label className='section-label' htmlFor='selfDescription'>
                                Quick Background Summary
                            </label>
                            <textarea
                                value={selfDescription}
                                onChange={(e) => setSelfDescription(e.target.value)}
                                id='selfDescription'
                                name='selfDescription'
                                className='panel__textarea panel__textarea--short'
                                placeholder="Highlight your years of experience, core tech stack, and standout achievements..."
                            />
                        </div>

                        {/* Guidance Box */}
                        <div className='info-box'>
                            <span className='info-box__icon'>
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <circle cx="12" cy="12" r="10" />
                                    <line x1="12" y1="16" x2="12" y2="12" />
                                    <line x1="12" y1="8" x2="12.01" y2="8" />
                                </svg>
                            </span>
                            <p>For maximum fidelity, provide a <strong>PDF resume</strong> with your target <strong>job description</strong>.</p>
                        </div>
                    </div>
                </div>

                {/* Card Footer */}
                <div className='interview-card__footer'>
                    <div className='footer-info'>
                        <span className='footer-info-dot' />
                        <span>Powered by Google Gemini Models • Generation takes ~15-25 seconds</span>
                    </div>

                    <button
                        type='button'
                        onClick={handleGenerateReport}
                        className='generate-btn'
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                        </svg>
                        Generate Interview Strategy
                    </button>
                </div>
            </div>

            {/* Recent Reports Dashboard Section */}
            {reports && reports.length > 0 && (
                <section className='recent-reports'>
                    <div className='recent-reports__header'>
                        <h2>
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="12" cy="12" r="10" />
                                <polyline points="12 6 12 12 16 14" />
                            </svg>
                            Recent Interview Strategies
                            <span className='reports-count'>{reports.length}</span>
                        </h2>
                    </div>

                    <div className='reports-grid'>
                        {reports.map((report) => {
                            const scoreClass =
                                report.matchScore >= 80 ? 'score--high' :
                                report.matchScore >= 60 ? 'score--mid' : 'score--low'

                            return (
                                <div
                                    key={report._id}
                                    className='report-card'
                                    onClick={() => navigate(`/interview/${report._id}`)}
                                >
                                    <div className='report-card__header'>
                                        <h3 className='report-card__title'>{report.title || 'Target Position Strategy'}</h3>
                                        <span className={`report-score-pill ${scoreClass}`}>
                                            {report.matchScore}%
                                        </span>
                                    </div>

                                    <div className='report-card__footer'>
                                        <span className='report-card__date'>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                                                <line x1="16" y1="2" x2="16" y2="6" />
                                                <line x1="8" y1="2" x2="8" y2="6" />
                                                <line x1="3" y1="10" x2="21" y2="10" />
                                            </svg>
                                            {new Date(report.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                        </span>
                                        <span className='report-card__arrow'>
                                            View Report &rarr;
                                        </span>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </section>
            )}

            {/* Footer */}
            <footer className='page-footer'>
                <a href='#'>HirePrep Intelligence</a>
                <span>&bull;</span>
                <a href='#'>Documentation</a>
                <span>&bull;</span>
                <a href='#'>Privacy & Terms</a>
            </footer>
        </div>
    )
}

export default Home