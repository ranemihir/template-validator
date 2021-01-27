/**
 * Contribution is a base class for Issue and Pull Request.
 * Constribution Inspector considers every issue and PR as a contribution.
 */
class Contribution {
	constructor(core, payload, octokit, owner, repo) {
		this._core = core;
		this._payload = payload;
		this._octokit = octokit;
		this._owner = owner;
		this._repo = repo;
	}

	/**
	 * Posts a comment on issue or PR.
	 * 
	 * @param {string} body - comment text body 
	 */
	async createContributionComment(body) {
		try {
			await this._octokit.issues.createComment({
				owner: this._owner,
				repo: this._repo,
				issue_number: this._payload.number,
				body: body,
			});
		} catch (err) {
			console.error(err);
			this._core.setFailed(`Action failed with error: ${err}`);
		}
	}

	/**
	 * Add labels to an issue or PR.
	 * 
	 * @param {Array} labels 
	 * 
	 * @param {Array} labels 
	 * @param {string} labels[i] - label name to be added
	 */
	async addLabels(labels) {
		try {
			await this._octokit.issues.addLabels({
				owner: this._owner,
				repo: this._repo,
				issue_number: this._payload.number,
				labels: labels,
			});
		} catch (err) {
			console.error(err);
			this._core.setFailed(`Action failed with error: ${err}`);
		}
	}
}

module.exports = Contribution;