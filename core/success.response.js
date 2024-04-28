"use strict";

const httpStatusCode = require("./httpStatusCode");

class SuccessResponse {
  constructor({
    message = "",
    statusCode = httpStatusCode.StatusCodes.OK,
    reasonStatusCode = httpStatusCode.ReasonPhrases.OK,
    metadata = {},
    options = {},
  }) {
    this.message = !message ? httpStatusCode.ReasonPhrases.OK : message;
    this.status = statusCode;
    this.metadata = metadata;
    this.options = options;
  }

  send(res) {
    res.status(this.status).json(this);
  }
}

class OK extends SuccessResponse {
  constructor({ message = "", metadata = {}, options = {} }) {
    super(message, metadata);
    this.metadata = metadata;
    this.message = message;
    this.options = options;
  }
}

class BAD extends SuccessResponse {
  constructor({
    options = {},
    message = "",
    statusCode = httpStatusCode.StatusCodes.BAD_REQUEST,
    metadata = {},
  }) {
    super(message, metadata);
    this.options = options;
    this.metadata = metadata;
    this.status = !statusCode
      ? httpStatusCode.StatusCodes.BAD_REQUEST
      : statusCode;
    this.message = !message
      ? httpStatusCode.ReasonPhrases.BAD_REQUEST
      : message;
  }
}

module.exports = {
  OK,
  BAD,
  SuccessResponse,
};
