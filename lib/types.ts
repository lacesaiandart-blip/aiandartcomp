export type SubmissionStatus = "pending" | "approved" | "deleted";
export type SubmissionNotificationKind = "pending" | "approved" | "rejected";

export type Profile = {
  id: string;
  email: string;
  full_name: string | null;
  school: string | null;
  created_at: string;
};

export type Submission = {
  id: string;
  user_id: string;
  student_name: string;
  school: string;
  email: string;
  artwork_title: string;
  theme: string;
  image_path: string;
  prompt_log: string;
  ai_tools_used: string;
  creative_process_statement: string;
  integrity_agreed: boolean;
  status: SubmissionStatus;
  created_at: string;
};

export type VoteSummaryRow = {
  id: string;
  artwork_title: string;
  student_name: string;
  theme: string;
  school: string;
  vote_count: number;
};

export type SubmissionNotification = {
  id: string;
  user_id: string;
  submission_id: string | null;
  artwork_title: string;
  kind: SubmissionNotificationKind;
  message_title: string;
  message_body: string;
  created_at: string;
};
