export const eventConfig = {
  competitionName: "High School AI Art Competition",
  siteTitle: "AI Art Competition",
  heroTitleLines: [
    "High School",
    "AI Art",
    "Competition"
  ],
  schoolName: "Your High School",
  schoolNamePlaceholder: "Your high school",
  audienceLabel: "high school students",
  entryWindowLabel: "Entry window",
  contactEmail: "organizers@example.com",
  organizersLabel: "the organizers",
  fundsRecipientLabel: "the organizers",
  campusTourLabel: "a campus tour",
  campusTourDescription: "Winners may also be invited to a campus tour led by partner student groups.",
  maxSubmissionsPerUser: 2,
  maxVotesPerUser: 3,
  reservedGalleryCodesPerStudent: 1,
  fundraiserGalleryCodesPerStudent: 10,
  fundraiserCodePriceLabel: "$1 cash",
  themes: [
    "Future Cities",
    "Nature",
    "Steampunk",
    "Other"
  ],
  judgingCriteria: [
    { label: "Creativity and viewer votes", weight: "50%" },
    { label: "Effective use of AI tools", weight: "30%" },
    { label: "Process documentation", weight: "20%" }
  ],
  prizes: [
    { place: "1st", label: "1st place", award: "$100" },
    { place: "2nd", label: "2nd place", award: "$50" },
    { place: "3rd", label: "3rd place", award: "$25" }
  ]
} as const;
