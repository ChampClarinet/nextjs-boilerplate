#!/bin/bash

set -euo pipefail

# ---------------------------------------------------------------------------
# Configuration
# ---------------------------------------------------------------------------

base_name="nextjs-boilerplate"

environment="production"
env_file=".env.production"
expected_branch="main"

version=""
no_cache="no"
keep_images="no"

# ---------------------------------------------------------------------------
# Help
# ---------------------------------------------------------------------------

show_help() {
  cat <<'EOF'
Usage:
  ./deploy.sh [options] [version]

Options:
  --env <environment>
  --env=<environment>
      dev | development  -> .env.development / develop branch
      prod | production  -> .env.production / main branch

  --no-cache | no-cache
      Build without Docker cache.

  --keep | keep
      Keep old Docker images.

  -h | --help | help
      Show this help message.

Arguments:
  <version>
      Optional image version.

Examples:
  ./deploy.sh --env dev
  ./deploy.sh --env dev --no-cache
  ./deploy.sh --env prod v1.2.0
  ./deploy.sh --env dev --no-cache v1.2.0
EOF
}

# ---------------------------------------------------------------------------
# Arguments
# ---------------------------------------------------------------------------

while [ "$#" -gt 0 ]; do
  case "$1" in
    -h|--help|help)
      show_help
      exit 0
      ;;

    --env)
      if [ -z "${2:-}" ]; then
        echo "ERROR: --env requires an environment." >&2
        exit 1
      fi

      environment="$2"
      shift
      ;;

    --env=*)
      environment="${1#*=}"
      ;;

    --no-cache|no-cache)
      no_cache="yes"
      ;;

    --keep|keep)
      keep_images="yes"
      ;;

    -*)
      echo "ERROR: unknown option: $1" >&2
      exit 1
      ;;

    *)
      if [ -n "$version" ]; then
        echo "ERROR: multiple versions provided: '$version' and '$1'." >&2
        exit 1
      fi

      version="$1"
      ;;
  esac

  shift
done

case "$environment" in
  dev|development)
    environment="development"
    env_file=".env.development"
    expected_branch="develop"
    ;;

  prod|production)
    environment="production"
    env_file=".env.production"
    expected_branch="main"
    ;;

  *)
    echo "ERROR: invalid environment: $environment" >&2
    echo "Expected: dev, development, prod, or production." >&2
    exit 1
    ;;
esac

# ---------------------------------------------------------------------------
# Pre-deployment checks
# ---------------------------------------------------------------------------

echo "---- PRE-DEPLOYMENT CHECKS ----"

if ! git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
  echo "ERROR: this script must be run inside a Git repository." >&2
  exit 1
fi

current_branch=$(git branch --show-current)

if [ -z "$current_branch" ]; then
  echo "ERROR: detached HEAD is not allowed for deployment." >&2
  exit 1
fi

if [ "$current_branch" != "$expected_branch" ]; then
  echo "ERROR: cannot deploy '$environment' from branch '$current_branch'." >&2
  echo "Expected branch: '$expected_branch'." >&2
  exit 1
fi

if [ -n "$(git status --porcelain)" ]; then
  echo "ERROR: working tree has uncommitted changes." >&2
  echo "Deployment aborted." >&2
  echo >&2
  git status --short >&2
  exit 1
fi

if [ ! -f "$env_file" ]; then
  echo "ERROR: env file not found: $env_file" >&2
  exit 1
fi

echo "Fetching origin..."
git fetch origin "$expected_branch"

local_commit=$(git rev-parse HEAD)
remote_commit=$(git rev-parse "origin/$expected_branch")

if [ "$local_commit" != "$remote_commit" ]; then
  echo "ERROR: local '$expected_branch' does not match origin/$expected_branch." >&2
  echo >&2
  echo "Local:  $local_commit" >&2
  echo "Remote: $remote_commit" >&2
  echo >&2
  echo "Run 'git pull' and try again." >&2
  exit 1
fi

echo "Branch:      $current_branch"
echo "Environment: $environment"
echo "Env file:    $env_file"
echo "Git status:  clean and up to date"

# ---------------------------------------------------------------------------
# Image metadata
# ---------------------------------------------------------------------------

commit_id=$(git rev-parse --short HEAD)
branch_name=$(git rev-parse --abbrev-ref HEAD)

if [ -z "$version" ]; then
  image_name="${base_name}:${commit_id}"
else
  image_name="${base_name}:${version}-${commit_id}"
fi

echo
echo "---- BUILD CONFIGURATION ----"
echo "Image:       $image_name"
echo "Branch:      $branch_name"
echo "Commit:      $commit_id"
echo "Environment: $environment"
echo "Env file:    $env_file"
echo "No cache:    $no_cache"
echo "Keep images: $keep_images"

# ---------------------------------------------------------------------------
# Docker build
# ---------------------------------------------------------------------------

echo
echo "---- BUILDING IMAGE ----"

docker_build_args=(
  --platform=linux/amd64
  --build-arg "COMMIT_SHA=$commit_id"
  --build-arg "BRANCH=$branch_name"
  --build-arg "ENV_FILE=$env_file"
  -t "$image_name"
)

if [ "$no_cache" = "yes" ]; then
  docker_build_args+=(--no-cache)
fi

docker build "${docker_build_args[@]}" .

# ---------------------------------------------------------------------------
# Latest tag
# ---------------------------------------------------------------------------

echo
echo "---- TAGGING IMAGE AS LATEST ----"

docker tag "$image_name" "${base_name}:latest"

# ---------------------------------------------------------------------------
# Clean old images
# ---------------------------------------------------------------------------

if [ "$keep_images" != "yes" ]; then
  echo
  echo "---- REMOVING OLD IMAGES ----"
  echo "Images referenced by existing containers will be preserved."

  tmp_inuse_ids=$(mktemp)
  tmp_candidates=$(mktemp)
  tmp_to_remove=$(mktemp)

  cleanup_temp_files() {
    rm -f "$tmp_inuse_ids" "$tmp_candidates" "$tmp_to_remove"
  }

  trap cleanup_temp_files EXIT

  # Image IDs currently referenced by any container, including stopped ones.
  docker ps -aq \
    | xargs -r docker inspect -f '{{.Image}}' \
    | sort -u \
    > "$tmp_inuse_ids"

  # Candidate images:
  # - same repository
  # - not "latest"
  # - not the image from the current commit
  docker images --no-trunc --format '{{.Repository}} {{.Tag}} {{.ID}}' \
    | awk -v repo="$base_name" -v commit="$commit_id" '
        $1 == repo &&
        $2 != "latest" &&
        index($2, commit) == 0 {
          print $3
        }
      ' \
    | sort -u \
    > "$tmp_candidates"

  # Remove candidates that are not referenced by any container.
  comm -23 "$tmp_candidates" "$tmp_inuse_ids" > "$tmp_to_remove"

  if [ -s "$tmp_to_remove" ]; then
    xargs -r docker rmi < "$tmp_to_remove"
  else
    echo "Nothing to remove."
  fi

  cleanup_temp_files
  trap - EXIT
else
  echo
  echo "---- SKIPPING OLD IMAGE CLEANUP (--keep) ----"
fi

# ---------------------------------------------------------------------------
# Restart
# ---------------------------------------------------------------------------

echo
echo "---- RESTARTING DOCKER COMPOSE ----"

docker compose down
docker compose up -d

echo
echo "---- DEPLOYMENT COMPLETE ----"
echo "Environment: $environment"
echo "Branch:      $branch_name"
echo "Commit:      $commit_id"
echo "Image:       $image_name"