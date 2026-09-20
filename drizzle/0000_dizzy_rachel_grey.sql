CREATE TYPE "public"."decision_outcome" AS ENUM('Scale', 'Modify', 'Repeat', 'Stop', 'Inconclusive');--> statement-breakpoint
CREATE TYPE "public"."experiment_status" AS ENUM('Draft', 'Recruiting', 'Running', 'Analyzing', 'Completed', 'Cancelled');--> statement-breakpoint
CREATE TYPE "public"."goal_status" AS ENUM('Open', 'Testing', 'Improving', 'Archived');--> statement-breakpoint
CREATE TABLE "citizens" (
	"id" text PRIMARY KEY NOT NULL,
	"email" text NOT NULL,
	"password_hash" text NOT NULL,
	"display_name" text NOT NULL,
	"avatar_url" text,
	"bio" text DEFAULT '' NOT NULL,
	"interests" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"skills" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"is_moderator" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "comments" (
	"id" text PRIMARY KEY NOT NULL,
	"experiment_id" text NOT NULL,
	"citizen_id" text NOT NULL,
	"body" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "community_signals" (
	"experiment_id" text NOT NULL,
	"citizen_id" text NOT NULL,
	"outcome" "decision_outcome" NOT NULL,
	"reasoning" text DEFAULT '' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "community_signals_experiment_id_citizen_id_pk" PRIMARY KEY("experiment_id","citizen_id")
);
--> statement-breakpoint
CREATE TABLE "decisions" (
	"id" text PRIMARY KEY NOT NULL,
	"experiment_id" text NOT NULL,
	"outcome" "decision_outcome" NOT NULL,
	"reasoning" text NOT NULL,
	"decided_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "decisions_experiment_id_unique" UNIQUE("experiment_id")
);
--> statement-breakpoint
CREATE TABLE "experiments" (
	"id" text PRIMARY KEY NOT NULL,
	"slug" text NOT NULL,
	"idea_id" text NOT NULL,
	"creator_id" text,
	"title" text NOT NULL,
	"question" text NOT NULL,
	"hypothesis" text NOT NULL,
	"description" text NOT NULL,
	"intervention" text NOT NULL,
	"participant_target" integer NOT NULL,
	"participant_eligibility" text NOT NULL,
	"duration_days" integer NOT NULL,
	"start_date" timestamp with time zone,
	"end_date" timestamp with time zone,
	"primary_metric" text NOT NULL,
	"secondary_metrics" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"guardrails" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"baseline" text NOT NULL,
	"data_collected" text NOT NULL,
	"privacy_notes" text NOT NULL,
	"time_burden" text NOT NULL,
	"status" "experiment_status" DEFAULT 'Draft' NOT NULL,
	"is_demo" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "experiments_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "goals" (
	"id" text PRIMARY KEY NOT NULL,
	"slug" text NOT NULL,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"domain" text NOT NULL,
	"creator_id" text,
	"status" "goal_status" DEFAULT 'Open' NOT NULL,
	"target_metric" text NOT NULL,
	"baseline" text NOT NULL,
	"desired_target" text NOT NULL,
	"reasoning" text NOT NULL,
	"is_demo" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "goals_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "idea_supports" (
	"idea_id" text NOT NULL,
	"citizen_id" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "idea_supports_idea_id_citizen_id_pk" PRIMARY KEY("idea_id","citizen_id")
);
--> statement-breakpoint
CREATE TABLE "ideas" (
	"id" text PRIMARY KEY NOT NULL,
	"goal_id" text NOT NULL,
	"title" text NOT NULL,
	"explanation" text NOT NULL,
	"hypothesis" text NOT NULL,
	"expected_effect" text NOT NULL,
	"estimated_cost" text NOT NULL,
	"potential_downsides" text NOT NULL,
	"creator_id" text,
	"is_demo" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "knowledge_promotions" (
	"id" text PRIMARY KEY NOT NULL,
	"entity_type" text NOT NULL,
	"entity_id" text NOT NULL,
	"okf_path" text NOT NULL,
	"git_commit" text NOT NULL,
	"reviewed_by" text,
	"promoted_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "participations" (
	"experiment_id" text NOT NULL,
	"citizen_id" text NOT NULL,
	"consented_at" timestamp with time zone DEFAULT now() NOT NULL,
	"withdrawn_at" timestamp with time zone,
	"consent_version" text DEFAULT 'v0.1' NOT NULL,
	CONSTRAINT "participations_experiment_id_citizen_id_pk" PRIMARY KEY("experiment_id","citizen_id")
);
--> statement-breakpoint
CREATE TABLE "results" (
	"id" text PRIMARY KEY NOT NULL,
	"experiment_id" text NOT NULL,
	"summary" text NOT NULL,
	"measurements" jsonb NOT NULL,
	"baseline_comparison" text NOT NULL,
	"positive_effects" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"negative_effects" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"guardrail_outcomes" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"limitations" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"participant_feedback" text NOT NULL,
	"confidence_notes" text NOT NULL,
	"published_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "results_experiment_id_unique" UNIQUE("experiment_id")
);
--> statement-breakpoint
CREATE TABLE "sessions" (
	"id" text PRIMARY KEY NOT NULL,
	"citizen_id" text NOT NULL,
	"token_hash" text NOT NULL,
	"expires_at" timestamp with time zone NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "comments" ADD CONSTRAINT "comments_experiment_id_experiments_id_fk" FOREIGN KEY ("experiment_id") REFERENCES "public"."experiments"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "comments" ADD CONSTRAINT "comments_citizen_id_citizens_id_fk" FOREIGN KEY ("citizen_id") REFERENCES "public"."citizens"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "community_signals" ADD CONSTRAINT "community_signals_experiment_id_experiments_id_fk" FOREIGN KEY ("experiment_id") REFERENCES "public"."experiments"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "community_signals" ADD CONSTRAINT "community_signals_citizen_id_citizens_id_fk" FOREIGN KEY ("citizen_id") REFERENCES "public"."citizens"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "decisions" ADD CONSTRAINT "decisions_experiment_id_experiments_id_fk" FOREIGN KEY ("experiment_id") REFERENCES "public"."experiments"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "experiments" ADD CONSTRAINT "experiments_idea_id_ideas_id_fk" FOREIGN KEY ("idea_id") REFERENCES "public"."ideas"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "experiments" ADD CONSTRAINT "experiments_creator_id_citizens_id_fk" FOREIGN KEY ("creator_id") REFERENCES "public"."citizens"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "goals" ADD CONSTRAINT "goals_creator_id_citizens_id_fk" FOREIGN KEY ("creator_id") REFERENCES "public"."citizens"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "idea_supports" ADD CONSTRAINT "idea_supports_idea_id_ideas_id_fk" FOREIGN KEY ("idea_id") REFERENCES "public"."ideas"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "idea_supports" ADD CONSTRAINT "idea_supports_citizen_id_citizens_id_fk" FOREIGN KEY ("citizen_id") REFERENCES "public"."citizens"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ideas" ADD CONSTRAINT "ideas_goal_id_goals_id_fk" FOREIGN KEY ("goal_id") REFERENCES "public"."goals"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ideas" ADD CONSTRAINT "ideas_creator_id_citizens_id_fk" FOREIGN KEY ("creator_id") REFERENCES "public"."citizens"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "knowledge_promotions" ADD CONSTRAINT "knowledge_promotions_reviewed_by_citizens_id_fk" FOREIGN KEY ("reviewed_by") REFERENCES "public"."citizens"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "participations" ADD CONSTRAINT "participations_experiment_id_experiments_id_fk" FOREIGN KEY ("experiment_id") REFERENCES "public"."experiments"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "participations" ADD CONSTRAINT "participations_citizen_id_citizens_id_fk" FOREIGN KEY ("citizen_id") REFERENCES "public"."citizens"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "results" ADD CONSTRAINT "results_experiment_id_experiments_id_fk" FOREIGN KEY ("experiment_id") REFERENCES "public"."experiments"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_citizen_id_citizens_id_fk" FOREIGN KEY ("citizen_id") REFERENCES "public"."citizens"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "citizens_email_unique" ON "citizens" USING btree ("email");--> statement-breakpoint
CREATE INDEX "comments_experiment_idx" ON "comments" USING btree ("experiment_id");--> statement-breakpoint
CREATE INDEX "experiments_idea_idx" ON "experiments" USING btree ("idea_id");--> statement-breakpoint
CREATE INDEX "experiments_status_idx" ON "experiments" USING btree ("status");--> statement-breakpoint
CREATE INDEX "ideas_goal_idx" ON "ideas" USING btree ("goal_id");--> statement-breakpoint
CREATE UNIQUE INDEX "knowledge_promotions_entity_path_unique" ON "knowledge_promotions" USING btree ("entity_type","entity_id","okf_path");--> statement-breakpoint
CREATE INDEX "knowledge_promotions_entity_idx" ON "knowledge_promotions" USING btree ("entity_type","entity_id");--> statement-breakpoint
CREATE UNIQUE INDEX "sessions_token_unique" ON "sessions" USING btree ("token_hash");--> statement-breakpoint
CREATE INDEX "sessions_citizen_idx" ON "sessions" USING btree ("citizen_id");