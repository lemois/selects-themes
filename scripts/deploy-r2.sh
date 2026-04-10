#!/usr/bin/env bash
set -euo pipefail

: "${R2_ACCOUNT_ID:?R2_ACCOUNT_ID is required}"
: "${R2_BUCKET:?R2_BUCKET is required}"
: "${AWS_ACCESS_KEY_ID:?AWS_ACCESS_KEY_ID is required}"
: "${AWS_SECRET_ACCESS_KEY:?AWS_SECRET_ACCESS_KEY is required}"

R2_ENDPOINT="https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com"
SYNC_DIRS=(themes/web themes/card themes/package)
DEPLOY_IGNORE=".deployignore"

# Build per-domain exclude args from .deployignore
declare -A EXCLUDE_ARGS
if [[ -f "${DEPLOY_IGNORE}" ]]; then
  while IFS= read -r line || [[ -n "${line}" ]]; do
    line="${line%%#*}"
    line="${line%"${line##*[![:space:]]}"}"
    [[ -z "${line}" || "${line}" != */* ]] && continue
    domain="${line%%/*}"
    theme="${line#*/}"
    EXCLUDE_ARGS["${domain}"]+=" --exclude ${theme}/*"
  done < "${DEPLOY_IGNORE}"
fi

for dir in "${SYNC_DIRS[@]}"; do
  if [[ ! -d "${dir}" ]]; then
    continue
  fi

  domain="${dir#themes/}"
  dest="s3://${R2_BUCKET}/${domain}/"
  excludes="${EXCLUDE_ARGS["${domain}"]:-}"

  echo "Sync ${dir} -> ${dest}"
  if [[ -n "${excludes}" ]]; then
    echo "  Excluding: ${excludes}"
  fi

  # Phase 1: upload/update only (no deletions yet)
  # shellcheck disable=SC2086
  aws s3 sync "${dir}" "${dest}" \
    --endpoint-url "${R2_ENDPOINT}" \
    --only-show-errors \
    ${excludes}

  # Phase 2: delete objects not present in source, after uploads complete
  # shellcheck disable=SC2086
  aws s3 sync "${dir}" "${dest}" \
    --endpoint-url "${R2_ENDPOINT}" \
    --delete \
    --only-show-errors \
    ${excludes}
done
