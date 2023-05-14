/**
 * An object with the configuration of the story sorting for `compareStories`.
 *
 * Keys are names from the name path to a story. They are supposed to be ordered
 * in the configuration object as they should appear in the navigation list.
 *
 * Values are objects configuring the order on a level one step deeper. The value
 * `null` means that stories on that level should be sorted by default by Storybook.
 */
export interface StoryOrder {
  [key: string]: StoryOrder | null
}

/**
 * An object describing a story passed by Storybook to `storySort`.
 *
 * An example of properties of an autodocs documentation page:
 *
 *     id:             'elements-button--documentation'
 *     title:          'Elements/Button'
 *     name:           'Documentation'
 *     importPath:     './stories/elements/Button.stories.js'
 *     type:           'docs'
 *     tags:           [ 'docs', 'autodocs' ]
 *     storiesImports: []
 *
 * An example of properties of a story:
 *
 *     id:         'elements-link--active'
 *     title:      'Elements/Link'
 *     name:       'Active'
 *     importPath: './stories/elements/Link.stories.js'
 *     tags:       [ 'story' ]
 *     type:       'story'
 */
export type Story = object

/**
 * An integer value with their specified order of two stories:
 *
 *  * `0`  - the same order
 *  * `-1` - the first story should preceed the second story
 *  * `1`  - the first story should follow the second story
 */
export type CompareResult = -1 | 0 | 1

/**
 * Additional context, which can be used when comparing two names of stories or their groups.
 */
export interface CompareContext {
  /**
   * THe full path of names of the first story in the comparision.
   */
  path1: string[]

  /**
   * THe full path of names of the second story in the comparision.
   */
  path2: string[]
}

/**
 * Compares two names of stories or their groups and returns an value with their expected order.
 */
export type NameComparator = (name1: string, name2: string, context: CompareContext) => CompareResult

/**
 * Configuration for comparing two stories by `compareStories`.
 */
export interface CompareOptions {
  /**
   * Groups pages by their type by keeping all pages of one type before or after
   * pages of other types.
   *
   * The default behaviour is to place all documentation pages (type `docs`)
   * before all stories (type `docs`) and then all other pages ungrouped.
   * An asterisk (`*`) represents any type and can be used for moving a group
   * of pages of a specific type behind pages of any other types.
   *
   * An empty array means ordering the stories by their name paths only and not
   * grouping by their types.
   *
   * @default ['docs', 'story']
   */
  typeOrder?: string[]

  /**
   * Compares single names of stories and other pages or their groups.
   *
   * Compares alphabetically by the locale-aware `localeCompare` by default.
   */
  compareNames?: NameComparator
}

/**
 * Compares title paths of two stories or other documentation pages and returns
 * an value with their expected order.
 */
export function compareStories(
  storyOrder: StoryOrder, story1: Story, story2: Story, compareOptions?: CompareOptions
): CompareResult

/**
 * Implements `parameters.options.storySort` for `.storybook/preview.js`.
 */
export function storySort(story1: Story, story2: Story): CompareResult

/**
 * Configuration for the behaviour of `storySort`.
 */
export interface SortOptions {
  /**
   * Configures the order of stories and documentation pages.
   */
  storyOrder?: StoryOrder

  /**
   * Groups pages by their type by keeping all pages of one type before or after
   * pages of other types.
   *
   * The default behaviour is to place all documentation pages (type `docs`)
   * before all stories (type `docs`) and then all other pages ungrouped.
   * An asterisk (`*`) represents any type and can be used for moving a group
   * of pages of a specific type behind pages of any other types.
   *
   * An empty array means ordering the stories by their name paths only and not
   * grouping by their types.
   *
   * @default ['docs', 'story']
   */
  typeOrder?: string[]

  /**
   * Compares single names of stories and other pages or their groups.
   *
   * Compares alphabetically by the locale-aware `localeCompare` by default.
   */
  compareNames?: NameComparator
}

/**
 * When called in `.storybook/main.js`, it will save the configuration
 * for `storySort`, which will be used later in `.storybook/preview.js`.
 *
 * This function has to be called at least once before `storySort` is called.
 */
export function configureSort(sortOptions?: SortOptions): void
