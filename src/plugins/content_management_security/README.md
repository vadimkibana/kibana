# `content_management_security` plugin

This plugin provides a security layer for the content management plugin. Its
purpose is to inject the `security` plugin into the `content_management` plugin
at runtime. Due to plugin cyclic dependencies, this is not possible at plugin
construction time.
