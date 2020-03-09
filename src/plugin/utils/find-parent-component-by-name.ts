import Vue from 'vue'

/**
 * @name findParentComponentByName
 * @summary Find the Vue instance of the first parent component that matches the provided component name.
 *
 * @description The `findParentComponentByName()` method returns the Vue instance of the first parent component
 * that has a `name` component option that matches the provided component name.
 *
 * @param {Vue} vm - The children component Vue instance that is looking for the parent component Vue instance
 * @param {string} componentName - The parent component name
 * @returns {Vue|undefined} The parent component instance that matches the provided component name,
 * otherwise, undefined is returned
 *
 * @example
 * // Find `<App/>` component from `<Child/>`:
 * <App>
 *   <GrandParent>
 *     <Parent>
 *       <Child/>
 *     </Parent>
 *   </GrandParent>
 * </App>
 *
 * // Descendant component Vue instance
 * new Vue({
 *   name: 'Child',
 *
 *   created() {
 *     const app = findParentComponentByName(this, 'App')
 *     // => VueComponent {_uid: 1, _isVue: true, $options: {…}, _renderProxy: Proxy, _self: VueComponent, …}
 *  },
 * })
 */
export function findParentComponentByName(
  vm: Vue,
  componentName: string
): Vue | undefined {
  //
  //  Components tree:
  //  +---------------------+  \ return undefined, <Child/> is not a descendant of <App/> \
  //  | <App>               |---> Return if component name option matches, otherwise
  //  |---------------------|    \ continue traversing the tree upwards \
  //  |   <GrandParent>     |-----> Return if component name option matches, otherwise
  //  |---------------------|      \ continue traversing the tree upwards \
  //  |     <Parent>        |-------> Return if component name option matches, otherwise
  //  |---------------------|        \ traverse the tree upwards \
  //  |       <Child/>      |---------> STARTING POINT, start looking for App component from here
  //  |---------------------|
  //  |     </Parent>       |
  //  |---------------------|
  //  |   </GrandParent>    |
  //  |---------------------|
  //  | </App>              |
  //  +---------------------+
  //

  let component: Vue | undefined
  let parent = vm.$parent

  while (parent && !component) {
    if (parent.$options.name === componentName) {
      component = parent
    }
    parent = parent.$parent
  }

  return component
}
