# Backup to S3 Action

This action backs up GitHub repositories to an Amazon S3 bucket.

## Inputs

### `GH_TOKEN`

**Required** GitHub token (Personal Access Token with `repo` scope to access private repositories).

### `AWS_ACCESS_KEY_ID`

**Required** AWS Access Key ID.

### `AWS_SECRET_ACCESS_KEY`

**Required** AWS Secret Access Key.

### `AWS_DEFAULT_REGION`

**Required** AWS Region.

### `S3_BUCKET`

**Required** S3 bucket name.

### `GH_ORG_NAME`

GitHub organization name (optional). Provide this to back up an organization's repositories. If not provided, the action will back up repositories for the user associated with the provided GitHub token.

## Setup

### Step 1: Generate a GitHub Personal Access Token

1. Go to your GitHub account settings.
2. Navigate to "Developer settings" > "Personal access tokens".
3. Generate a new token with the `repo` scope.
4. Copy the token.

### Step 2: Add Secrets to Your Repository

1. Go to your repository's settings.
2. Navigate to "Secrets and variables" > "Actions".
3. Add the following secrets:
   - `GH_TOKEN`: The GitHub Personal Access Token generated in Step 1.
   - `AWS_ACCESS_KEY_ID`: Your AWS Access Key ID.
   - `AWS_SECRET_ACCESS_KEY`: Your AWS Secret Access Key.
   - `AWS_DEFAULT_REGION`: Your AWS region.
   - `S3_BUCKET`: The name of your S3 bucket.
   - `GH_ORG_NAME`: (Optional) The GitHub organization name if you are backing up an organization's repositories.

## Example Workflow

Create a workflow file in your repository (e.g., `.github/workflows/backup.yml`) with the following content:

```yaml
name: Backup GitHub Repos to S3

on:
  schedule:
    - cron: '0 2 * * *' # Runs every day at 2 AM UTC
  workflow_dispatch: # Allows manual triggering of the workflow

jobs:
  backup:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout repository
        uses: actions/checkout@v4

      - name: Run backup action
        uses: your-username/backup-to-s3-action@v1.0.0
        with:
          GH_TOKEN: ${{ secrets.GH_TOKEN }} # Ensure this is the correct PAT with `repo` scope
          AWS_ACCESS_KEY_ID: ${{ secrets.AWS_ACCESS_KEY_ID }}
          AWS_SECRET_ACCESS_KEY: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          AWS_DEFAULT_REGION: ${{ secrets.AWS_DEFAULT_REGION }}
          S3_BUCKET: ${{ secrets.S3_BUCKET }}
          GH_ORG_NAME: ${{ secrets.GH_ORG_NAME }} # Only required if backing up an organization's repositories
```