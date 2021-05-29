---
id: introduction
title: Introduction
sidebar_label: Introduction
---
---

<img src="http://i.imgur.com/RleQNNh.png?1" alt="illustration of a kiln"  />

Editing tools for Clay


Powering [New York Magazine](http://nymag.com/), [Vulture](http://www.vulture.com/), [The Cut](https://www.thecut.com/), [Grub Street](http://www.grubstreet.com/).
Created by New York Media.

---

## Installation

```
npm install --save clay-kiln
```

Kiln comes with compiled scripts and styles, most of which will be automatically inlined by the template.

The logged-in scripts must be copied (from `dist/clay-kiln-edit.js` and `dist/clay-kiln-view.js`) into your publicly-served assets directory, as they'll be linked by `<script src="[site assetPath]/js/clay-kiln-edit.js">` and `<script src="[site assetPath]/js/clay-kiln-view.js">`.

This allows your end users' browsers to cache the (fairly weighty) Kiln application code, speeding up page loads across your sites.

---

## Usage

As Kiln itself is a component, it must be included in your layouts and have some data, e.g. `allow: true` (a convention we use for components that don't otherwise have data in them). Add an instance of Kiln to your bootstraps:

```yaml
components:
  clay-kiln:
    instances:
      general:
        allow: true
```

Then create a _non-editable_ component list in your layout (preferably near the end), and add a reference to your Kiln instance:

```yaml
components:
  layout:
    instances:
      article:
        kilnInternals:
          -
            _ref: /_components/clay-kiln/instances/general
```

Make sure you add that component list to your layout template, and double check that it isn't editable:

```handlebars
<div class="kiln-internals">{{ > component-list kilnInternals }}</div>
```

---

## User Experience

On public-facing pages, Kiln will add a very small snippet of JavaScript that enabled users to type Shift+CLAY to redirect them to the Clay login page, `/_auth/login`.

When users are logged-in, they will see some Kiln buttons in the top left corner which will allow them to access the Clay Menu and enter Edit Mode.

When users are in Edit Mode, they will see a toolbar across the top of the screen which will enable all Kiln functionality on the current page.

> Users may also enter edit mode directly on any page by appending `?edit=true` to the URL.
