---
id: manipulating-components
title: Adding, Removing, and Reordering Components
sidebar_label: Adding, Removing, and Reordering Components
---

---

![add component](/clay-kiln/img/add_component.png)

---
## Component Lists

Components are added, removed, and reordered in fields called _component lists_, of which there are **four types**.

### Basic Lists

Components that contain child component lists need to do two things: Render an _editable_ list in their template and specify a _config_ in their `schema.yml`.

```handlebars
<div data-editable="myList">{{> component-list myList }}</div>
```

> You'll notice that `data-editable` is the same attribute used to specify editable fields. The `component-list` handlebars partial comes from [our included library of helpers and partials](https://github.com/clay/handlebars#partials) and renders a list of components with their data. The element with `data-editable` must be the _immediate parent_ of the components in the list.

```yaml
myList:
  _componentList:
    include:
      - some-component
      - some-other-component
```

This would create a basic list with drag & drop functionality. When selecting components inside this list, you'd see _Remove_ and _Add Component_ buttons that would allow you to remove those components or add new instances of `some-component` and `some-other-component`. When adding components to a list, a component's default data is cloned into a new instance.

#### Placeholders

Basic lists also allow placeholders, which will display (and prompt users to add components) when the list is empty.

```yaml
myList:
  _placeholder:
    height: 600px
  _componentList:
    include:
      - some-component
      - some-other-component
```

![list placeholder](/clay-kiln/img/list_placeholder.png)

#### Collapsible Lists

In edit mode, basic component lists may be expanded and collapsed. This feature only affects edit mode, so it's useful for removing visual clutter in component lists that aren't displayed in view mode. Note that this is different than _invisible_ component lists, which are editable through the "Find on Page" / "Find on Layout" drawer.

```yaml
myList:
  _placeholder:
      text: Article Content
  _componentList:
    include:
      - tweet
    collapse: true
```

![list open](/clay-kiln/img/list_open.png)

Collapsible lists will _always_ display their placeholder, as well as an expand/collapse toggle.

![list collapsed](/clay-kiln/img/list_collapsed.png)

When collapsible lists are empty, they'll display the same "Add Component" button as other component lists.

![list empty](/clay-kiln/img/list_empty.png)

#### Validation

Similarly to [editable fields](editing-components.md#standard-input-arguments), component lists may contain validation for `min` and `max` lengths.

```yaml
myList:
  _componentList:
    include:
      - some-component
      - some-other-component
    validate:
      min: 1
      max: 10
```

Similarly to text inputs, component lists may also prevent users from adding components over the maximum with `enforceMaxlength`.

```yaml
myList:
  _componentList:
    include:
      - some-component
      - some-other-component
    validate:
      max: 10
    enforceMaxlength: true
```

### Head Lists

Components in the `<head>` of the page require a different syntax. Much like how you denote the start of `<head>` components with a `<!-- data-editable -->` comment, you use html comments for the beginning _and the end_ of these component lists.

```handlebars
<!-- data-editable="myList" -->
{{> component-list myList }}
<!-- data-editable-end -->
```

The `schema.yml` config of a head list is the same as a basic list.

```yaml
myList:
  _componentList:
    include:
      - some-component
      - some-other-component
```

Head component lists get added as tabs to the _Find on Page_ drawer in Kiln automatically, allowing them to be edited.

![head list](/clay-kiln/img/head_list.png)

### Invisible Lists

It's useful to have a component list for various components that might not have public-facing visual elements, such as tracking scripts, affiliate marketing scripts, pixels, or lightboxes. If these components must live in the `<body>` (rather than the `<head>`), you may add a property to the component list to make them appear as tabs in the _Find on Page_ drawer, allowing them to be edited.

```handlebars
<div data-editable="myList">{{> component-list myList }}</div>
```

```yaml
myList:
  _componentList:
    invisible: true
    include:
      - some-component
      - some-other-component
```

### Page Areas

Page areas are a special type of component list that only exists in layouts. By adding a property to the layout's `schema.yml`, you can specify that certain component lists exist in the page's data (and thus are specific to that page) rather than the layout's data (thus being shared amongst all pages with that layout).

```handlebars
<div data-editable="myList">{{> component-list myList }}</div>
```

```yaml
myList:
  _componentList:
    page: true
    include:
      - some-component
      - some-other-component
```

The data for component lists inside components (including layouts) looks like an array of objects:

```json
{
  "myList": [{
    "_ref": "domain.com/_components/some-component/instances/some-instance"
  }, {
    "_ref": "domain.com/_components/some-other-component/instances/some-instance"
  }]
}
```

Meanwhile, the data for component lists inside page data looks like an array of strings:

```json
{
  "myList": [
    "domain.com/_components/some-component/instances/some-instance",
    "domain.com/_components/some-other-component/instances/some-instance"
  ]
}
```

Page areas may also have placeholders.

---

## Site-Specific Components

All types of component lists allow whitelisting of components using the `include` property in the config. You may also specify that components in a list should be included or excluded on a specific site. To do so, add a comma-separated list of sites in parenthesis after the name of the component in the include list:

```yaml
content:
  _componentList:
    include:
      - blockquote (site1, site2) # allow on site1 and site2 ONLY
      - paragraph # allow on all sites
      - image (not:site1) # allow on all sites EXCEPT site1
      - link (site1, site2, site3, not:site2, not:site3) # only allow on site1
      # if (for some reason) you both include and exclude a site, it'll filter by the
      # included sites first, then filter out the excluded.
```

---

## Fuzzy Lists

Additionally, all types of component lists may be set to _fuzzy_. The default `include` list is appropriate for most situations, but there are certain scenarios where you might want to be less strict. For example, the body of an article might be restricted to paragraphs and images 99% of the time, but you still want to allow your interactive team to create one-off components and add them through Kiln's UI.

You may make any component list _fuzzy_ by adding that property in the config. This will add a _View All Components_ button into the header of the Add Components modal, which will list _all components available in your Clay installation_.

![fuzzy list](/clay-kiln/img/fuzzy_list.png)

---

## Component Properties

In addition to component lists, you can use _component properties_ if you want a single child component instead of an array of children.

```yaml
tags:
  _component:
    include:
      - normal-tags
      - fancy-tags
```

This allows you to swap out different components in a specific place, for example, if you have two different tagging components with different styles and functionality. As with component lists, you may include a `_placeholder`. If your component property is editable, the child component's selector will allow you to remove it (and the placeholder that displays will allow you to add it).

> Component properties are not allowed in the layout or page data, only in normal components. Because of this, they are also not allowed in the `<head>` of the page.
