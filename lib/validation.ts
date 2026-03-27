import { z } from "zod";

const MIN_PROMPT_LOG_LENGTH = 40;
const MIN_PROCESS_STATEMENT_WORDS = 50;
const MAX_PROCESS_STATEMENT_WORDS = 200;

function wordCount(value: string) {
  return value.trim().split(/\s+/).filter(Boolean).length;
}

function minLengthMessage(value: string, minimum: number, fieldLabel: string, guidance: string) {
  const trimmed = value.trim();
  const remaining = Math.max(minimum - trimmed.length, 0);

  if (trimmed.length === 0) {
    return `${fieldLabel} is required. ${guidance}`;
  }

  return `${fieldLabel} is too short. Add about ${remaining} more character${remaining === 1 ? "" : "s"} so reviewers can understand it. ${guidance}`;
}

export const submissionSchema = z.object({
  student_name: z.string().trim().min(2, "Enter the student's full name."),
  school: z.string().trim().min(2, "Enter the school name."),
  email: z.string().trim().email("Enter a valid email address."),
  artwork_title: z.string().trim().min(2, "Enter the artwork title."),
  theme: z.string().trim().min(2, "Choose a theme."),
  prompt_log: z.string().superRefine((value, ctx) => {
    if (value.trim().length < MIN_PROMPT_LOG_LENGTH) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: minLengthMessage(
          value,
          MIN_PROMPT_LOG_LENGTH,
          "Prompt log and base sketches",
          "Include the key prompts, any base sketches you used, what changed between versions, and any edits you made after generation."
        )
      });
    }
  }),
  ai_tools_used: z
    .string()
    .trim()
    .min(2, "List the AI tools you used, for example ChatGPT, Midjourney, Photoshop, or Firefly."),
  creative_process_statement: z.string().superRefine((value, ctx) => {
    const words = wordCount(value);

    if (words < MIN_PROCESS_STATEMENT_WORDS) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `Creative process statement is too short. Write at least ${MIN_PROCESS_STATEMENT_WORDS} words. Explain your idea, the choices you made, and how you shaped the final result.`
      });
    }

    if (words > MAX_PROCESS_STATEMENT_WORDS) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `Creative process statement is too long. Keep it under ${MAX_PROCESS_STATEMENT_WORDS} words.`
      });
    }
  }),
  integrity_agreed: z.literal("on", {
    errorMap: () => ({ message: "You must agree to the integrity statement." })
  })
});

export type SubmissionSchemaInput = z.infer<typeof submissionSchema>;
