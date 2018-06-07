# cross-link

A utility for creating symlinks to node packages.
Useful for combining multiple yarn workspaces.

Supports scoped package names.


## Use case

Allows you to use a project setup like this:

```javascript
/my-app
/my-app/.cross-link
/my-app/workspaces

/my-app/workspaces/client                   <- yarn workspace
/my-app/workspaces/client/packages
/my-app/workspaces/client/packages/client-app
/my-app/workspaces/client/packages/client-admin
/my-app/workspaces/client/packages/client-components
/my-app/workspaces/client/packages/client-utils

/my-app/workspaces/server/                  <- yarn workspace
/my-app/workspaces/server/packages/server-app
/my-app/workspaces/server/packages/server-admin
/my-app/workspaces/server/packages/server-utils

/my-app/workspaces/common/                  <- yarn workspace
/my-app/workspaces/common/packages/
/my-app/workspaces/common/packages/common-api
/my-app/workspaces/common/packages/common-utils
...

```

Thanks to yarn workspaces, each package can access its siblings already: Any client package can require any other client package, any server package can require any other server package, etc.

Now consider that `/my-app/.cross-link` contains this:

```
workspaces/common/packages/* -> workspaces/client/node_modules
workspaces/common/packages/* -> workspaces/server/node_modules
```

Running cross-link on this setup will create a symlink to each common package in both client and server workspaces.
Effectively, any client package and any server package will be able to require any common package. Hooray!

### More control over yarn dependency hoisting

Dependencies are hoisted only up to the individual yarn workspaces, but not further, preventing them from "bleeding over" into other workspaces.
For example, you can have one workspace that uses babel 6 and another one that uses babel 7 without any mixups due to dependency hoisting.

In a real-world-scenario, you might have a `create-react-app` client that uses babel 6, and you don't want to eject it or try to migrate to babel 7 manually. In near future you might just pull an official update if you stay un-ejected.

At the same time, you might have a server or utilities setup where you choose to use babel 7 already.

In a single yarn workspace, this scenario will have babel 6 and 7 co-exist all over the place.
Some babel plugins will simply not work and report that you're trying to run them with a wrong version of babel, and it's hard or impossible to get good control over the situation.

Using multiple yarn workspaces avoids those problems altogether, but it provides no way to cross-link packages across workspaces either.

That's where cross-link steps in.

### Project structure

TODO Describe project structure. Link to example repo.

Each workspace should have a snappy name that is also used as the scope for all contained packages, e.g. `client` and `"name": "@client/app"`, `"name": "@client/utils"` etc.

You basically have one more level in the high-level hierarchy:

```
project
project - workspace
project - workspace - package
```

Consider `project` being the "outer" project that contains several smaller projects.
If `project` is something called "hyper", it might contain many `workspace` folders like "web", "native", "server", "common" etc.
Finally, while a `package` can also be considered a "project" on its own, here it is defined by simply having a `package.json`.

Whenever a package grows too large - simply extract parts of it into another package in the same workspace, and simply import it without extra work other than running `cross-link` to update the links.

If you don't publish your packages anyways, don't bother with globally unique scope names. They only have to be unique within the same `project`,
so don't bother with `hyper-server`, just call it `server` and enjoy shorter imports.

If you do plan to publish some of your packages, then you should probably use more concise scope names.

```
import { Str } from '@server/utils';
// vs
import { Str } from '@hyper-server/utils';
```

## Installation

Install it as a global tool or as a dependency in your project.

```
# global install
npm install --global cross-link

# just in this project
yarn add cross-link --dev
```

Or don't install at all and use `npx` instead (available since npm@5.2.0).

# Usage

## Default command

The default command will run with default settings, look for definitions and try to create symlinks.

```
# basic command: "run in the current directory, it has a .cross-link file with definitions"
cross-link

# same recursively for all nested directories
cross-link -r


# dry run, report but don't create the symlinks
cross-link -d


# use a definitions file other than .cross-link
cross-link . -f symlinks.json


# recurse all workspace packages, use package.json files and the "symlinks" property inside them
cross-link workspace --f package.json -p symlinks -r
```

See `cross-link --help` for an overview:

```javascript

$ cross-link --help

  Usage: cross-link [target]

  Options:

    -V, --version                output the version number
    -f, --filename [filename]    Name of definition files to use. (default: .cross-link)
    -p, --propname [propname]    Name of property to use in JSON definitions. (default: cross-link)
    -r, --recursive [recursive]  Scan for cross-link definitions recursively. (default: false)
    -d, --dry [dry]              Perform a dry run without actually creating any symlinks. (default: false)
    -h, --help                   output usage information

```


## link command

The link command takes one definition and executes it in the current directory. Make sure to wrap your definition in quotes.

```
cross-link link "./a/* -> ../b"
```

See `cross-link link --help` for an overview:

```
$ cross-link link --help

  Usage: link [options] <definition>

  Options:

    -d, --dry [dry]  perform a dry run and report, do not create symlinks (default: false)
    -h, --help       output usage information

  Arguments:

     definition                  A definition in the format source->target
```


Create a `.cross-link` file or add a `"cross-link"` array in your package.json, then run `npx cross-link` in the directory.

## The `.cross-link` file

This can either be a textfile with one instruction per line, or a json file.
If it's a JSON file, it should contain a `"cross-link"` array with instructions.

Runnin `cross-link` against such a file is basically the same as calling a bunch of `cross-link link <instruction>` commands manually.

## Instructions

An instruction is a string in the format `sourceGlob->targetGlob`: it consists of two globs combined with a dash and an arrow.
Any glob pattern supported by [glob](http://npmjs.com/package/glob) should work.

- The left-hand side will pick directories that contain a `package.json` file.
- The right-hand side will pick target directories, in which to create symlinks for all left-hand matches.
    - Missing folder structures will be created, e.g. `a/* -> b/sub/node_modules` works even when there is no `b` folder yet

Consider this folder structure:
```
$ find .
.
./a
./a/bar
./a/bar/package.json
./a/baz
./a/baz/baz.txt
./a/foo
./a/foo/package.json
./b
```

Now we run `cross-link link` with a single instruction:

```
$ cross-link link "./a/*->./b"
[cross-link] created: D:/Projects/npm/cross-link/examples/simple/a/bar → D:\Projects\npm\cross-link\examples\simple\b\@a\bar
[cross-link] created: D:/Projects/npm/cross-link/examples/simple/a/foo → D:\Projects\npm\cross-link\examples\simple\b\@a\foo
```

The result is that we have symlinks to `a/foo` and `a/bar`, but not to `a/baz` because it had no `package.json` file:

```
a/
a/foo/
a/foo/package.json
a/bar/
a/bar/package.json
a/baz/
a/baz/baz.txt
b/
b/foo/
b/foo/package.json
b/bar/
b/bar/package.json
```

## Textfile

If `.cross-link` is a textfile, place one instruction per line, and you're good to go:

```javascript
common/packages/* -> client/node_modules
common/packages/* -> server/node_modules
```

## JSON file

If `.cross-link` is a json file, place a `"cross-link"` array of instructions in it

```javascript
{
    "cross-link": [
        "common/packages/* -> client/node_modules",
        "common/packages/* -> server/node_modules"
    ]
}
```

If you prefer to use a different property name than "cross-link", you can use the `-p` or `--propname` flag.

### Using package.json

You might just as well use your existing `package.json` and define a `"cross-link"` array inside of it.
cross-link doesn't mind - it's just a json file with the required property.

In this example, we choose to have a "symlinks" property in our `package.json`. We can then run:

```
cross-link -f package.json -p symlinks
```

