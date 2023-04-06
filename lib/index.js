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
  }  else if (path1.length === 0 && path2.length > 0) {
    // Path1 must be an ancestor of path2
    return -1
  } else if (path1.length > 0 && path2.length === 0) {
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
    } else {
      return result
    }
  }

  let currentOrder
  const updatetOrderAndCompare = (newOrder, path1, path2) => {
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
    return updatetOrderAndCompare(order[path1Head] || order['*'], path1Tail, path2Tail)
  }

  if (hasKey(order, path1Head) && hasKey(order, path2Head)) {
    // If both heads are in the reference order, use the ordering of the keys in the reference order
    const orderKeys = Object.keys(order)

    return orderKeys.indexOf(path1Head) < orderKeys.indexOf(path2Head) ? -1 : 1
  } else if (hasKey(order, path1Head) && !hasKey(order, path2Head)) {
    return -1 // Give preference to path1, since it is included in the reference order
  } else if (!hasKey(order, path1Head) && hasKey(order, path2Head)) {
    return 1 // Give preference to path2, since it is included in the reference order
  } else {
    // No explicit order for the path heads was found, try the wildcard key,
    // otherwise pass `undefined` to sort without an explicit order
    return updatetOrderAndCompare(order['*'], path1, path2)
  }
}

export default (order, story1, story2, { compareNames = compareAlphabetical } = {}) => {
  const story1Path = [...story1.title.split('/'), story1.name].map(key => key.toLowerCase())
  const story2Path = [...story2.title.split('/'), story2.name].map(key => key.toLowerCase())

  return compareStoryPaths(order, story1Path, story2Path, { compareNames })
}
