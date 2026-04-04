import type { User } from "@supabase/supabase-js";
import type { Submission, SubmissionNotification, VoteSummaryRow } from "@/lib/types";

export const DEMO_GALLERY_CODE = "SPRING24";
export const DEMO_JUDGE_CODE = "JUDGE-A";

export const demoUser = {
  id: "00000000-0000-0000-0000-000000000001",
  email: "demo.student@ucla.edu",
  user_metadata: {
    full_name: "Demo Student",
    name: "Demo Student"
  },
  app_metadata: {
    provider: "email"
  },
  aud: "authenticated",
  created_at: "2024-01-01T00:00:00.000Z"
} as User;

export const demoSubmissions: Submission[] = [
  {
    id: "10000000-0000-0000-0000-000000000001",
    user_id: demoUser.id,
    student_name: "Maya Lin",
    school: "Arcadia High School",
    email: "maya@example.edu",
    artwork_title: "Transit Memories",
    theme: "Steampunk",
    image_path: "/demo/transit-memories.svg",
    prompt_log: "Started with sketches of bus interiors, then iterated on color and window reflections.",
    ai_tools_used: "ChatGPT, Adobe Firefly, Photoshop",
    creative_process_statement:
      "I wanted to show how everyday public spaces can hold quiet emotional weight. I used AI to rough in composition ideas, then edited heavily for pacing, color balance, and facial direction.",
    integrity_agreed: true,
    status: "approved",
    created_at: "2024-04-20T12:00:00.000Z"
  },
  {
    id: "10000000-0000-0000-0000-000000000002",
    user_id: demoUser.id,
    student_name: "Jordan Park",
    school: "Culver City High School",
    email: "jordan@example.edu",
    artwork_title: "Garden Atlas",
    theme: "Nature",
    image_path: "/demo/garden-atlas.svg",
    prompt_log: "Tested botanical collage prompts, then adjusted for flatter poster-like geometry.",
    ai_tools_used: "Midjourney, Procreate",
    creative_process_statement:
      "This piece mixes field-guide illustration with a neighborhood garden map. AI helped generate layout options, but the final structure and labeling choices came from my own sketchbook drafts.",
    integrity_agreed: true,
    status: "approved",
    created_at: "2024-04-18T12:00:00.000Z"
  },
  {
    id: "10000000-0000-0000-0000-000000000003",
    user_id: demoUser.id,
    student_name: "Elena Torres",
    school: "Roosevelt High School",
    email: "elena@example.edu",
    artwork_title: "Four Versions of Me",
    theme: "Abstract",
    image_path: "/demo/four-versions.svg",
    prompt_log: "Used text prompts for mirrored portrait layouts, then composited and repainted details.",
    ai_tools_used: "DALL-E, Photoshop",
    creative_process_statement:
      "I was exploring how AI can exaggerate personal symbols while still needing human editing to feel specific. The final version is a collage of multiple generations with manual retouching.",
    integrity_agreed: true,
    status: "approved",
    created_at: "2024-04-14T12:00:00.000Z"
  },
  {
    id: "10000000-0000-0000-0000-000000000004",
    user_id: demoUser.id,
    student_name: "Aiden Brooks",
    school: "Santa Monica High School",
    email: "aiden@example.edu",
    artwork_title: "Roofline Studies",
    theme: "Future Cities",
    image_path: "/demo/roofline-studies.svg",
    prompt_log: "Experimented with modular city silhouettes and late-afternoon shadows.",
    ai_tools_used: "Stable Diffusion, Illustrator",
    creative_process_statement:
      "This draft is still under review in the demo dashboard to show how moderation states work before publishing.",
    integrity_agreed: true,
    status: "pending",
    created_at: "2024-04-22T12:00:00.000Z"
  }
];

export const demoViewerVoteSummary: VoteSummaryRow[] = [
  {
    id: demoSubmissions[0].id,
    artwork_title: demoSubmissions[0].artwork_title,
    student_name: demoSubmissions[0].student_name,
    theme: demoSubmissions[0].theme,
    school: demoSubmissions[0].school,
    vote_count: 3
  },
  {
    id: demoSubmissions[1].id,
    artwork_title: demoSubmissions[1].artwork_title,
    student_name: demoSubmissions[1].student_name,
    theme: demoSubmissions[1].theme,
    school: demoSubmissions[1].school,
    vote_count: 2
  }
];

export const demoJudgeVoteSummary: VoteSummaryRow[] = [
  {
    id: demoSubmissions[2].id,
    artwork_title: demoSubmissions[2].artwork_title,
    student_name: demoSubmissions[2].student_name,
    theme: demoSubmissions[2].theme,
    school: demoSubmissions[2].school,
    vote_count: 4
  },
  {
    id: demoSubmissions[1].id,
    artwork_title: demoSubmissions[1].artwork_title,
    student_name: demoSubmissions[1].student_name,
    theme: demoSubmissions[1].theme,
    school: demoSubmissions[1].school,
    vote_count: 1
  }
];

export const demoSubmissionNotifications: SubmissionNotification[] = [
  {
    id: "20000000-0000-0000-0000-000000000001",
    user_id: demoUser.id,
    submission_id: demoSubmissions[0].id,
    artwork_title: demoSubmissions[0].artwork_title,
    kind: "approved",
    message_title: "Submission accepted",
    message_body: `"${demoSubmissions[0].artwork_title}" has been approved and is now part of the competition gallery.`,
    created_at: "2024-04-24T12:00:00.000Z"
  },
  {
    id: "20000000-0000-0000-0000-000000000002",
    user_id: demoUser.id,
    submission_id: demoSubmissions[3].id,
    artwork_title: demoSubmissions[3].artwork_title,
    kind: "pending",
    message_title: "Submission received",
    message_body: `"${demoSubmissions[3].artwork_title}" is under review. Organizer review usually takes 24-48 hours.`,
    created_at: "2024-04-22T12:05:00.000Z"
  },
  {
    id: "20000000-0000-0000-0000-000000000003",
    user_id: demoUser.id,
    submission_id: null,
    artwork_title: "Quiet Signals",
    kind: "rejected",
    message_title: "Submission not accepted",
    message_body: "\"Quiet Signals\" was not accepted for the competition. Review the rules and contact the organizers if you need clarification.",
    created_at: "2024-04-16T10:00:00.000Z"
  }
];
