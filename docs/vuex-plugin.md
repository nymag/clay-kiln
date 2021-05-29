---
id: vuex-plugin
title: Vuex Plugins
sidebar_label: Vuex Plugins
---

When you're working with plugins is slightly tricky to get access to the vue object and its context because you don't have direct access to it. The best way to get around this limitation is to dynamically register a store in a created hook on your root component. It is also necessary to namespace your store due to the module nature of Kiln plugins. For more info on `Vuex modules` see official [documentation](https://vuex.vuejs.org/guide/modules.html)

Example:

```js

const store = {
  // important!
  namespaced: true,
  state: {...}
  actions: {...},
  mutations: {...},
  getters: {...}
}

// The main component
Main = {
  data: () => {...},
  components: {...},

  // register the store under MyStoreNamespace in the created callback
  created() {
      this.$store.registerModule('MyStoreNamespace', store)
  }

  computed: {
     someStateVal() {
       return this.$store.state.MyStoreNamespace.someValue
    }
  },

  methods: {
    updateSomeValue() {
      this.$store.dispatch('MyStoreNamespace/updateSomeValue')
    }
  }
}
```
