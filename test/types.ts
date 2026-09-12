import {
  compareStories, configureSort, storySort, type CompareResult
} from 'storybook-multilevel-sort'

compareStories({}, {}, {})

const compareNames = (name1: string, name2: string, { path1, path2 }: { path1: string[], path2: string[] }): CompareResult => {
  console.log(path1, path2)
  return name1.localeCompare(name2) as CompareResult
}
compareStories({}, {}, {}, { compareNames })

configureSort()
configureSort({})
configureSort({ storyOrder: {} })
configureSort({ typeOrder: [] })
configureSort({ compareNames })

storySort({}, {})
