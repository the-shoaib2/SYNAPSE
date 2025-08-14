---
globs: ui/**/*
description: Ensures consistent URL opening behavior in UI components using the
  IDE messenger pattern
alwaysApply: false
---

# UI Link Opening

When adding functionality to open external links in UI components, use `ideMessenger.post("openUrl", url)` where `ideMessenger` is obtained from `useContext(IdeMessengerContext)`
