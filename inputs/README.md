
# wysiwyg

A multi-line text input which allows a rich editing experience. Uses [Quill](http://quilljs.com/). Inline inputs (which can only be wysiwyg) have the same arguments as normal wysiwyg, but will inherit styles from their parent component.

## Arguments

* **buttons** - array of button names (strings) or groups (arrays) for text styling, passed directly into Quill (defaults to "remove formatting")
* **type** - `single-line`, `multi-line`, or `multi-component`. (defaults to `single-line`)
* **pseudoBullet** - boolean to enable <kbd>tab</kbd> to create pseudo bullet points
* **paste** - array of paste rules for parsing pasted content and creating new components

The buttons allowed in our wysiwyg behavior are [defined in Quill's documentation](http://quilljs.com/docs/modules/toolbar/)

By default, wysiwyg fields will use the styles of the containing component. To use our kiln input styling, set `styled` to `true`.

The default `type` -- `single-line` -- allows entering one line of rich text, but prevents users from creating new paragraphs or applying paste rules.

`multi-line` is used for components like blockquotes or lists, and allows paste rules to create new block-level elements in the same component's field (but not create different components).

`multi-component` enables more affordances, including:

* keyboard navigation across components (up and down arrows)
* <kbd>enter</kbd> creating new components (and splitting text in front of the cursor into them)
* <kbd>delete</kbd> removing components (and merging text in front of the cursor into the previous component)
* full paste rule affordances, including creating different components

**Paste** is an optional array of pasting rules that's used for parsing and creating different components. This is useful for transforming pasted links into embeds, catching pasted blockquotes, etc. Rules have these properties:

* `match` - regex to match the pasted content. all rules will be wrapped in `^` and `$` (so they don't match urls _inside_ links in the content)
* `matchLink` - boolean to determine whether _links_ containing the regex should also match. Should be true for embeds, false for components that could potentially contain links inside them.
* `component` - the name of the component that should be created
* `field` - the name of the field that the captured data should be populated to on the new component. the (last) new component will focus this field after it's added (note: this is limited to a single regex capture group)
* `group` - (optional) the group that should be focused when the (last) new component is added (instead of the specific field). this is useful for components with forms that contain both the specified field and other things, and preserves the same editing experience as editing that component normally

## Example

```
text:
  _placeholder:
    height: 50px
    text: New Paragraph
    required: true
  _has:
    input: inline
    type: 'multi-component'
    pseudoBullet: true
    buttons:
      - bold
      - italic
      - strike
      - link
      -
        script: sub
    paste:
      -
        match: (https?://twitter\.com/\w+?/status/\d+)
        matchLink: true
        component: clay-tweet
        field: url
      -
        match: (https?://www\.facebook\.com/.+?/posts/\d+)
        matchLink: true
        component: clay-facebook-post
        field: url
        group: inlineForm
      -
        match: <blockquote>(.*?)(?:</blockquote>)?
        component: blockquote
        field: text
      -
        match: (.*)
        component: clay-paragraph
        field: text
```

### Shared Arguments

This input shares certain arguments with other inputs:

* **help** - description / helper text for the field
* **attachedButton** - an icon button that should be attached to the field, to allow additional functionality
* **validate** - an object that contains pre-publish validation rules:

* **validate.required** - either `true` or an object that described the conditions that should make this field required
* **validate.min** - minimum number (for `type=numer`) or length (for other types) that the field must meet
* **validate.max** - maximum number (for `type=number`) or length (for other types) that the field must not exceed
* **validate.pattern** - regex pattern

Validation rules may also have custom error messages, that will appear in the same place as the help text. If you do not specify a message, default error messages will appear.

* **validate.requiredMessage** - will appear when required validation fails
* **validate.minMessage** - will appear when minimum validation fails
* **validate.maxMessage** - will appear when maximum validation fails
* **validate.patternMessage** - will appear when pattern validation fails (very handy to set, as the default message is vague)

### Conditional Required Arguments

* **field** to compare against (inside complex-list item, current form, or current component)
* **operator** _(optional)_ to use for the comparison
* **value** _(optional)_ to compare the field against

If neither `operator` nor `value` are specified, this will make the current field required if the compared field has any data (i.e. if it's not empty). If only the value is specified, it'll default to strict equality.

Operators:

* `===`
* `!==`
* `<`
* `>`
* `<=`
* `>=`
* `typeof`
* `regex`
* `empty` (only checks field data, no value needed)
* `not-empty` (only checks field data, no value needed)
* `truthy` (only checks field data, no value needed)
* `falsy` (only checks field data, no value needed)

_Note:_ You can compare against deep fields (like checkbox-group) by using dot-separated paths, e.g. `featureTypes.New York Magazine Story` (don't worry about spaces!)

Note: labels are pulled from the field's `_label` property.

# lock

Append a lock button to an input. The input will be locked until the user clicks the lock button. This provides a small amount of friction before editing important (and rarely-edited) fields, similar to macOS's system preferences.

# magic-button

Append a magic button to an input.

## Arguments

* **field** _(optional)_ a field to grab the value from (in the current complex list, form, or component)
* **component** _(optional)_ a name of a component to grab the component ref/uri from
* **transform** _(optional)_ a transform to apply to the grabbed value
* **transformArg** _(optional)_ an argument to pass through to the transform
* **store** _(optional)_ to grab data from the client-side store
* **url** _(optional)_ to get data from
* **property** _(optional)_ to get from the returned data
* **moreMagic** _(optional)_ to run the returned value through more transforms, api calls, etc

☆.。.:*・°☆.。.:*・°☆.。.:*・°☆.。.:*・°☆

Magic buttons are extremely powerful, but can be a little confusing to configure. This is what they generally look like:

1. specify a `field` or `component`. The button will grab the value or ref, respectively
2. specify a `transform`. Transforms are useful when doing api calls with that data
2. specify a `transformArg` if you need to send more information to the transform.
3. specify a `store` path or `url` if you need to grab data from somewhere. The request will be prefixed with the `store`/`url` string you pass in.
4. specify a `property` to grab from the result of that api call. You can use `_.get()` syntax, e.g. `foo.bar[0].baz`
5. add `moreMagic` if you need to do anything else to the returned data

**All of these arguments are optional!**

## Here are some examples:

_Note: MediaPlay is the name of our image server._

### (ﾉ◕ヮ◕)ﾉ*:・ﾟ✧ "just grab the primary headline"

```yaml
field: primaryHeadline
```

### (ﾉ◕ヮ◕)ﾉ*:・ﾟ✧ "grab a caption from mediaplay"

```yaml
field: url
transform: mediaplayUrl (to change the image url into a string we can query mediaplay's api with)
url: [mediaplay api url]
property: metadata.caption
```

### (ﾉ◕ヮ◕)ﾉ*:・ﾟ✧ "grab the url of the first mediaplay-image on this page"

```yaml
component: mediaplay-image
store: components
property: url
```

### (ﾉ◕ヮ◕)ﾉ*:・ﾟ✧ "grab a list of items keyed by some component uri"

```yaml
component: mediaplay-image
transform: getComponentInstance (this transforms the full component uri into a ref we can pop onto the end of our site prefix)
url: $SITE_PREFIX/lists/images (this is a ~ special token ~ that evaluates to the prefix of current site, so you can do api calls against your own clay instance)
```

### (ﾉ◕ヮ◕)ﾉ*:・ﾟ✧ "grab the image url from a lede component, then ask mediaplay for the caption"

```yaml
component: feature-lede
store: components
property: imgUrl
moreMagic:
  -
    transform: mediaplayUrl (to change the image url into a string we can query mediaplay's api with)
    url: [mediaplay api url]
    property: metadata.caption
```

### (ﾉ◕ヮ◕)ﾉ*:・ﾟ✧ "grab the tv show name and use it to automatically format an image url"

```yaml
field: showName
transform: formatUrl
transformArg: [base image url]/recaps-$DATAFIELD.png ($DATAFIELD is the placeholder in our formatUrl transform)
```

☆.。.:*・°☆.。.:*・°☆.。.:*・°☆.。.:*・°☆

# text

A basic text input. Can be single line or multi-line. Uses the float label pattern.

## Arguments

* **type** - defaults to `text` if not defined. Set to `multi-line` for a multi-line text area
* **step** - define step increments (for numberical inputs only)
* **enforceMaxlength** - prevent user from typing more characters than the maximum allowed (`from validate.max`)

### Shared Arguments

This input shares certain arguments with other inputs:

* **help** - description / helper text for the field
* **attachedButton** - an icon button that should be attached to the field, to allow additional functionality
* **validate** - an object that contains pre-publish validation rules:

* **validate.required** - either `true` or an object that described the conditions that should make this field required
* **validate.min** - minimum number (for `type=numer`) or length (for other types) that the field must meet
* **validate.max** - maximum number (for `type=number`) or length (for other types) that the field must not exceed
* **validate.pattern** - regex pattern

Validation rules may also have custom error messages, that will appear in the same place as the help text. If you do not specify a message, default error messages will appear.

* **validate.requiredMessage** - will appear when required validation fails
* **validate.minMessage** - will appear when minimum validation fails
* **validate.maxMessage** - will appear when maximum validation fails
* **validate.patternMessage** - will appear when pattern validation fails (very handy to set, as the default message is vague)

### Conditional Required Arguments

* **field** to compare against (inside complex-list item, current form, or current component)
* **operator** _(optional)_ to use for the comparison
* **value** _(optional)_ to compare the field against

If neither `operator` nor `value` are specified, this will make the current field required if the compared field has any data (i.e. if it's not empty). If only the value is specified, it'll default to strict equality.

Operators:

* `===`
* `!==`
* `<`
* `>`
* `<=`
* `>=`
* `typeof`
* `regex`
* `empty` (only checks field data, no value needed)
* `not-empty` (only checks field data, no value needed)
* `truthy` (only checks field data, no value needed)
* `falsy` (only checks field data, no value needed)

_Note:_ You can compare against deep fields (like checkbox-group) by using dot-separated paths, e.g. `featureTypes.New York Magazine Story` (don't worry about spaces!)

Note: labels are pulled from the field's `_label` property.