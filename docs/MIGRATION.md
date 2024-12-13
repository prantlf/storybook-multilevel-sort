# Migration

Choose the version of this package according the the version of Storybook that you use.

| Version of this package | Supported Storybook version |
|-------------------------|-----------------------------|
| ^1                      | <=6                         |
| ^2                      | ^7, ^8, probably newer too  |

Read the migration chapter according to the old and new version of this package that you're going to upgrade to.

## Migration from 1.x to 2.x

When you upgrade Storybook 6 to 7 or newer, you will need to install a version 2 of this package and migrate the configuration of the custom sorting. The instructions below show how to start with the [configuration version 1] and end with the [configuration version 2].

### Version 1

The custom sorting was enabled by installing the `storybook-multilevel-sort` package in `package.json`:

```json
"devDependencies": {
  "storybook-multilevel-sort": "^1.2.1"
}
```

And by configuring the sort order in `.storybook/preview.js`:

```js
import sort from 'storybook-multilevel-sort'

const order = {
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

export const parameters = {
  options: {
    storySort: (story1, story2) => sort(order, story1, story2)
  }
}
```

### Version 2

The version of `storybook-multilevel-sort` package in `package.json` needs to be increased:

```json
"devDependencies": {
  "storybook-multilevel-sort": "^2.0.0"
}
```

And the configuration needs to be moved from `.storybook/preview.js` to `.storybook/main.js`. The object from the `order` variable in Version 1 belongs to the property `storyOrder` passed to the call to `configureSort`:

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

Eventually, the rest of code from Version 1 related to the custom sorting in `.storybook/preview.js` needs to be replaced with just the following:

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

Later changes to customising the sorting will be made only in `.storybook/main.js`.

[configuration version 1]: https://github.com/prantlf/storybook-multilevel-sort/tree/v1.x/example/.storybook
[configuration version 2]: https://github.com/prantlf/storybook-multilevel-sort/tree/master/examples/sb8-autodocs-all/.storybook
