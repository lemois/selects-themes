#!/usr/bin/env bash
set -euo pipefail

: "${R2_ACCOUNT_ID:?R2_ACCOUNT_ID is required}"
: "${R2_BUCKET:?R2_BUCKET is required}"
: "${AWS_ACCESS_KEY_ID:?AWS_ACCESS_KEY_ID is required}"
: "${AWS_SECRET_ACCESS_KEY:?AWS_SECRET_ACCESS_KEY is required}"

R2_ENDPOINT="https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com"
SYNC_DIRS=(web card package)

for dir in "${SYNC_DIRS[@]}"; do
  if [[ ! -d "${dir}" ]]; then
    continue
  fi

  dest="s3://${R2_BUCKET}/${dir}/"
  echo "Sync ${dir} -> ${dest}"

  # Phase 1: upload/update only (no deletions yet)
  aws s3 sync "${dir}" "${dest}" \
    --endpoint-url "${R2_ENDPOINT}" \
    --only-show-errors

  # Phase 2: delete objects not present in source, after uploads complete
  aws s3 sync "${dir}" "${dest}" \
    --endpoint-url "${R2_ENDPOINT}" \
    --delete \
    --only-show-errors
done
