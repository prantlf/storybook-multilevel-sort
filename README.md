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
│   └── Header
│       ├── Collapsed.mdx     Components/Header/Collapsed
│       ├── Default.mdx       Components/Header/Default
│       └── Expanded.mdx      Components/Header/Expanded
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
    '*': { default: null }
  }
}

export const parameters = {
  options: {
    storySort: (story1, story2) => sort(order, story1, story2)
  }
}
```

## Installation

This module can be installed in your project using [NPM], [PNPM] or [Yarn]. Make sure, that you use [Node.js] version 14 or newer.

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

The function expects an object with the sorting configuration and two stories to compare, just like storybook passed them to the `storySort` method:

```js
export const parameters = {
  options: {
    storySort: (story1, story2) => sort(order, story1, story2)
  }
}
```

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

If you want to skip explicit sorting at one level and specify the next level, use `*` instead of names, for which you want to specify the next level. The `*` matches any name, which is not listed explicitly at the same level:

```js
{
  '*': {
    default: null // Link/Default
  }               // Link/Active
}                 // Link/Visited
```

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
[Node.js]: http://nodejs.org/
[NPM]: https://www.npmjs.com/
[PNPM]: https://pnpm.io/
[Yarn]: https://yarnpkg.com/
