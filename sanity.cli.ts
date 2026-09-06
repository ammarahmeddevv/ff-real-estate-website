import { defineCliConfig } from "sanity/cli";

// This config is only loaded by the Sanity CLI (`sanity deploy`, `sanity dataset …`),
// never by `next build`/`next dev`. `projectId` is intentionally left undefined
// until the client sets NEXT_PUBLIC_SANITY_PROJECT_ID in `.env` (see SETUP.md) —
// the CLI then prompts for / picks it up. The site itself falls back safely via
// `src/sanity/env.ts`.
const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";

export default defineCliConfig({
  api: { projectId, dataset },
  studioHost: "ff-real-estate",
  autoUpdates: true,
});
