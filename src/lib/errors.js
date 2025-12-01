export class DatabaseError extends Error {
    constructor(message, status = 503, cause) {
        super(message);
        this.name = "DatabaseError";
        this.status = status;
        this.cause = cause;
    }
}

export class TokenError extends Error {
    constructor(message, status = 401, cause) {
        super(message);
        this.name = "TokenError";
        this.status = status;
        this.cause = cause;
    }
}

export class ValidationError extends Error {
    constructor(message, status = 400, details) {
        super(message);
        this.name = "ValidationError";
        this.status = status;
        this.details = details;
    }
}