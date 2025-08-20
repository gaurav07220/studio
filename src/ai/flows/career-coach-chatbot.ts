
'use server';

/**
 * @fileOverview Implements an AI career coach chatbot that provides resume tips, job search strategies, and interview preparation advice.
 *
 * - careerCoachChatbot - A function that provides career advice using a chatbot interface.
 * - CareerCoachChatbotInput - The input type for the careerCoachChatbot function.
 * - CareerCoachChatbotOutput - The return type for the careerCoachChatbot function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const CareerCoachChatbotInputSchema = z.object({
  query: z.string().describe('The user query for career advice.'),
});
export type CareerCoachChatbotInput = z.infer<typeof CareerCoachChatbotInputSchema>;

const CareerCoachChatbotOutputSchema = z.object({
  response: z.string().describe('The chatbot response to the user query.'),
});
export type CareerCoachChatbotOutput = z.infer<typeof CareerCoachChatbotOutputSchema>;

export async function careerCoachChatbot(input: CareerCoachChatbotInput): Promise<CareerCoachChatbotOutput> {
  return careerCoachChatbotFlow(input);
}

const prompt = ai.definePrompt({
  name: 'careerCoachChatbotPrompt',
  input: {schema: CareerCoachChatbotInputSchema},
  output: {schema: CareerCoachChatbotOutputSchema},
  prompt: `You are an AI career coach chatbot providing helpful advice to job seekers.

  Respond to the following query with helpful and actionable advice:
  {{query}}
  `,
});

const careerCoachChatbotFlow = ai.defineFlow(
  {
    name: 'careerCoachChatbotFlow',
    inputSchema: CareerCoachChatbotInputSchema,
    outputSchema: CareerCoachChatbotOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
