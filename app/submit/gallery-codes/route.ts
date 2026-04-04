import { NextResponse } from "next/server";
import { createSimplePdf } from "@/lib/pdf";
import { getUserAssignedGalleryCodes } from "@/lib/queries";
import { createClient } from "@/lib/supabase/server";
import { demoUser } from "@/lib/demo";
import { isDemoMode } from "@/lib/env";

export async function GET() {
  let userId: string | null = null;

  if (isDemoMode) {
    userId = demoUser.id;
  } else {
    const supabase = await createClient();
    const {
      data: { user }
    } = await supabase.auth.getUser();

    userId = user?.id ?? null;
  }

  if (!userId) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const codes = await getUserAssignedGalleryCodes(userId);

  if (codes.length === 0) {
    return new NextResponse("No gallery codes available yet.", { status: 404 });
  }

  const studentCode = codes.find((code) => code.assignment_type === "reserved");
  const fundraiserCodes = codes.filter((code) => code.assignment_type === "fundraiser");

  const pdf = createSimplePdf([
    "# Gallery access codes",
    "Student packet with 1 reserved code and 10 fundraiser codes",
    "",
    "## Instructions",
    "- The first code below is reserved for the student who submitted.",
    "- Sell each fundraiser code strip for $1 cash.",
    "- Each code works once for one parent or supporter account.",
    "- Once redeemed, the code stays linked to that account.",
    "",
    "## Reserved student code",
    studentCode ? `- ${studentCode.code}${studentCode.redeemed ? " (USED)" : ""}` : "- N/A",
    "",
    "## Fundraiser codes",
    ...fundraiserCodes.map((item) => `- ${item.code}${item.redeemed ? " (USED)" : ""}`)
  ]);

  return new NextResponse(pdf, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": 'attachment; filename="gallery-access-codes.pdf"',
      "Cache-Control": "no-store"
    }
  });
}
