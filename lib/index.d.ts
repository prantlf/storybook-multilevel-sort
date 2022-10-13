export interface Order {
  [key: string]: Order | null
}

// eslint-disable-next-line no-explicit-any
type Story = any

declare function sort(order: Order, story1: Story, story2: Story): 0 | -1 | 1

export default sort
