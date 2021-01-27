const Comment = require('./../modules/comment');

class IssueComment extends Comment {
	static createBody(isValid, greetingMessage, authorSlug, titleValidation, headersValidation) {
		let commentBody = '';

		commentBody += this.createGreetingMessage(greetingMessage, authorSlug);

		if (!isValid) {
			commentBody += this.HEADER_ERROR_MESSAGE;
			commentBody += this.isTitleEmpty(titleValidation);
			commentBody += this.isTitleFollowingTemplate(titleValidation);
			commentBody += this.createHeadersValidationMessage(headersValidation);
		}

		return commentBody;
	}

	static isTitleFollowingTemplate(titleValidation) {
		if (!titleValidation.isTitleFollowingTemplate) {
			return '\n:x: Title does not follow the template.';
		}

		return '';
	}
}

module.exports = IssueComment;