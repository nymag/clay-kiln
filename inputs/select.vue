<docs>
  # `select`

  An enhanced browser `<select>` element, allowing the user to select one (or more!) of a few related options. [Uses Keen's UISelect](https://josephuspaye.github.io/Keen-UI/#/ui-select).

  ### Select Arguments

  * **multiple** - allow multiple options to be selected. data will be an object with options as keys, similar to checkbox-group
  * **search** - allow users to type stuff in to filter options. Extremely useful for longer options lists
  * **list** - The key `list` is where the value is the name of a list that Amphora knows about accessible via `/<site>/_lists/<listName>`.
  * **options** - an array of strings or objects (with `name`, `value`, and optionally `sites`)
  * **keys** passthrough option for Keen to specify keys for input objects, especially for use when you don't control the input shape, e.g. lists. Defaults to `{label: 'name', value: 'value'}`
  * **storeRawData** normally only the `value` of each option is stored, but with this option you can store the entire input object. note that this only works when `multiple` is false
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

  {% hint style="info" %}

  #### Usage Notes

  * you may have a value for a 'None' option. this is useful for components that have defaults that you want to be able to revert to after selecting an option
  * your "default" value may use the label 'None' _or_ 'Default'
  * if a 'None' option is not specified, it is generated and you don't need to specify an empty option in the schema
  * you can specify site-specific options, [similar to components in a component-list](https://github.com/clay/clay-kiln/wiki/Component-Lists#site-specific-components)

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

  {% endhint %}

  ### Select Data Formats

  By default (when `multiple` is false or unset), this will return data as a **string** with the value of the selected option. If `multiple` is `true`, this will return an **object** where each option is a key with a `true` / `false` value. Note that the single-select mode is the same format as a `radio` input, and the multi-select mode is the same as a `checkbox-group`.
</docs>

<template>
  <ui-select
    v-if="hasOptions"
    :name="name"
    :value="value"
    :keys="keys"
    :options="options"
    :multiple="args.multiple"
    :hasSearch="args.search"
    :list="args.list"
    :label="label"
    :floatingLabel="true"
    :help="args.help"
    :disabled="disabled"
    :error="errorMessage"
    :invalid="isInvalid"
    iconPosition="right"
    @input="handleInput"
    @dropdown-open="onDropdown"
    @dropdown-close="onDropdownClose"
    v-dynamic-events="customEvents"
  >
    <attached-button slot="icon" :name="name" :data="data" :schema="schema" :args="args" @disable="disableInput" @enable="enableInput"></attached-button>
  </ui-select>
  <!-- todo: there's a "no-results" slot in ui-select, should we maybe use that? -->
  <span v-else class="editor-no-options">{{ label }}: No options available on current site.</span>
</template>

<script>
  import _ from 'lodash';
  import { UPDATE_FORMDATA } from '../lib/forms/mutationTypes';
  import label from '../lib/utils/label';
  import { shouldBeRequired, getValidationError } from '../lib/forms/field-helpers';
  import { filterBySite } from '../lib/utils/site-filter';
  import UiSelect from 'keen/UiSelect';
  import attachedButton from './attached-button.vue';
  import { DynamicEvents } from './mixins';

  export default {
    mixins: [DynamicEvents],
    props: ['name', 'data', 'schema', 'args', 'disabled'],
    data() {
      return {
        listOptions: [],
        isDisabled: false
      };
    },
    mounted() {
      if (this.args.list) {
        this.fetchListItems().then((listItems) => {
          this.listOptions = listItems;
        }).catch(() => {
          log.error(`Error getting list for ${this.args.list}`);
        });
      }
    },
    computed: {
      keys() {
        return _.assign({
          label: 'name',
          value: 'value'
        }, this.args.keys || {});
      },
      equalLabelValueKeys() {
        return this.keys.label === this.keys.value;
      },
      valueKey() {
        return this.equalLabelValueKeys ? 'value' : this.keys.value;
      },
      NULL_OPTION() {
        return {
          [this.keys.label]: 'None',
          [this.valueKey]: null
        };
      },
      // combine arg/prop options, fetched list options, and a null option for non-multiple selects
      options() {
        const propOptions = this.args.options || [],
          currentSlug = _.get(this.$store, 'state.site.slug'),
          { label } = this.keys,
          noneOption = propOptions.find((val) => {
            return val[label] === 'None' || val[label] === 'Default';
          });

        let fullOptions = propOptions.concat(this.listOptions);

        // filter by site specificity
        fullOptions = filterBySite(fullOptions, currentSlug);

        // format the options for the UI
        fullOptions = _.map(fullOptions, (option) => {
          if (_.isString(option) || _.isNumber(option)) {
            return {
              [this.valueKey]: option,
              [label]: _.startCase(option)
            };
          }

          return {
            ...option, // spread the whole object in case it has extra properties
            [this.valueKey]: this.equalLabelValueKeys ? option[label] : option[this.valueKey]
          };
        });

        // if there is no 'None' option defined then add a null option because
        // single-select must have null option, if there is no null option
        if (fullOptions.length && !this.args.multiple && !noneOption) {
          fullOptions = [this.NULL_OPTION].concat(fullOptions);
        }

        return fullOptions;
      },
      // convert store data into a format suitable for Keen UiSelect.value prop
      value() {
        if (!this.data) {
          // defaults to pass Keen's type check
          return this.args.multiple ? [] : this.NULL_OPTION;
        } else if (this.args.multiple) {
          return _.filter(this.options, option => !!this.data[option[this.valueKey]]);
        } else if (this.args.storeRawData) {
          return this.data;
        } else {
          return _.find(this.options, option => this.data === option[this.valueKey]);
        }
      },
      hasOptions() {
        return this.options.length > 0;
      },
      isRequired() {
        return _.get(this.args, 'validate.required') === true || shouldBeRequired(this.args.validate, this.$store, this.name);
      },
      label() {
        return `${label(this.name, this.schema)}${this.isRequired ? '*' : ''}`;
      },
      errorMessage() {
        return getValidationError(this.data, this.args.validate, this.$store, this.name);
      },
      isInvalid() {
        return !!this.errorMessage;
      }
    },
    methods: {
      onDropdown() {
        const length = this.options.length < 7 ? this.options.length : 7; // 7 items is the max number that will be displayed at once

        this.$emit('resize', length * 32); // potentially resize the form (if dropdown options overflow)
      },
      onDropdownClose() {
        this.$emit('resize', 0);
      },
      handleInput(value) {
        let data;

        if (this.args.multiple) {
          // set all existing options in data to false
          data = _.mapValues(_.cloneDeep(this.data), () => false);
          // for each of the selected options, set the related key in the data to true
          _.forEach(value, option => data[option[this.valueKey]] = true);
        } else if (this.args.storeRawData) {
          data = _.cloneDeep(value);
        } else {
          data = value[this.valueKey];
        }

        this.$store.commit(UPDATE_FORMDATA, { path: this.name, data });
      },
      fetchListItems() {
        // todo: look into "loading" prop for UiSelect
        const listName = this.args.list,
          list = _.get(this, `$store.state.lists['${listName}']`, {});

        let promise;

        if (list.items && !list.isLoading && !list.error) {
          promise = Promise.resolve(list.items);
        } else {
          promise = this.$store.dispatch('getList', listName).then(() => _.get(this, `$store.state.lists['${listName}'].items`, []));
        }

        return promise;
      },
      disableInput() {
        this.isDisabled = true;
      },
      enableInput() {
        this.isDisabled = false;
      }
    },
    components: {
      UiSelect,
      attachedButton
    }
  };
</script>

<style lang="sass">
  @import '../styleguide/typography';

  .editor-no-options {
    @include type-body();

    color: $text-disabled-color;
  }
</style>
