
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


const PersonProfileSchema = z.object({
    name: z.string().describe("The full name of the recommended contact."),
    headline: z.string().describe("The professional headline of the contact (e.g., 'Senior Software Engineer at Google')."),
    linkedinUrl: z.string().url().describe("A valid, real URL to the contact's LinkedIn profile."),
    reason: z.string().describe("A brief, one-sentence explanation of why this person is a good connection for the user.")
});

const NetworkingRecommendationsOutputSchema = z.object({
  recommendations: z.array(PersonProfileSchema).describe('A list of 3-5 personalized networking contacts.'),
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
  prompt: `You are a career expert and master networker. Based on the user's profile, recommend 3-5 specific people they should connect with on LinkedIn.

**User Profile:**
- **Skills:** {{{skills}}}
- **Experience:** {{{experience}}}
- **Job Preferences:** {{{jobPreferences}}}

**Your Task:**
For each recommended person, you MUST provide the following:
- **name:** Their full name.
- **headline:** Their current professional headline (e.g., "VP of Engineering at StartupX" or "Recruiter for Tech Roles at BigCorp").
- **linkedinUrl:** A valid, real URL to their LinkedIn profile.
- **reason:** A concise, single-sentence explanation of why connecting with this person would be beneficial for the user (e.g., "They have experience in the exact niche you're targeting." or "They actively recruit for roles that match your skillset.").

Focus on recommending people who are highly relevant to the user's career goals and industry preferences.`,
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
