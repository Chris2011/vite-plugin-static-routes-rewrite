import { test, expect } from "vitest";
import { IncomingMessage, ServerResponse } from "http";
import viteStaticRoutesRewrite from "./vite-plugin-static-routes-rewrite";

interface MockRequest extends Partial<IncomingMessage> {
  originalUrl: string;
  url: string;
}

test("vite-plugin-static-routes-rewrite - route rewrite", async () => {
  const plugin = viteStaticRoutesRewrite({
    routes: [
      { from: "/services", to: "/services.html" },
      { from: "/references", to: "/references.html" },
    ],
  });

  const mockRequest: MockRequest = {
    originalUrl: "/services",
    url: "/services",
  };

  const mockResponse = {} as ServerResponse;
  const next = () => {};

  await plugin.configureServer({
    middlewares: {
      use: (
        middleware: (
          req: MockRequest,
          res: ServerResponse,
          next: () => void
        ) => void
      ) => {
        middleware(mockRequest, mockResponse, next);
      },
    },
  });

  // Überprüfe, ob die URL korrekt umgeschrieben wurde
  expect(mockRequest.url).toBe("/services.html");
});

test("vite-plugin-static-routes-rewrite - route rewrite woth regex", async () => {
  const plugin = viteStaticRoutesRewrite({
    routes: [
      { from: /\/id[0-9]-SLUG/, to: "/some-page.html" },
    ],
  });

  const mockRequest: MockRequest = {
    originalUrl: "/id1-SLUG",
    url: "/id1-SLUG",
  };

  const mockResponse = {} as ServerResponse;
  const next = () => {};

  await plugin.configureServer({
    middlewares: {
      use: (
        middleware: (
          req: MockRequest,
          res: ServerResponse,
          next: () => void
        ) => void
      ) => {
        middleware(mockRequest, mockResponse, next);
      },
    },
  });

  // Überprüfe, ob die URL korrekt umgeschrieben wurde
  expect(mockRequest.url).toBe("/some-page.html");
});

test("vite-plugin-static-routes-rewrite - no matching route", async () => {
  const plugin = viteStaticRoutesRewrite({
    routes: [
      { from: "/services", to: "/services.html" },
      { from: "/references", to: "/references.html" },
    ],
  });

  // Mock-Request mit expliziter Typ-Definition
  const mockRequest: MockRequest = {
    originalUrl: "/unknown-route",
    url: "/unknown-route",
  };

  const mockResponse = {} as ServerResponse;
  const next = () => {};

  await plugin.configureServer({
    middlewares: {
      use: (
        middleware: (
          req: MockRequest,
          res: ServerResponse,
          next: () => void
        ) => void
      ) => {
        middleware(mockRequest, mockResponse, next);
      },
    },
  });

  expect(mockRequest.url).toBe("/unknown-route");
});

test("vite-plugin-static-routes-rewrite - no matching route with regex", async () => {
  const plugin = viteStaticRoutesRewrite({
    routes: [
      { from: "/id[0-9]-slug", to: "/services.html" },
    ],
  });

  const mockRequest: MockRequest = {
    originalUrl: "/id-123-slug",
    url: "/id-123-slug",
  };

  const mockResponse = {} as ServerResponse;
  const next = () => {};

  await plugin.configureServer({
    middlewares: {
      use: (
        middleware: (
          req: MockRequest,
          res: ServerResponse,
          next: () => void
        ) => void
      ) => {
        middleware(mockRequest, mockResponse, next);
      },
    },
  });

  expect(mockRequest.url).toBe("/id-123-slug");
});
