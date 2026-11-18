=== Data Debug Tool ===
Contributors:      wpspices
Tags:              tool, debug, data, tools, json
Requires at least: 6.1
Tested up to:      7.1
Stable tag:        0.2.0
License:           GPL-2.0-or-later
License URI:       https://www.gnu.org/licenses/gpl-2.0.html

A simple lightweight tool to debug WordPress data. X-ray vision for WordPress data structures with smart data decoding capabilities.

== Description ==

Ever wished you could peek inside WordPress's data structure without writing a single line of code? Data Debug Tool is your x-ray vision into WordPress - see options, meta, and more in a clean, visual interface.

== Smart Data Decode viewer ==
* Automatically parses Gutenberg blocks into readable JSON format for viewing
* Unserializes PHP serialized data
* Prettifies JSON structures

== Features ==
* No bloat - just the essentials you need
* Smart data decoding - see Gutenberg blocks, serialized data, and JSON in readable format
* Simple UI that's easy to use
* Dark mode that actually looks good
* No JavaScript on the front end
* No jQuery
* Inspect WordPress options, post meta, user meta, and terms with search capabilities
* Real-time data visualization with JSON viewer and one-click copy
* Zero impact on front-end performance
* Secure, administrator-only access

Whether you're debugging plugins, themes, or core WordPress functionality, Data Debug Tool makes it easy to find and inspect the data you need.

== Installation ==

1. Upload the plugin files to the `/wp-content/plugins/data-debug-tool` directory, or install the plugin through the WordPress plugins screen directly.
2. Activate the plugin through the 'Plugins' screen in WordPress.
3. Navigate to Tools -> Data Debug Tool in the WordPress admin menu.

== Screenshots ==

1. Data Debug Tool interface showing options and smart decoded data.

== Changelog ==

= 0.2.0 =
* Fix: Resolved critical REST API route registration bug that prevented debug endpoints from loading.
* Security: Removed user password hashes (`user_pass`) and activation keys from user debug endpoints.
* Security: Removed wildcard CORS headers and enforce strict capability and nonce checks.
* Fix: Corrected React lifecycle hook order in JsonViewer component.
* Clean: Removed unused boilerplate `block.json`, dead state variables, and console statements.
* Compatibility: Tested and verified compatibility up to WordPress 7.1.

= 0.1.1 =
* Remove Screenshots

= 0.1.0 =
* Initial release
