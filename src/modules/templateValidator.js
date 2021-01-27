const fetch = require('node-fetch');

/**
 * Fetches the templates and validates it first.
 * Then validates the contribution body text against the template.
 */
class TemplateValidator {
	constructor(owner, repo, octokit, core, templatePath, contributionTitle, contributionBody) {
		this._owner = owner;
		this._repo = repo;
		this._octokit = octokit;
		this._core = core;
		this._templatePath = templatePath;

		this._title = contributionTitle;
		this._body = contributionBody;
	}

	/**
	 * Fetches and returns the template using provided template path.
	 * 
	 * @returns {string} template - template body text.
	 */
	async getTemplate() {
		try {
			const response = await this._octokit.repos.getContent({
				owner: this._owner,
				repo: this._repo,
				path: this._templatePath
			});

			const fileUrl = await response.data.download_url;

			const res = await fetch(fileUrl);
			const result = await res.text();

			return result.toString();
		} catch (err) {
			console.error(err);
			this._core.setFailed(`Action failed with error: ${err}`);
		}
	}

	isTitleEmpty() {
		return (this._title.length == 0);
	}

	isBodyEmpty() {
		return (this._body.length == 0);
	}

	/**
	 * Returns all the headers from the given text.
	 * Example: ### Describe the bug:
	 * 
	 * @param {string} text 
	 * 
	 * @returns {Array} headers - a list of all headers
	 * @returns {string} headers[i] - a single header
	 */
	getHeaders(text) {
		try {
			const lines = text.split(/\r?\n/);
			let headers = [];

			lines.forEach(line => {
				if (line.startsWith('###')) {
					headers.push(line);
				}
			});

			if (headers.length == 0) {
				throw new Error('Atleast one header is required.');
			}

			return headers;
		} catch (err) {
			console.error(err);
			this._core.setFailed(`Action failed with error: ${err}`);
		}
	}

	/**
	 * Validates headers against the template headers.
	 * 
	 * 
	 * @param {Array} templateHeaders - headers fetched from template
	 * @param {Array} contributionHeaders - headers fetched form contribution.
	 * 
	 * @returns {object} headersValidation - An object representing the validation.
	 * @returns {Array} headersValidation.invalidHeaders - list of all headers which are not originally preent inside the template.
	 * @returns {Array} headersValidation.remainingHeaders - list of all the headers which are there in the template but not in the contribution.
	 */
	validateHeaders(templateHeaders, contributionHeaders) {
		let invalidHeaders = [];
		let remainingHeaders = [...templateHeaders];

		contributionHeaders.forEach((header) => {
			if (remainingHeaders.includes(header)) {
				const index = remainingHeaders.indexOf(header);
				remainingHeaders.splice(index, 1);
			} else {
				invalidHeaders.push(header);
			}
		});

		return {
			invalidHeaders,
			remainingHeaders
		};
	}
}

module.exports = TemplateValidator;