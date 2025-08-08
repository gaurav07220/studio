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

const UpskillingRecommenderOutputSchema = z.object({
  courseRecommendations: z
    .string()
    .describe('Recommended courses to bridge the skill gaps.'),
  certificationRecommendations: z
    .string()
    .describe('Recommended certifications to enhance career prospects.'),
  additionalResources: z
    .string()
    .optional()
    .describe('Any additional resources that might be helpful.'),
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

Consider platforms like Coursera, Udemy, edX, and LinkedIn Learning when making recommendations.

Format your output clearly, separating course recommendations, certification recommendations, and any additional helpful resources.`,
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
