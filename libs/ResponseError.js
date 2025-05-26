class ResponseError {
  constructor(msg, status) {
    if (typeof msg === 'string') {
      this.message = msg;
    } else {
      this.message = msg;
    }

    this.status = status;
  }
}

module.exports = ResponseError;
