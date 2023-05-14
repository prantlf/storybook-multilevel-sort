import { configureSort } from './api.js'

/* c8 ignore next 9 */
export function managerEntries(entries, { presetsList }) {
  const addon = presetsList.find(({ name }) => name.includes('storybook-multilevel-sort/lib'))
    || presetsList.find(({ name }) => name.includes('storybook-multilevel-sort'))
  if (!addon) throw new Error('Missing preset for storybook-multilevel-sort')

  configureSort(addon.options)

  return entries
}

// export function previewAnnotations(entries = [], cf) {
//   return [...entries, require.resolve('./preview')]
// }
