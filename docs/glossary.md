---
id: glossary
title: Glossary
sidebar_label: Glossary
---

# Glossary	

 ## `_description`

 Every component must have a root-level `_description` in its schema, which contains markdown-formatted text describing the purpose and use of the component. It may include plain english descriptions of any non-obvious functionality, suggested workflows and advanced features, and non-obvious interactions with other components. Descriptions will appear in components' _Info_ modal.	

 ## `_devDescription`

 If the component has information that's useful for developers (but not end users), add a root-level `_devDescription`. It works the same as `_description`, but will not display in Kiln (only in component README files). It may include lists of workflows, functional requirements, business justifications, intentions of the author and situations that are explicitly unsupported, and developer-focused information on certain fields that's not appropriate for user-facing field descriptions.	

 ## `_version`

 The version of the component's data, [used to upgrade components](https://docs.clayplatform.com/amphora/docs/upgrade). Kiln doesn't care about this property.	

 ## `_confirmRemoval`

 Set this to `true` to add more friction when removing certain components.	

 ## `_allowBookmerks`

 Set this to `true` to allow saving of specific component instances for use (via cloning) later.	

 ## `_label`

 Field label, used when generating component READMEs as well as in forms. Inline WYSIWYG fields won't display the label when editing them.	

 ## `_reveal`

 Conditionally show or hide a field, based on other fields or the current site.	

 ## `_placeholder`

 Configuration for placeholders. May have `text`, `height`, and `permanent`. Must have `permanent` or `ifEmpty` when used in a group.	

 ## `_publish`

 Property to publish data when component saves. Will be published _after_ `model.save()` runs.	

 ## `_subscribe`

 Property to subscribe to. Will call `model.save()` _after_ it subscribes.	

 ## `_has`

 Configuration for an input. Maybe the name of the input (if it doesn't have any arguments), or an object with an `input` property.	

 ## `attachedButton`

 Icon button attached to a field. Maybe the name of the button (if it doesn't have any arguments), or an object with a `name` property.	

 ## `_groups`

 Root-level property in schemas denoting groups configuration. Each group must be a property of this object.	

 ## `data-editable`

 An attribute that must be added to elements in the template to enable editing of component lists and fields. Will display a placeholder if one is specified.	

 ## `data-placeholder`

 Similar to `data-editable`, but only displays a placeholder and does not allow editing.
