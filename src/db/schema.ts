import {
  boolean,
  index,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  primaryKey,
  text,
  timestamp,
  uniqueIndex,
} from "drizzle-orm/pg-core";

export const goalStatus = pgEnum("goal_status", ["Open", "Testing", "Improving", "Archived"]);
export const experimentStatus = pgEnum("experiment_status", [
  "Draft",
  "Recruiting",
  "Running",
  "Analyzing",
  "Completed",
  "Cancelled",
]);
export const decisionOutcome = pgEnum("decision_outcome", [
  "Scale",
  "Modify",
  "Repeat",
  "Stop",
  "Inconclusive",
]);

const timestamps = {
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
};

export const citizens = pgTable(
  "citizens",
  {
    id: text("id").primaryKey(),
    email: text("email").notNull(),
    passwordHash: text("password_hash").notNull(),
    displayName: text("display_name").notNull(),
    avatarUrl: text("avatar_url"),
    bio: text("bio").notNull().default(""),
    interests: jsonb("interests").$type<string[]>().notNull().default([]),
    skills: jsonb("skills").$type<string[]>().notNull().default([]),
    isModerator: boolean("is_moderator").notNull().default(false),
    ...timestamps,
  },
  (table) => [uniqueIndex("citizens_email_unique").on(table.email)],
);

export const sessions = pgTable(
  "sessions",
  {
    id: text("id").primaryKey(),
    citizenId: text("citizen_id")
      .notNull()
      .references(() => citizens.id, { onDelete: "cascade" }),
    tokenHash: text("token_hash").notNull(),
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    uniqueIndex("sessions_token_unique").on(table.tokenHash),
    index("sessions_citizen_idx").on(table.citizenId),
  ],
);

export const goals = pgTable("goals", {
  id: text("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  domain: text("domain").notNull(),
  creatorId: text("creator_id").references(() => citizens.id, { onDelete: "set null" }),
  status: goalStatus("status").notNull().default("Open"),
  targetMetric: text("target_metric").notNull(),
  baseline: text("baseline").notNull(),
  desiredTarget: text("desired_target").notNull(),
  reasoning: text("reasoning").notNull(),
  isDemo: boolean("is_demo").notNull().default(false),
  ...timestamps,
});

export const ideas = pgTable(
  "ideas",
  {
    id: text("id").primaryKey(),
    goalId: text("goal_id")
      .notNull()
      .references(() => goals.id, { onDelete: "cascade" }),
    title: text("title").notNull(),
    explanation: text("explanation").notNull(),
    hypothesis: text("hypothesis").notNull(),
    expectedEffect: text("expected_effect").notNull(),
    estimatedCost: text("estimated_cost").notNull(),
    potentialDownsides: text("potential_downsides").notNull(),
    creatorId: text("creator_id").references(() => citizens.id, { onDelete: "set null" }),
    isDemo: boolean("is_demo").notNull().default(false),
    ...timestamps,
  },
  (table) => [index("ideas_goal_idx").on(table.goalId)],
);

export const ideaSupports = pgTable(
  "idea_supports",
  {
    ideaId: text("idea_id")
      .notNull()
      .references(() => ideas.id, { onDelete: "cascade" }),
    citizenId: text("citizen_id")
      .notNull()
      .references(() => citizens.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [primaryKey({ columns: [table.ideaId, table.citizenId] })],
);

export const experiments = pgTable(
  "experiments",
  {
    id: text("id").primaryKey(),
    slug: text("slug").notNull().unique(),
    ideaId: text("idea_id")
      .notNull()
      .references(() => ideas.id, { onDelete: "restrict" }),
    creatorId: text("creator_id").references(() => citizens.id, { onDelete: "set null" }),
    title: text("title").notNull(),
    question: text("question").notNull(),
    hypothesis: text("hypothesis").notNull(),
    description: text("description").notNull(),
    intervention: text("intervention").notNull(),
    participantTarget: integer("participant_target").notNull(),
    participantEligibility: text("participant_eligibility").notNull(),
    durationDays: integer("duration_days").notNull(),
    startDate: timestamp("start_date", { withTimezone: true }),
    endDate: timestamp("end_date", { withTimezone: true }),
    primaryMetric: text("primary_metric").notNull(),
    secondaryMetrics: jsonb("secondary_metrics").$type<string[]>().notNull().default([]),
    guardrails: jsonb("guardrails").$type<string[]>().notNull().default([]),
    baseline: text("baseline").notNull(),
    dataCollected: text("data_collected").notNull(),
    privacyNotes: text("privacy_notes").notNull(),
    timeBurden: text("time_burden").notNull(),
    status: experimentStatus("status").notNull().default("Draft"),
    isDemo: boolean("is_demo").notNull().default(false),
    ...timestamps,
  },
  (table) => [index("experiments_idea_idx").on(table.ideaId), index("experiments_status_idx").on(table.status)],
);

export const participations = pgTable(
  "participations",
  {
    experimentId: text("experiment_id")
      .notNull()
      .references(() => experiments.id, { onDelete: "cascade" }),
    citizenId: text("citizen_id")
      .notNull()
      .references(() => citizens.id, { onDelete: "cascade" }),
    consentedAt: timestamp("consented_at", { withTimezone: true }).notNull().defaultNow(),
    withdrawnAt: timestamp("withdrawn_at", { withTimezone: true }),
    consentVersion: text("consent_version").notNull().default("v0.1"),
  },
  (table) => [primaryKey({ columns: [table.experimentId, table.citizenId] })],
);

export const results = pgTable("results", {
  id: text("id").primaryKey(),
  experimentId: text("experiment_id")
    .notNull()
    .unique()
    .references(() => experiments.id, { onDelete: "cascade" }),
  summary: text("summary").notNull(),
  measurements: jsonb("measurements").$type<Array<{ label: string; value: string; note?: string }>>().notNull(),
  baselineComparison: text("baseline_comparison").notNull(),
  positiveEffects: jsonb("positive_effects").$type<string[]>().notNull().default([]),
  negativeEffects: jsonb("negative_effects").$type<string[]>().notNull().default([]),
  guardrailOutcomes: jsonb("guardrail_outcomes").$type<string[]>().notNull().default([]),
  limitations: jsonb("limitations").$type<string[]>().notNull().default([]),
  participantFeedback: text("participant_feedback").notNull(),
  confidenceNotes: text("confidence_notes").notNull(),
  publishedAt: timestamp("published_at", { withTimezone: true }).notNull().defaultNow(),
});

export const decisions = pgTable("decisions", {
  id: text("id").primaryKey(),
  experimentId: text("experiment_id")
    .notNull()
    .unique()
    .references(() => experiments.id, { onDelete: "cascade" }),
  outcome: decisionOutcome("outcome").notNull(),
  reasoning: text("reasoning").notNull(),
  decidedAt: timestamp("decided_at", { withTimezone: true }).notNull().defaultNow(),
});

export const comments = pgTable(
  "comments",
  {
    id: text("id").primaryKey(),
    experimentId: text("experiment_id")
      .notNull()
      .references(() => experiments.id, { onDelete: "cascade" }),
    citizenId: text("citizen_id")
      .notNull()
      .references(() => citizens.id, { onDelete: "cascade" }),
    body: text("body").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [index("comments_experiment_idx").on(table.experimentId)],
);

export const communitySignals = pgTable(
  "community_signals",
  {
    experimentId: text("experiment_id")
      .notNull()
      .references(() => experiments.id, { onDelete: "cascade" }),
    citizenId: text("citizen_id")
      .notNull()
      .references(() => citizens.id, { onDelete: "cascade" }),
    outcome: decisionOutcome("outcome").notNull(),
    reasoning: text("reasoning").notNull().default(""),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [primaryKey({ columns: [table.experimentId, table.citizenId] })],
);

export const knowledgePromotions = pgTable(
  "knowledge_promotions",
  {
    id: text("id").primaryKey(),
    entityType: text("entity_type").notNull(),
    entityId: text("entity_id").notNull(),
    okfPath: text("okf_path").notNull(),
    gitCommit: text("git_commit").notNull(),
    reviewedBy: text("reviewed_by").references(() => citizens.id, { onDelete: "set null" }),
    promotedAt: timestamp("promoted_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    uniqueIndex("knowledge_promotions_entity_path_unique").on(table.entityType, table.entityId, table.okfPath),
    index("knowledge_promotions_entity_idx").on(table.entityType, table.entityId),
  ],
);
