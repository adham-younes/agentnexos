# Local review build

review.html at the revision root is the complete standalone build. It needs no server, API key, connection or package install to open. It embeds React, content, the selected image and the existing site's fonts. This is a review artifact, not a production bundle.

To rebuild from source in an isolated working directory, provide React/ReactDOM matching the application and esbuild, then run build-review.mjs with Node. Do not alter the application's dependency lock solely for this review. The included license files cover React's bundled runtime. Published-site font setup stays in the production project.

The current handoff was bundled using available React 18 dependencies in an isolated earlier prototype dependency directory, with TypeScript checked using the application’s React type definitions. Source and types passed; application integration/build still needs the project's installed runtime.

Preserve source components and their CSS; the embedded document includes all bilingual content for easy review. Production pages should load their own locale and route content rather than ship all 34 texts in one client module. Server-render static marketing content; only interactive workspace/actions need client state.
