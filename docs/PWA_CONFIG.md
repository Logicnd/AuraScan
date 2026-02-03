# 📱 PWA Manifest Configuration

This document explains all configurable options in `public/manifest.json`.

## Overview

The `manifest.json` file configures how AuraScan appears when installed as a Progressive Web App (PWA) on users' devices.

---

## Core Configuration

### App Identity

```json
{
  "name": "AuraScan - Your AI's Conscience",  // Full app name (for install dialogs)
  "short_name": "AuraScan",                    // Name on home screen (12 chars max recommended)
  "description": "Mobile-first PWA..."         // App store/install description
}
```

**To customize:**
- Change `name` for your branding
- Keep `short_name` under 12 characters

---

### Display Settings

```json
{
  "display": "standalone",     // How app launches
  "orientation": "portrait",   // Lock orientation
  "start_url": "/",            // Initial page when opened
  "scope": "/"                 // Navigation boundary
}
```

**Display options:**
| Value | Description |
|-------|-------------|
| `standalone` | Looks like native app (no browser UI) |
| `fullscreen` | Uses entire screen (good for games) |
| `minimal-ui` | Browser with minimal controls |
| `browser` | Opens in browser tab |

---

### Theme Colors

```json
{
  "theme_color": "#22c55e",      // Browser/status bar color (green)
  "background_color": "#0a0a0a"  // Splash screen background (dark)
}
```

**To customize:**
- `theme_color`: Match your primary brand color
- `background_color`: Match your app's background

---

## Icons

Icons are required for PWA installation. Place them in `/public/icons/`.

```json
"icons": [
  {
    "src": "/icons/icon-192x192.png",
    "sizes": "192x192",
    "type": "image/png",
    "purpose": "maskable any"
  }
]
```

### Required Sizes
- 72x72, 96x96, 128x128, 144x144, 152x152, 192x192, 384x384, 512x512

### Icon Generator
Use: https://realfavicongenerator.net/ to generate all sizes from one image.

### Purpose Values
| Value | Description |
|-------|-------------|
| `any` | Standard icon |
| `maskable` | Adaptive icon (can be cropped to circles/shapes) |
| `monochrome` | Single-color icon for notifications |

---

## Shortcuts

Quick actions from long-press on app icon:

```json
"shortcuts": [
  {
    "name": "Quick Scan",           // Full name
    "short_name": "Scan",           // Short version
    "description": "Start a scan",  // Tooltip
    "url": "/?action=scan",         // Where it navigates
    "icons": [{ "src": "/icons/scan-shortcut.png", "sizes": "96x96" }]
  }
]
```

**Current shortcuts:**
1. Quick Scan - Start ethics scan
2. AR Lens - Open AR mode
3. Templates - Browse templates

---

## Screenshots

Screenshots shown in install dialogs:

```json
"screenshots": [
  {
    "src": "/screenshots/home.png",
    "sizes": "1080x1920",
    "type": "image/png",
    "form_factor": "narrow",  // "narrow" = phone, "wide" = tablet/desktop
    "label": "Home Screen"
  }
]
```

**To add:**
1. Take screenshots at 1080x1920 (portrait) or 1920x1080 (landscape)
2. Place in `/public/screenshots/`
3. Add to manifest

---

## Advanced Features

### Share Target

Allows sharing TO the app from other apps:

```json
"share_target": {
  "action": "/share",
  "method": "POST",
  "params": {
    "title": "title",
    "text": "text",
    "url": "url"
  }
}
```

When users share text to AuraScan, it opens `/share` with the shared content.

---

### Protocol Handler

Allows `web+aurascan://` links:

```json
"protocol_handlers": [
  {
    "protocol": "web+aurascan",
    "url": "/protocol?url=%s"
  }
]
```

Example: `web+aurascan://scan?prompt=hello` opens the app.

---

### File Handler

Allows opening `.txt` and `.json` files with AuraScan:

```json
"file_handlers": [
  {
    "action": "/analyze",
    "accept": {
      "text/plain": [".txt"],
      "application/json": [".json"]
    }
  }
]
```

---

## Testing PWA

### Chrome DevTools
1. Open DevTools (F12)
2. Go to Application tab
3. Check "Manifest" section for errors

### Lighthouse Audit
1. Open DevTools
2. Go to Lighthouse tab
3. Run "Progressive Web App" audit

### Install Test
1. Visit your site
2. Click the install icon in address bar
3. Or: Menu → Install AuraScan

---

## Required Files

For PWA to work, ensure these exist:

```
public/
├── manifest.json          # This file
├── icons/
│   ├── icon-72x72.png
│   ├── icon-96x96.png
│   ├── icon-128x128.png
│   ├── icon-144x144.png
│   ├── icon-152x152.png
│   ├── icon-192x192.png
│   ├── icon-384x384.png
│   └── icon-512x512.png
├── screenshots/           # Optional but recommended
│   ├── home.png
│   ├── scan.png
│   └── ar.png
└── favicon.ico
```

---

## Resources

- PWA Manifest Spec: https://developer.mozilla.org/en-US/docs/Web/Manifest
- PWA Builder: https://www.pwabuilder.com/
- Icon Generator: https://realfavicongenerator.net/
