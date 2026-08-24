import type {IncomingMessage, ServerResponse} from "node:http";
import type {Connect, Plugin} from "vite";
import {COLOR_NAMES, EXISTING_USERNAMES} from "./data.ts";

function sendJson(res: ServerResponse, status: number, body: unknown) {
    res.statusCode = status;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify(body));
}

function readUrl(req: IncomingMessage): URL {
    return new URL(req.url ?? "/", "http://localhost");
}

function delay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

function createMockApiMiddleware(): Connect.NextHandleFunction {
    return async (req, res, next) => {
        const url = readUrl(req);

        if (req.method === "GET" && url.pathname === "/api/colors") {
            await delay(150);
            const query = (url.searchParams.get("q") ?? "").trim().toLowerCase();
            const colors = query
                ? COLOR_NAMES.filter((name) => name.toLowerCase().includes(query)).slice(0, 20)
                : COLOR_NAMES.slice(0, 20);
            sendJson(res, 200, {colors});
            return;
        }

        if (req.method === "GET" && url.pathname === "/api/username/check") {
            await delay(200);
            const username = (url.searchParams.get("username") ?? "").trim().toLowerCase();
            if (!username) {
                sendJson(res, 400, {error: "username is required"});
                return;
            }
            const exists = EXISTING_USERNAMES.includes(username);
            sendJson(res, 200, {username, exists, available: !exists});
            return;
        }

        next();
    };
}

/**
 * Vite plugin that serves mock REST endpoints during `vite` / `vite preview`.
 * - GET /api/colors?q= — color name autocomplete
 * - GET /api/username/check?username= — existing username check
 */
export function mockApiPlugin(): Plugin {
    return {
        name: "mock-api",
        configureServer(server) {
            server.middlewares.use(createMockApiMiddleware());
        },
        configurePreviewServer(server) {
            server.middlewares.use(createMockApiMiddleware());
        },
    };
}
