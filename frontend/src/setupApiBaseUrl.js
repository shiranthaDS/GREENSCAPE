// Centralizes API base URL. Rewrites hardcoded localhost:5000 to actual backend port.
// This is a non-invasive shim so you don't need to edit every component.
import axios from "axios";

const DEFAULT_BACKEND_PORT = 5001; // backend currently starts on 5001
const from = "http://localhost:5000";
const to = `http://localhost:${DEFAULT_BACKEND_PORT}`;

// Intercept requests and rewrite base URLs if they match hardcoded 5000
axios.interceptors.request.use((config) => {
  if (typeof config.url === "string" && config.url.startsWith(from)) {
    config.url = config.url.replace(from, to);
  }
  return config;
});

// Patch global fetch as well
const originalFetch = window.fetch.bind(window);
window.fetch = (input, init) => {
  let url = typeof input === "string" ? input : input.url;
  if (url && url.startsWith(from)) {
    const rewritten = url.replace(from, to);
    if (typeof input === "string") {
      return originalFetch(rewritten, init);
    }
    return originalFetch(new Request(rewritten, input), init);
  }
  return originalFetch(input, init);
};

export const API_BASE = to;
