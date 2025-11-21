'use server';

/**
 * @fileOverview A Genkit flow for finding relevant jobs based on a user's profile.
 * 
 * - findRelevantJobs - A function that takes user profile data and returns a list of relevant jobs.
 * - FindRelevantJobsInput - The input type for the findRelevantJobs function.
 * - FindRelevantJobsOutput - The return type for the findRelevantJobs function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import type { Job } from '@/lib/types';

const FindRelevantJobsInputSchema = z.object({
  userProfile: z.object({
    name: z.string().describe('User full name'),
    skills: z.array(z.string()).describe('List of user skills'),
    experience: z.array(z.object({
      title: z.string(),
      company: z.string(),
      description: z.string(),
    })).describe('List of user work experiences'),
    location: z.string().optional().describe('User preferred location'),
  }).describe('The user profile data.'),
});

const JobSchema = z.object({
  id: z.string(),
  title: z.string(),
  companyName: z.string(),
  location: z.string(),
  remoteType: z.enum(['Remote', 'On-site', 'Hybrid']),
  seniorityLevel: z.enum(['Internship', 'Entry-level', 'Mid-Senior', 'Senior', 'Lead']),
  jobScore: z.number().describe('A score from 0-100 indicating how well the job matches the user profile.'),
  applyMethod: z.enum(['easy_apply', 'external', 'email']),
  description: z.string(),
  skills: z.array(z.string()),
  source: z.string().describe('Where the job was found (e.g., LinkedIn, Indeed)'),
  datePosted: z.string().describe('The date the job was posted.'),
});

const FindRelevantJobsOutputSchema = z.object({
  jobs: z.array(JobSchema).describe('A list of 5-10 relevant job postings.'),
});

export type FindRelevantJobsInput = z.infer<typeof FindRelevantJobsInputSchema>;
export type FindRelevantJobsOutput = z.infer<typeof FindRelevantJobsOutputSchema>;


export async function findRelevantJobs(input: FindRelevantJobsInput): Promise<FindRelevantJobsOutput> {
  return findRelevantJobsFlow(input);
}


const prompt = ai.definePrompt({
  name: 'findRelevantJobsPrompt',
  input: { schema: FindRelevantJobsInputSchema },
  output: { schema: FindRelevantJobsOutputSchema },
  prompt: `You are a world-class AI job recruiter. Your task is to find 5 to 10 highly relevant job opportunities for a user based on their profile.
Analyze the user's skills, experience, and location preferences to find the best possible matches from simulated job boards like LinkedIn, Indeed, etc.

For each job, provide a detailed description, required skills, and a "jobScore" from 0-100 indicating the strength of the match.

User Profile:
- Name: {{{userProfile.name}}}
- Location: {{{userProfile.location}}}
- Skills: {{#each userProfile.skills}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}
- Experience:
{{#each userProfile.experience}}
  - Role: {{{title}}} at {{{company}}}
    Description: {{{description}}}
{{/each}}

Generate a list of jobs in the correct JSON format.
`,
});

const findRelevantJobsFlow = ai.defineFlow(
  {
    name: 'findRelevantJobsFlow',
    inputSchema: FindRelevantJobsInputSchema,
    outputSchema: FindRelevantJobsOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
