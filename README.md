# UMD Libraries Exhibits — Omeka S theme

A shared theme for UMD Libraries digital exhibits on Omeka S 4.2. One theme
serves every exhibit; differences between exhibits come from the settings form
in `config/theme.ini`, not from separate forked themes. Version 0.1.0.

## Install

Themes are added to the production image as release zips in the `umd-omeka`
Dockerfile, unzipped into `themes/`. Add a line for this theme, pinned to a
release:

```dockerfile
-o UmdExhibits.zip https://github.com/umd-lib/umd-lib-omeka-theme/releases/download/vX.Y.Z/umd-lib-omeka-theme-X.Y.Z.zip \
```

Then select **UMD Libraries Exhibits** in the site's admin under Themes.

## Develop

Bind-mount a working copy into a running Omeka container. `umd-omeka`'s
`docker-compose` mounts one at `themes/umd-exhibits`; edit a template or CSS
file and reload, with no rebuild.

Do not edit `asset/css/design-system.css`. It is generated from the Libraries
design system and committed here; hand edits are overwritten when it is
regenerated. Put local styles in `asset/css/theme.css` or `asset/css/exhibits/`.

## Files

```
config/theme.ini              settings form, block variants, item-page regions
view/layout/                  site chrome
view/common/block-template/   two base partials and seven named treatments
asset/js/lightbox.js          lightbox, no dependencies
asset/css/design-system.css   generated (see Develop)
asset/css/theme.css           maps Omeka markup onto design-system tokens
```

## Constraints

- Every exhibit tier runs this theme unchanged. Anything that differs between
  exhibits must be set through `[config]`.
- Accent colour is a choice among three contrast-checked token sets, not a free
  colour picker.
- The theme uses only core Omeka block types, so it runs on the unmodified
  `umd-omeka` image.
- Dark mode inverts the design-system tokens rather than swapping a palette.
  Read `asset/css/theme.css` before changing CSS: a surface that should look the
  same in both modes needs fixed colour values, not tokens.
