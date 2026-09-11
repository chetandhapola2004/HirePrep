const { GoogleGenAI } = require("@google/genai")
const { z } = require("zod")
const { zodToJsonSchema } = require("zod-to-json-schema")

const ai = new GoogleGenAI({
    apiKey: process.env.GOOGLE_GENAI_API_KEY
})

const PRIMARY_MODEL = process.env.GEMINI_MODEL || "gemini-3.6-flash"
const FALLBACK_MODEL = "gemini-3-flash-preview"

const SYSTEM_INSTRUCTION = `You are an elite Tech Hiring Director, Principal Engineer, and Career Coach with extensive hiring experience at leading technology firms.
Your objective is to conduct a thorough, realistic, and highly customized interview preparation analysis by comparing a candidate's profile (resume and/or self-description) against a target job description.

Follow these strict guidelines:
1. Calibrated Match Score: Calculate an objective 0-100 score reflecting true alignment with core requirements, seniority level, must-have technologies, and domain depth. Avoid arbitrary high scores; be realistic and constructive.
2. High-Impact Technical Questions: Generate deep, scenario-driven questions tailored specifically to the technologies, architecture patterns, and responsibilities in the job description. Provide comprehensive model answers that cover core principles, trade-offs, edge cases, and best practices.
3. Structured Behavioral Questions: Generate challenging situational and behavioral questions relevant to team dynamics, project delivery, and cross-functional leadership for this role. Provide model answers structured with the STAR methodology (Situation, Task, Action, Result).
4. Critical Skill Gaps: Identify real gaps between the candidate's background and the job requirements, categorizing each gap's severity (low, medium, high) based on how essential it is to the role.
5. Actionable Roadmap: Construct a structured, progressive day-wise preparation plan with concrete, practical tasks (coding practice, system design diagrams, mock interview drills, revision).
6. Job Title Extraction: Extract a concise, professional job title accurately summarizing the target role.`

const interviewReportSchema = z.object({
    matchScore: z.number().min(0).max(100).describe("An objective score between 0 and 100 indicating how well the candidate's profile matches the job requirements"),
    technicalQuestions: z.array(z.object({
        question: z.string().describe("A targeted technical or system design question specifically relevant to the job requirements and tech stack"),
        intention: z.string().describe("What the interviewer is evaluating (e.g. architectural understanding, algorithmic thinking, edge case handling, debugging)"),
        answer: z.string().describe("A thorough model answer explaining key concepts, trade-offs, best practices, and code or architecture patterns")
    })).describe("Technical questions tailored to the role and tech stack along with their evaluation intent and comprehensive model answers"),
    behavioralQuestions: z.array(z.object({
        question: z.string().describe("A realistic behavioral, situational, or leadership question assessing communication, ownership, and conflict resolution"),
        intention: z.string().describe("The core competency and mindset the interviewer is evaluating (e.g. resilience under pressure, collaboration, problem ownership)"),
        answer: z.string().describe("A model answer structured around the STAR method (Situation, Task, Action, Result) highlighting authentic talking points")
    })).describe("Behavioral questions relevant to the position with interviewer intentions and STAR-formatted model answers"),
    skillGaps: z.array(z.object({
        skill: z.string().describe("Specific skill, tool, framework, or concept required or preferred by the job that is missing or weak in the candidate's profile"),
        severity: z.enum([ "low", "medium", "high" ]).describe("The severity of this skill gap based on how critical the skill is to the target role")
    })).describe("Identified gaps in the candidate's profile relative to the job requirements with severity levels"),
    preparationPlan: z.array(z.object({
        day: z.number().describe("The day number in the preparation plan, starting from 1"),
        focus: z.string().describe("The core theme or milestone for this day (e.g. Core Framework Internals, Scalability and System Design, Live Coding Drills, Behavioral Stories)"),
        tasks: z.array(z.string()).describe("Actionable, high-impact tasks to execute on this day (e.g. study specific topics, solve curated problem patterns, perform mock interviews)")
    })).describe("A progressive day-wise preparation roadmap for the candidate to master the target role"),
    title: z.string().describe("A concise, professional job title extracted from the job description (e.g. 'Senior Full Stack Engineer')"),
})

function buildPrompt({ resume, selfDescription, jobDescription }) {
    const candidateSections = []

    if (resume?.trim()) {
        candidateSections.push(`### Candidate Resume Content:\n${resume.trim()}`)
    }

    if (selfDescription?.trim()) {
        candidateSections.push(`### Candidate Self-Description:\n${selfDescription.trim()}`)
    }

    const candidateProfile = candidateSections.length > 0
        ? candidateSections.join("\n\n")
        : "No explicit candidate resume or self-description was provided. Base the preparation report primarily on the requirements and competencies demanded by the job description."

    return `Please evaluate the following candidate against the target job description and generate a complete, structured interview preparation report:

### Target Job Description:
${jobDescription.trim()}

${candidateProfile}
`
}

function parseJsonSafely(rawText) {
    if (!rawText || typeof rawText !== "string") {
        throw new Error("Empty or invalid response received from AI model.")
    }

    let cleaned = rawText.trim()

    // Remove markdown code fences if present (e.g. ```json ... ```)
    if (cleaned.startsWith("```")) {
        cleaned = cleaned.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/i, "").trim()
    }

    return JSON.parse(cleaned)
}

async function callModelWithFallback({ contents, systemInstruction, responseSchema }) {
    const config = {
        responseMimeType: "application/json",
        responseSchema,
        ...(systemInstruction ? { systemInstruction } : {})
    }

    try {
        const response = await ai.models.generateContent({
            model: PRIMARY_MODEL,
            contents,
            config,
        })
        return parseJsonSafely(response.text)
    } catch (primaryError) {
        console.warn(`Primary model (${PRIMARY_MODEL}) failed, attempting fallback (${FALLBACK_MODEL}):`, primaryError.message)

        try {
            const fallbackResponse = await ai.models.generateContent({
                model: FALLBACK_MODEL,
                contents,
                config,
            })
            return parseJsonSafely(fallbackResponse.text)
        } catch (fallbackError) {
            console.error(`Fallback model (${FALLBACK_MODEL}) also failed:`, fallbackError.message)
            throw primaryError
        }
    }
}

/**
 * @description Generates a comprehensive interview preparation report based on candidate profile and target job description.
 */
async function generateInterviewReport({ resume, selfDescription, jobDescription }) {
    if (!jobDescription || !jobDescription.trim()) {
        throw new Error("Job description is required to generate an interview report.")
    }

    const prompt = buildPrompt({ resume, selfDescription, jobDescription })
    const jsonSchema = zodToJsonSchema(interviewReportSchema)

    const parsedData = await callModelWithFallback({
        contents: prompt,
        systemInstruction: SYSTEM_INSTRUCTION,
        responseSchema: jsonSchema,
    })

    // Validate structure against the zod schema for data integrity
    const validated = interviewReportSchema.safeParse(parsedData)
    if (!validated.success) {
        console.warn("AI response validation warning, using raw parsed data:", validated.error)
        return parsedData
    }

    return validated.data
}

/**
 * @description Helper stub for resume PDF generation compatibility with controllers.
 */
async function generateResumePdf({ resume, jobDescription, interviewReport }) {
    return {
        message: "Resume PDF generation helper initialized.",
        resume,
        jobDescription,
        interviewReport
    }
}

module.exports = {
    generateInterviewReport,
    generateResumePdf
}