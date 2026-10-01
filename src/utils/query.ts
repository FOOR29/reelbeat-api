import { BadRequestError } from "../errors/app-errors.js";

const VALID_PERIODS = ["7day", "1month", "3month", "6month", "12month", "overall"];

export function parsePeriod(value: unknown): string {
    if (value === undefined) {
        return "7day";
    }

    if (typeof value !== "string" || !VALID_PERIODS.includes(value)) {
        throw new BadRequestError(`period inválido. Usa uno de: ${VALID_PERIODS.join(", ")}`);
    }

    return value;
}

export function parseLimit(value: unknown, fallback = 5): number {
    if (value === undefined) {
        return fallback;
    }

    const limit = Number(value);

    if (typeof value !== "string" || !Number.isInteger(limit) || limit < 1 || limit > 20) {
        throw new BadRequestError("limit debe ser un entero entre 1 y 20");
    }

    return limit;
}