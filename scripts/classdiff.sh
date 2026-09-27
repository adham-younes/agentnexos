#!/usr/bin/env bash
# Structural className diff: original template commit vs current working tree.
cd "$(dirname "$0")/.." || exit 1
BASE=9f8220d
mkdir -p /tmp/classdiff
for f in components/landing/*.tsx; do
  base="$f"
  # original location for page.tsx moved; components are same path
  git show "$BASE:$f" > /tmp/classdiff/orig.tsx 2>/dev/null || continue
  name=$(basename "$f" .tsx)
  # extract className string literals, normalized (strip template ${...} dynamic parts)
  grep -oE 'className=\{?`?"[^"]*"' /tmp/classdiff/orig.tsx | sed 's/className={*`*"//; s/"$//' | sort -u > /tmp/classdiff/$name.orig.txt
  grep -oE 'className=\{?`?"[^"]*"' "$f" | sed 's/className={*`*"//; s/"$//' | sort -u > /tmp/classdiff/$name.new.txt
  only_orig=$(comm -23 /tmp/classdiff/$name.orig.txt /tmp/classdiff/$name.new.txt)
  only_new=$(comm -13 /tmp/classdiff/$name.orig.txt /tmp/classdiff/$name.new.txt)
  if [ -n "$only_orig$only_new" ]; then
    echo "##### $name #####"
    [ -n "$only_orig" ] && echo "--- REMOVED from template ---" && echo "$only_orig"
    [ -n "$only_new" ] && echo "--- ADDED ---" && echo "$only_new"
    echo
  fi
done
