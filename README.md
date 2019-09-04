[![Published on NPM](https://img.shields.io/npm/v/@advanced-rest-client/export-options.svg)](https://www.npmjs.com/package/@advanced-rest-client/export-options)

[![Build Status](https://travis-ci.org/advanced-rest-client/export-options.svg?branch=stage)](https://travis-ci.org/advanced-rest-client/export-options)

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

### In a LitElement

```js
import { LitElement, html } from 'lit-element';
import '@advanced-rest-client/export-options/export-options.js';

class SampleElement extends LitElement {
  render() {
    return html`
    <export-options @accept="${this._export}"></export-options>
    `;
  }
}
customElements.define('sample-element', SampleElement);
```

## Development

```sh
git clone https://github.com/advanced-rest-client/export-options
cd export-options
npm install
```

### Running the demo locally

```sh
npm start
```

### Running the tests
```sh
npm test
```
