/**
 * Use this class to manage, everything related to labels - creation, updation.
 * 
 * NOTE: addLabels() function is present in the contribution class.
 */
class LabelsManager {
	constructor(core, payload, octokit, owner, repo, labels) {
		this._core = core;
		this._payload = payload;
		this._octokit = octokit;
		this._owner = owner;
		this._repo = repo;
		this._labels = labels;
	}

	get LABELS() {
		return this._labels;
	}

	/**
	 * Fetches and returns all labels from a repo.
	 * Also filters the labels to have only name, description and color properties.
	 * 
	 * @returns {Array} allLabels - a list of all labels in a repo
	 * @returns {object} allLabels[i] - a label
	 * 
	 * @param {string} allLabels[i].name - label name
	 * @param {string} allLabels[i].description - label description
	 * @param {string} allLabels[i].color - label color
	 */
	async getAllFilteredLabels() {
		try {
			const response = await this._octokit.issues.listLabelsForRepo({
				owner: this._owner,
				repo: this._repo
			});

			const allLabels = await response.data;

			await allLabels.forEach((label, i) => {
				allLabels[i] = {
					name: label.name,
					description: label.description,
					color: label.color
				};
			});

			return allLabels;
		} catch (err) {
			console.error(err);
			this._core.setFailed(`Action failed with error: ${err}`);
		}
	}

	/**
	 * Creates labels if they are already not created.
	 * Updates labels if they are chnaged.
	 */
	async createOrUpdateLabels() {
		try {
			const allCreatedLabels = await this.getAllFilteredLabels();

			/**
			 * For every label check if it exists or not. If not create it.
			 * If it exists, check if it has the valid description and color properties.
			 */
			for (let i = 0; i < this.LABELS.length; i++) {
				let isLabelAlreadyCreated = false;

				for (let j = 0; j < allCreatedLabels.length; j++) {
					if (this.LABELS[i].name == allCreatedLabels[j].name) {
						if (this.LABELS[i].description != allCreatedLabels[j].description || this.LABELS[i].color != allCreatedLabels[j].color) {
							await this.updateLabel({
								name: this.LABELS[i].name,
								description: this.LABELS[i].description,
								color: this.LABELS[i].color
							});
						}

						isLabelAlreadyCreated = true;
						break;
					}
				}

				if (isLabelAlreadyCreated == false) {
					await this.createLabel({
						name: this.LABELS[i].name,
						description: this.LABELS[i].description,
						color: this.LABELS[i].color
					});
				}
			}

		} catch (err) {
			console.error(err);
			this._core.setFailed(`Action failed with error: ${err}`);
		}
	}

	/**
	 * Creates labels.
	 * 
	 * @param {Array} labels - list of labels to be created.
	 * @param {object} labels[i] - label
	 * 
	 * @param {string} labels[i].name - label name
	 * @param {string} labels[i].description - label description
	 * @param {string} labels[i].color - label color
	 */
	async createLabels(labels) {
		try {
			await labels.forEach(async (label) => {
				await this.createLabel(label);
			});
		} catch (err) {
			console.error(err);
			this._core.setFailed(`Action failed with error: ${err}`);
		}
	}

	/**
	 * Creates a single label.
	 * 
	 * @param {object} label
	 * 
	 * @param {string} labels[i].name - label name
	 * @param {string} labels[i].description - label description
	 * @param {string} labels[i].color - label color
	 */
	async createLabel({ name, color, description }) {
		try {
			await this._octokit.issues.createLabel({
				owner: this._owner,
				repo: this._repo,
				name: name,
				color: color,
				description: description
			});
		} catch (err) {
			console.error(err);
			this._core.setFailed(`Action failed with error: ${err}`);
		}
	}

	/**
	 * Updates labels.
	 * 
	 * @param {Array} labels - list of labels to be created.
	 * @param {object} labels[i] - label
	 * 
	 * @param {string} labels[i].name - label name
	 * @param {string} labels[i].description - label description
	 * @param {string} labels[i].color - label color
	 */
	async updateLabels(labels) {
		try {
			await labels.forEach(async (label) => {
				await this.updateLabel(label);
			});
		} catch (err) {
			console.error(err);
			this._core.setFailed(`Action failed with error: ${err}`);
		}
	}

	/**
	 * Updates a single label.
	 * 
	 * @param {object} label
	 * 
	 * @param {string} labels[i].name - label name
	 * @param {string} labels[i].description - label description
	 * @param {string} labels[i].color - label color
	 */
	async updateLabel({ name, color, description }) {
		try {
			await this._octokit.issues.updateLabel({
				owner: this._owner,
				repo: this._repo,
				name: name,
				color: color,
				description: description
			});
		} catch (err) {
			console.error(err);
			this._core.setFailed(`Action failed with error: ${err}`);
		}
	}
}

module.exports = LabelsManager;