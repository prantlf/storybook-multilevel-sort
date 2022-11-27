# Multi-level Sorting for Storybook

[![Latest version](https://img.shields.io/npm/v/storybook-multilevel-sort)
 ![Dependency status](https://img.shields.io/librariesio/release/npm/storybook-multilevel-sort)
](https://www.npmjs.com/package/storybook-multilevel-sort)
[![Test Coverage](https://codecov.io/gh/prantlf/storybook-multilevel-sort/branch/master/graph/badge.svg)](https://codecov.io/gh/prantlf/storybook-multilevel-sort)

Applies specific sort order to more than two levels of chapters and stories in a [storybook].

## Synopsis

The following directory structure:

```txt
.
├── Articles
│   ├── Getting Started.mdx   Articles/Getting Started
│   └── Versioning.mdx        Articles/Versioning
├── Components
│   ├── Header
│   │   ├── Collapsed.mdx     Components/Header/Collapsed
│   │   ├── Default.mdx       Components/Header/Default
│   │   ├── Expanded.mdx      Components/Header/Expanded
│   │   └── WithSearch.mdx    Components/Header/With Search
│   └── List
│       ├── Collapsed.mdx     Components/List/Collapsed
│       ├── Default.mdx       Components/List/Default
│       └── Expanded.mdx      Components/List/Expanded
└── Elements
    ├── Button
    │   ├── Active.mdx        Elements/Button/Active
    │   └── Default.mdx       Elements/Button/Default
    └── Link
        ├── Active.mdx        Elements/Link/Active
        └── Default.mdx       Elements/Link/Default
```

Can be sorted according to this request:

1. `Elements` before `Components`
2. `Default` stories before the others
3. Otherwise alphabetically

Resulting in a TOC like this:

```txt
Articles
  Getting Started
  Versioning
Elements
  Button
    Default
    Active
  Link
    Default
    Active
Components
  Header
    Default
    With Search
    Collapsed
    Expanded
  List
    Default
    Collapsed
    Expanded
```

When using the following code in `.storybook/preview.js`:

```js
import sort from 'storybook-multilevel-sort'

const order = {
  articles: null,
  elements: {
    '*': { default: null }
  },
  components: {
    header: {
      default: null,
      'with search': null
    },
    '*': { default: null }
  }
}

export const parameters = {
  options: {
    storySort: (story1, story2) => sort(order, story1, story2)
  }
}
```

A simplification using nested wildcards:

```js
const order = {
  articles: null,
  elements: null,
  components: {
    header: {
      default: null,
      'with search': null
    },
  },
  '**': { default: null }
}
```

## Installation

This module can be installed in your project using [NPM], [PNPM] or [Yarn]. Make sure, that you use [Node.js] version 14.8 or newer.

```sh
npm i -D storybook-multilevel-sort
pnpm i -D storybook-multilevel-sort
yarn add storybook-multilevel-sort
```

## API

This package exports a function to compare two stories:

```js
import sort from 'storybook-multilevel-sort'
```

The function expects an object with the sorting configuration, two stories to compare, just like storybook passed them to the `storySort` method, and optionally sorting options:

```js
export const parameters = {
  options: {
    storySort: (story1, story2) => sort(order, story1, story2)
  }
}
```

This package can be imported to CJS projects too:

```js
const sort = require('storybook-multilevel-sort')
```

### Custom Comparisons

Names of groups and stories on one level are compared alphabetically according to the current locale by default. If you need a different comparison, you can specify it using the optional `options` parameter:

```js
const options = {
  compareNames: (name1, name2, context) {
    // name1 - the string with the name on the left side of the comparison
    // name2 - the string with the name on the right side of the comparison
    // context - additional information
    // context.path1 - an array of strings with the path of groups
    //                 down to the left compared group or story name (name1)
    // context.path2 - an array of strings with the path of groups
    //                 down to the right compared group or story name (name2)
    return name1.localeCompare(name2, { numeric: true })
  }
}

...

  storySort: (story1, story2) => sort(order, story1, story2, options)
```

Mind that the strings with names of groups and stories are converted to lower-case, before they are passed to the comparator.

## Configuration

The sorting configuration is an object. Keys are titles of groups and stories. Values are objects with the next level of groups or stories. Nesting of the objects follows the slash-delimited story paths set to the `title` attribute:

```js
{
  elements: {
    link: null,    // Elements/Link/...
    button: null   // Elements/Button/...
  },
  components: null // Components/Card/...
                   // Components/Header/...
}
```

**Keys in the sorting objects have to be lower-case.** If a value is `null` or an empty object, that level will be sorted alphabetically. Names of groups or stories missing among the object keys will be sorted alphabetically, behind the names that are listed as keys.

### Whitespace

Names of groups and stories may include spaces. They are usually declared using pascal-case or camel-case and Storybook will separate the words by spaces:

```js
// The name will be "With Search"
export const WithSearch = Template.bind({})
```

They can be also assigned the displayable name using the `storyName` property:

```js
// The name will be "With Search" too
export const story1 = Template.bind({})
story1.storyName = 'With Search'
```

When you refer to such groups or stories on the ordering configuration, use the displayable name (with spaces) lower-case, for example:

```js
const order = {
  '*': {
    default: null,
    'with search': null
  }
}
```

**Generally, names of groups and stories are expected in the ordering configuration as Storybook displays them.** Not as the exported variables are named. You need to be aware of the [algorithm how Storybook generates the names of stories].

### Wildcards

If you want to skip explicit sorting at one level and specify the next level, use `*` instead of names, for which you want to specify the next level. The `*` matches any name, which is not listed explicitly at the same level:

```js
{
  '*': {
    default: null // Link/Default
  }               // Link/Active
}                 // Link/Visited
```

### Nested Wildcards

If you want to enable implicit sorting at multiple levels, you would have to repeat the `*` selector on each level:

```js
{
  elements: {
    '*': {
      default: null // Link/Default
    }               // Link/Active
  },                // Link/Visited
  components: {
    '*': {
      default: null // Header/Default
    }               // Header/Collapsed
  }                 // Header/Expanded
}
```

you can use a nested wildcard `**` to specify default for the current and deeper levels. The `**` matches any name, which is not listed explicitly at the same level and if there is no `*` wildcard selector at that level:

```js
{
  elements: null,
  components: null,
  '**': {
    default: null // Link/Default
  }               // Link/Active
}                 // Link/Visited
                  // Header/Default
                  // Header/Collapsed
                  // Header/Expanded
```

The precedence of the selectors at a particular level:

1. A concrete name of a group or story
2. The wildcard `*` matching any name of a group or story
3. The nested wildcard `**` frm the same or from an outer level matching any name of a group or story

## Motivation

Unfortunately, the [sorting configuration supported by Storybook] works only for two-level storybooks:

> The order array can accept a nested array in order to sort 2nd-level story kinds.

If you group your components by one more level, the stories will move to the third level and you won't be able to sort them. For example:

```txt
.
├── Articles
│   ├── Getting Started.mdx
│   └── Versioning.mdx
└── Elements
    ├── Button
    │   ├── Active.mdx
    │   └── Default.mdx
    └── Link
        ├── Active.mdx
        └── Default.mdx
```

Let's say, that you want to sort the stories alphabetically, but put the `Default` story before the other stories. It's impossible using the declarative configuration, because stories are on the third level. The following configuration:

```js
storySort: {
  order: ['Articles', '*', ['*', ['Default', '*']]]
}
```

Will generate the following TOC:

```txt
Articles
  Getting Started
  Versioning
Elements
  Button
    Active
    Default
  Link
    Active
    Default
```

This package will help generating the proper TOC:

```txt
Articles
  Getting Started
  Versioning
Elements
  Button
    Default
    Active
  Link
    Default
    Active
```

Using the following order configuration:

```js
const order = {
  articles: null,
  elements: {
    '*': { default: null }
  }
}
```

## Contributing

In lieu of a formal styleguide, take care to maintain the existing coding style. Lint and test your code.

## License

Copyright (c) 2022 Ferdinand Prantl

Licensed under the MIT license.

[storybook]: https://storybook.js.org/
[sorting configuration supported by Storybook]: https://storybook.js.org/docs/react/writing-stories/naming-components-and-hierarchy#sorting-stories
[algorithm how Storybook generates the names of stories]: https://storybook.js.org/docs/react/api/csf#named-story-exports
[Node.js]: http://nodejs.org/
[NPM]: https://www.npmjs.com/
[PNPM]: https://pnpm.io/
[Yarn]: https://yarnpkg.com/
