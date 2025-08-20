
'use server';

/**
 * @fileOverview A Genkit flow for generating a personalized cover letter.
 *
 * - generateCoverLetter - A function that creates a cover letter based on a resume and job description.
 * - CoverLetterGeneratorInput - The input type for the generateCoverLetter function.
 * - CoverLetterGeneratorOutput - The return type for the generateCoverLetter function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { getFirebaseUid } from 'genkit/next';
import { doc, setDoc, increment } from 'firebase/firestore';
import { db } from '@/lib/firebase';

const CoverLetterGeneratorInputSchema = z.object({
  resumeText: z.string().describe('The full text of the user\'s resume.'),
  jobDescriptionText: z.string().describe('The full text of the job description.'),
});
export type CoverLetterGeneratorInput = z.infer<typeof CoverLetterGeneratorInputSchema>;

const CoverLetterGeneratorOutputSchema = z.object({
  coverLetter: z.string().describe('The generated personalized cover letter text.'),
});
export type CoverLetterGeneratorOutput = z.infer<typeof CoverLetterGeneratorOutputSchema>;

export async function generateCoverLetter(input: CoverLetterGeneratorInput): Promise<CoverLetterGeneratorOutput> {
  return generateCoverLetterFlow(input);
}

const prompt = ai.definePrompt({
  name: 'coverLetterGeneratorPrompt',
  input: {schema: CoverLetterGeneratorInputSchema},
  output: {schema: CoverLetterGeneratorOutputSchema},
  prompt: `You are an expert career coach specializing in writing compelling cover letters.

Given the user's resume and a specific job description, generate a personalized, professional, and enthusiastic cover letter.

**Your Task:**
1.  **Analyze Both Documents:** Carefully read the resume to understand the candidate's skills and experience. Analyze the job description to identify key requirements and company values.
2.  **Structure the Letter:** Create a standard cover letter format (introduction, body paragraphs, conclusion).
3.  **Personalize the Content:**
    *   In the introduction, state the position being applied for.
    *   In the body, highlight 2-3 key experiences or skills from the resume that directly match the most important requirements in the job description. Do not just list skills; explain how the candidate has applied them.
    *   Connect the candidate's experience to the company's mission or values if possible.
4.  **Maintain a Professional Tone:** The tone should be confident and professional, but also show genuine interest in the role.
5.  **Keep it Concise:** The ideal cover letter is around 3-4 paragraphs long.

**Resume Text:**
{{{resumeText}}}

**Job Description Text:**
{{{jobDescriptionText}}}
`,
});

const generateCoverLetterFlow = ai.defineFlow(
  {
    name: 'generateCoverLetterFlow',
    inputSchema: CoverLetterGeneratorInputSchema,
    outputSchema: CoverLetterGeneratorOutputSchema,
    auth: {
      required: true,
    }
  },
  async (input, context) => {
    const uid = getFirebaseUid(context);
    if (uid) {
        const userDocRef = doc(db, 'users', uid);
        await setDoc(userDocRef, { coverLettersGenerated: increment(1) }, { merge: true });
    }
    
    const {output} = await prompt(input);
    return output!;
  }
);
