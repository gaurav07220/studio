// This file is machine-generated - edit at your own risk.

'use server';

/**
 * @fileOverview Provides recommendations for courses and certifications based on skill gaps and career goals.
 *
 * - upskillingRecommender - A function that recommends courses and certifications.
 * - UpskillingRecommenderInput - The input type for the upskillingRecommender function.
 * - UpskillingRecommenderOutput - The return type for the upskillingRecommender function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const UpskillingRecommenderInputSchema = z.object({
  skillGaps: z
    .string()
    .describe('Identified skill gaps that need to be addressed.'),
  careerGoals: z
    .string()
    .describe('The user\'s desired career goals and aspirations.'),
  preferredPlatforms: z
    .string()
    .optional()
    .describe(
      'Optional: Preferred learning platforms like Coursera, Udemy, etc.'
    ),
});
export type UpskillingRecommenderInput = z.infer<
  typeof UpskillingRecommenderInputSchema
>;

const CourseRecommendationSchema = z.object({
    name: z.string().describe("The full name of the course."),
    platform: z.string().describe("The platform where the course is offered (e.g., Coursera, Udemy)."),
    description: z.string().describe("A brief, compelling summary of what the user will learn."),
    url: z.string().url().describe("A direct, valid URL to the course enrollment page."),
});

const UpskillingRecommenderOutputSchema = z.object({
  courseRecommendations: z
    .array(CourseRecommendationSchema)
    .describe('A list of recommended courses to bridge the skill gaps.'),
  certificationRecommendations: z
    .string()
    .describe('Recommended certifications to enhance career prospects, in Markdown format.'),
  additionalResources: z
    .string()
    .optional()
    .describe('Any additional resources that might be helpful, in Markdown format.'),
});
export type UpskillingRecommenderOutput = z.infer<
  typeof UpskillingRecommenderOutputSchema
>;

export async function upskillingRecommender(
  input: UpskillingRecommenderInput
): Promise<UpskillingRecommenderOutput> {
  return upskillingRecommenderFlow(input);
}

const prompt = ai.definePrompt({
  name: 'upskillingRecommenderPrompt',
  input: {schema: UpskillingRecommenderInputSchema},
  output: {schema: UpskillingRecommenderOutputSchema},
  prompt: `You are an expert career advisor, adept at recommending courses and certifications to help users achieve their career goals.

Given the following skill gaps and career goals, provide specific course and certification recommendations.

Skill Gaps: {{{skillGaps}}}
Career Goals: {{{careerGoals}}}

{{#if preferredPlatforms}}
Preferred Learning Platforms: {{{preferredPlatforms}}}
{{/if}}

Your Task:
1.  **Recommend Courses**: Suggest 2-4 specific courses from well-known platforms like Coursera, Udemy, edX, or LinkedIn Learning that directly address the user's skill gaps. For each course, provide:
    *   **name:** The full name of the course.
    *   **platform:** Where to find it (e.g., Coursera, Udemy).
    *   **description:** A brief, compelling summary of what the user will learn.
    *   **url:** A valid, direct URL to the course page. You must find a real, working URL.
2.  **Recommend Certifications**: Suggest 1-2 relevant professional certifications that align with the user's career goals. Format this as a Markdown string.
3.  **Provide Additional Resources**: If applicable, suggest other learning materials like books, blogs, or tutorials. Format this as a Markdown string.
`,
});

const upskillingRecommenderFlow = ai.defineFlow(
  {
    name: 'upskillingRecommenderFlow',
    inputSchema: UpskillingRecommenderInputSchema,
    outputSchema: UpskillingRecommenderOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
