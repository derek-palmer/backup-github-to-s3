# GitHub Repos Backup to AWS S3

This repository contains a GitHub Action workflow to back up all repositories in your GitHub organization to an Amazon S3 bucket. The workflow clones all repositories, compresses them into a zip file, and uploads the archive to S3 on a scheduled basis or via manual trigger.

## Prerequisites

- AWS account with an S3 bucket
- GitHub personal access token with read access to your organization's/user's repositories
- GitHub repository to store the workflow

## Setup

### 1. Create an S3 Bucket

1. Sign in to the AWS Management Console.
2. Open the Amazon S3 console at [https://s3.console.aws.amazon.com/s3/](https://s3.console.aws.amazon.com/s3/).
3. Choose "Create bucket".
4. Enter a unique name for your bucket and select the desired AWS region.
5. Configure any additional settings as needed and choose "Create bucket".

### 2. Create an IAM Policy

1. Go to the AWS Management Console.
2. Open the IAM console at [https://console.aws.amazon.com/iam/](https://console.aws.amazon.com/iam/).
3. Choose "Policies" in the navigation pane, and then choose "Create policy".
4. Select the "JSON" tab and paste the following policy, replacing `your-s3-bucket` with the name of your S3 bucket:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "s3:PutObject",
        "s3:PutObjectAcl",
        "s3:GetObject",
        "s3:ListBucket"
      ],
      "Resource": [
        "arn:aws:s3:::your-s3-bucket",
        "arn:aws:s3:::your-s3-bucket/*"
      ]
    }
  ]
}
```

5. Choose "Review policy", enter a name for the policy (e.g., GitHubActionsS3Policy), and then choose "Create policy".

### 3. Create an IAM User
In the IAM console, choose "Users" and then "Add user".
Enter a user name (e.g., github-actions-user).
Select "Programmatic access" as the access type.
Choose "Next: Permissions".
Choose "Attach policies directly" and select the policy you created (e.g., GitHubActionsS3Policy).
Choose "Next: Tags" to add tags (optional), and then "Next: Review".
Review the user details and choose "Create user".
Save the access key ID and secret access key for the new user. You will use these credentials in your GitHub repository secrets.


### 4. Set Up GitHub Secrets
1. Go to your repository settings.
2. Navigate to **"Secrets and variables" > "Actions"**.
3. Click **"New repository secret"** and add the following secrets:
   - `AWS_ACCESS_KEY_ID`: Your IAM user's access key ID.
   - `AWS_SECRET_ACCESS_KEY`: Your IAM user's secret access key.
   - `AWS_DEFAULT_REGION`: The AWS region where your S3 bucket is located.
   - `GITHUB_TOKEN`: A personal access token with read access to your organization's repositories.


### 5. Useage

The workflow will automatically run according to the defined schedule. You can also manually trigger the workflow from the **"Actions"** tab in your GitHub repository.

1. Go to the **"Actions"** tab in your GitHub repository.
2. Select the **"Backup GitHub Repos to AWS S3"** workflow.
3. Click **"Run workflow"** to trigger it manually.
