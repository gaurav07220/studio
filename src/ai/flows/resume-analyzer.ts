// This file holds the Genkit flow for the resumeAnalysisFeedback story.
'use server';
/**
 * @fileOverview This file contains the resume analysis flow, input and output types.
 *
 * - resumeAnalysisFeedback - Analyzes resume and provides feedback.
 * - ResumeAnalysisInput - The input type for the resumeAnalysisFeedback function.
 * - ResumeAnalysisOutput - The return type for the resumeAnalysisFeedback function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ResumeAnalysisInputSchema = z.object({
  resumeDataUri: z
    .string()
    .describe(
      "The resume file as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type ResumeAnalysisInput = z.infer<typeof ResumeAnalysisInputSchema>;

const ResumeAnalysisOutputSchema = z.object({
  summary: z.string().describe("A brief one-paragraph summary of the resume's strengths and weaknesses."),
  atsCompatibilityScore: z.number().describe('A score from 0 to 100 indicating how well the resume is optimized for Applicant Tracking Systems (ATS).'),
  strengths: z.array(z.string()).describe('A list of key strengths of the resume.'),
  areasForImprovement: z.array(z.string()).describe('A list of specific areas where the resume can be improved.'),
  keywordAnalysis: z.object({
    extractedKeywords: z.array(z.string()).describe('A list of the most relevant keywords and skills extracted from the resume.'),
    suggestions: z.string().describe('Suggestions for adding or optimizing keywords to better match common job descriptions in the relevant field.'),
  }),
  formattingAndReadability: z.object({
    feedback: z.string().describe('Feedback on the resume\'s formatting, layout, and readability.'),
    suggestions: z.array(z.string()).describe('A list of specific suggestions to improve formatting and readability.'),
  }),
});
export type ResumeAnalysisOutput = z.infer<typeof ResumeAnalysisOutputSchema>;

export async function resumeAnalysisFeedback(input: ResumeAnalysisInput): Promise<ResumeAnalysisOutput> {
  return resumeAnalysisFeedbackFlow(input);
}

const prompt = ai.definePrompt({
  name: 'resumeAnalysisFeedbackPrompt',
  input: {schema: ResumeAnalysisInputSchema},
  output: {schema: ResumeAnalysisOutputSchema},
  prompt: `You are an expert career coach and professional resume reviewer. A user will upload their resume and you will provide a comprehensive analysis.

  Analyze the following resume:
  {{media url=resumeDataUri}}

  Provide a detailed report covering the following areas:
  1.  **Summary**: A brief one-paragraph overview of the resume.
  2.  **ATS Compatibility Score**: Assign a score from 0-100 based on ATS-friendliness (standard format, clear headings, relevant keywords, etc.). A higher score is better.
  3.  **Strengths**: Identify the strongest aspects of the resume.
  4.  **Areas for Improvement**: Pinpoint specific, actionable weaknesses.
  5.  **Keyword Analysis**: Extract key skills and suggest others that might be missing for common roles in the candidate's likely field.
  6.  **Formatting and Readability**: Comment on the layout, font, and overall visual presentation and provide suggestions for improvement.
  `,
});

const resumeAnalysisFeedbackFlow = ai.defineFlow(
  {
    name: 'resumeAnalysisFeedbackFlow',
    inputSchema: ResumeAnalysisInputSchema,
    outputSchema: ResumeAnalysisOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
