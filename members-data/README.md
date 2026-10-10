# members-data

An app with records and sign-in: a list of a club's members, read from the
app's own data, and an account page that shows who is signed in.

## What is in it

```text
pwpack.json                          the app and its foundation pin
app/definitions/entities.json        the Member entity: name (required), role
app/data/Member.json                 three seed members, as { "data": [ … ] }
app/definitions/auth.json            sign-in: optional, by password, on the app's own host
app/definitions/navigation.json      the top bar: Members · Account, and the account control
app/surfaces/members.receipt.json    a repeater over {{Member}}: one card per member
app/surfaces/account.receipt.json    what sign-in does in this app
app/definitions/appearance.json      theme-zinc, light
app/plan.json                        the two pages and their purpose
```

How the data reaches the page:

1. `entities.json` declares the **Member** type and its fields.
2. `members.receipt.json` asks for it through the persistence capability, with
   one data source: `{ "id": "Member", "kind": "entity", "entityType": "Member" }`.
3. The source's `id` is the name the page binds. The repeater's block-level
   `"repeat": "{{Member}}"` makes its child a template: the runtime draws it
   once per record, and the child's `{{item.name}}` and `{{item.role}}` read
   each record's fields.
   `loadingWhen` and `errorWhen` bind to `{{__loading.Member}}` and
   `{{__errors.Member}}`, the flags the runtime keeps for every source.
4. `app/data/Member.json` holds the seed records a local host starts with.

## Run it

```sh
pwf add <foundation.pwpack>   # install the foundation this app pins (see ../README.md)
pwf validate
pwf dev
```

Records and sign-in need a **host**: something that answers the app's data
and session requests. `pwf dev` mounts the engine's local development host
beside the pages (records in memory, seeded from `app/data/`, and one
development user), so the whole loop runs on your machine:

1. `pwf dev` prints the address it serves and `local host mounted at …`.
2. Open the address. The members list is drawn from the three seed records:
   the host serves the `Member` entity source as its own record endpoint.
3. Select **Sign in** in the top bar and use any e-mail and password (the
   host has one development user). The control then shows the signed-in
   user and offers sign-out. It is there because `navigation.json` declares
   `account: { placement: "navbar" }`.

This folder works the same against any host that implements the data and
session protocols.

## Build and serve the result

```sh
pwf build                 # writes the runnable app to .pwf/out/
pwf run .pwf/out          # serves the static files at http://127.0.0.1:4700/
```

`pwf run` is a static file server: the built app renders, but with no host
behind it the list is empty. To serve it with data, put the built folder
behind a host that answers the record and session endpoints. The
self-hosting pages on pwfabric.com list exactly what that host must provide.
