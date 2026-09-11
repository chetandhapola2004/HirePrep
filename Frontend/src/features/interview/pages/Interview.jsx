import React, { useState, useEffect } from 'react'
import '../style/interview.css'
import { useInterview } from '../hooks/useInterview.js'
import { useAuth } from '../../auth/hooks/useAuth.js'
import { useNavigate, useParams } from 'react-router'

const NAV_ITEMS = [
    {
        id: 'technical',
        label: 'Technical Questions',
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="16 18 22 12 16 6" />
                <polyline points="8 6 2 12 8 18" />
            </svg>
        )
    },
    {
        id: 'behavioral',
        label: 'Behavioral Questions',
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
        )
    },
    {
        id: 'roadmap',
        label: 'Preparation Roadmap',
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="3 11 22 2 13 21 11 13 3 11" />
            </svg>
        )
    },
]

// ── Question Card Component ──
const QuestionCard = ({ item, index, isBehavioral }) => {
    const [open, setOpen] = useState(index === 0)
    const [copied, setCopied] = useState(false)

    const handleCopy = (e) => {
        e.stopPropagation()
        navigator.clipboard?.writeText(item.question)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    return (
        <div className={`q-card ${open ? 'q-card--open' : ''}`}>
            <div className='q-card__header' onClick={() => setOpen(o => !o)}>
                <span className='q-card__index'>Q{index + 1}</span>
                <p className='q-card__question'>{item.question}</p>
                <div className='q-card__actions'>
                    <button
                        type='button'
                        className='copy-q-btn'
                        onClick={handleCopy}
                        title={copied ? "Copied to clipboard!" : "Copy question"}
                    >
                        {copied ? (
                            <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="20 6 9 17 4 12" />
                            </svg>
                        ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                            </svg>
                        )}
                    </button>
                    <span className={`q-card__chevron ${open ? 'q-card__chevron--open' : ''}`}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="6 9 12 15 18 9" />
                        </svg>
                    </span>
                </div>
            </div>

            {open && (
                <div className='q-card__body'>
                    <div className='q-card__section'>
                        <span className='q-card__tag q-card__tag--intention'>
                            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="12" cy="12" r="10" />
                                <line x1="12" y1="16" x2="12" y2="12" />
                                <line x1="12" y1="8" x2="12.01" y2="8" />
                            </svg>
                            Interviewer Intention
                        </span>
                        <p className='q-card__text'>{item.intention}</p>
                    </div>

                    <div className='q-card__section'>
                        <span className='q-card__tag q-card__tag--answer'>
                            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="20 6 9 17 4 12" />
                            </svg>
                            {isBehavioral ? "STAR Model Response" : "Comprehensive Model Answer"}
                        </span>
                        <p className='q-card__text'>{item.answer}</p>
                    </div>
                </div>
            )}
        </div>
    )
}

// ── Roadmap Day Component with Checkboxes ──
const RoadMapDay = ({ day }) => {
    const [completedTasks, setCompletedTasks] = useState({})

    const toggleTask = (index) => {
        setCompletedTasks(prev => ({
            ...prev,
            [index]: !prev[index]
        }))
    }

    return (
        <div className='roadmap-day'>
            <div className='roadmap-card'>
                <div className='roadmap-day__header'>
                    <span className='roadmap-day__badge'>Day {day.day}</span>
                    <h3 className='roadmap-day__focus'>{day.focus}</h3>
                </div>

                <ul className='roadmap-day__tasks'>
                    {day.tasks.map((task, i) => {
                        const isDone = !!completedTasks[i]
                        return (
                            <li
                                key={i}
                                className={`roadmap-task-item ${isDone ? 'completed' : ''}`}
                                onClick={() => toggleTask(i)}
                            >
                                <input
                                    type='checkbox'
                                    checked={isDone}
                                    onChange={() => {}}
                                    className='task-checkbox'
                                />
                                <span>{task}</span>
                            </li>
                        )
                    })}
                </ul>
            </div>
        </div>
    )
}

// ── Main Dashboard Component ──
const Interview = () => {
    const [activeNav, setActiveNav] = useState('technical')
    const { report, getReportById, loading } = useInterview()
    const { user, handleLogout } = useAuth()
    const { interviewId } = useParams()
    const navigate = useNavigate()

    useEffect(() => {
        if (interviewId) {
            getReportById(interviewId)
        }
    }, [interviewId])

    const handleLogoutClick = async () => {
        await handleLogout()
        navigate('/login')
    }

    const handlePrint = () => {
        window.print()
    }

    if (loading || !report) {
        return (
            <main className='brand-loader-container'>
                <div className='brand-spinner' />
                <div className='brand-loader-text'>
                    <h2>Loading Your Interview Strategy</h2>
                    <p>Fetching tailored questions, match calibrations, and your study roadmap...</p>
                </div>
            </main>
        )
    }

    const score = report.matchScore ?? 75
    const scoreColor =
        score >= 80 ? 'score--high' :
        score >= 60 ? 'score--mid' : 'score--low'

    const verdictClass =
        score >= 80 ? 'verdict--high' :
        score >= 60 ? 'verdict--mid' : 'verdict--low'

    const verdictText =
        score >= 80 ? 'Exceptional Fit' :
        score >= 60 ? 'Solid Contender' : 'Growth Candidate'

    return (
        <div className='interview-page'>
            <div className='interview-layout'>

                {/* ── Left Sidebar Navigation ── */}
                <nav className='interview-nav'>
                    <div className='nav-header'>
                        <button
                            type='button'
                            className='back-to-home-btn'
                            onClick={() => navigate('/')}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="19" y1="12" x2="5" y2="12" />
                                <polyline points="12 19 5 12 12 5" />
                            </svg>
                            Back to Hub
                        </button>

                        <div className='interview-brand'>
                            <span className='interview-brand__icon'>
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M12 2L2 7l10 5 10-5-10-5z" />
                                    <path d="M2 17l10 5 10-5" />
                                    <path d="M2 12l10 5 10-5" />
                                </svg>
                            </span>
                            <span className='interview-brand__title'>HirePrep AI</span>
                        </div>
                    </div>

                    <div className='nav-content'>
                        <p className='interview-nav__label'>Strategy Sections</p>
                        {NAV_ITEMS.map(item => {
                            const count =
                                item.id === 'technical' ? report.technicalQuestions?.length :
                                item.id === 'behavioral' ? report.behavioralQuestions?.length :
                                item.id === 'roadmap' ? report.preparationPlan?.length : 0

                            return (
                                <button
                                    key={item.id}
                                    className={`interview-nav__item ${activeNav === item.id ? 'interview-nav__item--active' : ''}`}
                                    onClick={() => setActiveNav(item.id)}
                                >
                                    <div className='interview-nav__item-left'>
                                        <span className='interview-nav__icon'>{item.icon}</span>
                                        <span>{item.label}</span>
                                    </div>
                                    <span className='interview-nav__count'>{count}</span>
                                </button>
                            )
                        })}
                    </div>

                    <div className='nav-footer'>
                        {user && (
                            <div className='user-pill'>
                                <span className='user-pill__avatar'>
                                    {(user.name || user.email || 'U')[0].toUpperCase()}
                                </span>
                                <span>{user.name || user.email}</span>
                            </div>
                        )}
                        <button onClick={handleLogoutClick} className='logout-button'>
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                                <polyline points="16 17 21 12 16 7" />
                                <line x1="21" y1="12" x2="9" y2="12" />
                            </svg>
                            Logout
                        </button>
                    </div>
                </nav>

                <div className='interview-divider' />

                {/* ── Main Content Area ── */}
                <main className='interview-content'>
                    {/* Header Banner */}
                    <div className='content-header'>
                        <div className='content-header__top'>
                            <div className='content-header__title-group'>
                                <h1>{report.title || "Custom Interview Strategy"}</h1>
                                <div className='content-header__meta'>
                                    <span className='content-header__meta-item'>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                                            <line x1="16" y1="2" x2="16" y2="6" />
                                            <line x1="8" y1="2" x2="8" y2="6" />
                                            <line x1="3" y1="10" x2="21" y2="10" />
                                        </svg>
                                        Generated {new Date(report.createdAt).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}
                                    </span>
                                </div>
                            </div>

                            <div className='content-actions'>
                                <button
                                    type='button'
                                    className='action-pill-btn'
                                    onClick={handlePrint}
                                    title="Print or Save as PDF"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <polyline points="6 9 6 2 18 2 18 9" />
                                        <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
                                        <rect x="6" y="14" width="12" height="8" />
                                    </svg>
                                    Print Strategy
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Section 1: Technical Questions */}
                    {activeNav === 'technical' && (
                        <section>
                            <div className='section-headline'>
                                <h2>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <polyline points="16 18 22 12 16 6" />
                                        <polyline points="8 6 2 12 8 18" />
                                    </svg>
                                    Technical & Architectural Questions
                                </h2>
                                <span className='section-badge'>{report.technicalQuestions?.length} Questions</span>
                            </div>

                            <div className='q-list'>
                                {report.technicalQuestions?.map((q, i) => (
                                    <QuestionCard key={i} item={q} index={i} isBehavioral={false} />
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Section 2: Behavioral Questions */}
                    {activeNav === 'behavioral' && (
                        <section>
                            <div className='section-headline'>
                                <h2>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                                    </svg>
                                    Behavioral & Culture Fit Scenarios
                                </h2>
                                <span className='section-badge'>{report.behavioralQuestions?.length} Questions</span>
                            </div>

                            <div className='q-list'>
                                {report.behavioralQuestions?.map((q, i) => (
                                    <QuestionCard key={i} item={q} index={i} isBehavioral={true} />
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Section 3: Preparation Roadmap */}
                    {activeNav === 'roadmap' && (
                        <section>
                            <div className='section-headline'>
                                <h2>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <polygon points="3 11 22 2 13 21 11 13 3 11" />
                                    </svg>
                                    Daily Preparation Roadmap
                                </h2>
                                <span className='section-badge'>{report.preparationPlan?.length}-Day Plan</span>
                            </div>

                            <div className='roadmap-list'>
                                {report.preparationPlan?.map((day) => (
                                    <RoadMapDay key={day.day} day={day} />
                                ))}
                            </div>
                        </section>
                    )}
                </main>

                <div className='interview-divider' />

                {/* ── Right Sidebar: Analysis & Gaps ── */}
                <aside className='interview-sidebar'>
                    {/* Match Score Card */}
                    <div className='match-score-card'>
                        <p className='match-score__label'>Profile Alignment</p>
                        <div className={`match-score__gauge ${scoreColor}`}>
                            <span className='match-score__value'>{score}</span>
                            <span className='match-score__pct'>/ 100</span>
                        </div>
                        <span className={`match-verdict-pill ${verdictClass}`}>
                            {verdictText}
                        </span>
                    </div>

                    <div className='sidebar-divider' />

                    {/* Skill Gaps Card */}
                    <div className='skill-gaps'>
                        <div className='skill-gaps__header'>
                            <p className='skill-gaps__label'>Identified Gaps</p>
                            <span className='skill-gaps__count'>{report.skillGaps?.length || 0}</span>
                        </div>

                        <div className='skill-gaps__list'>
                            {report.skillGaps && report.skillGaps.length > 0 ? (
                                report.skillGaps.map((gap, i) => (
                                    <div key={i} className='skill-gap-item'>
                                        <span className='skill-gap-name' title={gap.skill}>
                                            {gap.skill}
                                        </span>
                                        <span className={`severity-pill severity--${gap.severity}`}>
                                            {gap.severity}
                                        </span>
                                    </div>
                                ))
                            ) : (
                                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                                    No significant skill gaps identified.
                                </p>
                            )}
                        </div>
                    </div>
                </aside>
            </div>
        </div>
    )
}

export default Interview