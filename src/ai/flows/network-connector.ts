'use server';

/**
 * @fileOverview A Genkit flow for generating personalized networking recommendations.
 *
 * - generateNetworkingRecommendations - A function that generates personalized networking recommendations.
 * - NetworkingRecommendationsInput - The input type for the generateNetworkingRecommendations function.
 * - NetworkingRecommendationsOutput - The return type for the generateNetworkingRecommendations function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const NetworkingRecommendationsInputSchema = z.object({
  skills: z.string().describe('The skills of the user.'),
  experience: z.string().describe('The experience of the user.'),
  jobPreferences: z.string().describe('The job preferences of the user.'),
});
export type NetworkingRecommendationsInput = z.infer<typeof NetworkingRecommendationsInputSchema>;

const NetworkingRecommendationsOutputSchema = z.object({
  recommendations: z.string().describe('The personalized networking recommendations.'),
});
export type NetworkingRecommendationsOutput = z.infer<typeof NetworkingRecommendationsOutputSchema>;

export async function generateNetworkingRecommendations(
  input: NetworkingRecommendationsInput
): Promise<NetworkingRecommendationsOutput> {
  return generateNetworkingRecommendationsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'networkingRecommendationsPrompt',
  input: {schema: NetworkingRecommendationsInputSchema},
  output: {schema: NetworkingRecommendationsOutputSchema},
  prompt: `You are a career expert. Generate personalized networking recommendations based on the user's skills, experience, and job preferences. Suggest connections and groups on LinkedIn or similar platforms.

Skills: {{{skills}}}
Experience: {{{experience}}}
Job Preferences: {{{jobPreferences}}}

Recommendations:`,
});

const generateNetworkingRecommendationsFlow = ai.defineFlow(
  {
    name: 'generateNetworkingRecommendationsFlow',
    inputSchema: NetworkingRecommendationsInputSchema,
    outputSchema: NetworkingRecommendationsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
