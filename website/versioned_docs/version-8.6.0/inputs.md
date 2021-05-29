---
id: version-8.6.0-inputs
title: Form Inputs
sidebar_label: Form Inputs
original_id: inputs
---

---

# `checkbox-group`

A group of checkboxes, allowing the user to toggle on or off related items. You can specify site-specific options, [similar to components in a component-list](https://github.com/clay/clay-kiln/wiki/Component-Lists#site-specific-components). [Uses Keen's UICheckboxGroup](https://josephuspaye.github.io/Keen-UI/#/ui-checkbox-group).

```yaml
    input: checkbox-group
    options:
      - foo (site1)
      - bar (not: site1)
      - baz (site1, site2)
```

### Checkbox Group Arguments

* **options** - an array of strings or objects (with `name`, `value`, and optionally `sites`)
* **help** - description / helper text for the field
* **validate.required** - either `true` or an object that described the conditions that should make this field required
* **validate.requiredMessage** - will appear when required validation fails

If you specify options as strings, the label for each will simply be the option converted to Start Case. If this behavior is run on a site with no available options, an error message will appear. Please use `_reveal` on the field to conditionally hide/show based on site.

```yaml
field1:
  _has:
    input: checkbox-group
    options:
      - foo
      -
        name: Bar
        value: bar
      -
        name: Baz Qux
        value: baz-qux
        sites: site1, site2
```

### Checkbox Group Data Format

Checkbox group formats its value as an **object**, where each option is a key with a `true` / `false` value. For example, the data for the options above (`foo`, `bar`, `baz-qux`) might look like:

```js
{
  foo: true,
  bar: false,
  'baz-qux': true
}
```

---

# `checkbox`

A single checkbox, allowing the user to toggle something on or off. [Uses Keen's UICheckbox](https://josephuspaye.github.io/Keen-UI/#/ui-checkbox).

In practice, it's usually best to use a conversational tone/question as the checkbox label, e.g.

```yaml
field1:
  _label: Should we use a special logo in this component?
  _has: checkbox
```

### Checkbox Arguments

* **help** - description / helper text for the field

>Single checkboxes don't have validation.

### Checkbox Data Format

Checkbox data is a **boolean**, `true` or `false`.

---

# `codemirror`

A syntax-highlighted text area. Useful for writing css, sass, yaml, or other code in the editor.

### Codemirror Arguments

* **mode** _(required)_ the language used
* **help** - description / helper text for the field
* **attachedButton** - an icon button that should be attached to the field, to allow additional functionality
* **validate.required** - either `true` or an object that described the conditions that should make this field required
* **validate.requiredMessage** - will appear when required validation fails

The mode of the editor sets syntax highlighting, linting, and other functionality. Currently, we support these modes:

* `text/css` - css mode
* `text/x-scss` - sass/scss mode (useful for per-instance styles)
* `text/x-yaml` - yaml mode (useful for writing elasticsearch queries)

>We will add more supported modes as we find use cases for them. See [the full list of modes supported in codemirror.](http://codemirror.net/mode/)

### Codemirror Data Format

Codemirror inputs, no matter what mode you select, will return a **string** of plaintext.

---

# `complex-list`

An array of objects with arbitrary properties. Each property may have any inputs a field is allowed to have, including custom inputs. Complex-list is similar to [Angular's _transcluded directives_](https://nulogy.com/who-we-are/company-blog/articles/transclusion-in-angular/) or [Advanced Custom Fields' _repeater field_](https://www.advancedcustomfields.com/add-ons/repeater-field/), in that each item in the list is treated as a separate field. Like fields, items must also have `_label`, but may not have `_placeholder`.

### Complex List Arguments

* **props** an array of objects, representing the fields in each item. Each item should have a name, defined by `prop: 'name'`, as well as `_label` and the input that item uses.
* **collapse** a property that should be used as the title for items. If `collapse` is set, all but the current item will be collapsed, only displaying its title. This is useful for lists with lots of complicated items.
* **filter** boolean determining if the items may be filtered. If `true`, will add a search box at the top of the list.
* **enforceMaxlength** - boolean preventing the user from adding items when the list is at max length (`from validate.max`)

### Complex List Usage

* When a complex-list is empty, it will display a `add` button to add the initial item
* Items can be added by clicking the `add` button
* When a complex-list is _not_ empty, the focused item will have actions it, with `add` and `remove` buttons
* Items can be removed by clicking the `remove` button
* Items can be reordered by clicking the up and down carets next to their location
* If complex-list is filterable, typing in the search box will match all text inputs in the list items

```yaml
links:
  _has:
    input: complex-list
    collapse: title
    filter: true
    props:
      -
        prop: url
        _label: URL
        _has:
          input: text
          type: url
      -
        prop: title
        _label: Title
        _has: text
```

>Complex lists don't have any of the common shared arguments and don't display a field label.

### Complex List Data Format

Complex lists will always return an **array of objects**, where each object has the properties defined as `props` in the Schema.

---

# `csv`

A button that allows uploading CSV data. Note: the data isn't editable once it's uploaded, but should be re-uploaded from a CSV file when it needs to be changed.

### CSV Arguments

* **delimiter** - alternate delimiter (defaults to comma, of course)
* **quote** - alternate quote to use (defaults to one double-quote)
* **help** - description / helper text for the field

Note: Certain spreadsheet editors like Google Spreadsheets will use triple-quotes if you use both quotes and commas in your cells. Make sure you account for that by changing the `quote` argument:

```yaml
_has:
  input: csv
  quote: '"""'
```

>CSV buttons don't have validation or attached buttons.

### CSV Data Format

CSV inputs will format data as an **array of objects*, where each object corresponds to a row and each object's keys are derived from the CSV's column headers.

---

# `datepicker`

A material design calendar picker. Allows specifying minimum and maximum dates. [Uses Keen's UIDatepicker](https://josephuspaye.github.io/Keen-UI/#/ui-datepicker).

### Datepicker Arguments

* **help** - description / helper text for the field
* **attachedButton** - an icon button that should be attached to the field, to allow additional functionality
* **validate.required** - either `true` or an object that described the conditions that should make this field required
* **validate.min** - minimum date, specified in YYYY-MM-DD
* **validate.max** - maximum date, specified in YYYY-MM-DD
* **validate.requiredMessage** - will appear when required validation fails
* **validate.minMessage** - will appear when minimum validation fails
* **validate.maxMessage** - will appear when maximum validation fails

### Datepicker Data Format

Datepicker returns a **string** with the date in `YYYY-MM-DD` format.

---

# `wysiwyg`

A multi-line text input which allows a rich editing experience. Uses [Quill](http://quilljs.com/). Inline inputs (which can only be wysiwyg) have the same arguments as normal wysiwyg, but will inherit styles from their parent component.

### WYSIWYG Arguments

* **buttons** - array of button names (strings) or groups (arrays) for text styling, passed directly into Quill (defaults to "remove formatting")
* **type** - `single-line`, `multi-line`, or `multi-component`. (defaults to `single-line`)
* **pseudoBullet** - boolean to enable <kbd>tab</kbd> to create pseudo bullet points
* **paste** - array of paste rules for parsing pasted content and creating new components
* **help** - description / helper text for the field
* **attachedButton** - an icon button that should be attached to the field, to allow additional functionality
* **validate.required** - either `true` or an object that described the conditions that should make this field required
* **validate.min** - minimum length that the field must meet
* **validate.max** - maximum length that the field must not exceed
* **validate.pattern** - regex pattern
* **validate.requiredMessage** - will appear when required validation fails
* **validate.minMessage** - will appear when minimum validation fails
* **validate.maxMessage** - will appear when maximum validation fails
* **validate.patternMessage** - will appear when pattern validation fails (very handy to set, as the default message is vague)

The buttons allowed in our wysiwyg behavior are [defined in Quill's documentation](http://quilljs.com/docs/modules/toolbar/)

The default `type` -- `single-line` -- allows entering one line of rich text but prevents users from creating new paragraphs or applying paste rules.

`multi-line` is used for components like blockquotes or lists and allows paste rules to create new block-level elements in the same component's field (but not create different components).

`multi-component` (which is usually used when the input is `inline`, but may be used in normal `wysiwyg` inputs) enables more affordances, including:

* keyboard navigation across components (up and down arrows)
* <kbd>enter</kbd> creating new components (and splitting text in front of the cursor into them)
* <kbd>delete</kbd> removing components (and merging text in front of the cursor into the previous component)
* full paste rule affordances, including creating different components

**Paste** is an optional array of pasting rules that are used for parsing and creating different components. This is useful for transforming pasted links into embeds, catching pasted blockquotes, etc. Rules have these properties:

* `match` - regex to match the pasted content. all rules will be wrapped in `^` and `$` (so they don't match urls _inside_ links in the content)
* `matchLink` - boolean to determine whether _links_ containing the regex should also match. Should be true for embeds, false for components that could potentially contain links inside them.
* `component` - the name of the component that should be created
* `field` - the name of the field that the captured data should be populated on the new component. the (last) new component will focus this field after it's added (note: this is limited to a single regex capture group)
* `group` - (optional) the group that should be focused when the (last) new component is added (instead of the specific field). this is useful for components with forms that contain both the specified field and other things and preserves the same editing experience as editing that component normally

```
paste:
  - match: (https?://twitter\.com/\w+?/status/\d+)
    matchLink: true
    component: clay-tweet
    field: url
  - match: (https?://www\.facebook\.com/.+?/posts/\d+)
    matchLink: true
    component: clay-facebook-post
    field: url
    group: inlineForm
  - match: <blockquote>(.*?)(?:</blockquote>)?
    component: blockquote
    field: text
  - match: (.*)
    component: clay-paragraph
    field: text
```

### WISYWIG Data Format

WYSIWYG returns a **string** of HTML.

---

# `inline`

A multi-line text input which allows a rich editing experience, but appears inline rather than in a form. It will inherit styles from the component you're editing, rather than looking like a Kiln text input. [It supports exactly the same arguments and returns the same format as `wysiwyg`.](inputs.md#wysiwyg)

---

# `lock`

Appends a lock button to an input. The input will be locked until the user clicks the lock button. This provides a small amount of friction before editing important (and rarely-edited) fields, similar to macOS's system preferences.

---

# `magic-button`

Append a magic button to an input.

### Magic Button Arguments

* **field** - a field to grab the value from (in the current complex list, form, or component)
* **component** - a name of a component to grab the component ref/uri from
* **transform** - a transform to apply to the grabbed value
* **transformArg** - an argument to pass through to the transform
* **store** - to grab data from the client-side store
* **url** - to get data from
* **property** - to get from the returned data
* **moreMagic** - to run the returned value through more transforms, api calls, etc
* **tooltip** - text that will display in a tooltip. used to explain what each button is doing, so make it concise!

### Magic Button Usage

☆.。.:*・°☆.。.:*・°☆.。.:*・°☆.。.:*・°☆

Magic buttons are extremely powerful but can be a little confusing to configure. This is what they generally look like:

1. specify a `field` or `component`. The button will grab the value or ref, respectively. If you specify either as an array, it will look for the first field/component, then fall back to the next ones specified in the array if necessary (if the field is empty, or the component isn't on the page)
2. specify a `transform`. Transforms are useful when doing api calls with that data. You may add custom transformers (or overwrite built-in ones) via `window.kiln.transformers`
2. specify a `transformArg` if you need to send more information to the transform.
3. specify a `store` path or `url` if you need to grab data from somewhere. The request will be prefixed with the `store`/`url` string you pass in.
4. specify a `property` to grab from the result of that api call. You can use `_.get()` syntax, e.g. `foo.bar[0].baz`. If you specify as an array, it will grab the first property in the array that's not empty in the component above.
5. add `moreMagic` if you need to do anything else to the returned data

**All of these arguments are optional!**

#### Here are some examples:

_Note: MediaPlay is the name of our image server._

##### (ﾉ◕ヮ◕)ﾉ*:・ﾟ✧ "just grab the primary headline"

```yaml
field: primaryHeadline
tooltip: Use Primary Headline
```

##### (ﾉ◕ヮ◕)ﾉ*:・ﾟ✧ "grab a caption from mediaplay"

```yaml
field: url
transform: mediaplayUrl (to change the image url into a string we can query mediaplay's api with)
url: [mediaplay api url]
property: metadata.caption
tooltip: Fetch caption from Mediaplay
```

##### (ﾉ◕ヮ◕)ﾉ*:・ﾟ✧ "grab the url of the first mediaplay-image on this page"

```yaml
component: mediaplay-image
store: components
property: url
tooltip: Fetch First Image
```

##### (ﾉ◕ヮ◕)ﾉ*:・ﾟ✧ "grab a list of items keyed by some component uri"

```yaml
component: mediaplay-image
transform: getComponentInstance (this transforms the full component uri into a ref we can pop onto the end of our site prefix)
url: $SITE_PREFIX/_lists/images (this is a ~ special token ~ that evaluates to the prefix of the current site, so you can do api calls against your own clay instance)
tooltip: Fetch Images
```

##### (ﾉ◕ヮ◕)ﾉ*:・ﾟ✧ "grab the image url from a lede component, then ask mediaplay for the caption"

```yaml
component: feature-lede
store: components
property: imgUrl
moreMagic:
  -
    transform: mediaplayUrl (to change the image url into a string we can query mediaplay's api with)
    url: [mediaplay api url]
    property: metadata.caption
tooltip: Fetch Caption For Lede Image
```

##### (ﾉ◕ヮ◕)ﾉ*:・ﾟ✧ "grab the tv show name and use it to automatically format an image url"

```yaml
field: showName
transform: formatUrl
transformArg: [base image url]/recaps-$DATAFIELD.png ($DATAFIELD is the placeholder in our formatUrl transform)
tooltip: Fetch TV Show Image
```
##### (ﾉ◕ヮ◕)ﾉ*:・ﾟ✧ "grab an image url from either a mediaplay-image (url) or lede-gallery (ledeImageUrl) (whichever is higher on the page)"

```yaml
component:
  - mediaplay-image
  - lede-gallery
store: components
property:
  - url
  - ledeImageUrl
tooltip: Fetch First Image
```

Options may also contain a `_reveal` property containing rules for when it should display.
[The config is the same as the field-level `_reveal` property.](editing-components.md#reveal)

☆.。.:*・°☆.。.:*・°☆.。.:*・°☆.。.:*・°☆

---

# `radio`

A group of radio buttons, allowing the user to select one of a few related options. You can specify site-specific options, [similar to components in a component-list](https://github.com/clay/clay-kiln/wiki/Component-Lists#site-specific-components). [Uses Keen's UIRadioGroup](https://josephuspaye.github.io/Keen-UI/#/ui-radio-group).

```yaml
    input: radio
    options:
      - foo (site1)
      - bar (not: site1)
      - baz (site1, site2)
```

### Radio Arguments

* **options** - an array of strings or objects (with `name`, `value`, and optionally `sites`)
* **help** - description / helper text for the field
* **validate.required** - either `true` or an object that described the conditions that should make this field required
* **validate.requiredMessage** - will appear when required validation fails

If you specify options as strings, the label for each will simply be the option converted to Start Case. If this behavior is run on a site with no available options, an error message will appear. Please use `_reveal` on the field to conditionally hide/show it based on site.

```yaml
field1:
  _has:
    input: radio
    options:
      - foo
      -
        name: Bar
        value: bar
      -
        name: Baz Qux
        value: baz-qux
        sites: site1, site2
```

### Radio Data Format

Radio will return a **string** with the `value` of the selected `option`.

---

# `range`

A slider that allows selecting between a range of numerical values. May use two points (known as a _dual-point range_). Uses [noUISlider](https://refreshless.com/nouislider/) under the hood, styled based on [KeenUI's slider](https://josephuspaye.github.io/Keen-UI/#/ui-slider).

```yaml
    input: range
    min: 0
    max: 10
```

### Range Arguments

* **start** - default value, or an array of _two_ values (for dual-point ranges)
* **min** - hardcoded minimum value selectable in the range, defaults to `0`
* **max** - hardcoded maximum value selectable in the range, defaults to `10`
* **minLabel** - label that will be displayed on the left side of the range, defaults to the `min` value
* **maxLabel** - label that will be displayed on the right side of the range, defaults to the `max` value
* **step** - define step increments, defaults to `1`,
* **tooltips** - boolean that determines whether value tooltips will display above the points, defaults to `true`
* **help** - description / helper text for the field
* **validate.min** - minimum value allowed
* **validate.max** - maximum value allowed
* **validate.minMessage** - will appear when minimum validation fails
* **validate.maxMessage** - will appear when maximum validation fails

Note that you should use `min`/`max` to set the hardcoded limits for the range input and `validate.min`/`validate.max` to set a (more limited) _publishable_ range, if necessary.

### Range Returned Value

If you specify the `start` as a single (numerical) value, Range will return a single **number**. If you specify the `start` as an array of two (numerical) values, Range will return an **array of numbers** with two values.
Note that the `start` value and the data of this input's value **must** be of the same type. This input will error if `start` is an array and the value passed from the component data is a number or vice versa.

---

# `segmented-button`

A group of buttons allowing the user to select one (or more!) of a few related options.

### Segmented Button Arguments

* **multiple** - allow multiple things to be selected. `false` by default
* **options** - an array of options
* **help** - description / helper text for the field
* **validate.required** - either `true` or an object that described the conditions that should make this field required
* **validate.requiredMessage** - will appear when required validation fails

Each option should be an object with `icon`, `text`, and `value` properties. Icons will be displayed in the buttons, and text will be used for tooltips.

### Segmented Button Data Formats

By default (when `multiple` is false or unset), this will return data as a **string** with the value of the selected option. If `multiple` is `true`, this will return an **object** where each option is a key with a `true` / `false` value. Note that the single-select mode is the same format as a `radio` input, and the multi-select mode is the same as a `checkbox-group`.

---

# `segmented-button-group`

A group of segmented buttons allowing the user to select one (or more!) of a few related options.

### Segmented Button Group Arguments

* **multiple** - allow multiple things to be selected. `false` by default
* **options** _(required)_ an array of options
* **help** - description / helper text for the field
* **validate.required** - either `true` or an object that described the conditions that should make this field required
* **validate.requiredMessage** - will appear when required validation fails

Each option should be an object with `title` and `values` properties. The `values` should be an array of objects with `icon`, `text`, and `value` properties, which will be passed into each `segmented-button`.

Options may also contain a `_reveal` property containing rules for when they should display. [The config is the same as the field-level `_reveal` property.](editing-components.md#reveal)

### Segmented Button Group Data Formats

By default (when `multiple` is false or unset), this will return data as a **string** with the value of the selected option. If `multiple` is `true`, this will return an **object** where each option is a key with a `true` / `false` value. Note that the single-select mode is the same format as a `radio` input, and the multi-select mode is the same as a `checkbox-group`.

---

# `select`

An enhanced browser `<select>` element, allowing the user to select one (or more!) of a few related options. [Uses Keen's UISelect](https://josephuspaye.github.io/Keen-UI/#/ui-select).

### Select Arguments

* **multiple** - allow multiple options to be selected. data will be an object with options as keys, similar to checkbox-group
* **search** - allow users to type stuff in to filter options. Extremely useful for longer options lists
* **list** - The key `list` is where the value is the name of a list that Amphora knows about accessible via `/<site>/_lists/<listName>`.
* **options** - an array of strings or objects (with `name`, `value`, and optionally `sites`)
* **keys** passthrough option for Keen to specify keys for input objects, especially for use when you don't control the input shape, e.g. lists. Defaults to `{label: 'name', value: 'value'}`
* **storeRawData** normally only the `value` of each option is stored, but with this option, you can store the entire input object. note that this only works when `multiple` is false
* **help** - description / helper text for the field
* **attachedButton** - an icon button that should be attached to the field, to allow additional functionality
* **validate.required** - either `true` or an object that described the conditions that should make this field required
* **validate.requiredMessage** - will appear when required validation fails

If you specify options as strings, the label for each will simply be the option converted to Start Case. If this behavior is run on a site with no available options, an error message will appear. Please use `_reveal` on the field to conditionally hide/show it based on site.

```yaml
field1:
  _has:
    input: select
    options:
      - foo
      -
        name: Bar
        value: bar
      -
        name: Baz Qux
        value: baz-qux
        sites: site1, site2
```

>#### Usage Notes
>* you may have a value for a 'None' option. this is useful for components that have defaults that you want to be able to revert to after selecting an option
>* your "default" value may use the label 'None' _or_ 'Default'
>* if a 'None' option is not specified, it is generated and you don't need to specify an empty option in the schema
>* you can specify site-specific options, [similar to components in a component-list](https://github.com/clay/clay-kiln/wiki/Component-Lists#site-specific-components)
```yaml
fn: select
options:
  - foo (site1)
  - bar (not: site1)
  - baz (site1, site2)
  # ...

specialFeature:
  fn: select
  options:
    - name: None
      value: General
    - name: Interview
      value: interview
    - name: Slideshow
      value: slideshow
    - name: Live Blog
      value: live-blog
```

### Select Data Formats

By default (when `multiple` is false or unset), this will return data as a **string** with the value of the selected option. If `multiple` is `true`, this will return an **object** where each option is a key with a `true` / `false` value. Note that the single-select mode is the same format as a `radio` input, and the multi-select mode is the same as a `checkbox-group`.

---

# `simple-list`

An array of strings (or objects with a `text` property, if you add the `propertyName` argument). Useful for lists of items such as tags, keywords, or author names.

### Simple List Arguments

* **propertyName** - appends double-click functionality to items in the list. The data will be an array of objects with `text` properties, as well as the value of this argument. e.g. `propertyName: bar` will make the data look like `[{ text: 'foo', bar: 'baz' }]`
* **badge** - name of the icon (or a two-character string) that should be displayed in the simple list item when editing. Icon names can be anything from the [Material Design Icon Set](https://material.io/icons/), or you can use two initials
* **allowRepeatedItems** - allow the same item more than once. defaults to false
* **ignoreComma** - do not listen for comma key input to deliminated list items. defaults to false
* **autocomplete** - object with autocomplete options. The key `list`  is where the value is the name of a list that Amphora knows about accessible via `/<site>/_lists/<listName>`. The key `allowRemove` enables an X in the `autocomplete` that allows the user to remove that item from the autocomplete list. If the key `allowCreate` is set to true, Kiln will add the item to the list via the store.
* **help** - description / helper text for the field
* **attachedButton** - an icon button that should be attached to the field, to allow additional functionality
* **validate.required** - either `true` or an object that described the conditions that should make this field required
* **validate.max** - maximum number of items that the field must not exceed
* **validate.requiredMessage** - will appear when required validation fails
* **validate.maxMessage** - will appear when maximum validation fails

```yaml
  -
    fn: simple-list
    autocomplete:
      list: authors
```

### Simple List Usage

* Type something and press <kbd>enter</kbd>, <kbd>tab</kbd>, or <kbd>,</kbd> (comma) to add it as an item
* Delete items by clicking the `x` button or selecting them and pressing <kbd>backspace</kbd>
* Select items using <kbd>→</kbd> / <kbd>←</kbd> or <kbd>tab</kbd> and <kbd>shift + tab</kbd>. You may select the last item in the list from the text input
* Pressing <kbd>backspace</kbd> in an empty text input will select the last item in the list
* If `propertyName` is defined, you can double-click items to set the "primary" item. This will add a badge to the primary item. Only one item may be "primary" at a time
* Double-clikcing the "primary" item will unset it as the "primary" item

```yaml
tags:
  _label: Tags
  _has:
    input: simple-list
    propertyName: featureRubric
    badge: FR # or, say, `star` if you want to use a material design icon
    autocomplete:
      list: tags
```

### Simple List Data Format

Simple List will format data as an **array of objects**, where each object has a `text` property. If the `propertyName` argument is set, each object will also have a property (denoted by the value of the `propertyName` argument) that will be a **boolean**. Only one of the objects (the "primary item") will have this custom property set to `true`.

---

# `static`

A static, non-editable bit of text. Useful for displaying data in a list when only overrides are editable

```yaml
title:
  _label: Title from Service
  _has: static
titleOverride:
  _label: Title Override
  _has: text
```

### Static Arguments

* **help** - description / helper text for the field
* **text** - optional interpolated string to use rather than simply printing the value of the property

```yaml
title:
  _label: Title from Service
  _has:
    input: static
    text: ${title} (generated)
    help: Non-editable title
```

>Static inputs don't have validation.

---

# `text`

A basic text input. Can be a single line or multi-line. Uses the float label pattern. [Uses Keen's UITextbox](https://josephuspaye.github.io/Keen-UI/#/ui-textbox).

### Text Arguments

* **type** - input type, which can match any native `<input type="">` or can be set to `multi-line` for a multi-line text area
* **rows** - number of lines the textarea should have. to be used with `multi-line`
* **step** - define step increments (for numberical inputs only)
* **enforceMaxlength** - prevent user from typing more characters than the maximum allowed (`from validate.max`)
* **help** - description / helper text for the field
* **attachedButton** - an icon button that should be attached to the field, to allow additional functionality
* **validate.required** - either `true` or an object that described the conditions that should make this field required
* **validate.min** - minimum number (for `type=numer`) or length (for other types) that the field must meet
* **validate.max** - maximum number (for `type=number`) or length (for other types) that the field must not exceed
* **validate.pattern** - regex pattern
* **validate.requiredMessage** - will appear when required validation fails
* **validate.minMessage** - will appear when minimum validation fails
* **validate.maxMessage** - will appear when maximum validation fails
* **validate.patternMessage** - will appear when pattern validation fails (very handy to set, as the default message is vague)

### Text Data Formats

Most text inputs format data as a **string** of plaintext. If `type` is set to `number`, data will be a **number**.

---

# `timepicker`

A basic time picker. Uses native time inputs when available, but falls back to relatively-simple natural language parsing.

### Timepicker Arguments

* **help** - description / helper text for the field
* **attachedButton** - an icon button that should be attached to the field, to allow additional functionality
* **validate.required** - either `true` or an object that described the conditions that should make this field required
* **validate.requiredMessage** - will appear when required validation fails

>#### Natural Language Parsing
>
>On browsers without native time pickers, users may enter in the time without worrying about the format. The simple NLP engine can handle things like "10am", "4:15 PM", "13:00", and even "midnight".

### Timepicker Data Format

Timepicker returns a **string** with the time in `h:mm A` format.
