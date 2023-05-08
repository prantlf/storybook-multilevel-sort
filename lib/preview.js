export const parameters = {
  options: {
    storySort: (story1, story2) =>
      globalThis['storybook-multilevel-sort:storySort'](story1, story2)
  }
}
