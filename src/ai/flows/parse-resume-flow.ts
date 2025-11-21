'use server';

/**
 * @fileOverview A Genkit flow for parsing resume files.
 *
 * - parseResume - A function that takes resume file content and returns structured data.
 * - ParseResumeInput - The input type for the parseResume function.
 * - ParseResumeOutput - The return type for the parseResume function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const ResumeDataSchema = z.object({
  skills: z.object({
    technical: z.array(z.string()).describe('List of technical skills (e.g., Python, JavaScript)'),
    tools: z.array(z.string()).describe('List of tools and technologies (e.g., Git, Docker, Figma)'),
    soft: z.array(z.string()).describe('List of soft skills (e.g., Communication, Teamwork)'),
  }),
  experience: z.array(
    z.object({
      title: z.string().describe('Job title'),
      company: z.string().describe('Company name'),
      startDate: z.string().describe('Start date in YYYY-MM-DD format'),
      endDate: z.string().describe('End date in YYYY-MM-DD format, or "Present"'),
      description: z.string().describe('Bulleted or paragraph description of responsibilities and achievements'),
    })
  ),
  projects: z.array(
    z.object({
      name: z.string().describe('Project name'),
      description: z.string().describe('A brief description of the project'),
      tags: z.array(z.string()).describe('Technologies or skills used in the project'),
    })
  ),
});

const ParseResumeInputSchema = z.object({
  resumeText: z.string().describe('The full text content of the resume file.'),
});

const ParseResumeOutputSchema = z.object({
  parsedData: ResumeDataSchema,
});

export type ParseResumeInput = z.infer<typeof ParseResumeInputSchema>;
export type ParseResumeOutput = z.infer<typeof ParseResumeOutputSchema>;

export async function parseResume(input: ParseResumeInput): Promise<ParseResumeOutput> {
  return parseResumeFlow(input);
}

const prompt = ai.definePrompt({
  name: 'parseResumePrompt',
  input: { schema: ParseResumeInputSchema },
  output: { schema: ParseResumeOutputSchema },
  prompt: `You are an expert resume parser. Analyze the following resume text and extract the information into a structured JSON format.
Ensure dates are in YYYY-MM-DD format.

Resume Text:
{{{resumeText}}}

Extract the skills, work experience, and projects into the specified JSON output format.`,
});

const parseResumeFlow = ai.defineFlow(
  {
    name: 'parseResumeFlow',
    inputSchema: ParseResumeInputSchema,
    outputSchema: ParseResumeOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
