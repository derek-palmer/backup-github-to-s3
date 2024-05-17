const core = require('@actions/core');
const exec = require('@actions/exec');
const fs = require('fs');

async function run() {
  try {
    const ghToken = core.getInput('GH_TOKEN');
    const awsAccessKeyId = core.getInput('AWS_ACCESS_KEY_ID');
    const awsSecretAccessKey = core.getInput('AWS_SECRET_ACCESS_KEY');
    const awsDefaultRegion = core.getInput('AWS_DEFAULT_REGION');
    const s3Bucket = core.getInput('S3_BUCKET');
    const ghOrgName = core.getInput('GH_ORG_NAME');
    const ghUserName = core.getInput('GH_USER_NAME');

    // Set AWS environment variables
    core.exportVariable('AWS_ACCESS_KEY_ID', awsAccessKeyId);
    core.exportVariable('AWS_SECRET_ACCESS_KEY', awsSecretAccessKey);
    core.exportVariable('AWS_DEFAULT_REGION', awsDefaultRegion);

    // Install AWS CLI
    await exec.exec('curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"');
    await exec.exec('unzip awscliv2.zip');
    await exec.exec('sudo ./aws/install --update');

    // Clone repositories
    fs.mkdirSync('backup', { recursive: true });
    process.chdir('backup');
    let reposResponse = '';
    if (ghOrgName) {
      reposResponse = await exec.getExecOutput(`curl -H "Authorization: token ${ghToken}" -s https://api.github.com/orgs/${ghOrgName}/repos`);
    } else if (ghUserName) {
      reposResponse = await exec.getExecOutput(`curl -H "Authorization: token ${ghToken}" -s https://api.github.com/users/${ghUserName}/repos`);
    } else {
      throw new Error('Neither GH_ORG_NAME nor GH_USER_NAME is provided.');
    }
    const repos = JSON.parse(reposResponse.stdout).map(repo => repo.clone_url);
    for (const repo of repos) {
      await exec.exec(`git clone ${repo}`);
    }

    // Compress repositories
    await exec.exec(`zip -r backup.zip .`);

    // Upload to S3
    await exec.exec(`aws s3 cp backup.zip s3://${s3Bucket}/backup_$(date +%Y%m%d%H%M%S).zip`);

  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
