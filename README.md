# Backup to S3 Action

This action backs up GitHub repositories to an Amazon S3 bucket.

## Inputs

### `GH_TOKEN`

**Required** GitHub token.

### `AWS_ACCESS_KEY_ID`

**Required** AWS Access Key ID.

### `AWS_SECRET_ACCESS_KEY`

**Required** AWS Secret Access Key.

### `AWS_DEFAULT_REGION`

**Required** AWS Region.

### `S3_BUCKET`

**Required** S3 bucket name.

### `GH_ORG_NAME`

GitHub organization name (optional). Either this or `GH_USER_NAME` must be provided.

### `GH_USER_NAME`

GitHub username (optional). Either this or `GH_ORG_NAME` must be provided.

## Example usage

Here's how to use this action in your own workflow, including a schedule to run daily at 2 AM UTC:

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
        uses: derek-palmer/backup-to-s3-action@v1.0.0
        with:
          GH_TOKEN: ${{ secrets.GH_TOKEN }}
          AWS_ACCESS_KEY_ID: ${{ secrets.AWS_ACCESS_KEY_ID }}
          AWS_SECRET_ACCESS_KEY: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          AWS_DEFAULT_REGION: ${{ secrets.AWS_DEFAULT_REGION }}
          S3_BUCKET: ${{ secrets.S3_BUCKET }}
          GH_ORG_NAME: ${{ secrets.GH_ORG_NAME }} # Or provide GH_USER_NAME
          GH_USER_NAME: ${{ secrets.GH_USER_NAME }} # Or provide GH_ORG_NAME
```