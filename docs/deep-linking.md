---
id: deep-linking
title: Deep Linking
sidebar_label: Deep Linking
---

---

All Kiln Nav Drawers, i.e. the UI elements that slide in from the right and left, can be deep-linked to by manipulating the url hash. All page components and their property modals can also be deep-linked to as the url hash is updated when they are being edited to reflect the name of the component.

The kiln nav drawers, both left and right are opened with the [openDrawer](vuex-actions.md#module_drawers) function (or the toggleDrawer function which calls [openDrawer](vuex-actions.md#module_drawers) when opening and [closeDrawer](vuex-actions.md#module_drawers) when closing).  The [openDrawer](vuex-actions.md#module_drawers) function sets the url hash to the value passed to it.  The value can either be a string, indicating the name of the drawer to open, or an object, which includes the name, as well as further properties that can be used to deep-link to content within the drawer, such as to a tab or a specific UI element within the drawer.

The hash can contain up to 4 values, each divided by a tilde.  For example: `#kiln~one~two~three~four`. The very first value in the hash, the #kiln~ value indicates that the hash is for a kiln UI element, rather than a page component.  The hash is parsed and stored in the vuex store on pageload. It is stored at store.state.url. That example hash (`#kiln~one~two~three~four`) would be stored like this:
```
url {
  tabs: 'one',
  sites: 'two',
  status: 'three',
  query: 'four'
}
```

When the hash is present on the initial pageload, and the first hash parameter matches the name of a drawer, that drawer will automatically open. If there are further parameters, it is up to the drawer to react to it. For example: `#kiln~find-on-a-page~visible-components` would open the 'find-on-a-page' drawer, and the 'find-on-a-page' drawer reads the second hash parameter 'visible-components' and makes the tab with that name, the active tab. In the same way that `kiln~find-on-a-page~head-components` would open the 'find-on-a-page' drawer and make the 'head-components' tab, the active tab. The tabs component within the 'find-on-a-page' drawer is also responsible for setting the hash when the user changes tabs.  If the user is on the 'visible-components' tab and then clicks the 'head-components' tab, the url hash changes from `#kiln~find-on-a-page~visible-components` to `kiln~find-on-a-page~head-components`.  To set the hash, the [setHash](vuex-actions.md#module_deep-linking) function is called.

---

## Kiln Plugins

Kiln plugins can also take advantage of the hash deep-linking. The easiest way to demonstrate how to use the deep-linking with a plugin is to show a simple, example plugin.

### Alert Plugin Example

index.js - adds a nav button, and nav content to the window.kiln object.  The nav button will appear in the left nav and the nav content will appear in the left drawer when that button is clicked.  The drawer will also open if the url hash is set to `#kiln~alert`.
```js
module.exports = () => {
  window.kiln.navButtons['alert'] = require('./nav-button.vue');
  window.kiln.navContent['alert'] = require('./main.vue');
};
```

nav-button.vue - the markup for the nav button, with a click event attached that runs the toggleDrawer function, which will open the drawer if it's closed, and close it if it's open.

```vue
<template>
<div>
  <nav-menu-button id="alert" icon="images" @nav-click="toggleDrawer">Alert</nav-menu-button>
</div>
</template>
 <script>
'use strict';
const navMenuButton = window.kiln.utils.components.navMenuButton;
module.exports = {
  data() {
    return {};
  },
  methods: {
    toggleDrawer() {
      this.$store.dispatch('toggleDrawer', 'alert');
    }
  },
  components: {
    navMenuButton
  }
};
</script>
```

main.vue - the contents of the drawer.  The two buttons each set the url hash to a different value, and each of the two paragraphs is only shown when the url hash matches a certain value.  Click the Danger button and the url hash becomes `#kiln~alert~danger`.  If you refresh the page after clicking that button, the alert drawer will be open, with the Danger paragraph visible.
```
<template>
  <div>
    <p v-if="activeElement === 'danger'">Danger Will Robinson!</p>
    <p v-else>Beam Me Up!</p>
    <button @click="setElement('danger')">Danger</button><button @click="setElement('beam')">Beam</button>
  </div>
</template>

<script>
export default {
  name: "Alert",
  computed: {
    activeElement() {
      return this.$store.state.url.sites;
    }
  },
  methods: {
    setElement(component) {
      this.$store.dispatch('setHash', { menu: { tab: 'alert', sites: component, status: '', query: ''} });
    }
  }
}
</script>
```
