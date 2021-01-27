const TemplateValidator = require('./../modules/templateValidator');

class PullRequestTemplateValidator extends TemplateValidator {
	constructor(owner, repo, octokit, core, templatePath, contributionTitle, contributionBody) {
		super(owner, repo, octokit, core, templatePath, contributionTitle, contributionBody);
	}

	async validate() {
		try {
			this._template = await this.getTemplate();

			this._templateHeaders = this.getHeaders(this._template);
			this._contributionHeaders = this.getHeaders(this._body);

			this._headersValidation = this.validateHeaders(this._templateHeaders, this._contributionHeaders);

			return {
				isValid: this.isValid(),
				titleValidation: {
					isEmpty: this.isTitleEmpty()
				},
				headersValidation: this._headersValidation
			};
		} catch (err) {
			console.error(err);
			this._core.setFailed(`Action failed with error: ${err}`);
		}
	}

	isValid() {
		if (this.isTitleEmpty()) {
			return false;
		}

		if (this._headersValidation.remainingHeaders.length > 0 || this._headersValidation.invalidHeaders.length > 0) {
			return false;
		}

		return true;
	}
}

module.exports = PullRequestTemplateValidator;