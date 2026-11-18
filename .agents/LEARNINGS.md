# Project Continuous Learning & Feedback Log (LEARNINGS.md)

This document is the persistent memory and feedback loop for AI agents working on **Data Debug Tool**. Agents MUST read and adhere to these accumulated rules, design decisions, and architectural benchmarks before undertaking any modifications.

---

## 1. REST API Architecture & Lifecycle Learnings

1. **Never Gate `rest_api_init` on `wp_get_current_user()` during `plugins_loaded`:**
   - **The Pitfall:** In WordPress load sequence, `plugins_loaded` fires before `pluggable.php` authenticates the request cookies. At `plugins_loaded`, `wp_get_current_user()` returns a dummy `WP_User` object with ID `0` and empty `$roles = []`. Checking `in_array( 'administrator', $user->roles )` at this stage always evaluates to `false`.
   - **The Consequence:** Hooking `add_action( 'rest_api_init', ... )` inside that check meant the REST endpoints were never registered during normal WordPress requests, causing all debug tool API calls to fail with `404 rest_no_route`.
   - **The Rule:** Always hook route registration directly to `rest_api_init` during initialization. Enforce all role and capability checks (`current_user_can( 'manage_options' )`) inside the route's `permission_callback`.

2. **Dual REST Method Architecture (`GET` & `POST`):**
   - **Background:** The legacy client sent all debug requests via `POST` (`WP_REST_Server::CREATABLE`). However, REST standards dictate that read-only diagnostics should use `GET` (`WP_REST_Server::READABLE`).
   - **The Pattern:** Configure `get_api_args()` with `methods => [ WP_REST_Server::READABLE, WP_REST_Server::CREATABLE ]`. This maintains 100% backward compatibility with existing React client calls while allowing standard browser URL queries and external tooling via GET.

3. **Option Value Falsy Preservation:**
   - When fetching WordPress options via `get_option( $name, null )`, explicitly pass `null` as the default fallback.
   - Do NOT use `empty( $value )` to determine if an option exists, because valid options may store `0`, `false`, or `""`. Check `if ( null === $option_value )` to differentiate between a non-existent option and a falsy option value.

---

## 2. Security & Defense-in-Depth Learnings

1. **Strict CSRF Nonce Enforcement on Cookie Sessions:**
   - **The Risk:** Checking only `is_user_logged_in() && current_user_can( 'manage_options' )` without verifying a nonce leaves custom REST endpoints open to Cross-Site Request Forgery (CSRF). A logged-in administrator lured to an external malicious site could have requests forged on their behalf.
   - **The Solution:** In `check_admin_permission()`, if the request carries cookie authentication (`! empty( $_COOKIE[ LOGGED_IN_COOKIE ] )`), require either the localized `debug_nonce` (`wp_debug_rest`) or standard `X-WP-Nonce` (`wp_rest`). Non-cookie authenticated requests (e.g., CLI or token authentication) are authorized based on verified `manage_options` capability.

2. **Sensitive Credential Sanitization in Debug Outputs:**
   - Direct output of `$user->data` exposes the user's password hash (`user_pass`) and password reset key (`user_activation_key`).
   - In `get_user_data()`, clone `$user->data` and explicitly unset `user_pass` and `user_activation_key` prior to response dispatch.
   - In `get_user_meta_data()`, mask sensitive meta entries such as `session_tokens` with `[Hidden for security]`.

3. **Invalid Wildcard CORS with Credentials:**
   - Combining `Access-Control-Allow-Origin: *` with `Access-control-allow-credentials: true` violates the W3C/Fetch CORS specification and causes browser errors.
   - Furthermore, internal diagnostic tools must never leak system info, database prefixes, and users cross-origin. Remove wildcard CORS headers and rely on WordPress REST defaults.

---

## 3. React Frontend & Code Standards Learnings

1. **React Rules of Hooks in Diagnostic Viewers:**
   - **The Bug:** In `src/components/JsonViewer.js`, returning early (`if ( ! data ) return null;`) before `useState( 'Copy' )` violated React's fundamental Rules of Hooks. When the component initially mounted with `data === null`, the hook was skipped; when data loaded, the hook was executed, risking fiber state corruption.
   - **The Fix:** Hooks must always be invoked at the top level of the component before any conditional early returns.

2. **XSS Defense in Custom Formatted Output:**
   - When rendering colorized and formatted JSON using `dangerouslySetInnerHTML`, every element (object keys, string values, and fallback primitives) must pass through `escapeHtml()`.

3. **Admin Dashboard Tool vs Gutenberg Block Separation:**
   - Data Debug Tool is an admin dashboard application mounted on `tools.php?page=data-debug-tool`, not a Gutenberg block.
   - Including an empty or partial `block.json` in `src/` confuses `@wordpress/scripts build` into emitting invalid block build outputs. Keep `src/` focused on the admin application entry point (`index.js`).

4. **Stylelint Descending Specificity in Nested SCSS:**
   - In nested SCSS rules, general selectors must precede more specific selectors to prevent `no-descending-specificity` errors.
   - Declare base selectors (e.g. `.icon-button`) before `.dark-mode .icon-button`.
   - In interactive pseudoclasses, place `&:disabled` before `&:hover:not(:disabled)`.

5. **Plugin Check (PCP) Compliance for Internal Agent Documentation:**
   - WordPress Plugin Check flags markdown files in the plugin root with `unexpected_markdown_file` (only `README.md` and `CHANGELOG.md` are allowed in root).
   - Internal agent documentation must reside in `.agents/` (`.agents/AGENTS.md` and `.agents/LEARNINGS.md`), and `/.agents` must be added to `.distignore` to prevent inclusion in release packages.

6. **Zero Local System Paths Rule:**
   - Never commit or document absolute local host machine paths (e.g. `C:\laragon\...`, `/home/...`, `/Users/...`) in project files, markdown documentation (`AGENTS.md`, `LEARNINGS.md`), or source code.
   - Always use repository-relative paths (e.g. `.agents/LEARNINGS.md`, `src/index.js`) or generic WordPress relative paths.
