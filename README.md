[![Published on NPM](https://img.shields.io/npm/v/@advanced-rest-client/export-options.svg)](https://www.npmjs.com/package/@advanced-rest-client/export-options)

[![Build Status](https://travis-ci.org/advanced-rest-client/export-options.svg?branch=stage)](https://travis-ci.org/advanced-rest-client/export-options)

[![Published on webcomponents.org](https://img.shields.io/badge/webcomponents.org-published-blue.svg)](https://www.webcomponents.org/element/advanced-rest-client/export-options)

# export-options

Export options dialog for ARC

### Example

```html
<export-options></export-options>
```

### API components

This components is a part of [API components ecosystem](https://elements.advancedrestclient.com/)

## Usage

### Installation
```
npm install --save @advanced-rest-client/export-options
```

### In an html file

```html
<html>
  <head>
    <script type="module">
      import './node_modules/@advanced-rest-client/export-options/export-options.js';
    </script>
  </head>
  <body>
    <export-options></export-options>
  </body>
</html>
```

### In a Polymer 3 element

```js
import {PolymerElement, html} from './node_modules/@polymer/polymer';
import './node_modules/@advanced-rest-client/export-options/export-options.js';

class SampleElement extends PolymerElement {
  static get template() {
    return html`
    <export-options></export-options>
    `;
  }
}
customElements.define('sample-element', SampleElement);
```

### Installation

```sh
git clone https://github.com/advanced-rest-client/export-options
cd api-url-editor
npm install
npm install -g polymer-cli
```

### Running the demo locally

```sh
polymer serve --npm
open http://127.0.0.1:<port>/demo/
```

### Running the tests
```sh
polymer test --npm
```
