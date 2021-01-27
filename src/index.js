require('dotenv').config();

const core = require('@actions/core');
const github = require('@actions/github');

const context = github.context;

const token = core.getInput('token');
const octokit = github.getOctokit(token);

const owner = context.repo.owner;
const repo = context.repo.repo;

const IssueContribution = require('./issue/issueContribution');
const PullRequestContribution = require('./pullRequest/pullRequestContribution');

if (context.payload.issue != undefined) {
	const issue = new IssueContribution(core, context.payload.issue, octokit, owner, repo);
	issue.respond().then(() => { }).catch(err => core.setFailed(`Action failed with error: ${err}`));
} else {
	const pullRequest = new PullRequestContribution(core, context.payload.pull_request, octokit, owner, repo);
	pullRequest.respond().then(() => { }).catch(err => core.setFailed(`Action failed with error: ${err}`));
}



