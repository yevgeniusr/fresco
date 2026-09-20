import "server-only";

import { and, asc, count, desc, eq, isNull, sql } from "drizzle-orm";

import { db } from "@/db";
import {
  citizens,
  comments,
  communitySignals,
  decisions,
  experiments,
  goals,
  ideas,
  ideaSupports,
  participations,
  results,
} from "@/db/schema";

export async function listPublicExperiments() {
  return db
    .select({
      id: experiments.id,
      slug: experiments.slug,
      title: experiments.title,
      question: experiments.question,
      status: experiments.status,
      durationDays: experiments.durationDays,
      participantTarget: experiments.participantTarget,
      isDemo: experiments.isDemo,
      domain: goals.domain,
      goalTitle: goals.title,
      participantCount: count(participations.citizenId),
    })
    .from(experiments)
    .innerJoin(ideas, eq(experiments.ideaId, ideas.id))
    .innerJoin(goals, eq(ideas.goalId, goals.id))
    .leftJoin(participations, and(eq(participations.experimentId, experiments.id), isNull(participations.withdrawnAt)))
    .groupBy(experiments.id, goals.id)
    .orderBy(sql`case ${experiments.status} when 'Recruiting' then 0 when 'Running' then 1 when 'Completed' then 2 else 3 end`);
}

export async function listGoals() {
  return db
    .select({
      id: goals.id,
      slug: goals.slug,
      title: goals.title,
      description: goals.description,
      domain: goals.domain,
      status: goals.status,
      baseline: goals.baseline,
      desiredTarget: goals.desiredTarget,
      targetMetric: goals.targetMetric,
      ideaCount: count(ideas.id),
      isDemo: goals.isDemo,
    })
    .from(goals)
    .leftJoin(ideas, eq(ideas.goalId, goals.id))
    .groupBy(goals.id)
    .orderBy(asc(goals.createdAt));
}

export async function getGoal(idOrSlug: string) {
  const [goal] = await db.select().from(goals).where(sql`${goals.id} = ${idOrSlug} or ${goals.slug} = ${idOrSlug}`).limit(1);
  if (!goal) return null;
  const goalIdeas = await db
    .select({
      id: ideas.id,
      title: ideas.title,
      explanation: ideas.explanation,
      hypothesis: ideas.hypothesis,
      expectedEffect: ideas.expectedEffect,
      estimatedCost: ideas.estimatedCost,
      potentialDownsides: ideas.potentialDownsides,
      isDemo: ideas.isDemo,
      supportCount: count(ideaSupports.citizenId),
    })
    .from(ideas)
    .leftJoin(ideaSupports, eq(ideaSupports.ideaId, ideas.id))
    .where(eq(ideas.goalId, goal.id))
    .groupBy(ideas.id)
    .orderBy(asc(ideas.createdAt));
  const goalExperiments = await db
    .select({ id: experiments.id, slug: experiments.slug, title: experiments.title, question: experiments.question, status: experiments.status, durationDays: experiments.durationDays })
    .from(experiments)
    .innerJoin(ideas, eq(experiments.ideaId, ideas.id))
    .where(eq(ideas.goalId, goal.id))
    .orderBy(desc(experiments.createdAt));
  return { goal, ideas: goalIdeas, experiments: goalExperiments };
}

export async function getExperiment(idOrSlug: string, citizenId?: string) {
  const rows = await db
    .select({ experiment: experiments, idea: ideas, goal: goals })
    .from(experiments)
    .innerJoin(ideas, eq(experiments.ideaId, ideas.id))
    .innerJoin(goals, eq(ideas.goalId, goals.id))
    .where(sql`${experiments.id} = ${idOrSlug} or ${experiments.slug} = ${idOrSlug}`)
    .limit(1);
  const base = rows[0];
  if (!base) return null;
  const [resultRows, decisionRows, commentRows, signalRows, participantRows, membershipRows] = await Promise.all([
    db.select().from(results).where(eq(results.experimentId, base.experiment.id)).limit(1),
    db.select().from(decisions).where(eq(decisions.experimentId, base.experiment.id)).limit(1),
    db.select({ id: comments.id, body: comments.body, createdAt: comments.createdAt, author: citizens.displayName })
      .from(comments).innerJoin(citizens, eq(comments.citizenId, citizens.id))
      .where(eq(comments.experimentId, base.experiment.id)).orderBy(desc(comments.createdAt)),
    db.select({ outcome: communitySignals.outcome, total: count() }).from(communitySignals)
      .where(eq(communitySignals.experimentId, base.experiment.id)).groupBy(communitySignals.outcome),
    db.select({ total: count() }).from(participations)
      .where(and(eq(participations.experimentId, base.experiment.id), isNull(participations.withdrawnAt))),
    citizenId ? db.select().from(participations)
      .where(and(eq(participations.experimentId, base.experiment.id), eq(participations.citizenId, citizenId))).limit(1) : Promise.resolve([]),
  ]);
  return {
    ...base,
    result: resultRows[0] ?? null,
    decision: decisionRows[0] ?? null,
    comments: commentRows,
    signals: signalRows,
    participantCount: participantRows[0]?.total ?? 0,
    participation: membershipRows[0] ?? null,
  };
}

export async function dashboardData(citizenId: string) {
  const [allGoals, allExperiments, joined] = await Promise.all([
    listGoals(),
    listPublicExperiments(),
    db.select({ id: experiments.id, slug: experiments.slug, title: experiments.title, status: experiments.status, withdrawnAt: participations.withdrawnAt })
      .from(participations).innerJoin(experiments, eq(participations.experimentId, experiments.id))
      .where(eq(participations.citizenId, citizenId)).orderBy(desc(participations.consentedAt)),
  ]);
  return { goals: allGoals, experiments: allExperiments, joined };
}

export async function listIdeasForCreate() {
  return db.select({ id: ideas.id, title: ideas.title, goalTitle: goals.title }).from(ideas).innerJoin(goals, eq(ideas.goalId, goals.id)).orderBy(asc(goals.title), asc(ideas.title));
}
