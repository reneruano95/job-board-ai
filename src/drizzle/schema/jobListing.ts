import {
  boolean,
  index,
  integer,
  pgEnum,
  pgTable,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";
import { createdAt, id, updatedAt } from "../schemaHelpers";
import { OrganizationTable } from "./organization";
import { relations } from "drizzle-orm";
import { JobListingApplicationTable } from "./jobListingApplication";

export const wageIntervals = [
  "hourly",
  "daily",
  "weekly",
  "bi-weekly",
  "yearly",
  "monthly",
] as const;
export type WageInterval = (typeof wageIntervals)[number];
export const wageIntervalEnum = pgEnum(
  "job_listing_wage_interval",
  wageIntervals
);

export const locationRequirements = [
  "remote",
  "in-office",
  "hybrid",
  "flexible",
  "not-specified",
  "other",
] as const;
export type LocationRequirement = (typeof locationRequirements)[number];
export const locationRequirementsEnum = pgEnum(
  "job_listing_location_requirement",
  locationRequirements
);

export const experienceLevels = [
  "internship",
  "entry-level",
  "mid-level",
  "senior-level",
] as const;
export type ExperienceLevel = (typeof experienceLevels)[number];
export const experienceLevelEnum = pgEnum(
  "job_listing_experience_level",
  experienceLevels
);

export const jobListingTypes = [
  "full-time",
  "part-time",
  "contract",
  "temporary",
  "internship",
] as const;
export type JobListingType = (typeof jobListingTypes)[number];
export const jobListingTypeEnum = pgEnum("job_listing_type", jobListingTypes);

export const jobListingStatuses = ["draft", "published", "delisted"] as const;
export type JobListingStatus = (typeof jobListingStatuses)[number];
export const jobListingStatusEnum = pgEnum(
  "job_listing_status",
  jobListingStatuses
);

export const JobListingTable = pgTable(
  "job_listings",
  {
    id,
    organizationId: varchar()
      .references(() => OrganizationTable.id, {
        onDelete: "cascade",
      })
      .notNull(),
    title: varchar().notNull(),
    description: text().notNull(),
    wage: integer(),
    wageInterval: wageIntervalEnum(),
    stateAbbreviation: varchar(),
    city: varchar(),
    isFeatured: boolean().notNull().default(false),
    locationRequirement: locationRequirementsEnum().notNull(),
    experienceLevel: experienceLevelEnum().notNull(),
    status: jobListingStatusEnum().notNull(),
    type: jobListingTypeEnum().notNull(),
    postedAt: timestamp({ withTimezone: true }),
    createdAt,
    updatedAt,
  },
  (table) => [index().on(table.stateAbbreviation)]
);

export const jobListingReferences = relations(
  JobListingTable,
  ({ one, many }) => ({
    organization: one(OrganizationTable, {
      fields: [JobListingTable.organizationId],
      references: [OrganizationTable.id],
    }),
    applications: many(JobListingApplicationTable),
  })
);
