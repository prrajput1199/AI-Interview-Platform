import { GoogleGenerativeAI, GenerativeModel } from "@google/generative-ai";

export class GeminiService {
    private model: GenerativeModel;

    constructor() {
        const GenAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        this.model = GenAI.getGenerativeModel({ model: "gemini-pro" })
    }


    async generateQuestion(role: string, difficulty: string, count: number): Promise<string[]> {
        try {
            const prompt = `
        Generate ${count} interview questions for a ${difficulty} level ${role} position.
        Questions should be challenging and relevant to the role.
        Return only the questions as a JSON array of strings.
        Example: ["Question 1", "Question 2", "Question 3"]
      `;

            const result = await this.model.generateContent(prompt);
            const response = await result.response;
            const text = response.text();

            try {
                const questions = JSON.parse(text);
                return questions;
            } catch (error) {
                // If not JSON, split by new lines
                return text.split('\n').filter(q => q.trim().length > 0);
            }
        } catch (error) {
            console.error("Gemini generate question error", error);
            throw new Error("Failed to Generate Questions")
        }
    }


    async evaluateAnswer(question: string, answer: string): Promise<{
        score: number,
        feedback: string,
        keywords: string[]
    }> {

        try {
            const prompt = `
                  Question: "${question}"
        Candidate's Answer: "${answer}"
        
        Evaluate this answer for a job interview.
        Provide:
        1. A score from 0-10 (decimal allowed)
        2. Brief feedback (1-2 sentences)
        3. Key keywords/topics mentioned
        
        Return as JSON:
        {
          "score": 7.5,
          "feedback": "Good answer, but could be more specific...",
          "keywords": ["keyword1", "keyword2"]
        }
            `

            const result = await this.model.generateContent(prompt);
            const response = await result.response;
            const text = response.text();

            try {
                const evaluation = JSON.parse(text);

                return {
                    score: evaluation.score || 5,
                    feedback: evaluation.feedback || "Could be improved",
                    keywords: evaluation.keywords || []
                };
            } catch (error) {
                // Fallback if parsing fails
                return {
                    score: 5,
                    feedback: 'Answer received but could not be properly evaluated.',
                    keywords: []
                };
            }
        } catch (error) {
           console.error("Gemini Evaluate Error",error);
           throw new Error("Failed to evaluate answer");
        }
    }

    async generateReport(question:string[],answers:string[]): Promise<{
      overallScore:number,
      strengths:string[],
      weaknesses:string[]
      suggestions:string[],
      summary:string
    }>{
        try {
            const qaPairs = question.map((q,i)=> `Q${i+1}: ${q}\nA${i+1}: ${answers[i] || "Not answered"}`).join('\n\n');

              const prompt = `
        Interview Transcript:
        ${qaPairs}
        
        Generate a comprehensive interview report.
        Provide:
        1. Overall score (0-10)
        2. Key strengths (3-5 points)
        3. Areas for improvement/weaknesses (3-5 points)
        4. Specific suggestions for improvement (3-5 points)
        5. Brief summary paragraph
        
        Return as JSON:
        {
          "overallScore": 7.2,
          "strengths": ["Strength 1", "Strength 2"],
          "weaknesses": ["Weakness 1", "Weakness 2"],
          "suggestions": ["Suggestion 1", "Suggestion 2"],
          "summary": "Overall, the candidate..."
        }
      `;

         const result = await this.model.generateContent(prompt);
         const response = await result.response;
         const text  = response.text();

         try {
            const report = JSON.parse(text);
            return report;
         } catch (error) {
            return {
          overallScore: 5,
          strengths: ['Good attempt'],
          weaknesses: ['Could be more prepared'],
          suggestions: ['Practice more interviews'],
          summary: 'A basic interview performance.'
        };
         }
        } catch (error) {
            console.error("Gemini Report generation error",error);
            throw new Error("Failed to generate report");
        }
    }


    
}



