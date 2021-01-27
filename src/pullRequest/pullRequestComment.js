const Comment = require('./../modules/comment');

class PullRequestComment extends Comment {
	static createBody(isValid, greetingMessage, authorSlug, titleValidation, headersValidation) {
		let commentBody = '';

		commentBody += this.createGreetingMessage(greetingMessage, authorSlug);

		if (!isValid) {
			commentBody += this.HEADER_ERROR_MESSAGE;
			commentBody += this.isTitleEmpty(titleValidation);
			commentBody += this.createHeadersValidationMessage(headersValidation);
		}

		return commentBody;
	}
}

module.exports = PullRequestComment;