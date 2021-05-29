---
id: vuex-actions
title: Vuex Actions
sidebar_label: Vuex Actions
---
## Modules
- [component-data](#module_component-data)
- [decorators](#module_decorators)
- [deep-linking](#module_deep-linking)
- [drawers](#module_drawers)
- [forms](#module_forms)
- [layout-state](#module_layout-state)
- [lists](#module_lists)
- [nav](#module_nav)
- [page-data](#module_page-data)
- [page-state](#module_page-state)
- [preloader](#module_preloader)
- [toolbar](#module_toolbar)
- [undo](#module_undo)
- [validators](#module_validators)

## Functions
[isPageSpecific(uri, store)](#isPageSpecific) ⇒ `boolean`
Is uri page spectific

## component-data

* [component-data](#component-data)
    * _static_
        * [.updateSchemaProp(store, schemaName, inputName, prop, value)](#component-dataupdateschemapropstore-schemaname-inputname-prop-value)
        * [.triggerModelSave(uri, data)](#component-datatriggermodelsaveuri-data-promise) ⇒ `Promise`
        * [.triggerModelRender(store, uri, data)](#component-datatriggermodelrenderstore-uri-data-promise) ⇒ `Promise`
        * [.saveComponent(store, uri, data, [eventID], [snapshot], [prevData], forceSave)](#component-datasavecomponentstore-uri-data-eventid-snapshot-prevdata-forcesave-promise) ⇒ `Promise`
        * [.removeComponent(store, data)](#component-dataremovecomponentstore-data-promise) ⇒ `Promise`
        * [.removeHeadComponent(store, startNode)](#component-dataremoveheadcomponentstore-startnode-promise) ⇒ `Promise`
        * [.addCreatedComponentsToPageArea(store, newComponents, currentURI, path, replace, number, array, boolean)](#component-dataaddcreatedcomponentstopageareastore-newcomponents-currenturi-path-replace-number-array-boolean-promise) ⇒ `Promise`
        * [.addComponents(store, [currentURI], parentURI, path, [replace], components)](#component-dataaddcomponentsstore-currenturi-parenturi-path-replace-components-promise) ⇒ `Promise`
        * [.openAddComponent(store, [currentURI], parentURI, path)](#component-dataopenaddcomponentstore-currenturi-parenturi-path-promise) ⇒ `Promise`
        * [.componentAdded(store, componentName, uri)](#component-datacomponentaddedstore-componentname-uri)
        * [.closeAddComponent(store)](#component-datacloseaddcomponentstore)
        * [.currentlyRestoring(store, restoring)](#component-datacurrentlyrestoringstore-restoring)
    * _inner_
        * [~logSaveError(uri, e, data, [eventID], [snapshot], store)](#component-data-logsaveerroruri-e-data-eventid-snapshot-store)
        * [~revertReject(uri, data, [snapshot], paths, store)](#component-data-revertrejecturi-data-snapshot-paths-store-promise) ⇒ `Promise`
        * [~clientSave(uri, data, oldData, store, [eventID], [snapshot], paths)](#component-data-clientsaveuri-data-olddata-store-eventid-snapshot-paths-promise) ⇒ `Promise`
        * [~findIndex(data, [uri])](#component-data-findindexdata-uri-number) ⇒ `number`
        * [~addComponentsToComponentList(store, data, [currentURI], parentURI, path, [replace], components)](#component-data-addcomponentstocomponentliststore-data-currenturi-parenturi-path-replace-components-promise) ⇒ `Promise`
        * [~addComponentsToComponentProp(store, data, parentURI, path, components)](#component-data-addcomponentstocomponentpropstore-data-parenturi-path-components-promise) ⇒ `Promise`
        * [~addComponentsToPageArea(store, currentURI, path, replace, components)](#component-data-addcomponentstopageareastore-currenturi-path-replace-components-promise) ⇒ `Promise`

### component-data.updateSchemaProp(store, schemaName, inputName, prop, value)
update a property value on a component schema

**Kind**: static method of [`component-data`](#component-data)  
**Return{promise}**:   

| Param | Type |
| --- | --- |
| store | `object` | 
| schemaName | `string` | 
| inputName | `string` | 
| prop | `string` | 
| value | `object` / `string` / `number` | 

### component-data.triggerModelSave(uri, data) ⇒ `promise`
trigger a the model.save of a component

**Kind**: static method of [`component-data`](#component-data)  

| Param | Type |
| --- | --- |
| uri | `string` | 
| data | `object` | 

### component-data.triggerModelRender(store, uri, data) ⇒ `promise`
trigger a the model.render of a component

**Kind**: static method of [`component-data`](#component-data)  

| Param | Type |
| --- | --- |
| store | `object` | 
| uri | `string` | 
| data | `object` | 

### component-data.saveComponent(store, uri, data, [eventID], [snapshot], [prevData], forceSave) ⇒ `Promise`
save a component's data and re-render

**Kind**: static method of [`component-data`](#component-data)  

| Param | Type | Description |
| --- | --- | --- |
| store | `object` |  |
| uri | `string` |  |
| data |`object` | (may be a subset of the data) |
| [eventID] | `string` | when saving from a pubsub subscription |
| [snapshot] | `boolean` | set to false if save is triggered by undo/redo |
| [prevData] | `object` | manually passed in when undoing/redoing (because the store has already been updated) |
| forceSave | `boolean` | if true, component will be saved even if it doesn't appear to have changed |

### component-data.removeComponent(store, data) ⇒ `Promise`
remove a component from its parent
note: removes from parent component OR page

**Kind**: static method of [`component-data`](#component-data)  

| Param | Type | Description |
| --- | --- | --- |
| store | `object` |  |
| data | `Element` | {el, msg} where el is the component to delete |

### component-data.removeHeadComponent(store, startNode) ⇒ `Promise`
remove head components (from page or layout)

**Kind**: static method of [`component-data`](#component-data)  

| Param | Type | Description |
| --- | --- | --- |
| store | `object` |  |
| startNode | `Node` | comment with data-uri |

### component-data.addCreatedComponentsToPageArea(store, newComponents, currentURI, path, replace, number, array, boolean) ⇒ `Promise`
add components to a page area

**Kind**: static method of [`component-data`](#component-data)  

| Param | Type |
| --- | --- |
| store | `object` | 
| newComponents | `array` | 
| currentURI | `string` | 
| path | `string` | 
| replace | `boolean` | 
| number | `index` | 
| array | `data` | 
| boolean | `forceRender` | 

### component-data.addComponents(store, [currentURI], parentURI, path, [replace], components) ⇒ `Promise`
add components to a parent component (or page)
note: allows multiple components to be added at once
note: always creates new instances of the components you're adding
note: allows you to replace a specific uri, or add components after it
note: if no currentURI passed in, it will add new components to the end (and won't replace anything)

**Kind**: static method of [`component-data`](#component-data)  
**Returns**: `Promise` - with the last added component's el  

| Param | Type | Description |
| --- | --- | --- |
| store | `object` |  |
| [currentURI] | `string` | if adding after / replacing a specific component |
| parentURI | `string` |  |
| path | `string` |  |
| [replace] | `boolean` | to replace the current URI |
| components | `array` | to add (object with name and [data]) |

### component-data.openAddComponent(store, [currentURI], parentURI, path) ⇒ `Promise`
open the add components pane, or add a new components

**Kind**: static method of [`component-data`](#component-data)  

| Param | Type | Description |
| --- | --- | --- |
| store | `object` |  |
| [currentURI] | `string` | if we're inserting after a specific component |
| parentURI | `string` |  |
| path | `string` |  |

### component-data.componentAdded(store, componentName, uri)
Store the last item added

**Kind**: static method of [`component-data`](#component-data)  

| Param | Type |
| --- | --- |
| store | `object` | 
| componentName | `string` | 
| uri | `string` |

### component-data.closeAddComponent(store)
Close the add component

**Kind**: static method of [`component-data`](#component-data)  

| Param | Type |
| --- | --- |
| store | `object` | 

### component-data.currentlyRestoring(store, restoring)
open the add components pane, or add a new components

**Kind**: static method of [`component-data`](#component-data)  

| Param | Type | Description |
| --- | --- | --- |
| store | `object` |  |
| restoring | `boolean` | if we're currently restoring a page |

### component-data~logSaveError(uri, e, data, [eventID], [snapshot], store)
log errors when components save and display them to the user

**Kind**: inner method of [`component-data`](#component-data)  

| Param | Type |
| --- | --- |
| uri | `string` | 
| e | `Error` | 
| data | `object` | 
| [eventID] | `string` | 
| [snapshot] | `boolean` | 
| store | `object` | 

### component-data~revertReject(uri, data, [snapshot], paths, store) ⇒ `Promise`
re-render (reverting) a component and stop the saving promise chain

**Kind**: inner method of [`component-data`](#component-data)  

| Param | Type |
| --- | --- |
| uri | `string` | 
| data | `object` | 
| [snapshot] | `boolean` | 
| paths | `array` | 
| store | `object` | 

### component-data~clientSave(uri, data, oldData, store, [eventID], [snapshot], paths) ⇒ `Promise`
save data client-side and queue up api call for the server
note: this uses the components' model.js (if it exists) and handlebars template
note: server-side saving and/or re-rendering has been removed in kiln v4.x

**Kind**: inner method of [`component-data`](#component-data)  

| Param | Type | Description |
| --- | --- | --- |
| uri | `string` |  |
| data | `object` |  |
| oldData | `object` |  |
| store | `object` |  |
| [eventID] | `string` |  |
| [snapshot] | `boolean` | passed through to render |
| paths | `array` |  |

### component-data~findIndex(data, [uri]) ⇒ `number`
find the index of a uri in a list
this is broken out into a separate function so we don't assume an index of 0 is falsy

**Kind**: inner method of [`component-data`](#component-data)  

| Param | Type |
| --- | --- |
| data | `array` | 
| [uri] | `string` | 

### component-data~addComponentsToComponentList(store, data, [currentURI], parentURI, path, [replace], components) ⇒ `Promise`
add one or more components to a component list

**Kind**: inner method of [`component-data`](#component-data)  

| Param | Type | Description |
| --- | --- | --- |
| store | `object` |  |
| data | `array` | list data |
| [currentURI] | `string` | if you want to add after / replace a specific current component |
| parentURI | `string` |  |
| path | `string` | of the list |
| [replace] | `boolean` | to replace currentURI |
| components | `array` | with { name, [data] } |

### component-data~addComponentsToComponentProp(store, data, parentURI, path, components) ⇒ `Promise`
replace a single component in another component's property

**Kind**: inner method of [`component-data`](#component-data)  

| Param | Type | Description |
| --- | --- | --- |
| store | `object` |  |
| data | `object` |  |
| parentURI | `string` |  |
| path | `string` |  |
| components | `array` | note: it'll only replace using the first thing in this array |

### component-data~addComponentsToPageArea(store, currentURI, path, replace, components) ⇒ `Promise`
create components to be added to a page area (i.e. head, main, etc.)

**Kind**: inner method of [`component-data`](#component-data)  

| Param | Type |
| --- | --- |
| store | `object` | 
| currentURI | `string` | 
| path | `string` | 
| replace | `boolean` | 
| components | `array` | 

<a name="module_decorators"></a>

## decorators

* [decorators](#decorators)
    * [.unselect(store)](#decoratorsunselectstore)
    * [.select(store, el)](#decoratorsselectstore-el)
    * [.scrollToComponent(store, el)](#decoratorsscrolltocomponentstore-el)
    * [.navigateComponents(store, direction)](#decoratorsnavigatecomponentsstore-direction-promise) ⇒ `Promise`
    * [.unfocus(store)](#decoratorsunfocusstore-promise) ⇒ `Promise`

### decorators.unselect(store)
unselect currently-selected component

**Kind**: static method of [`decorators`](#decorators)  

| Param | Type |
| --- | --- |
| store | `object` | 

### decorators.select(store, el)
select a component

**Kind**: static method of [`decorators`](#decorators)  

| Param | Type |
| --- | --- |
| store | `object` | 
| el | `element` | 

### decorators.scrollToComponent(store, el)
Scroll user to the component. "Weeee!" or "What the?"

**Kind**: static method of [`decorators`](#decorators)  

| Param | Type |
| --- | --- |
| store | `object` | 
| el | `Element` | 

### decorators.navigateComponents(store, direction) ⇒ `Promise`
navigate to the previous or next component

**Kind**: static method of [`decorators`](#decorators)  

| Param | Type | Description |
| --- | --- | --- |
| store | `object` |  |
| direction | `string` | 'prev' or 'next' |

### decorators.unfocus(store) ⇒ `Promise`
unfocus currently-focused field/group

**Kind**: static method of [`decorators`](#decorators)  

| Param | Type |
| --- | --- |
| store | `object` | 

## deep-linking

* [deep-linking](#deep-linking)
    * [.parseURLHash(store)](#deep-linkingparseurlhashstore-promise) ⇒ `Promise`
    * [.setHash(commit, [uri], [path], [initialFocus], [menu])](#deep-linkingsethashcommit-uri-path-initialfocus-menu)
    * [.clearHash(commit)](#deep-linkingclearhashcommit)

### deep-linking.parseURLHash(store) ⇒ `Promise`
parse url hash, opening form or clay menu as necessary

**Kind**: static method of [`deep-linking`](#deep-linking)  

| Param | Type |
| --- | --- |
| store | `object` | 

### deep-linking.setHash(commit, [uri], [path], [initialFocus], [menu])
set hash in window and store

**Kind**: static method of [`deep-linking`](#deep-linking)  

| Param | Type |
| --- | --- |
| commit | `function` | 
| [uri] | `string` | 
| [path] | `string` | 
| [initialFocus] | `string` | 
| [menu] | `object` |

### deep-linking.clearHash(commit)
clear hash in window and store

**Kind**: static method of [`deep-linking`](#deep-linking)  

| Param | Type |
| --- | --- |
| commit | `function` |

## drawers

* [drawers](#drawers)
    * [.closeDrawer(store)](#drawersclosedrawerstore)
    * [.openDrawer(store, nameOrConfig)](#drawersopendrawerstore-nameorconfig)

### drawers.closeDrawer(store)
close drawer without toggling a new drawer

**Kind**: static method of [`drawers`](#drawers)  

| Param | Type |
| --- | --- |
| store | `Object` |

### drawers.openDrawer(store, nameOrConfig)
open drawer

**Kind**: static method of [`drawers`](#drawers)  

| Param | Type | Description |
| --- | --- | --- |
| store | `Object` |  |
| nameOrConfig | `string` \ `object` | either just the tab name or a json object for deeper linking |

## forms

* [forms](#forms)
    * _static_
        * [.updateFormData(store, path, val)](#module_forms.updateFormData)
        * [.openForm(store, uri, path, [el], [offset], [appendText], [initialFocus], pos)](#module_forms.openForm)
        * [.closeForm(store)](#module_forms.closeForm) ⇒ `promise`
    * _inner_
        * [~hasDataChanged(newData, oldData)](#module_forms..hasDataChanged) ⇒ `Boolean`

### forms.updateFormData(store, path, val)
Update form data

**Kind**: static method of [`forms`](#forms)  

| Param | Type |
| --- | --- |
| store | `object` | 
| path | `string` | 
| val | `string` \ `number` |

### forms.openForm(store, uri, path, [el], [offset], [appendText], [initialFocus], pos)
open form

**Kind**: static method of [`forms`](#forms)  

| Param | Type | Description |
| --- | --- | --- |
| store | `object` |  |
| uri | `string` | component uri |
| path | `string` | field/form path |
| [el] | `Element` | parent element (for inline forms) |
| [offset] | `number` | caret offset (for text inputs) |
| [appendText] | `string` | text to append (for text inputs, used when splitting/merging components with text fields) |
| [initialFocus] | `string` | if focusing on a specific field when opening the form |
| pos | `object` | x/y coordinates used to position overlay forms |

### forms.closeForm(store) ⇒ `promise`
Close a form

**Kind**: static method of [`forms`](#forms)  

| Param | Type |
| --- | --- |
| store | `object` | 

### forms~hasDataChanged(newData, oldData) ⇒ `Boolean`
determine if data in form has changed
note: convert data to plain objects, since they're reactive

**Kind**: inner method of [`forms`](#forms)  

| Param | Type | Description |
| --- | --- | --- |
| newData | `object` | from form |
| oldData | `object` | from store |

## layout-state

* [layout-state](#layout-state)
    * [.fetchLayoutState(store, [preloadOptions])](#layout-statefetchlayoutstatestore-preloadoptions-promise) ⇒ `Promise`
    * [.updateLayout(store, [data], [preloadOptions])](#layout-stateupdatelayoutstore-data-preloadoptions-promise) ⇒ `Promise`
    * [.scheduleLayout(store, timestamp)](#layout-stateschedulelayoutstore-timestamp-promise) ⇒ `Promise`
    * [.unscheduleLayout(store, [publishing])](#layout-stateunschedulelayoutstore-publishing-promise) ⇒ `Promise`
    * [.publishLayout(store)](#layout-statepublishlayoutstore-promise) ⇒ `Promise`

<a name="module_layout-state.fetchLayoutState"></a>

### layout-state.fetchLayoutState(store, [preloadOptions]) ⇒ `Promise`
get the list data for a specific layout
note: if prefix / uri is specified, this does NOT commit the data (only returns it),
allowing the preloader to use it when doing the initial preload of data

**Kind**: static method of [`layout-state`](#layout-state)  

| Param | Type |
| --- | --- |
| store | `object` | 
| [preloadOptions] | `object` | 
| [preloadOptions.uri] | `string` | 
| [preloadOptions.prefix] | `string` | 
| [preloadOptions.user] | `object` |

### layout-state.updateLayout(store, [data], [preloadOptions]) ⇒ `Promise`
update a layout's title, or just the latest timestamp + user

**Kind**: static method of [`layout-state`](#layout-state)  

| Param | Type |
| --- | --- |
| store | `object` | 
| [data] | `object` | 
| [data.title] | `string` | 
| [preloadOptions] | `object` |

### layout-state.scheduleLayout(store, timestamp) ⇒ `Promise`
schedule the layout and update its index

**Kind**: static method of [`layout-state`](#layout-state)  

| Param | Type |
| --- | --- |
| store | `object` | 
| timestamp | `Date` |

### layout-state.unscheduleLayout(store, [publishing]) ⇒ `Promise`
unschedule the layout
get updated layout state if the call wasn't made during layout publish

**Kind**: static method of [`layout-state`](#layout-state)  

| Param | Type |
| --- | --- |
| store | `object` | 
| [publishing] | `Boolean` | 

<a name="module_layout-state.publishLayout"></a>

### layout-state.publishLayout(store) ⇒ `Promise`
publish layout
note: layouts index is updated server-side, including unscheduling the layout
if it's currently scheduled
also note: this will trigger a fetch of the updated (published) layout state

**Kind**: static method of [`layout-state`](#layout-state)  

| Param | Type |
| --- | --- |
| store | `object` |
## lists

---

## nav

### nav.openNav(store, nameOrConfig)
open nav tab

**Kind**: static method of [`nav`](#nav)  

| Param | Type | Description |
| --- | --- | --- |
| store | `object` |  |
| nameOrConfig | `string`\ `object` | tab name, or clay menu config openNav sets the ui.currentDrawer vuex variable, this allows drawers (the right slide-in menus) as well as the "nav" (the left slide-in menu) to be deep linked to. The openNav/closeNav are functions are depreciated. Should use the openDrawer/closeDrawer/toggleDrawer actions Just leaving these here in case any legacy plugins are still calling these functions |

## page-data

* [page-data](#page-data)
    * _static_
        * [.savePage(store, data, [snapshot])](#page-datasavepagestore-data-snapshot-promise) ⇒ `Promise`
        * [.createPage(store, id)](#page-datacreatepagestore-id-promise) ⇒ `Promise`
        * [.isPublishing(store, isPublishing)](#page-dataispublishingstore-ispublishing)
        * [.publishPage(store, uri)](#page-datapublishpagestore-uri-promise) ⇒ `Promise`
        * [.unpublishPage(store, uri)](#page-dataunpublishpagestore-uri-promise) ⇒ `Promise`
        * [.schedulePage(store, uri, timestamp)](#page-dataschedulepagestore-uri-timestamp-promise) ⇒ `Promise`
        * [.unschedulePage(store, [publishing])](#page-dataunschedulepagestore-publishing-promise) ⇒ `Promise`
    * _inner_
        * [~shouldRender(paths)](#page-data-shouldrenderpaths-boolean) ⇒ `boolean`
        * [~removeURI(uri, store)](#page-data-removeuriuri-store-promise) ⇒ `Promise`

### page-data.savePage(store, data, [snapshot]) ⇒ `Promise`
save a page's data, but do not re-render
because, uh, that would just be reloading the page

**Kind**: static method of [`page-data`](#page-data)  

| Param | Type | Description |
| --- | --- | --- |
| store | `object` |  |
| data | `\*` | to save |
| [snapshot] | `boolean` | false if we're undoing/redoing |

### page-data.createPage(store, id) ⇒ `Promise`
create a new page, then return its editable link

**Kind**: static method of [`page-data`](#page-data)  

| Param | Type |
| --- | --- |
| store | `object` | 
| id | `string` |

### page-data.isPublishing(store, isPublishing)
set currentlyPublishing in state

**Kind**: static method of [`page-data`](#page-data)  

| Param | Type |
| --- | --- |
| store | `object` | 
| isPublishing | `boolean` |

### page-data.publishPage(store, uri) ⇒ `Promise`
manually publish the page

**Kind**: static method of [`page-data`](#page-data)  

| Param | Type |
| --- | --- |
| store | `object` | 
| uri | `string` |

### page-data.unpublishPage(store, uri) ⇒ `Promise`
remove uri from /uris/

**Kind**: static method of [`page-data`](#page-data)  

| Param | Type |
| --- | --- |
| store | `object` | 
| uri | `string` |

### page-data.schedulePage(store, uri, timestamp) ⇒ `Promise`
schedule the page to publish

**Kind**: static method of [`page-data`](#page-data)  

| Param | Type |
| --- | --- |
| store | `object` | 
| uri | `string` | 
| timestamp | `Date` |

### page-data.unschedulePage(store, [publishing]) ⇒ `Promise`
unschedule the page
get updated page state if the call wasn't made during a page publish

**Kind**: static method of [`page-data`](#page-data)  

| Param | Type |
| --- | --- |
| store | `object` | 
| [publishing] | `Boolean` |

### page-data~shouldRender(paths) ⇒ `boolean`
iterate through the paths we're saving
if one of them ISN'T in the internalPageProps, we should re-render

**Kind**: inner method of [`page-data`](#page-data)  

| Param | Type |
| --- | --- |
| paths | `array` |

### page-data~removeURI(uri, store) ⇒ `Promise`
remove uri from /uris/

**Kind**: inner method of [`page-data`](#page-data)  

| Param | Type |
| --- | --- |
| uri | `String` | 
| store | `Object` |

## page-state

* [page-state](#page-state)
    * _static_
        * [.updatePageList(store, [data])](#page-stateupdatepageliststore-data-promise) ⇒ `Promise`
        * [.getListData(store, uri, [prefix])](#page-stategetlistdatastore-uri-prefix-promise) ⇒ `Promise`
    * _inner_
        * [~sequentialUpdate(prefix, uri, data)](#page-state-sequentialupdateprefix-uri-data-promise) ⇒ `Promise`

### page-state.updatePageList(store, [data]) ⇒ `Promise`
update page list with data provided from pubsub
note: if called without data, this just updates the updateTime and user
(e.g. when saving components in the page)
note: if called with a user, it adds the user (with updateTime) to the page (instead of current user)

**Kind**: static method of [`page-state`](#page-state)  

| Param | Type |
| --- | --- |
| store | `object` | 
| [data] | `object` |

### page-state.getListData(store, uri, [prefix]) ⇒ `Promise`
get the list data for a specific page
note: if prefix is specified, this does NOT commit the data (only returns it),
allowing the preloader to use it when doing the initial preload of data

**Kind**: static method of [`page-state`](#page-state)  

| Param | Type | Description |
| --- | --- | --- |
| store | `object` |  |
| uri | `string` |  |
| [prefix] | `string` | passed in when preloading (e.g. if site isn't in store yet) |

### page-state~sequentialUpdate(prefix, uri, data) ⇒ `Promise`
run page list updates sequentially, grabbing from the store after each to prevent race conditions

**Kind**: inner method of [`page-state`](#page-state)  

| Param | Type |
| --- | --- |
| prefix | `string` | 
| uri | `string` | 
| data | `object` |

## preloader

* [preloader](#preloader)
    * [~getComponentModels()](#preloader-getcomponentmodels-object) ⇒ `object`
    * [~getComponentKilnjs()](#preloader-getcomponentkilnjs-object) ⇒ `object`
    * [~reduceComponents(result, val)](#preloader-reducecomponentsresult-val-obj) ⇒ `obj`
    * [~composeLayoutData(layoutSchema, components, original)](#preloader-composelayoutdatalayoutschema-components-original-object) ⇒ `object`
    * [~reduceTemplates(result, val, key)](#preloader-reducetemplatesresult-val-key-obj) ⇒ `obj`
    * [~getPageStatus(state)](#preloader-getpagestatusstate-string) ⇒ `string`
    * [~getSchemas(schemas, kilnjs)](#preloader-getschemasschemas-kilnjs-object) ⇒ `object`

### preloader~getComponentModels() ⇒ `object`
get component models so we can mount them on window.kiln.componentModels
if they aren't already mounted (backwards-compatability)

**Kind**: inner method of [`preloader`](#preloader)

### preloader~getComponentKilnjs() ⇒ `object`
get component kiln files so we can mount them on window.kiln.componentKilnjs

**Kind**: inner method of [`preloader`](#preloader)

### preloader~reduceComponents(result, val) ⇒ `obj`
extract component data from preloadData obj

**Kind**: inner method of [`preloader`](#preloader)  

| Param | Type |
| --- | --- |
| result | `obj` | 
| val | `obj` |

### preloader~composeLayoutData(layoutSchema, components, original) ⇒ `object`
extract layout data from original data

**Kind**: inner method of [`preloader`](#preloader)  

| Param | Type | Description |
| --- | --- | --- |
| layoutSchema | `object` | schema for layout |
| components | `object` | key/value store of components |
| original | `object` | original preloaded data |

### preloader~reduceTemplates(result, val, key) ⇒ `obj`
make precompiled hbs templates ready for user

**Kind**: inner method of [`preloader`](#preloader)  

| Param | Type |
| --- | --- |
| result | `obj` | 
| val | `obj` | 
| key | `string` |

### preloader~getPageStatus(state) ⇒ `string`
get string state to pass to progress bar

**Kind**: inner method of [`preloader`](#preloader)  

| Param | Type |
| --- | --- |
| state | `object` | 

<a name="module_preloader..getSchemas"></a>

### preloader~getSchemas(schemas, kilnjs) ⇒ `object`
run a copy of the schema through its kiln.js file (if it has one)

**Kind**: inner method of [`preloader`](#preloader)  

| Param | Type |
| --- | --- |
| schemas | `object` | 
| kilnjs | `function` |

## toolbar

* [toolbar](#toolbar)
    * [.startProgress(commit, type)](#toolbarstartprogresscommit-type)
    * [.finishProgress(commit, type)](#toolbarfinishprogresscommit-type)
    * [.addAlert(store, config)](#toolbaraddalertstore-config)
    * [.removeAlert(store, config)](#toolbarremovealertstore-config)
    * [.showSnackbar(store, config)](#toolbarshowsnackbarstore-config)

### toolbar.startProgress(commit, type)
start progress bar. if already started, this will cause a slight pause
before continuing the progress bar

**Kind**: static method of [`toolbar`](#toolbar)  

| Param | Type | Description |
| --- | --- | --- |
| commit | `function` |  |
| type | `string` | e.g. 'save' or 'publish' |

### toolbar.finishProgress(commit, type)
finish the progress bar.

**Kind**: static method of [`toolbar`](#toolbar)  

| Param | Type | Description |
| --- | --- | --- |
| commit | `function` |  |
| type | `string` | e.g. 'save' or 'publish' |

### toolbar.addAlert(store, config)
add alert to the array

**Kind**: static method of [`toolbar`](#toolbar)  

| Param | Type | Description |
| --- | --- | --- |
| store | `object` |  |
| config | `string` \ `object` | the text of the alert (for info), or an object with { type, text } |

### toolbar.removeAlert(store, config)
remove an alert from the array, specifying the index

**Kind**: static method of [`toolbar`](#toolbar)  

| Param | Type | Description |
| --- | --- | --- |
| store |`object` |  |
| config | `number` \ `object` | index or an equivalent config object |

### toolbar.showSnackbar(store, config)
trigger a new snackbar. note: this happens imperatively (toolbar handles the actual creation, by watching this value)
note: if you want the snackbar to have an action, pass in both `action` (the text of the button) and `onActionClick` (a reference to the function you want invoked)

**Kind**: static method of [`toolbar`](#toolbar)  

| Param | Type | Description |
| --- | --- | --- |
| store | `object` |  |
| config | `string` \ `object` | message or full config object |

## undo

* [undo](#undo)
    * _static_
        * [.createSnapshot(store)](#undocreatesnapshotstore)
        * [.setFixedPoint(store)](#undosetfixedpointstore)
        * [.undo(store)](#undoundostore)
        * [.redo(store)](#undoredostore)
    * _inner_
        * [~getChangedComponents(current, compare)](#undo-getchangedcomponentscurrent-compare-object) ⇒ `object`
        * [~saveChangedComponents(changedComponents, store)](#undo-savechangedcomponentschangedcomponents-store)

<a name="module_undo.createSnapshot"></a>

### undo.createSnapshot(store)
create snapshot. called from the plugin listening to batched renders

**Kind**: static method of [`undo`](#undo)  

| Param | Type |
| --- | --- |
| store | `object` |

### undo.setFixedPoint(store)
"You're a fixed point in time and space. You're a fact. That's never meant to happen."
when doing a manual save from some point in history, we need to
remove snapshots after that point (to preserve the expected undo functionality)

**Kind**: static method of [`undo`](#undo)  

| Param | Type |
| --- | --- |
| store | `object` |

### undo.undo(store)
undo: sets cursor back one, re-saves affected components with old data

**Kind**: static method of [`undo`](#undo)  

| Param | Type |
| --- | --- |
| store | `object` |

### undo.redo(store)
redo: sets cursor forward one, re-saves affected components with new data

**Kind**: static method of [`undo`](#undo)  

| Param | Type |
| --- | --- |
| store | `object` |

### undo~getChangedComponents(current, compare) ⇒ `object`
get changed components, used by undo and redo

**Kind**: inner method of [`undo`](#undo)  

| Param | Type | Description |
| --- | --- | --- |
| current | `object` |  |
| compare | `object` | (prev/next components object) |

### undo~saveChangedComponents(changedComponents, store)
render multiple components at once

**Kind**: inner method of [`undo`](#undo)  

| Param | Type |
| --- | --- |
| changedComponents | `object` | 
| store | `object` |

## validators

* [validators](#validators)
    * _static_
        * [.runMetaValidator(metadata)](#validatorsrunmetavalidatormetadata-function) ⇒ `function`
        * [.runMetaValidators(uri, errorValidators, warningValidators)](#validatorsrunmetavalidatorsuri-errorvalidators-warningvalidators-promise) ⇒ `Promise`
        * [.runKilnjsValidators(schemas, components)](#validatorsrunkilnjsvalidatorsschemas-components-array) ⇒ `array`
        * [.getSchemasWithValidationRules(schemas)](#validatorsgetschemaswithvalidationrulesschemas-object) ⇒ `object`
        * [.isMetadataError(scope, type)](#validatorsismetadataerrorscope-type-boolean) ⇒ `boolean`
        * [.isMetadataWarning(scope, type)](#validatorsismetadatawarningscope-type-boolean) ⇒ `boolean`
        * [.isGlobalMetadataError(validator)](#validatorsisglobalmetadataerrorvalidator-boolean) ⇒ `boolean`
        * [.isGlobalMetadataWarning(validator)](#validatorsisspecificmetadatawarningvalidator-pageuri-boolean) ⇒ `boolean`
        * [.isSpecificMetadataWarning(validator, pageUri)](#validatorsisspecificmetadatawarningvalidator-pageuri-boolean) ⇒ `boolean`
        * [.isSpecificMetadataError(validator, pageUri)](#validatorsisspecificmetadataerrorvalidator-pageuri-boolean) ⇒ `boolean`
        * [.validate(store)](#validatorsvalidatestore-promise) ⇒ `Promise`
    * _inner_
        * [~isComponentInPageHeadList(uri, state)](#validators-iscomponentinpageheadlisturi-state-boolean) ⇒ `Boolean`
        * [~runValidator(state)](#validators-runvalidatorstate-function) ⇒ `function`
        * [~runValidators(validators, state)](#validators-runvalidatorsvalidators-state-promise) ⇒ `Promise`
        * [~hasItems(error)](#validators-hasitemserror-boolean) ⇒ `Boolean`
        * [~validKilnjsValidator(validators, validationRule)](#validators-validkilnjsvalidatorvalidators-validationrule-boolean) ⇒ `boolean`
        * [~getKilnJsFieldAndValue(validationRule, component)](#validators-getkilnjsfieldandvaluevalidationrule-component-object) ⇒ `object`
        * [~getKilnJsError(validationError, errorItem, errors)](#validators-getkilnjserrorvalidationerror-erroritem-errors-array) ⇒ `array`

### validators.runMetaValidator(metadata) ⇒ `function`
run an metadata validator. if it returns items, add the label and description and items

**Kind**: static method of [`validators`](#validators)  

| Param | Type |
| --- | --- |
| metadata | `object` |

### validators.runMetaValidators(uri, errorValidators, warningValidators) ⇒ `Promise`
run a list of validators using page metadata

**Kind**: static method of [`validators`](#validators)  

| Param | Type | Description |
| --- | --- | --- |
| uri | `uri` | page uri |
| errorValidators | `array` | validators for errors |
| warningValidators | `array` | validators for warnings |

### validators.runKilnjsValidators(schemas, components) ⇒ `array`
Run the kilnjsValidators

**Kind**: static method of [`validators`](#validators)  

| Param | Type |
| --- | --- |
| schemas | `object` | 
| components | `object` |

### validators.getSchemasWithValidationRules(schemas) ⇒ `object`
Get the schemas that have a validation property

**Kind**: static method of [`validators`](#validators)  

| Param | Type |
| --- | --- |
| schemas | `object` |

### validators.isMetadataError(scope, type) ⇒ `boolean`
Check whether is a metadata error

**Kind**: static method of [`validators`](#validators)  

| Param | Type |
| --- | --- |
| scope | `string` | 
| type | `string` |

### validators.isMetadataWarning(scope, type) ⇒ `boolean`
Check whether is a metadata warning

**Kind**: static method of [`validators`](#validators)  

| Param | Type |
| --- | --- |
| scope | `string` | 
| type | `string` |

### validators.isGlobalMetadataError(validator) ⇒ `boolean`
Check whether is a metadata error

**Kind**: static method of [`validators`](#validators)  

| Param | Type |
| --- | --- |
| validator | `object` | 
| validator.scope | `string` | 
| validator.type | `string` | 
| validator.uri | `string` |

### validators.isGlobalMetadataWarning(validator) ⇒ `boolean`
Check whether is a metadata error

**Kind**: static method of [`validators`](#validators)  

| Param | Type |
| --- | --- |
| validator | `object` | 
| validator.scope | `string` | 
| validator.type | `string` | 
| validator.uri | `string` |

### validators.isSpecificMetadataWarning(validator, pageUri) ⇒ `boolean`
Check whether is a metadata warning for specific page

**Kind**: static method of [ `validators`](#validators)  

| Param | Type |
| --- | --- |
| validator | `object` | 
| validator.scope | `string` | 
| validator.type | `string` | 
| validator.uri | `string` | 
| pageUri | `string` |

### validators.isSpecificMetadataError(validator, pageUri) ⇒ `boolean`
Check whether is a metadata error for specific page

**Kind**: static method of [`validators`](#validators)  

| Param | Type |
| --- | --- |
| validator | `object` | 
| validator.scope | `string` | 
| validator.type | `string` | 
| validator.uri | `string` | 
| pageUri | `string` |

### validators.validate(store) ⇒ `Promise`
trigger validation

**Kind**: static method of [`validators`](#validators)  

| Param | Type |
| --- | --- |
| store | `object` |

### validators~isComponentInPageHeadList(uri, state) ⇒ `Boolean`
determine if a component is in a page-specific head list

**Kind**: inner method of [`validators`](#validators)  

| Param | Type |
| --- | --- |
| uri | `string` | 
| state | `object` |

### validators~runValidator(state) ⇒ `function`
run an individual validator. if it returns items, add the label and description

**Kind**: inner method of [`validators`](#validators)  

| Param | Type |
| --- | --- |
| state | `object` |

### validators~runValidators(validators, state) ⇒ `Promise`
run a list of validators

**Kind**: inner method of [`validators`](#validators)  

| Param | Type |
| --- | --- |
| validators | `array` | 
| state | `object` |

### validators~hasItems(error) ⇒ `Boolean`
make sure that all errors have items that can display.
some may have been parsed out by the isActive check in runValidator, above

**Kind**: inner method of [`validators`](#validators)  

| Param | Type |
| --- | --- |
| error | `object` |

### validators~validKilnjsValidator(validators, validationRule) ⇒ `boolean`
Check if the validationRule has the correct properties to run validation with

**Kind**: inner method of [`validators`](#validators)  

| Param | Type |
| --- | --- |
| validators | `object` | 
| validationRule | `object` |

### validators~getKilnJsFieldAndValue(validationRule, component) ⇒ `object`
Get the inputs from a validationRule, either as a string or as an array
the fieldName is the name of the input that will have the focus when the user clicks to that error from the Health Tab
the value is what will be tested by the rule

**Kind**: inner method of [`validators`](#validators)  

| Param | Type |
| --- | --- |
| validationRule | `object` | 
| component | `object` |

### validators~getKilnJsError(validationError, errorItem, errors) ⇒ `array`
Add error to Errors, either as a completely new error, or as an entry in an existing error

**Kind**: inner method of [`validators`](#validators)  

| Param | Type |
| --- | --- |
| validationError | `object` | 
| errorItem | `object` | 
| errors | `array` |

## isPageSpecific(uri, store) ⇒ `boolean`
is uri page spectific

**Kind**: global function  

| Param | Type |
| --- | --- |
| uri | `string` | 
| store | `object` |
