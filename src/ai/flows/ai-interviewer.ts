
'use server';

/**
 * @fileOverview A Genkit flow for conducting a mock AI-powered job interview.
 *
 * - conductInterview - A function that drives the interview conversation.
 * - AiInterviewerInput - The input type for the conductInterview function.
 * - AiInterviewerOutput - The return type for the conductInterview function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';


const AiInterviewerInputSchema = z.object({
  jobDescription: z.string().describe('The job description for the role.'),
  history: z.array(z.string()).describe('The conversation history between the AI and the user. Each entry is a string formatted as "role: content".'),
});
export type AiInterviewerInput = z.infer<typeof AiInterviewerInputSchema>;

const AiInterviewerOutputSchema = z.object({
  response: z.string().describe('The AI\'s response, which could be the next question or the final report.'),
});
export type AiInterviewerOutput = z.infer<typeof AiInterviewerOutputSchema>;

export async function conductInterview(input: AiInterviewerInput): Promise<AiInterviewerOutput> {
  return conductInterviewFlow(input);
}

const interviewPrompt = ai.definePrompt({
  name: 'interviewPrompt',
  input: {schema: AiInterviewerInputSchema},
  output: {schema: AiInterviewerOutputSchema},
  prompt: `You are an expert AI interviewer conducting a mock interview for a job candidate.

  **Job Description:**
  {{{jobDescription}}}

  **Your Task:**
  1.  Ask relevant questions based on the job description, one at a time. Cover technical skills, behavioral questions, and past experience.
  2.  After the user provides an answer, ask the next logical question. Keep the conversation flowing naturally.
  3.  If the user asks to end the interview OR you feel you have asked enough questions (around 5-7 questions), you MUST end the interview.
  4.  To end the interview, you MUST respond with the exact phrase "INTERVIEW_COMPLETE" followed by a detailed performance report in Markdown format.

  **Performance Report Structure (use Markdown formatting):**
  - **## Overall Summary**
    - A brief overview of the candidate's performance.
  - **## Strengths**
    - Use a bulleted list to highlight specific strengths.
  - **## Areas for Improvement**
    - Use a bulleted list for constructive feedback on weak answers.
  - **## Sample Answers**
    - For each area of improvement, provide an example of a stronger answer under a sub-heading (e.g., ### For the question about X...).
  - **## Final Recommendation**
    - A concluding thought on the candidate's suitability for the role.

  **Conversation History:**
  {{#each history}}
  {{{this}}}
  {{/each}}
  `,
});

const conductInterviewFlow = ai.defineFlow(
  {
    name: 'conductInterviewFlow',
    inputSchema: AiInterviewerInputSchema,
    outputSchema: AiInterviewerOutputSchema,
  },
  async input => {
    const {output} = await interviewPrompt(input);
    return output!;
  }
);
