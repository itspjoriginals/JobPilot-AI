// src/ai/flows/resume-selection-for-job.ts
'use server';

/**
 * @fileOverview This file defines a Genkit flow for automatically selecting the most relevant resume for a job application.
 *
 * It takes a job description and a list of resumes as input, and returns the ID of the most relevant resume.
 *
 * - selectResumeForJob - A function that handles the resume selection process.
 * - SelectResumeForJobInput - The input type for the selectResumeForJob function.
 * - SelectResumeForJobOutput - The return type for the selectResumeForJob function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SelectResumeForJobInputSchema = z.object({
  jobDescription: z.string().describe('The description of the job posting.'),
  resumeIds: z.array(z.string()).describe('The IDs of the resumes to consider.'),
  resumes: z.array(
    z.object({
      id: z.string().describe('The ID of the resume.'),
      parsedData: z.string().describe('The parsed data of the resume.'),
    })
  ).describe('List of resumes with their IDs and parsed data.'),
});
export type SelectResumeForJobInput = z.infer<typeof SelectResumeForJobInputSchema>;

const SelectResumeForJobOutputSchema = z.object({
  selectedResumeId: z.string().describe('The ID of the most relevant resume for the job.'),
  reason: z.string().describe('The reason why resume was selected.'),
});
export type SelectResumeForJobOutput = z.infer<typeof SelectResumeForJobOutputSchema>;

export async function selectResumeForJob(input: SelectResumeForJobInput): Promise<SelectResumeForJobOutput> {
  return selectResumeForJobFlow(input);
}

const prompt = ai.definePrompt({
  name: 'selectResumeForJobPrompt',
  input: {schema: SelectResumeForJobInputSchema},
  output: {schema: SelectResumeForJobOutputSchema},
  prompt: `You are an expert in resume selection. Given a job description and a list of resumes, your task is to select the most relevant resume for the job.

Job Description: {{{jobDescription}}}

Resumes:
{{#each resumes}}
Resume ID: {{{id}}}
Resume Data: {{{parsedData}}}
{{/each}}

Based on the job description and the resume data, select the most relevant resume and provide the id of the selected resume. Also provide reason as to why the resume was selected. Make sure the resume ID you select exists in the resumes array.

Output the selected resume id and reason in JSON format.`, // Ensure JSON format for output
});

const selectResumeForJobFlow = ai.defineFlow(
  {
    name: 'selectResumeForJobFlow',
    inputSchema: SelectResumeForJobInputSchema,
    outputSchema: SelectResumeForJobOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
