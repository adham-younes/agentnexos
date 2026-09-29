#!/usr/bin/env bash
set -euo pipefail

# ==============================================================================
# Agentnexos — Automated Safe Rollback Procedure
# Usage:
#   bash scripts/rollback-plan.sh --dry-run   # Rehearsal mode (does not alter repo)
#   bash scripts/rollback-plan.sh --execute   # Executes safe revert and pushes
# ==============================================================================

MODE="${1:---dry-run}"
PROD_URL="https://compute-the-platform-to-build-six-fawn.vercel.app"

echo "================================================================="
echo "   AGENTNEXOS SAFE ROLLBACK REHEARSAL & EXECUTION RUNNER         "
echo "================================================================="
echo "Current mode: $MODE"
echo "Production Target: $PROD_URL"
echo ""

CURRENT_COMMIT=$(git rev-parse --short HEAD)
PREVIOUS_COMMIT=$(git rev-parse --short HEAD~1 2>/dev/null || echo "INITIAL")

echo "Current Commit: $CURRENT_COMMIT"
echo "Previous Commit: $PREVIOUS_COMMIT"
echo ""

# 1. Health Verification of Current Target
echo "[1/4] Checking live production health status..."
HEALTH_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$PROD_URL/api/health" || echo "FAILED")
echo "  Live Production /api/health HTTP Status: $HEALTH_STATUS"

if [ "$MODE" = "--dry-run" ]; then
  echo ""
  echo "[2/4] [DRY-RUN] Simulating Git Revert boundary..."
  echo "  Would execute: git revert --no-edit HEAD"
  echo "  Target rollback state: Revert of $CURRENT_COMMIT back to $PREVIOUS_COMMIT"
  
  echo ""
  echo "[3/4] [DRY-RUN] Verifying rollback test suites..."
  pnpm typecheck
  pnpm test:security
  
  echo ""
  echo "[4/4] [DRY-RUN] Rollback rehearsal passed successfully."
  echo "  No git changes were made. In an incident, run with --execute."
  exit 0
fi

if [ "$MODE" = "--execute" ]; then
  echo ""
  echo "[2/4] Executing Git Revert of HEAD..."
  git revert --no-edit HEAD
  
  echo ""
  echo "[3/4] Verifying local build before pushing revert..."
  pnpm typecheck
  pnpm build
  
  echo ""
  echo "[4/4] Pushing revert commit to main..."
  git push origin main
  
  echo "Rollback successfully dispatched. Monitor Vercel production deployment."
  exit 0
fi

echo "Unknown mode: $MODE. Use --dry-run or --execute."
exit 1
