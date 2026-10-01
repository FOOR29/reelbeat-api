import type { NextFunction, Request, Response } from "express";
import { BadRequestError, ExternalApiError } from "../errors/app-errors.js";

export function errorHandler(err: unknown, req: Request, res: Response, next: NextFunction) {
    if (res.headersSent) {
        return next(err);
    }

    if (err instanceof BadRequestError) {
        return res.status(400).json({ message: err.message });
    }

    if (err instanceof ExternalApiError) {
        console.error(`[${err.service}] respondió con status ${err.status}`);
        return res.status(502).json({ message: `No se pudo consultar ${err.service}` });
    }

    console.error("Error inesperado:", err);
    res.status(500).json({ message: "Error interno del servidor" });
}