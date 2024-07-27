class ErrorResponse extends Error {
    constructor(statusCode, message, data) {
        super(message);
        this.statusCode = statusCode;
        this.errorData = data;
    }
}

module.exports = ErrorResponse;