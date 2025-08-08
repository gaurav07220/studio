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
  feedback: z.string().describe('Feedback on how to improve the resume, including ATS compatibility and keyword optimization.'),
});
export type ResumeAnalysisOutput = z.infer<typeof ResumeAnalysisOutputSchema>;

export async function resumeAnalysisFeedback(input: ResumeAnalysisInput): Promise<ResumeAnalysisOutput> {
  return resumeAnalysisFeedbackFlow(input);
}

const prompt = ai.definePrompt({
  name: 'resumeAnalysisFeedbackPrompt',
  input: {schema: ResumeAnalysisInputSchema},
  output: {schema: ResumeAnalysisOutputSchema},
  prompt: `You are an expert career coach. A user will upload their resume and you will provide feedback on how to improve it, including ATS compatibility and keyword optimization.

  Here is the resume:
  {{media url=resumeDataUri}}
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
