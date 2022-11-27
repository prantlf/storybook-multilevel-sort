import { default as sort, Result } from 'storybook-multilevel-sort'

sort({}, 'a', 'b')

const compareNames = (name1: string, name2: string, { path1, path2 }): Result => {
  console.log(path1, path2)
  return name1.localeCompare(name2) as Result
}
sort({}, 'a', 'b', { compareNames })
