Open a commandline and try:

```
npx crosslink link "a/* -> b"
```

-   It should create a folder ``b`and create symlinks to`a/foo`and`a/bar`, because they each have a`package.json`.
-   It should not create a symlink to `a/baz` because it has no `package.json`
