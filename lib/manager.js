import { configureSort } from './api.js'

// export function managerEntries(entries = [], { presetsList }) {
//   const preset = presetsList.find(({ name }) => name.includes('storybook-multilevel-sort/lib'))
//     || presetsList.find(({ name }) => name.includes('storybook-multilevel-sort'))
//   if (!preset) throw new Error('Missing preset for storybook-multilevel-sort')

//   console.log('storybook-multilevel-sort configureSort:', preset.options)
//   configureSort(preset.options)

//   return entries
// }

export function previewAnnotations(entries = [], { presetsList }) {
   const preset = presetsList.find(({ name }) => name.includes('storybook-multilevel-sort/lib'))
    || presetsList.find(({ name }) => name.includes('storybook-multilevel-sort'))
  if (!preset) throw new Error('Missing preset for storybook-multilevel-sort')
  console.log('storybook-multilevel-sort:configureSort:', preset.options)
  configureSort(preset.options)

  const preview = require.resolve('./preview')
  console.log('storybook-multilevel-sort:previewAnnotations', preview)
  return [...entries, preview]
}
