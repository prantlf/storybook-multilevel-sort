# Multi-level Sorting for Storybook

[![Latest version](https://img.shields.io/npm/v/storybook-multilevel-sort)](https://www.npmjs.com/package/storybook-multilevel-sort) [![Dependency status](https://img.shields.io/librariesio/release/npm/storybook-multilevel-sort)](https://www.npmjs.com/package/storybook-multilevel-sort) [![Test Coverage](https://codecov.io/gh/prantlf/storybook-multilevel-sort/branch/master/graph/badge.svg)](https://codecov.io/gh/prantlf/storybook-multilevel-sort)

Applies specific sort order to more than two levels of chapters and stories in a [storybook].

**Attention**: Versions `2.x` of this package support Storybook 7 and newer. If you use Storybook 6 or older, look for the [versions `1.x` of this package]. If you upgrade Storybook to the version 7 or newer, you will need a version `2.x` of this package too. See the [documentation about how to migrate] from a version `1.x` to a version `2.x` of this package.

See also an [example of a Storybook project using this package].

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
3. `With Search` right after `Default` and before the others
4. Otherwise alphabetically

Resulting in a TOC like this. The "Docs" chapters are inserted by Storybook 7 instead of the "Docs" tab. If you want to change their order, see [Type Sort Order and Grouping](#type-sort-order-and-grouping) below:

```txt
Articles
  Getting Started
  Versioning
Elements
  Button
    Docs
    Default
    Active
  Link
    Docs
    Default
    Active
Components
  Header
    Docs
    Default
    With Search
    Collapsed
    Expanded
  List
    Docs
    Default
    Collapsed
    Expanded
```

When using the following code in `.storybook/main.js`:

```js
import { configureSort } from 'storybook-multilevel-sort'

configureSort({
  storyOrder: {
    articles: null,
    elements: {
      '*': { default: null }
    },
    components: {
      navigation: {
        header: {
          default: null,
          'with search': null
        }
      }
    },
    '**': { default: null }
  }
})
```

And the following code in `.storybook/preview.js`:

```js
export default {
  parameters: {
    options: {
      storySort: (story1, story2) =>
        globalThis['storybook-multilevel-sort:storySort'](story1, story2)
    }
  }
}
```

A simpler configuration using nested wildcards:

```js
{
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

This module can be installed in your project using [NPM], [PNPM] or [Yarn]. Make sure, that you use [Node.js] version 16 or newer.

```sh
npm i -D storybook-multilevel-sort
pnpm i -D storybook-multilevel-sort
yarn add storybook-multilevel-sort
```

## API

This package exports a function to configure the custom sorting:

```js
import { configureSort } from 'storybook-multilevel-sort'
```

The function is supposed to be executed in `.storybook/main.js` and expects an object with the sorting configuration:

```js
configureSort({
  typeOrder: ...
  storyOrder: ...
  compareNames: ...
})
```

It prepares a global function, which will be called in the `storySort` callback with the two stories to compare, implemented in`.storybook/preview.js`:

```js
export default {
  parameters: {
    options: {
      storySort: (story1, story2) =>
        globalThis['storybook-multilevel-sort:storySort'](story1, story2)
    }
  }
}
```

This package can be imported to CJS projects too:

```js
const { configureSort } = require('storybook-multilevel-sort')
```
## Configuration

The object expected by the `configureSort` function may include the following properties:

* `storyOrder`: configuration of the sort order based on names of groups and stories (`object`, optional)
* `compareNames`: custom name comparison function (`function`, optional)
* `typeOrder`: configuration of the page grouping and sort order based on types of the pages (`array`, optional)

### Name Sort Order

The sorting configuration is an object set by the `sortOrder` property. Keys are titles of groups and stories. Values are objects with the next level of groups or stories. Nesting of the objects follows the slash-delimited story paths set to the `title` attribute:

```js
configureSort({
  storyOrder: {
    elements: {
      link: null,    // Elements/Link/...
      button: null   // Elements/Button/...
    },
    components: null // Components/Card/...
                    // Components/Header/...
  }
})
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
{
  storyOrder: {
    '*': {
      default: null,
      'with search': null
    }
  }
}
```

**Generally, names of groups and stories are expected in the ordering configuration as Storybook displays them.** Not as the exported variables are named. You need to be aware of the [algorithm how Storybook generates the names of stories].

### Wildcards

If you want to skip explicit sorting at one level and specify the next level, use `*` instead of names, for which you want to specify the next level. The `*` matches any name, which is not listed explicitly at the same level:

```js
{
  storyOrder: {
    '*': {
      default: null // Link/Default
    }               // Link/Active
  }                 // Link/Visited
}
```

### Nested Wildcards

If you want to enable implicit sorting at multiple levels, you would have to repeat the `*` selector on each level:

```js
{
  storyOrder: {
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
}
```

you can use a nested wildcard `**` to specify default for the current and deeper levels. The `**` matches any name, which is not listed explicitly at the same level and if there is no `*` wildcard selector at that level:

```js
{
  storyOrder: {
    elements: null,
    components: null,
    '**': {
      default: null // Link/Default
    }               // Link/Active
  }                 // Link/Visited
                    // Header/Default
                    // Header/Collapsed
                    // Header/Expanded
}
```

The precedence of the selectors at a particular level:

1. A concrete name of a group or story
2. The wildcard `*` matching any name of a group or story
3. The nested wildcard `**` frm the same or from an outer level matching any name of a group or story

### Custom Comparisons

Names of groups and stories on one level are compared alphabetically according to the current locale by default. If you need a different comparison, you can specify it by using the optional `compareNames` parameter:

```js
{
  storyOrder: ...

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
```

Mind that the strings with names of groups and stories are converted to lower-case, before they are passed to the comparator.

### Type Sort Order and Grouping

Storybook 7 introduced a new type of pages, which can appear among the stories - `docs`. The documentation page earlier accessible on the "Docs" tab was moved to the tree of groups and stories. It means that there is a new type of the node in the navigation tree, which you may want to sort independently of the pages of the previous type - `story`.

Storybook inserts the links to the "Docs" pages before the first story of a particular component. This custom sorting will retain it by default, because the "Docs" page usually contains an overview of the component's usage. But you can change it by the `typeOrder` property. This is the default value, which groups all pages of the `docs` type before all pages of the `story` type:

```js
{
  storyOrder: ...

  typeOrder: ['docs', 'story']
}
```

The order of types in he array will be the order of the page groups. If you specify just one type, `['docs']` or `['story']`, pages of this type will be grouped toghether at the beginning and all other pages will follow behind them, regardless of their type, sorted only by their names.

If you want to handle the `docs` pages like any other stories and sort all the pages only by their names, you can pass an empty array to `typeOrder` to disable the gouping by type:

```js
{
  storyOrder: ...

  typeOrder: []
}
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

Copyright (c) 2022-2024 Ferdinand Prantl<br>
Licensed under the MIT license.

Sort icons created by [Freepik - Flaticon](https://www.flaticon.com/free-icon/sort_1707647?term=sort&related_id=1707647)<br>
Licensed under the [Icon Free License (with attribution)](./docs/icon-license.pdf)

[storybook]: https://storybook.js.org/
[sorting configuration supported by Storybook]: https://storybook.js.org/docs/react/writing-stories/naming-components-and-hierarchy#sorting-stories
[algorithm how Storybook generates the names of stories]: https://storybook.js.org/docs/react/api/csf#named-story-exports
[example of a Storybook project using this package]: ./example
[versions `1.x` of this package]: https://github.com/prantlf/storybook-multilevel-sort/tree/v1.x#readme
[open issue]: https://github.com/prantlf/storybook-multilevel-sort/issues/8#issuecomment-1537507235
[documentation about how to migrate]: ./docs/MIGRATION.md
[Node.js]: http://nodejs.org/
[NPM]: https://www.npmjs.com/
[PNPM]: https://pnpm.io/
[Yarn]: https://yarnpkg.com/
