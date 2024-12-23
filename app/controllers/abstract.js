const { logger } = require('../factories/logger');

class AbstractController {

  static _body (request) {
    let body = {};
    if (request && request.body) {
      body = request.body;
    }
    if (body && body.data) {
      body = body.data;
    }

    try {
      body = JSON.parse(body);
    } catch (e) {
    }

    return body;
  }

  static _query (req) {
    return req.query;
  }

  static _errorDetails (details) {
    let detailsAsString = details ? '' + details : '[no detail]';

    let detailsStack;
    if (details?.stack) {
      detailsStack = details.stack.toString();
    } else {
      const myObject = {};
      Error.captureStackTrace(myObject);
      detailsStack = myObject.stack.toString();
    }

    try {
      const detailsStringified = JSON.stringify(details);
      if (detailsStringified.length > detailsAsString.length) {
        detailsAsString = detailsStringified;
      }
    } catch (ignored) {
    }

    detailsAsString = detailsAsString.substring(0, 1000);
    if (detailsAsString.length === 1000) {
      detailsAsString += ' (too long ...)';
    }

    if (detailsStack) {
      detailsAsString += ' >> stack : ' + detailsStack;
    }

    return detailsAsString;
  }

  static _notFound (res, details) {
    const detailsAsString = AbstractController._errorDetails(details);
    logger.debug('_notFound: ', detailsAsString);
    return res.status(404).jsonp({ status: detailsAsString });
  }

  static _badRequest (res, details) {
    const detailsAsString = AbstractController._errorDetails(details);
    logger.debug('_badRequest: ', detailsAsString);
    return res.status(400).jsonp({ status: detailsAsString });
  }

  static _internalProblem (res, details) {
    const detailsAsString = AbstractController._errorDetails(details);
    logger.error('_internalProblem: ', detailsAsString);
    return res.status(500).jsonp({ status: detailsAsString });
  }

}

module.exports = { AbstractController };
