// See https://github.com/storybookjs/storybook/issues/548#issuecomment-1099949201

const hasKey = Object.hasOwn
  ? (obj, key) => Object.hasOwn(obj, key)
  /* c8 ignore next */
  : (obj, key) => Object.prototype.hasOwnProperty.call(obj, key)
const compareAlphabetical = (name1, name2) => name1.localeCompare(name2, { numeric: true })

const compareStoryPaths = (order, path1, path2, context) => {
  /* c8 ignore next 9 */
  if (path1.length === 0 && path2.length === 0) {
    return 0
  }
  if (path1.length === 0 && path2.length > 0) {
    // Path1 must be an ancestor of path2
    return -1
  }
  if (path1.length > 0 && path2.length === 0) {
    // Path2 must be an ancestor of path1
    return 1
  }

  const [path1Head, ...path1Tail] = path1
  const [path2Head, ...path2Tail] = path2

  if (!order) {
    // No reference order, so just sort alphabetically
    const result = context.compareNames(path1Head, path2Head, { path1, path2 })
    if (result === 0) {
      return compareStoryPaths(null, path1Tail, path2Tail, context)
    }
    return result
  }

  let currentOrder
  const updateOrderAndCompare = (newOrder, path1, path2) => {
    // Propagate the nested wildcard to the following call to compareStoryPaths
    const nestedOrder = order['**']
    if (nestedOrder) context.order = nestedOrder
    currentOrder = newOrder
    // If the same paths are going to be compared, do not use the nested wildcard
    // any more; it'd enter this clause once more and end up with a stack overflow
    if (!currentOrder && context.path1 !== path1 && context.path2 !== path2) {
      currentOrder = context.order
    }
    // Remember the current paths for future calls to compareStoryPaths
    context.path1 = path1
    context.path2 = path2
    return compareStoryPaths(currentOrder, path1, path2, context)
  }

  if (path1Head === path2Head) {
    // The two paths share the same head; try either the key for the head, or the
    // wildcard keys, otherwise pass `undefined` to sort without an explicit order
    return updateOrderAndCompare(order[path1Head] || order['*'], path1Tail, path2Tail)
  }

  if (hasKey(order, path1Head) && hasKey(order, path2Head)) {
    // If both heads are in the reference order, use the ordering of the keys in the reference order
    const orderKeys = Object.keys(order)

    return orderKeys.indexOf(path1Head) < orderKeys.indexOf(path2Head) ? -1 : 1
  }
  if (hasKey(order, path1Head) && !hasKey(order, path2Head)) {
    return -1 // Give preference to path1, since it is included in the reference order
  }
  if (!hasKey(order, path1Head) && hasKey(order, path2Head)) {
    return 1 // Give preference to path2, since it is included in the reference order
  }
  // No explicit order for the path heads was found, try the wildcard key,
  // otherwise pass `undefined` to sort without an explicit order
  return updateOrderAndCompare(order['*'], path1, path2)
}

const compareTypes = (type1, type2, { typeOrder = ['docs', 'story'] } = {}) => {
  // No ordedring of types means the same weight for all page typed and using
  // only alphabetical comparison of story names.
  if (!typeOrder.length) return 0

  let index1 = typeOrder.indexOf(type1)
  let index2 = typeOrder.indexOf(type2)

  // If some of the types does not have an explicitly specified order, try
  // assigning it the order of the wildcard type (`*`).
  if (index1 < 0 || index2 < 0) {
    const wildcardIndex = typeOrder.indexOf('*')
    if (wildcardIndex >= 0) {
      if (index1 < 0) index1 = wildcardIndex
      if (index2 < 0) index2 = wildcardIndex
    }
  }

  if (index1 >= 0) {
    // If both types have their indexes in the type-ordering array, apply
    // the usual numeric comparison on the type indexes.
    /* c8 ignore next */
    if (index2 >= 0) {
      return index1 === index2 ? 0 : index1 < index2 ? -1 : 1
    }
    // If just the first type was found, the first story should go to the front.
    return -1
  }
  // If just the second type was found, the second story should go to the front.
  if (index2 >= 0) {
    return 1
  }
  // If no type as found, both stories will start with the same weight
  // in the just following name comparison.
  return 0
}

export const compareStories = (storyOrder, story1, story2, { typeOrder, compareNames } = {}) => {
  const { title: title1, name: name1, type: type1 } = story1
  const { title: title2, name: name2, type: type2 } = story2

  // If the types are different and are not considered the same in the comparison,
  // they alone are enough to decide the order of the stories and this group
  // stories of the same type together.
  if (type1 !== type2) {
    const result = compareTypes(type1, type2, { typeOrder })
    if (result) return result
  }

  // Extract case-insensitive name paths from story titles. For example:
  // { title: 'Elements/Button', name: 'Documentation' }
  //  => [ 'elements', 'button', 'documentation' ]
  // { title: 'Elements/Link', name: 'Active' }
  //  => [ 'elements', 'link', 'active' ]
  const story1Path = [...title1.split('/'), name1].map(key => key.toLowerCase())
  const story2Path = [...title2.split('/'), name2].map(key => key.toLowerCase())

  if (!compareNames) compareNames = compareAlphabetical
  return compareStoryPaths(storyOrder, story1Path, story2Path, { compareNames })
}

export const storySort = (story1, story2) => {
  // A global object with the configuration is set by `configureSort`.
  const params = globalThis['storybook-multilevel-sort:params']
  if (!params) throw new Error('Missing storybook-multilevel-sort:params object. Forgot to call configureSort?')

  const { storyOrder, typeOrder, compareNames } = params
  return compareStories(storyOrder, story1, story2, { typeOrder, compareNames })
}

export const configureSort = ({ storyOrder, typeOrder, compareNames } = {}) => {
  const params = globalThis['storybook-multilevel-sort:params'] ||
    // biome-ignore lint/suspicious/noAssignInExpressions: this is easier to read
    (globalThis['storybook-multilevel-sort:params'] = {})
  if (storyOrder !== undefined) params.storyOrder = storyOrder
  if (typeOrder !== undefined) params.typeOrder = typeOrder
  if (compareNames !== undefined) params.compareNames = compareNames

  globalThis['storybook-multilevel-sort:storySort'] = storySort
}
