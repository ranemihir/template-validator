/**
 * Use this class to create comment body.
 */
class Comment {
	/**
	 * General header message if atleast 1 error is present.
	 */
	static get HEADER_ERROR_MESSAGE() {
		return '\n:shield: The contribution will remain closed until all the errors mentioned below are resolved:';
	}

	/**
	 * Returns a greeting message created from the greeting provided by user and author of the contribution.
	 * Example: 'Thanks for your contribution! :) @john123'
	 * 
	 * @param {string} greetingMessage - greeting message provided by user
	 * @param {string} authorSlug - author login userid
	 * @returns
	 */
	static createGreetingMessage(greetingMessage, authorSlug) {
		return `${greetingMessage} @${authorSlug}\n\n`;
	}

	/**
	 * Creates and returns error message if title is empty.
	 * 
	 * @param {object} titleValidation 
	 * @param {boolean} titleValidation.isEmpty - check if title is emppty or not
	 * 
	 * @returns {string} message
	 */
	static isTitleEmpty(titleValidation) {
		if (titleValidation.isEmpty) {
			return '\n:x: Title cannot be empty.';
		}

		return '';
	}

	/**
	 * Creates and returns error message if headers are invalid or not present.
	 * 
	 * @param {object} headersValidation 
	 * @param {Array} headersValidation.invalidHeaders
	 * @param {Array} headersValidation.remainingHeaders
	 * 
	 * @returns {string} message
	 */
	static createHeadersValidationMessage(headersValidation) {
		let headersValidationMessage = '';

		if (headersValidation.invalidHeaders.length > 0) {
			headersValidationMessage += '\n:x: The issue contains following invalid headers: \n';
			headersValidation.invalidHeaders.forEach(header => headersValidationMessage += ` - ${header.slice(4)}\n`);
		}

		if (headersValidation.remainingHeaders.length > 0) {
			headersValidationMessage += '\n:x: The issue does not contain following headers: \n';
			headersValidation.remainingHeaders.forEach(header => headersValidationMessage += ` - ${header.slice(4)}\n`);
		}

		return headersValidationMessage;
	}
}

module.exports = Comment;