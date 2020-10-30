#!/usr/bin/env node

import program from "commander";
import faunadb from "faunadb";
import setupMigrations from "./setupMigrations";
import createMigration from "./createMigration";
import migrate from "./migrate";
import rollback from "./rollback";
const MIGRATION_FOLDER = "./migrations";
const client = new faunadb.Client({
  secret: String(process.env.FAUNADB_SECRET),
  domain: String(process.env.FAUNADB_DOMAIN),
  scheme: String(process.env.FAUNADB_SCHEME) as "http" | "https",
  port: Number(process.env.FAUNADB_PORT),
});

export {
  setupMigrations,
  createMigration,
  migrate,
  rollback,
  MIGRATION_FOLDER
};

program.version("0.0.1").description("Fauna migrate tool");

program
  .command("setup")
  .description("Setup migrations")
  .action(() => setupMigrations(client));

program
  .command("create <migrationName>")
  .description("Create a migration file")
  .action((migrationName: string) =>
    createMigration(migrationName, MIGRATION_FOLDER)
  );

program
  .command("migrate")
  .description("Run migrations")
  .action(() => migrate(MIGRATION_FOLDER, client));

program
  .command("rollback")
  .description("Run rollback")
  .action(() => rollback(MIGRATION_FOLDER, client));

program.parse(process.argv);
