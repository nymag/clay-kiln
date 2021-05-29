---
id: version-8.10.0-kilnjs
title: Kilnjs
sidebar_label: Kilnjs
original_id: kilnjs
---

---

⚠️You must being using Clay-cli version **3.10.2** or greater to use Kiln.js⚠️

Kiln.js is an optional JavaScript file that transforms the schema.yaml file into a dynamic JavaScript Object that affects how Kiln interacts with components that use the schema. With it, events can be attached to the inputs that are used by kiln to edit components. These events can be used to hide or reveal different fields in the schema, update the values of those fields, make API calls, subscribe to Vuex mutations, and just about any other action allowed by JavaScript.

Using Kiln.js, you can remove the logic from the schema.yaml file and move it into JavaScript, keeping the schema file for presentational information.

To take advantage of the power that Kiln.js provides you need to create a file called kiln.js within a component folder, in the same location where you place the component's schema, model, and client files. At a minimum, it should look like this.
```js
'use strict';

module.exports = (schema) => {

  return schema;
};
```
A function that receives a parameter called schema that also returns the schema. The schema contains a JSON representation of the schema.yaml file and can be manipulated before returning. Values can be changed, added, or deleted directly on the JSON object without any other outside code. Anything you can do to a JSON object can be done to the schema.

```js
schema['_groups'].settings['_placeholder'].height = '200px';
```

However, note that the JSON that is returned still needs to conform to the structure needed by Kiln. ⚠️Deleting properties or adding properties that Kiln doesn't recognize can and will result in errors.⚠️


---

## KilnInput

The real power of Kiln.js comes from the KilnInput object, which can be used to make the fields within a schema truly dynamic. Using 'KilnInput' you can add events to the different form inputs as detailed on the [Form Inputs page](inputs). You can also subscribe to Vuex actions as described below.

To make a schema field a `KilnInput`, you set it to a new instance of `KilnInput`, passing it to the schema and the name of the field.

```js
const KilnInput = window.kiln.kilnInput;

module.exports = (schema) => {
  schema.title = new KilnInput(schema, 'title');

  return schema;
};
```

---

## Events

You can attach events to the schema inputs. The events you can attach vary depending upon the type input. The different events are detailed on the [Form Inputs page](inputs).

* ***on(event, callbackFunction)*** - pass it the event as a string, along with a callback function that is run after the event happens.

```js
  schema.enableSocialButtons.on('input', (val) => {
    if (val) {
      schema.shareServices.show();
    } else {
      schema.shareServices.hide();
    }
  });
```

### Validation

By attaching events, one of the things you can use kiln.js for is to do field validation.

```js
module.exports = (schema) => {
  schema.title = new KilnInput(schema, 'title');

  schema.title.on('keydown', (e) => {
    // prevent numbers from being entered in the title field
    if (!isNaN(e.key)) {
      e.preventDefault();
    }
  });

  return schema;
};
```

---

## Vuex Actions to Subscribe To

The following are some of the Vuex actions that you can subscribe to using Kiln.js. The actions can be scoped so that they only trigger the subscription function when the action is triggered by a component of the same type as the subscribing component. In other words, if the scope is set to **true** on a paragraph element, then the subscription function would only be called when a paragraph element triggers the Vuex action, but not when any other type of component triggers the Vuex action. When the scope is set to **false**, the subscription function is called whenever _any_ component triggers the Vuex action.

* ***OPEN_FORM*** - Triggered when a Kiln form is opened. Note that this can be triggered by both a modal form _and_ an inline form, so just clicking into a paragraph or other inline field will trigger this action. The payload returned from this action contains a JSON representation of the Schema along with the component URI that was opened in the form.

* ***CLOSE_FORM*** - Triggered when a Kiln form is closed. For inline fields this occurs when the field loses focus. When the user clicks out of the field. The payload returned from this action is `undefined`.

* ***UPDATE_FORMDATA*** - Triggered when an user changes the data in a form field. ⚠️This happens "on change", _not_ "on save".⚠️ The payload returns an object containing the path (field being changed) and data (the new value).

* ***UPDATE_COMPONENT*** - Triggered when a component is saved. The payload returns a JSON object containing all the fields in the component's schema, with the values for each of them.

* ***UPDATE_PAGE_STATE*** - Triggered when the page state changes. When it is published, unpublished, etc. The payload returned contains the page meta information, including published date/time, update date/time, history, users, etc.

* ***COMPONENT_ADDED*** - Triggered when a component is added to the page. The payload returned contains the name of the component added as well as its URI.  This is triggered _after_ the component is fully added and saved, so all its values are availabe in the Vuex store.

* ***REMOVE_COMPONENT*** - Triggered when a component is removed from the page. The payload returned contains the name of the component removed as well as its URI.

Often you might not wish to associate a subscription with a specific field, but rather to something more general. You can instantiate a `KilnInput` without referencing a specific field. Of course, if it makes sense to create a connection between a field and the action involved with a subscription, you can use the subscribe function on a field. It can be done either way. It's just a matter of what makes the intent clearer.

```js
module.exports = (schema) => {
  const subscriptions = new KilnInput(schema);

  schema.myDate = new KilnInput(schema, 'myDate');

  subscriptions.subscribe('UPDATE_COMPONENT', (payload) => {
    // do something when a component has been updated
    // you can also test the type of component updated
    // by checking the value of payload.data.componentVariation
    // and only reacting when it's a certain type of component
    // or if the component's new value is equal or not to some value
  }, false);

  schema.myDate.subscribe('UPDATE_COMPONENT', (payload) => {
    // same as above, just attached to the myDate field, which implies
    // you want to do something to the myDate field with the payload
  });

  return schema;
};

```

---

## Kiln.js custom methods

`KilnInput` also provides its own set of custom methods.

### getComponentData

* ***getComponentData(uri)*** - returns a promise from the API call to the component data that when resolved will return an object containing the component's properties and their values.

```js
kilnInput.getComponentData('localhost/_components/kilnjs-example/instances/cjw2igpzp00053h624fdnon2e');
```

### getComponentInstances

* ***getComponentInstances(componentName)*** - returns an array containing the uris of all components of type componentName that are on the current page.

```js
kilnInput.getComponentInstances('paragraph');
```

### getState

* ***getState()*** - returns a copy of the entire Vuex store as a JSON object. Should really only be used for reading, but altering it will not mutate the actual store because it's only a copy.

```js
kilnInput.getState();
```

### publishComponent

* ***publishComponent()*** - Publishs the component at the URI with the data provided.

```js
const URI = 'localhost/_components/kilnjs-example/instances/cjw2igpzp00053h624fdnon2e',
  componentData = {
    "size": "h2",
    "title": "",
    "pubDate": "5/23/2019, 4:19:43 PM",
    "pageTitle": "Clay Starter Article",
    "componentVariation": "kilnjs-example"
  }

kilnInput.publishComponent(URI, componentData);
```

### reRenderInstance

* ***reRenderInstance(uri)*** - Fetches the component's data and passes it through the components model.render function, thus refreshing it on the page. For instance, if some outside source has updated component data and does not trigger a page refresh, you could force a component rerender that would include the updated data.

```js
// if a paragraph component is updated, then rerender the instances of the snash component
kilnInput.subscribe('UPDATE_COMPONENT', (payload) => {
    if (payload.data.componentVariation === 'paragraph') {
      let snashInstances = eventBus.getComponentInstances('snash');
      snashInstances.forEach((instance) => {
        kilnInput.reRenderInstance(instance);
      });
    }
  }, false);
```

### saveComponent

* ***saveComponent(uri, data)*** - Saves the component at the provided URI with the provided data. Saving a component this way will also re-render it on the page with the updated data.

```js
const uri = 'localhost/_components/paragraph/instances/cjue4dl7i00062a65rpexptmp',
  data = { text: "This is a paragraph" };

kilnInput.saveComponent(uri, data);
```

### setProp

* ***setProp(prop, value)*** - change value of a property on the input

```js
kilninput.setProp('_has', { ...kilninput['_has'], input: 'select' });
```

### show/hide

* ***show()*** - used to make an input visible.

* ***hide()*** - used to make an input invisible

```js
  schema.enableSocialButtons.on('input', (val) => {
    if (val) {
      schema.shareServices.show();
    } else {
      schema.shareServices.hide();
    }
  });
```

### showSnackBar

* ***showSnackBar({ message = '', duration = 3000, position = 'left', queueSnackbars = false, transition = 'fade' })*** - Displays the SnackBar element with the provided message.

```js
kilnInput.showSnackBar({ message: 'Hey, this is a message that I want the user to see!', position: 'center' })
```

### url

* ***url()*** - returns the url object from Vuex state of the component that is currently being edited. The object contains the component name, the instance, and the path.

```js
  kilnInput.url()

  /**
   * returns an object structured like this
   *
   * {
   *   component: "meta-title"
   *   instance: "cjtfuc3rw00019fz9egagqev0"
   *   path: "settings"
   * }
   */
```

### value

* ***value(val)*** - used to set and retrieve value on an input. If a value is passed, it sets the value, otherwise it retrieves it.

```js
schema.title.value(); // gets the value of title
schema.title.value('Some New Value'); // sets the value of title
```

---

## Form Validation

Along with input level validation, you can also perform form validation using kiln.js.  To do this, you add a function to the schame named `formValidation`. This function is called just before a form is saved and if it returns `false` then the form will not be saved.  The snackBar element can be used to convey a message to the user explaining why the form wasn't saved.

```js
  schema.formValidation = () => {
    if (schema.size.value() === 'h2' && schema.title.value().length > 40) {
      kilnInput.showSnackBar({ message: 'When size is H2, the Title can\'t be longer than 40 chars', position: 'center' })
      return false;
    }


    return true;
  };
```
