export interface Order {
  [key: string]: Order | null
}

// eslint-disable-next-line no-explicit-any
export type Story = any

export type Result = 0 | -1 | 1

export interface Context {
  path1: string[],
  path2: string[]
}

export interface Options {
  compareNames?: (name1: string, name2: string, context: Context) => Result
}

export default function sort(order: Order, story1: Story, story2: Story, options?: Options): Result
