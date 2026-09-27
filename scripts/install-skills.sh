#!/usr/bin/env bash
# Installs the required design/agent skills into .agents/skills (openhands target only).
set -u
cd "$(dirname "$0")/.."

install() {
  local repo="$1"; shift
  echo "=================================================="
  echo "### $repo $*"
  echo "=================================================="
  npx --yes skills@latest add "$repo" "$@" -y --copy -a openhands 2>&1 | tail -12
  echo
}

install https://github.com/anthropics/skills --skill frontend-design
install https://github.com/vercel-labs/skills --skill find-skills
install https://github.com/vercel-labs/agent-browser --skill agent-browser
install https://github.com/vercel-labs/agent-skills --skill vercel-react-best-practices
install https://github.com/mattpocock/skills --skill teach
install https://github.com/mattpocock/skills --skill codebase-design
install https://github.com/mattpocock/skills --skill code-review
install https://github.com/mattpocock/skills --skill research
install https://github.com/mattpocock/skills --skill writing-for-agents
install https://github.com/heygen-com/hyperframes --skill hyperframes-cli
install https://github.com/heygen-com/hyperframes --skill hyperframes-registry
install https://github.com/heygen-com/hyperframes --skill hyperframes-animation
install https://github.com/leonxlnx/taste-skill --skill design-taste-frontend
install https://github.com/leonxlnx/taste-skill --skill high-end-visual-design
install https://github.com/leonxlnx/taste-skill --skill image-to-code
install https://github.com/supabase/agent-skills --skill supabase-postgres-best-practices
install https://github.com/emilkowalski/skills --skill find-animation-opportunities
