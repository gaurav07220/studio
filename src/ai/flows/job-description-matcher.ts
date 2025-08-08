'use server';

/**
 * @fileOverview Matches a resume against a job description and provides suggestions.
 *
 * - jobDescriptionMatcher - A function that handles the job description matching process.
 * - JobDescriptionMatcherInput - The input type for the jobDescriptionMatcher function.
 * - JobDescriptionMatcherOutput - The return type for the jobDescriptionMatcher function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const JobDescriptionMatcherInputSchema = z.object({
  resumeText: z
    .string()
    .describe('The text content of the resume to be analyzed.'),
  jobDescriptionText: z
    .string()
    .describe('The text content of the job description to match against.'),
});
export type JobDescriptionMatcherInput = z.infer<typeof JobDescriptionMatcherInputSchema>;

const JobDescriptionMatcherOutputSchema = z.object({
  matchedSkills: z.array(z.string()).describe('Skills from the resume that match skills required in the job description.'),
  missingSkills: z.array(z.string()).describe('Skills required in the job description that are missing from the resume.'),
  resumeAlignmentSuggestions: z.string().describe('Suggestions on how to align the resume with the job requirements.'),
});
export type JobDescriptionMatcherOutput = z.infer<typeof JobDescriptionMatcherOutputSchema>;

export async function jobDescriptionMatcher(input: JobDescriptionMatcherInput): Promise<JobDescriptionMatcherOutput> {
  return jobDescriptionMatcherFlow(input);
}

const prompt = ai.definePrompt({
  name: 'jobDescriptionMatcherPrompt',
  input: {schema: JobDescriptionMatcherInputSchema},
  output: {schema: JobDescriptionMatcherOutputSchema},
  prompt: `You are a career advisor. Compare the provided resume with the job description and identify matched skills, missing skills, and provide suggestions on how to improve the resume to better align with the job requirements.

Resume:
{{resumeText}}

Job Description:
{{jobDescriptionText}}

Output:
- List the skills from the resume that match skills required in the job description.
- List the skills required in the job description that are missing from the resume.
- Provide specific suggestions on how to align the resume with the job requirements.
`,
});

const jobDescriptionMatcherFlow = ai.defineFlow(
  {
    name: 'jobDescriptionMatcherFlow',
    inputSchema: JobDescriptionMatcherInputSchema,
    outputSchema: JobDescriptionMatcherOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
