const TemplateValidator = require('./../modules/templateValidator');

class IssueTemplateValidator extends TemplateValidator {
	constructor(owner, repo, octokit, core, templatePath, contributionTitle, contributionBody) {
		super(owner, repo, octokit, core, templatePath, contributionTitle, contributionBody);
	}

	async validate() {
		try {
			this._template = await this.getTemplate();

			this._templateMetadata = this.getTemplateMetadata(this._template);

			this._templateHeaders = this.getHeaders(this._template);
			this._contributionHeaders = this.getHeaders(this._body);

			this._headersValidation = this.validateHeaders(this._templateHeaders, this._contributionHeaders);

			return {
				isValid: await this.isValid(),
				titleValidation: {
					isEmpty: this.isTitleEmpty(),
					isTitleFollowingTemplate: this.isTitleFollowingTemplate(this._templateMetadata['title'])
				},
				headersValidation: this._headersValidation
			};
		} catch (err) {
			console.error(err);
			this._core.setFailed(`Action failed with error: ${err}`);
		}
	}

	isValid() {
		if (this.isTitleEmpty() || !this.isTitleFollowingTemplate(this._templateMetadata['title'])) {
			return false;
		}

		if (this._headersValidation.remainingHeaders.length > 0 || this._headersValidation.invalidHeaders.length > 0) {
			return false;
		}

		return true;
	}

	isTitleFollowingTemplate(templateTitle) {
		return this._title.startsWith(templateTitle);
	}

	getTemplateMetadata(template) {
		try {
			const lines = template.split(/\r?\n/);
			let metadata = {};

			let i = 0;

			while (i < lines.length) {
				if (lines[i].startsWith('---')) {
					break;
				}

				i += 1;
			}

			while (i < lines.length) {
				i += 1;

				if (lines[i].startsWith('---')) {
					break;
				}

				let entry = lines[i].split(':');

				if (entry.length >= 2) {
					let key = entry[0].trim();
					let value = entry.slice(1).join().trim();

					if (key != '' && value != '') {
						metadata[key] = value;
					}
				}
			}

			const metadataProperties = [
				'name',
				'labels'
			];

			metadataProperties.forEach(property => {
				// eslint-disable-next-line no-prototype-builtins
				if (!(property in metadata)) {
					throw new Error(`${property} metadata property is not present.`);
				}
			});

			return metadata;
		} catch (err) {
			console.error(err);
			this._core.setFailed(`Action failed with error: ${err}`);
		}
	}
}

module.exports = IssueTemplateValidator;