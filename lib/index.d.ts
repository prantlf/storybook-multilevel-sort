/**
 * An object with the configuration of the story sorting for `sort`.
 *
 * Keys are names from the name path to a story. They are supposed to be ordered
 * in the configuration object as they should appear in the navigation list.
 *
 * Values are objects configuring the order on a level one step deeper. The value
 * `null` means that stories on that level should be sorted by default by Storybook.
 */
export interface Order {
  [key: string]: Order | null
}

/**
 * An array describing a story passed by Storybook to `storySort`.
 */
export type Story = any

/**
 * An integer value with their specified order of two stories:
 *
 *  * `0`  - the same order
 *  * `-1` - the first story should preceed the second story
 *  * `1`  - the first story should follow the second story
 */
export type Result = 0 | -1 | 1

/**
 * Additional context, whcih can be used when comparing two parts of story names.
 */
export interface Context {
  path1: string[],
  path2: string[]
}

/**
 * Configuration for comparing two stories by `compareStories`.
 */
export interface Options {
  /**
   * Compares single name parts of stories and other pages.
   *
   * Compares alphabetically by the locale-aware `localeCompare` by default.
   */
  compareNames?: (name1: string, name2: string, context: Context) => Result
}

/**
 * Compares title paths of two stories or other documentation pages and returns
 * an value with their expected order.
 */
export default function sort(order: Order, story1: Story, story2: Story, options?: Options): Result
