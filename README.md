# crosslink

A utility for creating symlinks to node packages.
Useful for combining multiple yarn workspaces.

Supports scoped package names.

## Installation

Install it as a global tool or as a dependency in your project.

```sh
# global install
npm install -g @loopmode/crosslink

# just in this project
yarn add @loopmode/crosslink --dev
```

Or don't install at all and use `npx` instead (available since npm@5.2.0).
Unfortunately, when using `npx`, you must specify the full package name including scope: `npx @loopmode/crosslink`.

# Usage

## Default command

The default command will run with default settings, look for definitions and try to create symlinks.
It checks package.json and .crosslink files for `"crosslink": []` definitions.

```sh
crosslink

# same recursively for all nested directories
crosslink -r


# dry run, report but don't create the symlinks
crosslink -d


# load definitions from a file other than .crosslink or package.json
crosslink . -f symlinks.json


# recurse all workspace packages, use package.json files and the "symlinks" property inside them
crosslink workspace --f package.json -p symlinks -r
```

See `crosslink --help` for an overview:

```sh
$ crosslink --help

  Usage: crosslink [target]

  Options:

    -V, --version                output the version number
    -f, --filename [filename]    Name of definition files to use. (default: .crosslink)
    -p, --propname [propname]    Name of property to use in JSON definitions. (default: crosslink)
    -r, --recursive [recursive]  Scan for crosslink definitions recursively. (default: false)
    -d, --dry [dry]              Perform a dry run without actually creating any symlinks. (default: false)
    -h, --help                   output usage information
```

## link command

The link command takes one definition and executes it in the current directory. Make sure to wrap your definition in quotes.

```
 link "./a/* -> ../b"
```

See `crosslink link --help` for an overview:

```sh
$ crosslink link --help

  Usage: link [options] <definition>

  Options:

    -d, --dry [dry]  perform a dry run and report, do not create symlinks (default: false)
    -h, --help       output usage information

  Arguments:

     definition                  A definition in the format source->target
```

Create a `.crosslink` file or add a `"crosslink"` array in your package.json, then run `npx @loopmode/crosslink` in the directory.

## 1) definitions file

By default, you can provide a file named `.crosslink` and define instructions in it, or a field `"crosslink"` in your package.json file.
You can specify a different filename using the `--filename` parameter.

In any case: A definitions file can be either a textfile with one instruction per line, or a json file with an `"crosslink"` array of instructions.

Running `crosslink` against such a file is basically the same as calling a bunch of `crosslink link <instruction>` commands manually.

## 2) instructions

An instruction is a string in the format `sourceGlob->targetGlob`: it consists of two globs combined with a dash and an arrow.
Any glob pattern supported by [glob](http://npmjs.com/package/glob) should work.

Note: This is for symlinking node packages, therefore the left-hand side glob will only match target directories that contain a `package.json` file.

- The right-hand side will match any target directories.
- All left-hand matches will be symlinked to all right-hand matches.
- Missing folder structures will be created, e.g. `a/* -> b/sub/node_modules` works even when there is no `b` folder yet

Consider this folder structure:

```sh
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

Now we run the `link` command with a single instruction:

```sh
$ crosslink link "./a/*->./b"
[crosslink] created: D:/Projects/npm/crosslink/examples/simple/a/bar → D:/Projects/npm/crosslink/examples/simple/b/@a/bar
[crosslink] created: D:/Projects/npm/crosslink/examples/simple/a/foo → D:/Projects/npm/crosslink/examples/simple/b/@a/foo
```

The result is that we have symlinks to `a/foo` and `a/bar`, but not to `a/baz` because it had no `package.json` file:

## Definition file: text format

If the definitions file is a textfile, place one instruction per line:

```
common/packages/* -> client/node_modules
common/packages/* -> server/node_modules
```

## Definition file: JSON format

If the definitions file is a json file, place a `"crosslink"` array of instructions in it:

```
{
    "crosslink": [
        "common/packages/* -> client/node_modules",
        "common/packages/* -> server/node_modules"
    ]
}
```

If you prefer to use a different property name than "crosslink", you can use the `-p` or `--propname` flag.

### Using package.json

You might just as well use your existing `package.json` and define a `"crosslink"` array inside of it.
