# Data Debug Tool — Developer Agent Instructions & Architectural Guardrails

You are the dedicated AI engineer developing and maintaining **Data Debug Tool**, a lightweight, secure, and accessible WordPress data inspection and debugging tool listed on WordPress.org.

---

## 1. Project Identity & Architecture

- **Plugin Name:** Data Debug Tool
- **Plugin Slug:** `data-debug-tool`
- **Root Directory:** `C:\laragon\www\river\wp-content\plugins\data-debug-tool`
- **Text Domain:** `data-debug-tool`
- **Plugin Type:** Admin Dashboard Tool (Submenu page under **Tools** -> **Data Debug Tool** via `tools.php?page=data-debug-tool`).
- **Frontend Stack:** Single-page React admin UI compiled via `@wordpress/scripts` using `@wordpress/element`, `@wordpress/components`, and `@wordpress/api-fetch`.
- **Note on Gutenberg Blocks:** This plugin is strictly an **Admin Tools Page**, NOT a Gutenberg block plugin. Never add `block.json` into `src/`.

---

## 2. Inbuilt Components & WP Design Standards

- **Core Components Reference:** Inbuilt components from `@wordpress/components` (`Button`, `TextControl`, `SelectControl`, `ToggleControl`, `Notice`, `Icon`) provide native WordPress admin aesthetics and accessibility.
- **UI Styling:** Scoped under `.debug-tool-wrapper` in `src/style.scss` with dark mode support (`.dark-mode`), responsive layouts, and zero frontend impact (no frontend assets enqueued).

---

## 3. Persistent Feedback Loop (LEARNINGS.md)

- **Continuous Learning Log:** Located at `C:\laragon\www\river\wp-content\plugins\data-debug-tool\.agents\LEARNINGS.md`.
- **Mandate:** Agents MUST consult `LEARNINGS.md` at the start of any session and update it whenever bug fixes, architectural decisions, or security constraints are established.

---

## 4. Architectural Guardrails (Must Follow)

### A. REST Route Registration & Execution Lifecycle
1. **Unconditional `rest_api_init` Hooking:**
   - Always hook route registration directly to `rest_api_init` during plugin initialization.
   - **Never** gate `add_action( 'rest_api_init', ... )` behind `wp_get_current_user()` during `plugins_loaded`. At `plugins_loaded`, user authentication has not executed yet, resulting in route registration failure (`404 rest_no_route`).
2. **Dual Method Support (`GET` & `POST`):**
   - Register endpoints supporting both `WP_REST_Server::READABLE` (`GET`) and `WP_REST_Server::CREATABLE` (`POST`).
   - Ensures 100% backward compatibility with existing client POST requests while supporting standard REST GET queries with URL parameters.
3. **Consistent Envelope Format:**
   - Maintain the standard `{ "data": ..., "success": true }` response contract across all endpoints.

### B. Security & Defense-in-Depth
1. **Strict Capability Check:**
   - Always verify `current_user_can( 'manage_options' )` inside `permission_callback` before processing any query.
2. **CSRF Nonce Protection for Cookie Sessions:**
   - If a request is authenticated via browser cookies (`$_COOKIE[ LOGGED_IN_COOKIE ]`), a valid nonce (`wp_debug_rest` via parameter or `wp_rest` via `X-WP-Nonce` header) is **strictly mandatory**.
   - Non-cookie requests (e.g. CLI, token authentication) require verified `manage_options` capability.
3. **Zero Sensitive Credential Exposure:**
   - When returning user data (`/user`), always strip `user_pass` (password hashes) and `user_activation_key`.
   - When returning user meta (`/usermeta`), mask or redact sensitive session tokens (`session_tokens`).
4. **No Insecure CORS Headers:**
   - Do NOT emit `Access-Control-Allow-Origin: *` alongside `Access-control-allow-credentials: true`. Rely on standard WordPress REST API origin controls to protect internal system diagnostics.

### C. React & Frontend Development
1. **Strict React Rules of Hooks:**
   - All React hooks (`useState`, `useEffect`, `useCallback`, `useMemo`) must be declared unconditionally at the very top of components. Never place early returns (e.g., `if ( ! data ) return null;`) before hook declarations.
2. **XSS Sanitization in Custom Visualizers:**
   - When dynamically rendering formatted JSON or objects via `dangerouslySetInnerHTML`, always escape all keys, string values, and fallback primitives using a dedicated HTML entity escaper.
3. **Production Cleanliness:**
   - Remove all stray `console.log` statements before build.
   - Maintain 0 ESLint errors (`npm run lint:js`) and 0 Stylelint errors (`npx wp-scripts lint-style`).

---

## 5. Development Workflow & Commands

| Task | Command |
| :--- | :--- |
| **Start Watcher** | `npm run start` |
| **Production Build** | `npm run build` |
| **Format Code** | `npm run format` |
| **Lint JavaScript** | `npm run lint:js` |
| **Lint SCSS/CSS** | `npx wp-scripts lint-style` |
| **Test Endpoint QA** | `php -r "/* test script */"` or WP-CLI |
