import { z } from "zod";
import { CUSTOM_THEME_OPTION, THEMES } from "@/lib/constants";

const MIN_PROMPT_LOG_LENGTH = 40;
const MIN_PROCESS_STATEMENT_WORDS = 50;
const MAX_PROCESS_STATEMENT_WORDS = 200;
const MAX_CUSTOM_THEME_LENGTH = 60;

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
  theme_other: z.string().trim().max(MAX_CUSTOM_THEME_LENGTH, `Keep custom theme under ${MAX_CUSTOM_THEME_LENGTH} characters.`).optional(),
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
}).superRefine((data, ctx) => {
  if (!THEMES.includes(data.theme)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["theme"],
      message: "Choose a listed theme, or choose Other and type your theme."
    });
  }

  if (data.theme === CUSTOM_THEME_OPTION && !data.theme_other?.trim()) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["theme_other"],
      message: "Type the artwork theme."
    });
  }
}).transform((data) => ({
  ...data,
  theme:
    data.theme === CUSTOM_THEME_OPTION
      ? data.theme_other?.trim() ?? CUSTOM_THEME_OPTION
      : data.theme,
  theme_other: data.theme_other?.trim() ?? ""
}));

export type SubmissionSchemaInput = z.infer<typeof submissionSchema>;
