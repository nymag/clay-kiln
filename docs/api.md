---
id: api
title: API
sidebar_label: API
---
## CSS Classes

Kiln exports a number of CSS classes that may be used by plugins.

Class | Description
----- | -----------
`kiln-hide` | generic class to hide elements
`kiln-clearfix` | clearfix, so we don't keep reinventing the wheel
`kiln-normal-text` | inherit text styles from component
`kiln-display1` | large display text
`kiln-headline` | smaller display text
`kiln-title` | same size as form headers
`kiln-subheading` | same size as drawer section headers
`kiln-body` | standard kiln size
`kiln-caption` | smaller text
`kiln-button` | all caps button text
`kiln-list-header` | very small all caps text with background
`kiln-link` | link styling
`kiln-keyboard` | keyboard shortcut styling
`kiln-code` | code styling
`kiln-primary-color` | kiln primary color (blue-grey)
`kiln-accent-color` | kiln accent color (ingigo)

## JavaScript API

Kiln attaches a `window.kiln` object when it has loaded, which contains utilities, vue components, and places to put custom helpers, inputs, validators, etc. Note that you may always override built-in inputs, helpers, validators, etc with your own code if you need to.

Property | Description
-------- | -----------
`componentModels` | compiled model.js files, used by kiln to save/render components
`componentTemplates` | compiled handlebars templates, used by kiln to re-render components
`helpers` | handlebars helper functions. attach custom helpers here
`inputs` | form inputs, defined by vue components. attach custom inputs and `attachedButton` components here
`isInvalidDrag` | boolean that prevents dragging components when selecting text
`locals` | object with url and query params as well as site and user data
`modals` | vue components that may be displayed by calling `store.dispatch('openModal')`
`plugins` | vuex plugins that are called when kiln loads. may subscribe to state changes
`preloadData` | read-only composed page data used to bootstrap kiln on load
`preloadSchemas` | read-only object that contains schemas for all loaded components. used to bootstrap kiln
`selectorButtons` | custom vue components that will be applied to all component selectors
`toolbarButtons` | custom vue components that will be added to the edit toolbar
`navButtons` | custom vue components that will be added to the clay nav
`navContent` | custom vue components that should be rendered inside the clay nav when their corresponding navButton is clicked. Make sure to use the same object key for corresponding navButton + navContent.
`transformers` | object containing all magic-button transform functions. attach custom transformers here
`utils` | various utilities, useful for plugins
`validators` | object containing all validators. attach custom validators here

### Custom Nav Menu Items

You may add options to the Clay menu to be displayed between `New Page` and `Sign Out` options. The trigger buttons should extend the `navMenuButton` component included in `window.kiln.components` and should be added to `window.kiln.navButtons.`

Custom nav buttons should dispatch the `openDrawer` action with the same id used to name the nav button and nav content in the global `kiln` object.

The body of the nav option should be added to `window.kiln.navContent` using the same object key that was used to add the corresponding nav button.

Note that due to the vast difference in functionality and state data between view mode and edit mode, external nav menu options will not be loaded into the nav outside of edit mode.

### Custom Validators

You may add custom validation to `window.kiln.validators`. A validator should export `label`, `description`, `type` (either `error` or `warning`), and a `validate` method. The `validate` method receives the whole page `state`, so validators can be extremely flexible.

Most validators concern themselves with components and/or fields and should make use of the helper functions in `kiln.utils.validationHelpers` such as `forEachComponent` and `forEachField`. The built-in validators such as [`required`](https://github.com/clay/clay-kiln/blob/master/lib/validators/built-in/required.js) are good examples to work off of.

Validators must return an array of errors (or warnings), where each issue includes `uri`, and `field` properties. Optionally, an issue may include `location` (which creates a link to the relevant form) and `preview` (which displays context for an issue).

>#### Validating The DOM
>
>While validators may do DOM lookups to determine validity, remember that DOM lookups are slow compared to reducing on the `state` object directly. Please keep this in mind when writing validators that only concern themselves with page/component/etc data.

### Utilities

Kiln exports a number of JavaScript utils to the browser in the `window.kiln.utils` object.

Property | Description
-------- | -----------
`componentElements` | methods for finding component elements
`caret` | methods for getting/setting caret in text fields
`create()` | function to create new component instances
`headComponents` | methods for finding head components
`interpolate()` | function to interpolate data the same way placeholders do
`label()` | function to generate labels the same way selectors and forms do
`promises` | native Promise versions of bluebird methods
`references` | constants used by kiln, as well as common methods
`urls` | methods for dealing with urls and uris
`getAvailableComponents()` | function to determine which components are allowed in a list
`local` | methods to get/set localstorage
`validationHelpers` | methods to help with pre-publish validation
`fieldHelpers` | methods to help with custom inputs
`logger()` | function to create a new logger for a file (pass in the `__filename` when calling this)
`version` | current Kiln version
`components` | Vue.js components, exported by Kiln

### Vue Components

Kiln exports a number of [KeenUI](https://josephuspaye.github.io/Keen-UI/) and custom Vue.js components that may be used in plugins.

Component | Description
--------- | -----------
`avatar` | circular avatar image
`filterableList` | filterable list, useful for many types of UI
`person` | name, avatar, and subheader for a person, with actions
`timepicker` | text input that wraps `UiTextbox` for time-formatted inputs
`navMenuButton` | button component that should be used for custom navButtons
`UiAutocomplete` | [KeenUI autocomplete](https://josephuspaye.github.io/Keen-UI/#/ui-autocomplete)
`UiButton` | [KeenUI button](https://josephuspaye.github.io/Keen-UI/#/ui-button)
`UiCheckbox` | [single KeenUI checkbox](https://josephuspaye.github.io/Keen-UI/#/ui-checkbox)
`UiCheckboxGroup` | [group of KeenUI checkboxes](https://josephuspaye.github.io/Keen-UI/#/ui-checkbox-group)
`UiCollapsible` | [KeenUI collapsible content](https://josephuspaye.github.io/Keen-UI/#/ui-collapsible)
`UiDatepicker` | [KeenUI datepicker](https://josephuspaye.github.io/Keen-UI/#/ui-datepicker)
`UiFileupload` | [KeenUI file upload button](https://josephuspaye.github.io/Keen-UI/#/ui-fileupload)
`UiIcon` | [KeenUI icon](https://josephuspaye.github.io/Keen-UI/#/ui-icon) that uses [material design icons](https://material.io/icons/)
`UiIconButton` | [KeenUI icon button](https://josephuspaye.github.io/Keen-UI/#/ui-icon-button)
`UiMenu` | [KeenUI menu](https://josephuspaye.github.io/Keen-UI/#/ui-menu)
`UiProgressCircular` | [KeenUI circular progress indicator](https://josephuspaye.github.io/Keen-UI/#/ui-progress-circular)
`UiRadioGroup` | [group of KeenUI radio inputs](https://josephuspaye.github.io/Keen-UI/#/ui-radio-group)
`UiRippleInk` | [KeenUI ripple ink effect](https://josephuspaye.github.io/Keen-UI/#/ui-ripple-ink)
`UiSelect` | [KeenUI enhanced select dropdown](https://josephuspaye.github.io/Keen-UI/#/ui-select)
`UiSlider` | [KeenUI slider](https://josephuspaye.github.io/Keen-UI/#/ui-slider)
`UiSwitch` | [KeenUI switch](https://josephuspaye.github.io/Keen-UI/#/ui-switch)
`UiTabs` | [KeenUI tabs](https://josephuspaye.github.io/Keen-UI/#/ui-tabs)
`UiTab` | [individual KeenUI tab](https://josephuspaye.github.io/Keen-UI/#/ui-tabs)
`UiTextbox` | [KeenUI textbox](https://josephuspaye.github.io/Keen-UI/#/ui-textbox)
`UiTooltip` | [KeenUI tooltip](https://josephuspaye.github.io/Keen-UI/#/ui-tooltip)

## Vuex State

The Vuex state looks similar to this:

```js
{
  components: {
    // component instance data, keyed by uri
    // components that have been removed from the page will be empty objects
    'domain.com/_components/some-component/instances/some-instance': { /* some data */ }
  },
  componentDefaults: {
    // default component data, used when creating new components
    'some-component': { /* some data */ }
  },
  page: {
    uri: 'domain.com/_pages/current-page',
    data: { /* page areas, layout, and customURL */ },
    state: {
      // this page's representation in the list (data that's sent to the page list)
      published: false,
      scheduled: false,
      createdAt: 0,
      publishTime: null,
      scheduledTime: null,
      siteSlug: 'some-site',
      title: '',
      updateTime: null,
      uri: 'domain.com/_pages/current-page',
      url: ''
    }
  },
  layout: {
    // this layout's representation in the layouts list
    published: false,
    scheduled: false,
    createTime: 'Wed May 23 2018 16:20:05 GMT-0400 (EDT)',
    publishTime: null,
    scheduleTime: null,
    siteSlug: 'some-site',
    title: '',
    updateTime: null,
    updateUser: null,
    uri: 'domain.com/_components/some-layout/instances/some-id'
  }
  user: {
    // currently logged-in user
    auth: 'write',
    imageUrl: 'avatar url',
    name: 'Name of User',
    provider: 'some-provider',
    username: 'some username or email'
  },
  // ui state management
  ui: {
    currentForm: { uri, path, data }, // currently opened form
    currentAddComponentModal: { currentURI, parentURI, path, available }, // current "add component" modal
    currentModal: { title, type, size, data }, // current "simple" modal
    currentConfirm: { title, text, button, onConfirm }, // current "confirmation" modal
    currentDrawer: null, // current drawer menu, both left and right drawers
    currentSelection: null, // currently selected component, gets uri
    currentFocus: { uri, path }, // currently focused field/group
    currentProgress: 0, // progress bar, gets random number (to prevent flashes)
    currentlySaving: false, // don't focus components while forms are saving, gets boolean
    metaKey: false, // set to true when meta key is pressed, enables additional functionality in kiln
    alerts: [], // array of alerts to display to the user
    snackbar: null // current (or previous) snackbar.
    // note: snackbars are created imperatively (settings this simply informs the toolbar to create a new snackbar),
    // so this won't always be the snackbar displayed (it will be either the one displayed or the previous one displayed)
  },
  // publishing validation
  validation: {
    // errors and warnings are arrays of { label, description, items },
    // with each item being { field, location, path, uri, preview }
    errors: [],
    warnings: []
  },
  // read-only
  schemas: {
    'some-component': { /* some schema, converted to kiln 5.x syntax */ }
  },
  locals: {
    components: ['list', 'of', 'all', 'components'],
    edit: 'true',
    params: { /* url params */ },
    query: { /* url query params */ },
    routes: ['/available', '/routes', '/in', '/current', '/site'],
    site: { /* config for current site */ },
    url: 'http://current-url',
    user: { /* current user data */ }
  },
  models: {
    'some-component': { /* object with save() and/or render() methods */ }
  },
  templates: {
    'some-component': () => {} // render function, precompiled handlebars template
  },
  site: { /* config for current site */ },
  allSites: {
    // configs for all sites in the current clay instance
    'slug': { /* config */ }
  },
  url: null,
  lists: {
    // data from `/_lists`, populated as needed
    isLoading: false,
    'new-pages': {
      error: null,
      isLoading: false,
      items: [ /* array of list items */ ]
    }
  },
  isLoading: true, // preloading has started
  undo: {
    atStart: true, // boolean if we're at the start of the history (no undo)
    atEnd: true, // boolean if we're at the end of the history (no redo)
    cursor: 0 // current snapshot the user is on. used to undo/redo non-destructively
  }
}
```
