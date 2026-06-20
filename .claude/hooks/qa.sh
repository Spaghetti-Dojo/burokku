#!/usr/bin/env bash
set -uo pipefail

if ! git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
  echo "qa.sh: not a git repo, skipping."
  exit 0
fi

if ! command -v jq >/dev/null 2>&1; then
  echo "qa.sh: jq not found, skipping." >&2
  exit 0
fi

# Collect changed paths and bucket by extension.
has_php=0
has_js=0
has_style=0

while IFS= read -r -d '' entry; do
  [[ -z "$entry" ]] && continue
  status="${entry:0:2}"
  path="${entry:3}"

  # Renames/copies emit a second NUL field (the original path) in -z mode.
  # Consume it so it is not parsed as a bogus entry.
  if [[ "${status:0:1}" == "R" || "${status:0:1}" == "C" ]]; then
    read -r -d '' _orig || true
  fi

  # Skip deletions: the path no longer exists to lint.
  if [[ "$status" == *D* ]]; then
    continue
  fi

  case "$path" in
    *.php)                  has_php=1 ;;
    *.ts|*.tsx|*.js|*.jsx)  has_js=1 ;;
    *.scss|*.css)           has_style=1 ;;
  esac
done < <(git status --porcelain -z -uall)

failures=()

run_step() {
  local label="$1"
  shift
  local cmd="$*"
  local out
  local rc
  out="$("$@" 2>&1)"
  rc=$?
  if [[ $rc -ne 0 ]]; then
    local trimmed
    trimmed="$(printf '%s\n' "$out" | tail -n 100)"
    failures+=("$(printf '### %s\n- command: `%s`\n- exit: %d\n\n```\n%s\n```' \
      "$label" "$cmd" "$rc" "$trimmed")")
  fi
}

if [[ $has_php -eq 1 ]]; then
  run_step "php:cs:fix"   composer cs:fix
  run_step "php:cs"       composer cs
  run_step "php:analysis" composer analysis
fi

if [[ $has_js -eq 1 ]]; then
  run_step "scripts:fix"  pnpm lint:scripts:fix
  run_step "scripts"      pnpm lint:scripts
fi

if [[ $has_style -eq 1 ]]; then
  run_step "styles:fix"   pnpm lint:styles:fix
  run_step "styles"       pnpm lint:styles
fi

if [[ ${#failures[@]} -gt 0 ]]; then
  header="## QA failures (${#failures[@]})"
  body=$(printf '%s\n\n' "${failures[@]}")
  reason=$(printf '%s\n\n%s' "$header" "$body")
  jq -n --arg reason "$reason" '{decision:"block", reason:$reason}'
fi

exit 0
