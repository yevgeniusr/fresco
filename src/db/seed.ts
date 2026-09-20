import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import {
  decisions,
  experiments,
  goals,
  ideas,
  results,
} from "./schema";

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) throw new Error("DATABASE_URL is required to seed Fresco");

const client = postgres(databaseUrl, { max: 1 });
const db = drizzle(client);

const goalRows = [
  {
    id: "goal_physical_activity",
    slug: "physical-activity",
    title: "Increase voluntary physical activity",
    description: "Make movement a natural and enjoyable part of daily life, without relying on guilt, pressure, or heroic willpower.",
    domain: "Health",
    status: "Improving" as const,
    targetMetric: "Weekly active minutes per participant",
    baseline: "~80 minutes / week",
    desiredTarget: "150 minutes / week",
    reasoning: "Our surroundings often make sitting effortless and movement inconvenient. We can change that environment.",
    isDemo: true,
  },
  {
    id: "goal_voluntary_learning",
    slug: "voluntary-learning",
    title: "Increase voluntary learning",
    description: "Help people choose focused learning because it feels relevant, achievable, and connected to meaningful projects.",
    domain: "Learning",
    status: "Testing" as const,
    targetMetric: "Voluntary learning minutes per day",
    baseline: "18 minutes / day",
    desiredTarget: "30 minutes / day",
    reasoning: "Information is abundant, yet learning environments still create friction, overwhelm, and passive consumption.",
    isDemo: true,
  },
  {
    id: "goal_social_connection",
    slug: "social-connection",
    title: "Increase meaningful social connection",
    description: "Create more opportunities for mutual attention, shared activity, support, and lasting friendship.",
    domain: "Social",
    status: "Open" as const,
    targetMetric: "Meaningful social interactions per week",
    baseline: "2 interactions / week",
    desiredTarget: "4 interactions / week",
    reasoning: "Digital spaces maximize contact and content, but often make substantive connection harder to initiate.",
    isDemo: true,
  },
] satisfies Array<typeof goals.$inferInsert>;

const ideaRows = [
  {
    id: "idea_walking_groups", goalId: goalRows[0].id, title: "Small social walking groups",
    explanation: "Match three to five nearby citizens into low-pressure walking groups with participant-chosen times and routes.",
    hypothesis: "Small social walking groups increase sustained physical activity more effectively than isolated exercise prompts.",
    expectedEffect: "+50–70 weekly active minutes", estimatedCost: "$1–3 per participant",
    potentialDownsides: "Scheduling friction, social pressure, weather, accessibility barriers, and location privacy.", isDemo: true,
  },
  {
    id: "idea_home_movement", goalId: goalRows[0].id, title: "Home movement game",
    explanation: "A cooperative ten-minute movement session designed for small spaces and different abilities.",
    hypothesis: "Playful, adaptable sessions lower the activation energy for daily movement.",
    expectedEffect: "+40 weekly active minutes", estimatedCost: "$2,000 prototype",
    potentialDownsides: "Injury risk, camera privacy, novelty decay, and exclusion of some mobility profiles.", isDemo: true,
  },
  {
    id: "idea_buddy_matching", goalId: goalRows[0].id, title: "Exercise buddy matching",
    explanation: "Opt-in matching based on activity preference, accessibility needs, pace, and preferred accountability style.",
    hypothesis: "A compatible peer increases follow-through without requiring public streaks or rankings.",
    expectedEffect: "+30 weekly active minutes", estimatedCost: "Low",
    potentialDownsides: "Unwanted pressure, safety concerns, mismatches, and personal data exposure.", isDemo: true,
  },
  {
    id: "idea_learning_quests", goalId: goalRows[1].id, title: "Self-chosen daily learning quests",
    explanation: "Offer one ten-minute question connected to a citizen’s own project, with alternatives and no streak penalty.",
    hypothesis: "Small, relevant quests increase voluntary learning time without creating compulsive engagement.",
    expectedEffect: "+12 learning minutes per day", estimatedCost: "$6 per participant / month",
    potentialDownsides: "Shallow completion, AI errors, streak anxiety, and reduced intrinsic motivation.", isDemo: true,
  },
  {
    id: "idea_project_learning", goalId: goalRows[1].id, title: "Project-based learning circles",
    explanation: "Small cohorts learn a skill by producing one useful public artifact together.",
    hypothesis: "A concrete shared output improves relevance, persistence, and peer teaching.",
    expectedEffect: "+90 learning minutes per week", estimatedCost: "$20 per circle",
    potentialDownsides: "Unequal contribution, coordination burden, and pressure to publish.", isDemo: true,
  },
  {
    id: "idea_learning_groups", goalId: goalRows[1].id, title: "Weekly learning groups",
    explanation: "A recurring opt-in conversation where citizens bring one question and one thing learned.",
    hypothesis: "Lightweight social commitment increases sustained learning and knowledge sharing.",
    expectedEffect: "+45 learning minutes per week", estimatedCost: "Almost zero",
    potentialDownsides: "Meeting fatigue, dominant voices, and scheduling inequity.", isDemo: true,
  },
  {
    id: "idea_suggested_activities", goalId: goalRows[2].id, title: "Context-aware activity suggestions",
    explanation: "Suggest small shared activities based on stated interests, accessibility, distance, and available time.",
    hypothesis: "Specific, low-friction invitations create more meaningful interactions than an open social feed.",
    expectedEffect: "+1 meaningful interaction per week", estimatedCost: "Low",
    potentialDownsides: "Location privacy, awkward matching, notification fatigue, and algorithmic exclusion.", isDemo: true,
  },
  {
    id: "idea_interest_matching", goalId: goalRows[2].id, title: "Purpose-first interest matching",
    explanation: "Connect citizens around something they want to make, learn, repair, or explore together.",
    hypothesis: "Shared intent produces stronger connection than profile similarity alone.",
    expectedEffect: "+1 recurring relationship per quarter", estimatedCost: "Low",
    potentialDownsides: "Safety, exclusion, match disappointment, and pressure to perform.", isDemo: true,
  },
  {
    id: "idea_collaborative_challenges", goalId: goalRows[2].id, title: "Weekly collaborative challenges",
    explanation: "Small groups choose a useful, creative challenge that requires different skills and ends with reflection.",
    hypothesis: "Cooperation around a bounded task increases meaningful interaction and belonging.",
    expectedEffect: "+2 meaningful interactions per week", estimatedCost: "$5 per group",
    potentialDownsides: "Competition, uneven labor, accessibility gaps, and participation pressure.", isDemo: true,
  },
] satisfies Array<typeof ideas.$inferInsert>;

const experimentRows = [
  {
    id: "exp_social_walking_trial_1", slug: "social-walking-groups-trial-1", ideaId: "idea_walking_groups",
    title: "Social Walking Groups — Trial 1", question: "Do small, self-organized walking groups increase weekly active minutes while preserving autonomy and enjoyment?",
    hypothesis: ideaRows[0].hypothesis, description: "A 30-day illustrative trial of small, participant-scheduled walking groups.",
    intervention: "Participants join a group of three to five people, choose their own route and schedule, and receive one coordination prompt per week.",
    participantTarget: 30, participantEligibility: "Adults able to choose a safe, personally appropriate form of walking or equivalent adapted movement.",
    durationDays: 30, primaryMetric: "Weekly active minutes per participant",
    secondaryMetrics: ["Experiment retention", "Self-reported enjoyment", "Estimated cost per participant"],
    guardrails: ["Stress must not increase", "No pressure to disclose routes", "Withdrawal remains one click away", "No public individual activity data"],
    baseline: "82 self-reported active minutes per week", dataCollected: "Weekly aggregate active minutes, one enjoyment rating, and participation status.",
    privacyNotes: "Only aggregate demo measurements are public. No routes, health records, or individual activity totals are published.",
    timeBurden: "Two or three optional walks per week plus a two-minute check-in", status: "Completed" as const, isDemo: true,
  },
  {
    id: "exp_daily_learning_quests", slug: "daily-learning-quests", ideaId: "idea_learning_quests",
    title: "Daily Learning Quests", question: "Can one self-chosen ten-minute quest increase voluntary learning without creating streak anxiety?",
    hypothesis: ideaRows[3].hypothesis, description: "A 14-day trial of short questions tied to each participant’s own project.",
    intervention: "Choose a learning theme, receive one ten-minute quest each morning, swap or skip freely, and reflect twice during the trial.",
    participantTarget: 40, participantEligibility: "Any founding citizen with a self-chosen subject they want to explore.",
    durationDays: 14, primaryMetric: "Voluntary learning minutes per day",
    secondaryMetrics: ["Quest completion", "Self-reported usefulness", "Experiment retention"],
    guardrails: ["No streak penalties", "Anxiety must not increase", "Skipping is explicitly acceptable", "No private learning content is published"],
    baseline: "18 voluntary learning minutes per day", dataCollected: "Daily minutes, optional usefulness rating, and opt-in status.",
    privacyNotes: "Public reporting is aggregate. Quest answers stay private unless separately shared by the participant.",
    timeBurden: "About 10–15 minutes per day", status: "Recruiting" as const, isDemo: true,
  },
  {
    id: "exp_collaborative_challenge", slug: "weekly-collaborative-challenge", ideaId: "idea_collaborative_challenges",
    title: "Weekly Collaborative Challenge", question: "Does one small shared challenge create more meaningful interaction than open-ended community posting?",
    hypothesis: ideaRows[8].hypothesis, description: "A proposed three-week trial with small interest-aligned groups.",
    intervention: "Groups choose a useful creative challenge, divide roles voluntarily, meet once, and reflect on the quality of interaction.",
    participantTarget: 24, participantEligibility: "Founding citizens who can join one 45-minute session per week.",
    durationDays: 21, primaryMetric: "Meaningful social interactions per week",
    secondaryMetrics: ["Sense of belonging", "Experiment retention", "Time burden"],
    guardrails: ["No public ranking", "No penalty for leaving", "Workload must remain equitable", "Accessibility needs are collected before matching"],
    baseline: "2 meaningful social interactions per week", dataCollected: "Weekly interaction count, belonging rating, and voluntary feedback.",
    privacyNotes: "Only aggregate counts and de-identified themes would be published.",
    timeBurden: "One 45-minute session plus coordination", status: "Draft" as const, isDemo: true,
  },
] satisfies Array<typeof experiments.$inferInsert>;

async function seed() {
  await db.insert(goals).values(goalRows).onConflictDoNothing();
  await db.insert(ideas).values(ideaRows).onConflictDoNothing();
  await db.insert(experiments).values(experimentRows).onConflictDoNothing();
  await db.insert(results).values({
    id: "res_social_walking_trial_1", experimentId: experimentRows[0].id,
    summary: "Illustrative participants reported substantially more weekly movement, with strong retention and higher enjoyment. The design still needs a real baseline protocol and comparison condition.",
    measurements: [
      { label: "Weekly activity", value: "82 → 147 min", note: "+79% from the illustrative baseline" },
      { label: "Retention", value: "79%", note: "19 of 24 illustrative starters" },
      { label: "Enjoyment", value: "+18%", note: "Self-reported" },
      { label: "Estimated cost", value: "$1.80", note: "Per participant" },
    ],
    baselineComparison: "Illustrative average weekly activity changed from 82 to 147 minutes.",
    positiveEffects: ["More reported movement", "Low estimated cost", "Most participants stayed through day 30"],
    negativeEffects: ["Three groups reported scheduling friction", "Two participants disliked coordination prompts"],
    guardrailOutcomes: ["No reported injuries in demo data", "Stress was unchanged", "One withdrawal was processed without penalty"],
    limitations: ["Seeded demo data; no real trial occurred", "Self-report bias", "No comparison group", "Small and self-selected cohort"],
    participantFeedback: "People valued the social commitment but wanted easier scheduling and more pace options.",
    confidenceNotes: "Very low confidence. These synthetic measurements teach the result format and must never be cited as evidence.",
  }).onConflictDoNothing();
  await db.insert(decisions).values({
    id: "dec_social_walking_trial_1", experimentId: experimentRows[0].id, outcome: "Modify",
    reasoning: "Repeat with a clearer baseline, accessible movement alternatives, lower-friction scheduling, and a comparison condition before considering scale.",
  }).onConflictDoNothing();
}

seed()
  .then(async () => { console.info("Fresco seed is ready."); await client.end(); })
  .catch(async (error: unknown) => { console.error("Fresco seed failed", error); await client.end(); process.exit(1); });
