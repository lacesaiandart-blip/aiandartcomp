"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { submissionSchema } from "@/lib/validation";
import { CUSTOM_THEME_OPTION, MAX_SUBMISSIONS_PER_USER, THEMES } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { submitArtworkAction } from "@/lib/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

type SubmissionFormProps = {
  defaultName: string;
  defaultEmail: string;
  remaining: number;
  serverError?: string;
  success?: boolean;
  isDemoMode: boolean;
};

type FieldErrors = Partial<Record<keyof Omit<FormShape, "image"> | "image", string>>;

type FormShape = {
  student_name: string;
  school: string;
  email: string;
  artwork_title: string;
  theme: string;
  theme_other: string;
  prompt_log: string;
  ai_tools_used: string;
  creative_process_statement: string;
  integrity_agreed: string;
  image: File | null;
};

const orderedFields: Array<keyof FieldErrors> = [
  "student_name",
  "school",
  "email",
  "theme",
  "theme_other",
  "artwork_title",
  "image",
  "prompt_log",
  "ai_tools_used",
  "creative_process_statement",
  "integrity_agreed"
];

export function SubmissionForm({
  defaultName,
  defaultEmail,
  remaining,
  serverError,
  success,
  isDemoMode
}: SubmissionFormProps) {
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [theme, setTheme] = useState("");
  const formRef = useRef<HTMLFormElement>(null);

  const hasSlots = remaining > 0;
  const sharedInputClass = "bg-white";

  useEffect(() => {
    if (!success || !formRef.current) {
      return;
    }

    formRef.current.reset();
    setFieldErrors({});
    setTheme("");
  }, [success]);

  const statusNotice = useMemo(() => {
    if (success) {
      return <Notice tone="success">Submission received. Your entry is now pending review.</Notice>;
    }

    if (serverError) {
      return <Notice tone="error">{serverError}</Notice>;
    }

    return null;
  }, [serverError, success]);

  function clearFieldError(name: keyof FieldErrors) {
    setFieldErrors((current) => {
      if (!current[name]) {
        return current;
      }

      const next = { ...current };
      delete next[name];
      return next;
    });
  }

  function validateForm(formData: FormData) {
    const parsed = submissionSchema.safeParse({
      student_name: String(formData.get("student_name") ?? ""),
      school: String(formData.get("school") ?? ""),
      email: String(formData.get("email") ?? ""),
      artwork_title: String(formData.get("artwork_title") ?? ""),
      theme: String(formData.get("theme") ?? ""),
      theme_other: String(formData.get("theme_other") ?? ""),
      prompt_log: String(formData.get("prompt_log") ?? ""),
      ai_tools_used: String(formData.get("ai_tools_used") ?? ""),
      creative_process_statement: String(formData.get("creative_process_statement") ?? ""),
      integrity_agreed: String(formData.get("integrity_agreed") ?? "")
    });

    const nextErrors: FieldErrors = {};

    if (!parsed.success) {
      for (const issue of parsed.error.issues) {
        const name = issue.path[0] as keyof FieldErrors | undefined;
        if (name && !nextErrors[name]) {
          nextErrors[name] = issue.message;
        }
      }
    }

    const image = formData.get("image");
    if (!(image instanceof File) || image.size === 0) {
      nextErrors.image = "Upload an artwork image.";
    }

    return nextErrors;
  }

  function focusFirstError(errors: FieldErrors) {
    const firstField = orderedFields.find((field) => errors[field]);
    if (!firstField || !formRef.current) {
      return;
    }

    const element = formRef.current.elements.namedItem(firstField);
    if (element instanceof HTMLElement) {
      element.focus();
      element.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }

  return (
    <div className="space-y-5">
      {statusNotice}
      {isDemoMode ? (
        <Notice tone="success">Demo mode stores submission progress in cookies only. Uploads are not persisted.</Notice>
      ) : null}
      <div className="rounded-[24px] border border-white/80 bg-white/85 p-5 text-sm text-muted-foreground shadow-[0_14px_35px_rgba(35,59,92,0.06)]">
        <p className="font-medium text-foreground">Submission status</p>
        <p>
          {MAX_SUBMISSIONS_PER_USER - remaining} of 2 entries used. {remaining} remaining.
        </p>
      </div>

      {Object.keys(fieldErrors).length > 0 ? (
        <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          <p className="font-medium">Please fix the highlighted fields.</p>
        </div>
      ) : null}

      <form
        ref={formRef}
        action={submitArtworkAction}
        className="space-y-6"
        noValidate
        onSubmit={(event) => {
          const formData = new FormData(event.currentTarget);
          const errors = validateForm(formData);

          if (Object.keys(errors).length > 0) {
            event.preventDefault();
            setFieldErrors(errors);
            focusFirstError(errors);
          }
        }}
      >
        <section className="surface-card p-6 sm:p-8">
          <SectionHeading step="01" title="Artist details" />
          <div className="mt-6 grid gap-5 sm:grid-cols-2">
            <Field>
              <Label htmlFor="student_name" className="field-label">Student name</Label>
              <Input
                id="student_name"
                name="student_name"
                defaultValue={defaultName}
                className={inputClass(sharedInputClass, fieldErrors.student_name)}
                aria-invalid={Boolean(fieldErrors.student_name)}
                onChange={() => clearFieldError("student_name")}
              />
              <FieldError message={fieldErrors.student_name} />
            </Field>

            <Field>
              <Label htmlFor="email" className="field-label">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                defaultValue={defaultEmail}
                className={inputClass(sharedInputClass, fieldErrors.email)}
                aria-invalid={Boolean(fieldErrors.email)}
                onChange={() => clearFieldError("email")}
              />
              <FieldError message={fieldErrors.email} />
            </Field>

            <Field>
              <Label htmlFor="school" className="field-label">School</Label>
              <Input
                id="school"
                name="school"
                placeholder="Roosevelt High School"
                className={inputClass(sharedInputClass, fieldErrors.school)}
                aria-invalid={Boolean(fieldErrors.school)}
                onChange={() => clearFieldError("school")}
              />
              <FieldError message={fieldErrors.school} />
            </Field>

            <Field>
              <Label htmlFor="theme" className="field-label">Theme</Label>
              <select
                id="theme"
                name="theme"
                className={inputClass(
                  "flex h-12 w-full appearance-none rounded-xl bg-white px-4 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                  fieldErrors.theme
                )}
                aria-invalid={Boolean(fieldErrors.theme)}
                value={theme}
                onChange={(event) => {
                  setTheme(event.target.value);
                  clearFieldError("theme");
                  clearFieldError("theme_other");
                }}
              >
                <option value="">Select a theme</option>
                {THEMES.map((theme) => (
                  <option key={theme} value={theme}>
                    {theme}
                  </option>
                ))}
              </select>
              <FieldError message={fieldErrors.theme} />
            </Field>

            {theme === CUSTOM_THEME_OPTION ? (
              <Field>
                <Label htmlFor="theme_other" className="field-label">Custom theme</Label>
                <Input
                  id="theme_other"
                  name="theme_other"
                  placeholder="Type your theme"
                  className={inputClass(sharedInputClass, fieldErrors.theme_other)}
                  aria-invalid={Boolean(fieldErrors.theme_other)}
                  onChange={() => clearFieldError("theme_other")}
                />
                <FieldHint>Type the theme you want reviewers to see.</FieldHint>
                <FieldError message={fieldErrors.theme_other} />
              </Field>
            ) : null}
          </div>
        </section>

        <section className="surface-card p-6 sm:p-8">
          <SectionHeading step="02" title="Artwork submission" />
          <div className="mt-6 space-y-5">
            <Field>
              <Label htmlFor="artwork_title" className="field-label">Artwork title</Label>
              <Input
                id="artwork_title"
                name="artwork_title"
                placeholder="Title of your piece"
                className={inputClass(sharedInputClass, fieldErrors.artwork_title)}
                aria-invalid={Boolean(fieldErrors.artwork_title)}
                onChange={() => clearFieldError("artwork_title")}
              />
              <FieldError message={fieldErrors.artwork_title} />
            </Field>

            <Field>
              <Label htmlFor="image" className="field-label">Upload image</Label>
              <div className={cn("rounded-[28px] border border-dashed p-6 text-center", fieldErrors.image ? "border-red-300 bg-red-50/50" : "border-slate-200 bg-slate-50/75")}>
                <Input
                  id="image"
                  name="image"
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  className={cn("mx-auto max-w-sm bg-white", inputClass("", fieldErrors.image))}
                  aria-invalid={Boolean(fieldErrors.image)}
                  onChange={() => clearFieldError("image")}
                />
                <p className="mt-4 text-sm text-slate-600">Upload one final artwork image in JPG, PNG, or WEBP format.</p>
              </div>
              <FieldError message={fieldErrors.image} />
            </Field>
          </div>
        </section>

        <section className="surface-card p-6 sm:p-8">
          <SectionHeading step="03" title="Process statement" />
          <div className="mt-6 space-y-5">
            <Field>
              <Label htmlFor="ai_tools_used" className="field-label">AI tools used</Label>
              <Input
                id="ai_tools_used"
                name="ai_tools_used"
                placeholder="Midjourney, Stable Diffusion, Photoshop, etc."
                className={inputClass(sharedInputClass, fieldErrors.ai_tools_used)}
                aria-invalid={Boolean(fieldErrors.ai_tools_used)}
                onChange={() => clearFieldError("ai_tools_used")}
              />
              <FieldError message={fieldErrors.ai_tools_used} />
            </Field>

            <Field>
              <Label htmlFor="prompt_log" className="field-label">Prompt log and base sketches</Label>
              <Textarea
                id="prompt_log"
                name="prompt_log"
                placeholder="List the prompts, base sketches, revisions, and edits you used."
                className={inputClass(sharedInputClass, fieldErrors.prompt_log)}
                aria-invalid={Boolean(fieldErrors.prompt_log)}
                onChange={() => clearFieldError("prompt_log")}
              />
              <FieldHint>Include the main prompts, any base sketches, what changed between versions, and any edits you made after generation.</FieldHint>
              <FieldError message={fieldErrors.prompt_log} />
            </Field>

            <Field>
              <Label htmlFor="creative_process_statement" className="field-label">Creative process statement</Label>
              <Textarea
                id="creative_process_statement"
                name="creative_process_statement"
                placeholder="Explain your idea, what you changed, and how you shaped the final image."
                className={inputClass(sharedInputClass, fieldErrors.creative_process_statement)}
                aria-invalid={Boolean(fieldErrors.creative_process_statement)}
                onChange={() => clearFieldError("creative_process_statement")}
              />
              <FieldHint>Write 50 to 200 words. Explain the idea, which outputs you kept or rejected, and what made the final version yours.</FieldHint>
              <FieldError message={fieldErrors.creative_process_statement} />
            </Field>
          </div>
        </section>

        <div className={cn("surface-card p-6", fieldErrors.integrity_agreed ? "border-red-300 bg-red-50/40" : "")}>
          <div className="flex items-start gap-3">
            <input
              id="integrity_agreed"
              name="integrity_agreed"
              type="checkbox"
              className="mt-1 h-4 w-4 rounded border-primary"
              aria-invalid={Boolean(fieldErrors.integrity_agreed)}
              onChange={() => clearFieldError("integrity_agreed")}
            />
            <div className="space-y-2">
              <Label htmlFor="integrity_agreed" className="leading-6 text-slate-700">
                I confirm that this submission is my own work, that I am accurately describing my AI-assisted process, and that I understand organizers may remove entries that violate the competition guidelines.
              </Label>
              <FieldError message={fieldErrors.integrity_agreed} />
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between gap-4">
          <p className="max-w-md text-sm leading-6 text-slate-500">
            By submitting, you agree that approved work may appear in the competition gallery and judging portal.
          </p>
          <Button type="submit" disabled={!hasSlots} size="lg">
            Submit Artwork
          </Button>
        </div>
      </form>
    </div>
  );
}

function inputClass(base: string, error?: string) {
  return cn(base, error ? "border-red-300 ring-2 ring-red-100 focus-visible:ring-red-200" : "border-input");
}

function Field({ children }: { children: React.ReactNode }) {
  return <div className="space-y-2">{children}</div>;
}

function SectionHeading({ step, title }: { step: string; title: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-sky-100 text-sm font-semibold text-primary">
        {step}
      </div>
      <h2 className="text-2xl font-semibold tracking-[-0.04em] text-slate-950">{title}</h2>
    </div>
  );
}

function FieldError({ message }: { message?: string }) {
  if (!message) {
    return null;
  }

  return <p className="text-sm text-red-700">{message}</p>;
}

function FieldHint({ children }: { children: React.ReactNode }) {
  return <p className="text-sm text-muted-foreground">{children}</p>;
}

function Notice({ children, tone }: { children: React.ReactNode; tone: "error" | "success" }) {
  const className =
    tone === "error"
      ? "border-red-200 bg-red-50 text-red-700"
      : "border-emerald-200 bg-emerald-50 text-emerald-700";

  return <p className={`rounded-[20px] border px-4 py-3 text-sm ${className}`}>{children}</p>;
}
