import {PolymerElement} from '../../@polymer/polymer/polymer-element.js';
import {afterNextRender} from '../../@polymer/polymer/lib/utils/render-status.js';
import {html} from '../../@polymer/polymer/lib/utils/html-tag.js';
import '../../@polymer/paper-button/paper-button.js';
import '../../@polymer/paper-listbox/paper-listbox.js';
import '../../@polymer/paper-item/paper-icon-item.js';
import '../../@advanced-rest-client/arc-icons/arc-icons.js';
import '../../@polymer/paper-input/paper-input.js';
import '../../@polymer/paper-dropdown-menu/paper-dropdown-menu.js';
import '../../@polymer/iron-icon/iron-icon.js';
import '../../@polymer/iron-form/iron-form.js';
import '../../@advanced-rest-client/paper-chip-input/paper-chip-input.js';
import '../../@polymer/paper-toggle-button/paper-toggle-button.js';
/**
 * `export-options`
 *
 * Export options dialog for ARC.
 *
 * Listen for (non-bubbling) `accept` or `cancel` custom events.
 *
 * The detail on the `accept` event has the following values:
 *
 * ```json
 * {
 *  "options": {
 *    "file": "my-demo-file.json",
 *    "provider": "drive",
 *    "skipImport": true
 *  }
 * }
 * ```
 *
 * Additionally it can contain provider specific options:
 *
 * ```json
 * {
 *  "providerOptions": {
 *    "parents": [
 *      {
 *        "name": "Existing folder",
 *        "id": "folder2"
 *      },
 *      {
 *        "name": "Create folder",
 *      }
 *   ]
 * }
 * ```
 *
 * ## Styling
 *
 * `<export-options>` provides the following custom properties and mixins for styling:
 *
 * Custom property | Description | Default
 * ----------------|-------------|----------
 * `--primary-color` | Theme property, button color or action button background color | ``
 * `--primary-action-color` | Theme property, action button color | `#fff`
 *
 * @customElement
 * @polymer
 * @demo demo/index.html
 * @memberof ApiElements
 */
class ExportOptions extends PolymerElement {
  static get template() {
    return html`
    <style>
    :host {
      display: block;
    }

    [hidden] {
      display: none !important;
    }

    h3 {
      font-size: var(--arc-font-subhead-font-size);
      font-weight: var(--arc-font-subhead-font-weight);
      line-height: var(--arc-font-subhead-line-height);
    }

    .menu-item iron-icon {
      color: var(--context-menu-item-color);
    }

    .menu-item {
      color: var(--context-menu-item-color);
      background-color: var(--context-menu-item-background-color);
      cursor: pointer;
    }

    .menu-item:hover {
      color: var(--context-menu-item-color-hover);
      background-color: var(--context-menu-item-background-color-hover);
    }

    .menu-item:hover iron-icon {
      color: var(--context-menu-item-color-hover);
    }

    .actions {
      display: -ms-flexbox;
      -ms-flex-direction: row;
      -ms-flex-pack: end;
      display: -webkit-flex;
      -webkit-flex-direction: row;
      -webkit-justify-content: flex-end;
      display: flex;
      flex-direction: row;
      justify-content: flex-end;

      margin-top: 20px;
    }

    .actions paper-button {
      color: var(--export-options-action-button-color, var(--primary-color));
      background-color: var(--export-options-action-button-background-color);
      padding-left: 12px;
      padding-right: 12px;
    }

    .actions paper-button.action-button {
      background-color: var(--primary-color);
      color: var(--primary-action-color, #fff);
    }

    .toggle-option {
      margin: 8px 0;
    }
    </style>
    <h3>Export options</h3>
    <iron-form id="form">
      <form method="post" enctype="application/json" autocomplete="on">
        <paper-input label="File name" name="file" autocomplete="on" value="{{file}}" required="" auto-validate="" error-message="File name is required"></paper-input>
        <paper-dropdown-menu label="Destination" name="provider" required="" error-message="Destination is required" on-iron-select="_validateProvider" id="provider">
          <paper-listbox slot="dropdown-content" selected="{{provider}}" attr-for-selected="value" selected-value="value">
            <paper-icon-item class="menu-item" value="file"><iron-icon icon="arc:archive" slot="item-icon"></iron-icon>Export to file</paper-icon-item>
            <paper-icon-item class="menu-item" value="drive"><iron-icon icon="arc:drive-color" slot="item-icon"></iron-icon>Export to Google Drive</paper-icon-item>
            <slot name="export-option"></slot>
          </paper-listbox>
        </paper-dropdown-menu>
        <paper-chip-input label="Drive folders name (optional)" name="providerOptions.parents" value="{{providerOptions.parents}}" hidden\$="[[!isDrive]]" source="[[_driveSuggestions]]" chip-remove-icon="arc:close" on-iron-overlay-opened="_stopEvent" on-iron-overlay-closed="_stopEvent"></paper-chip-input>
        <div class="toggle-option">
          <paper-toggle-button checked="{{skipImport}}" title="With this option the file will be read directly to requests workspace instead showing import panel.">When opening file skip import dialog</paper-toggle-button>
        </div>
        <div class="actions">
          <paper-button on-click="cancel">Cancel</paper-button>
          <paper-button on-click="confirm" class="action-button">Export</paper-button>
        </div>
      </form>
    </iron-form>
`;
  }

  static get is() {
    return 'export-options';
  }
  static get properties() {
    return {
      /**
       * Export file name.
       */
      file: {type: String, notify: true},
      /**
       * Export provider. By default it is `drive` or `file`.
       */
      provider: {type: String, notify: true},
      /**
       * Google Drive export options. Only relevant when `file` is set to
       * `drive`.
       *
       * The object contains `parents` property which is an array of provided
       * by the user names of folder to create or IDs of already created
       * folders.
       *
       * The `accept` event will contain processed lsit of parents where
       * each item is an object with `name` and optional `id` property.
       * If the `id` property is not set then new folder to be created when
       * uploading the item to Google Drive.
       */
      providerOptions: {
        type: Object,
        notify: true,
        value: function() {
          return {};
        }
      },
      /**
       * Tells the application to set configuration on the export file to
       * skip import and insert project directly into workspace.
       */
      skipImport: Boolean,
      /**
       * Computed value, true when current provider is Google Drive.
       */
      isDrive: {type: Boolean, value: false, computed: '_computeIsDrive(provider)', observer: '_isDriveChanged'},
      driveFolders: {type: Array, observer: '_driveFoldersChanged'},
      _driveSuggestions: Array
    };
  }

  connectedCallback() {
    super.connectedCallback();
    this._isAttached = true;
    afterNextRender(this, () => {
      if (this.provider === 'drive' && !this.driveFolders) {
        this._listDriveFolders();
      }
    });
  }
  /**
   * Computes value for `isDrive` property
   * @param {String} file Current desination selection.
   * @return {Boolean} True when file equals `drive`.
   */
  _computeIsDrive(file) {
    return file === 'drive';
  }

  confirm() {
    if (!this.$.form.validate()) {
      return;
    }
    const data = this._getValues();
    this.dispatchEvent(new CustomEvent('accept', {
      detail: data
    }));
  }

  cancel() {
    this.dispatchEvent(new CustomEvent('cancel'));
  }

  _validateProvider() {
    this.$.provider.validate();
  }

  _getValues() {
    const result = {
      options: {
        file: this.file,
        provider: this.provider,
        skipImport: this.skipImport
      }
    };
    if (this.isDrive) {
      result.providerOptions = {
        parents: this._getDriveFolders()
      };
    }
    return result;
  }
  /**
   * Computes return valye for Gogole Drive folder.
   * It creates a list of objects with `name` and optional `id` property
   * which indicates whether the folder has to be created or not.
   * @return {Array<Object>} Parent folders definition.
   */
  _getDriveFolders() {
    let parents;
    if (this.providerOptions.parents) {
      parents = Array.from(this.providerOptions.parents);
    } else {
      parents = [];
    }
    const folders = this.driveFolders;
    for (let i = 0; i < parents.length; i++) {
      const name = parents[i];
      const item = {
        name
      };
      if (folders) {
        const folder = this._findFolder(folders, name);
        if (folder) {
          item.name = folder.name;
          item.id = folder.id;
        }
      }
      parents[i] = item;
    }
    return parents;
  }

  _findFolder(folders, id) {
    return folders.find((item) => item.id === id);
  }
  /**
   * Called automatically when `isDrive` property change.
   * Dispatches `iron-resize` custom event so parent elements can position this element
   * in e.g dialogs.
   * @param {Boolean} value Cusrrent isDrive value.
   */
  _isDriveChanged(value) {
    this.dispatchEvent(new CustomEvent('iron-resize', {
      bubbles: true,
      composed: true
    }));
    if (value) {
      this._listDriveFolders();
    }
  }
  /**
   * Attempts to read application settings by dispatching `settings-read`
   * with type `google-drive`. It expects to return `appFolders` with a list
   * of folder created by the app. This value is set as a suggestions on
   * folder input.
   * @return {Promise} This function is called automatically, this returns is
   * for tests.
   */
  _listDriveFolders() {
    if (!this._isAttached) {
      return;
    }
    this.driveFolders = undefined;
    const e = this._dispatchReadDriveSettings();
    if (!e.defaultPrevented) {
      console.info('Settings read event not handled for drive type.');
      return;
    }
    return e.detail.result
    .catch(() => {})
    .then((folders) => {
      this.driveFolders = folders && folders.length ? folders : undefined;
    });
  }
  /**
   * Dispatches `settings-read` custom event with type `google-drive`
   * @return {CustomEvent} e
   */
  _dispatchReadDriveSettings() {
    const e = new CustomEvent('google-drive-list-app-folders', {
      bubbles: true,
      cancelable: true,
      composed: true,
      detail: {}
    });
    this.dispatchEvent(e);
    return e;
  }
  /**
   * Transforms meta data related to created by the application Google Drive
   * folders to a list of suggestions.
   *
   * Google Drive folders meta are stores in the following structure:
   *
   * ```json
   * {
   *   "id": "Drive id",
   *   "name": "Folder name"
   * }
   * ```
   *
   * This produces suggestions for paper-chip-input in form:
   * ```json
   * {
   *   "value": "Folder name",
   *   "id": "Drive id"
   * }
   * ```
   * @param {?Array<Object>} folders List of folder.
   */
  _driveFoldersChanged(folders) {
    if (!folders || !(folders instanceof Array) || !folders.length) {
      this._driveSuggestions = undefined;
      return;
    }
    const result = [];
    for (let i = 0; i < folders.length; i++) {
      const folder = folders[i];
      if (!folder || !folder.id || !folder.name) {
        continue;
      }
      result[result.length] = {
        value: folder.name,
        id: folder.id
      };
    }
    this._driveSuggestions = result;
  }

  _stopEvent(e) {
    e.stopPropagation();
  }
}
window.customElements.define(ExportOptions.is, ExportOptions);
