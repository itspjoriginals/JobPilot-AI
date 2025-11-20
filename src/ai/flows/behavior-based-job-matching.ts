'use server';

/**
 * @fileOverview Implements behavior-based job matching by adjusting future matching scores based on user interactions.
 *
 * - behaviorBasedJobMatching - A function that handles the job matching process.
 * - BehaviorBasedJobMatchingInput - The input type for the behaviorBasedJobMatching function.
 * - BehaviorBasedJobMatchingOutput - The return type for the behaviorBasedJobMatching function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const BehaviorBasedJobMatchingInputSchema = z.object({
  jobDescription: z.string().describe('The description of the job.'),
  userProfile: z.string().describe('The user profile data.'),
  jobInteractionHistory: z.array(
    z.object({
      jobId: z.string().describe('The ID of the job.'),
      action: z
        .enum(['applied', 'skipped', 'saved'])
        .describe('The action taken by the user on the job.'),
      timestamp: z.string().describe('The timestamp of the interaction.'),
    })
  ).describe('The history of job interactions for the user.'),
});
export type BehaviorBasedJobMatchingInput = z.infer<typeof BehaviorBasedJobMatchingInputSchema>;

const BehaviorBasedJobMatchingOutputSchema = z.object({
  adjustedJobScore: z
    .number()
    .describe('The adjusted job score based on user behavior.'),
  reasoning: z
    .string()
    .describe('Explanation of how the job score was adjusted based on behavior.'),
});
export type BehaviorBasedJobMatchingOutput = z.infer<typeof BehaviorBasedJobMatchingOutputSchema>;

export async function behaviorBasedJobMatching(
  input: BehaviorBasedJobMatchingInput
): Promise<BehaviorBasedJobMatchingOutput> {
  return behaviorBasedJobMatchingFlow(input);
}

const prompt = ai.definePrompt({
  name: 'behaviorBasedJobMatchingPrompt',
  input: {schema: BehaviorBasedJobMatchingInputSchema},
  output: {schema: BehaviorBasedJobMatchingOutputSchema},
  prompt: `You are an AI job matching expert. You will receive a job description, user profile and the user's job interaction history. Based on this data, you will adjust the job score to better reflect the user's preferences.

Job Description: {{{jobDescription}}}
User Profile: {{{userProfile}}}
Job Interaction History: {{#each jobInteractionHistory}}\n- Job ID: {{{jobId}}}, Action: {{{action}}}, Timestamp: {{{timestamp}}}{{/each}}\n
Considering the user's past behavior, how would you adjust the job score and why? Provide a brief explanation.
`,
});

const behaviorBasedJobMatchingFlow = ai.defineFlow(
  {
    name: 'behaviorBasedJobMatchingFlow',
    inputSchema: BehaviorBasedJobMatchingInputSchema,
    outputSchema: BehaviorBasedJobMatchingOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
