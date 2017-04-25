# graphql

# Prerequisites

- [`node`][node] - `brew install node` prefered latest, required >= 7
- [`yarn`][yarn] - `brew install yarn`

[node]: https://nodejs.org/en/
[yarn]: https://yarnpkg.com/en/docs/install

If you're using VSCode, it is recommended that you download the
`GraphQL for VSCode` extension located [here][graphql-vscode], or you can run
`ext install graphql-for-vscode`.

[graphql-vscode]: https://marketplace.visualstudio.com/items?itemName=kumar-harsh.graphql-for-vscode

# Installation

```sh
git clone git@github.com:club-lpl/graphql.git # Clone the repo
cd graphql # Move into project directory
yarn # Install dependencies
```

# Usage

```sh
yarn start # Start the server
yarn start.dev # Starts the server in dev mode
```

Then open up [http://localhost:8000/graphiql](http://localhost:8000/graphiql)

# Things we'd still like to cover:

_Not in any particular order_

- [x] Data Loader
- [x] Query Fragments
- [x] Unions / Interfaces
- [ ] Pagination / Relay compliance
- [x] Authentication / Authorization
- [x] Hooking it up to a real database / Context
- [x] Custom Scalar Types - [Use Libs](http://dev.apollodata.com/tools/graphql-tools/scalars.html#Using-a-package)
- [ ] Subscriptions
- [ ] Deprecation
- [x] Directives
- [x] Custom Error Validation
- [ ] Migrate REST to GraphQL and vice versa
- [ ] Mocking
- [ ] Testing
- [ ] Usage on client
