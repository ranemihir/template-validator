const Contribution = require('../modules/contribution');
const IssueTemplateValidator = require('./issueTemplateValidator');
const IssueComment = require('./issueComment');
const LabelsManager = require('./../modules/labelsManager');

class Issue extends Contribution {
	constructor(core, payload, octokit, owner, repo) {
		super(core, payload, octokit, owner, repo);
	}

	get LABELS() {
		return [
			{
				name: 'Bug :shield:',
				description: 'Something went wrong.',
				color: 'b71c1c'
			},
			{
				name: 'Feature :shield:',
				description: 'A feature you want.',
				color: '304ffe'
			},
			{
				name: 'Discussion :shield:',
				description: 'Something you want to discuss.',
				color: 'ffa726'
			}
		];
	}

	get INPUTS() {
		return {
			greetingMessage: this._core.getInput('issue--greeting-message')
		};
	}

	get TEMPLATE_PATHS() {
		return {
			'Bug :shield:': '.github/ISSUE_TEMPLATE/bug_report.md',
			'Feature :shield:': '.github/ISSUE_TEMPLATE/feature_request.md',
			'Discussion :shield:': '.github/ISSUE_TEMPLATE/discussion.md',
		};
	}

	async close() {
		try {
			if (this._payload.state == 'open') {
				await this._octokit.issues.update({
					owner: this._owner,
					repo: this._repo,
					issue_number: this._payload.number,
					state: 'closed'
				});
			}
		} catch (err) {
			console.error(err);
			this._core.setFailed(`Action failed with error: ${err}`);
		}
	}

	getTemplatePath(labels) {
		try {
			for (let i = 0; i < labels.length; i++) {
				const labelName = labels[i].name;

				// eslint-disable-next-line no-prototype-builtins
				if (this.TEMPLATE_PATHS.hasOwnProperty(labelName)) {
					return this.TEMPLATE_PATHS[labelName];
				}
			}

			throw new Error('No relevant labels on the issue');
		} catch (err) {
			console.error(err);
			this._core.setFailed(`Action failed with error: ${err}`);
		}
	}

	async respond() {
		try {
			const labelsManager = new LabelsManager(this._core, this._payload, this._octokit, this._owner, this._repo, this.LABELS);
			await labelsManager.createOrUpdateLabels();

			const templatePath = this.getTemplatePath(this._payload.labels);

			const issueTemplateValidator = new IssueTemplateValidator(
				this._owner,
				this._repo,
				this._octokit,
				this._core,
				templatePath,
				this._payload.title,
				this._payload.body
			);

			const { isValid, titleValidation, headersValidation } = await issueTemplateValidator.validate();

			const responseCommentBody = IssueComment.createBody(
				isValid,
				this.INPUTS.greetingMessage,
				this._payload.user.login,
				titleValidation,
				headersValidation
			);

			await this.createContributionComment(responseCommentBody);

			if (!isValid) {
				await this.close();
			}
		} catch (err) {
			console.error(err);
			this._core.setFailed(`Action failed with error: ${err}`);
		}
	}
}

module.exports = Issue;