# Pixelattack Boilerplate

A personal small scale boilerplate for Pixelattack projects

## Install

Go into the project directory

```
cd project-name
```

then run

```
git clone git@github.com:apsuhos/pixelattack-boilerplate.git .
&& rm -rf .git
&& npm install
&& git init
&& git add .
&& git commit -m "Initial commit"
&& git checkout -b dev
&& npm run dev

```

### Directory

```
Project
├── .vscode
│   └── settings.json
├── assets
├── .editorconfig
├── .eslintrc
├── .gitattributes
├── .gitignore
├── .prettierignore
├── prettierrc
├── stylelintrc
├── gulpfile.js
├── LICENCE
├── package.json
├── package-lock.json
├── README.md
└── src/
    ├── scss/
    │   ├── components/
    │   │   └── _components.buttons.scss
    │   │   └── _components.wrapper.scss
    │   ├── elements/
    │   │   └── _elements.body.scss
    │   │   └── _elements.headings.scss
    │   │   └── _elements.links.scss
    │   │   └── _elements.root.scss
    │   ├── objects/
    │   │   └── _objects.box.scss
    │   │   └── _objects.media.scss
    │   │   └── _objects.row.scss
    │   │   └── _objects.section.scss
    │   │   └── _objects.wrapper.scss
    │   ├── settings/
    │   │   ├──_settings.config.scss
    │   ├── tools/
    │   │   ├──_tools.fluid-font-size.scss
    │   ├── utilities/
    │   │   └──_utilities.bgcolors.scss
    │   │   └──_utilities.colors.scss
    │   │   └──_utilities.displays.scss
    │   │   └──_utilities.flexbox.scss
    │   │   └──_utilities.responsive-spacings.scss
    │   │   └──_utilities.space.scss
    │   │   └──_utilities.spacings.scss
    │   │   └──_utilities.text-align.scss
    │   │   └──_utilities.typography.scss
    │   │   └──_utilities.widths.scss
    │   ├── _tokens_.scss
    │   └── main.scss
    ├── js
    │   └── main.js
    ├── images
    ├── fonts
    └── index.html
```

## TODOS

- Fluid font size
- Template engine
- Terser options
- Head of html document
- Critical css
- inuitcss plugins extensions
- Favicon generator + `.psd`
- Front end checklist
- Responsive images
- JSON-LD

Have fun!
