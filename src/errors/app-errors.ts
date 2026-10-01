export class BadRequestError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "BadRequestError";
    }
}

export class ExternalApiError extends Error {
    service: string;
    status: number;

    constructor(service: string, status: number) {
        super(`${service} respondió con status ${status}`);
        this.name = "ExternalApiError";
        this.service = service;
        this.status = status;
    }
}