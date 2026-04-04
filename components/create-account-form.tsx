"use client";

import Link from "next/link";
import { FormEvent, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type CreateAccountFormProps = {
  action: (formData: FormData) => void;
  defaultEmail: string;
  next: string;
};

export function CreateAccountForm({ action, defaultEmail, next }: CreateAccountFormProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const guardianInputRef = useRef<HTMLInputElement>(null);
  const [isUnder18, setIsUnder18] = useState(false);
  const [guardianName, setGuardianName] = useState("");
  const [under18Acknowledged, setUnder18Acknowledged] = useState(false);
  const [showGuardianDialog, setShowGuardianDialog] = useState(false);
  const [guardianError, setGuardianError] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    if (!isUnder18 || (guardianName.trim() && under18Acknowledged)) {
      return;
    }

    event.preventDefault();
    setShowGuardianDialog(true);
    setGuardianError("");

    window.setTimeout(() => {
      guardianInputRef.current?.focus();
    }, 0);
  }

  function handleGuardianContinue() {
    if (!guardianName.trim()) {
      setGuardianError("Please have a parent or guardian sign below by typing their full name.");
      guardianInputRef.current?.focus();
      return;
    }

    if (!under18Acknowledged) {
      setGuardianError("Please confirm that you understand the rules and have parent or guardian permission.");
      return;
    }

    setGuardianError("");
    setShowGuardianDialog(false);
    formRef.current?.requestSubmit();
  }

  return (
    <>
      <form ref={formRef} action={action} className="space-y-4" onSubmit={handleSubmit}>
        <input type="hidden" name="next" value={next} />
        <input type="hidden" name="guardian_name" value={guardianName.trim()} />
        <input type="hidden" name="is_over_18" value={isUnder18 ? "false" : "true"} />
        <input type="hidden" name="under_18_acknowledged" value={under18Acknowledged ? "true" : "false"} />

        <div className="space-y-2">
          <Label htmlFor="create-email">Email</Label>
          <Input
            id="create-email"
            name="email"
            type="email"
            placeholder="you@example.com"
            defaultValue={defaultEmail}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="create-password">Password</Label>
          <Input id="create-password" name="password" type="password" placeholder="At least 8 characters" required />
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirm-password">Confirm password</Label>
          <Input
            id="confirm-password"
            name="confirm_password"
            type="password"
            placeholder="Repeat your password"
            required
          />
        </div>

        <label className="flex items-start gap-3 rounded-xl border border-slate-200 bg-slate-50/80 px-4 py-3 text-sm text-slate-700">
          <input
            type="checkbox"
            checked={isUnder18}
            onChange={(event) => {
              setIsUnder18(event.target.checked);
              if (!event.target.checked) {
                setGuardianName("");
                setUnder18Acknowledged(false);
                setGuardianError("");
                setShowGuardianDialog(false);
              }
            }}
            className="mt-1 h-4 w-4 rounded border-slate-300 text-primary focus:ring-primary"
          />
          <span>I am under 18. If checked, we will ask for a parent or guardian signature and a quick acknowledgement before account creation.</span>
        </label>

        <Button className="w-full" size="lg" type="submit">
          Create account
        </Button>
      </form>

      {showGuardianDialog ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 px-4">
          <div className="w-full max-w-md rounded-[28px] border border-white/70 bg-white p-6 shadow-[0_24px_60px_rgba(15,23,42,0.24)]">
            <h3 className="text-xl font-semibold tracking-[-0.03em] text-slate-950">Parent or guardian signature</h3>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Because this account is for someone under 18, please have a parent or guardian sign below by typing
              their full name and review the{" "}
              <Link href="/terms" className="font-medium text-primary hover:underline">
                Terms
              </Link>{" "}
              and{" "}
              <Link href="/privacy" className="font-medium text-primary hover:underline">
                Privacy Policy
              </Link>{" "}
              before continuing.
            </p>

            <div className="mt-5 space-y-2">
              <Label htmlFor="guardian-name">Parent or guardian full name</Label>
              <Input
                id="guardian-name"
                ref={guardianInputRef}
                value={guardianName}
                onChange={(event) => {
                  setGuardianName(event.target.value);
                  if (guardianError) {
                    setGuardianError("");
                  }
                }}
                placeholder="Type full name as signature"
              />
            </div>

            <label className="mt-4 flex items-start gap-3 rounded-xl border border-slate-200 bg-slate-50/80 px-4 py-3 text-sm leading-6 text-slate-700">
              <input
                type="checkbox"
                checked={under18Acknowledged}
                onChange={(event) => {
                  setUnder18Acknowledged(event.target.checked);
                  if (guardianError) {
                    setGuardianError("");
                  }
                }}
                className="mt-1 h-4 w-4 rounded border-slate-300 text-primary focus:ring-primary"
              />
              <span>
                I have reviewed the{" "}
                <Link href="/terms" className="font-medium text-primary hover:underline">
                  Terms
                </Link>{" "}
                and{" "}
                <Link href="/privacy" className="font-medium text-primary hover:underline">
                  Privacy Policy
                </Link>
                , and I confirm that I give permission for this student to participate.
              </span>
            </label>

            {guardianError ? <p className="mt-3 text-sm text-red-600">{guardianError}</p> : null}

            <div className="mt-6 flex gap-3">
              <Button className="flex-1" type="button" onClick={handleGuardianContinue}>
                Save and continue
              </Button>
              <Button
                className="flex-1"
                variant="outline"
                type="button"
                onClick={() => {
                  setShowGuardianDialog(false);
                }}
              >
                Back
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
