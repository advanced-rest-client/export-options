import { fixture, assert, nextFrame } from '@open-wc/testing';
import sinon from 'sinon/pkg/sinon-esm.js';
import '../export-options.js';

describe('<export-options>', () => {
  async function basicFixture() {
    return (await fixture(`<export-options></export-options>`));
  }

  async function validFixture() {
    return (await fixture(`<export-options
      file="test-file" provider="file"></export-options>`));
  }

  async function fullDataFixture() {
    return (await fixture(`<export-options
      file="test-file.json"
      provider="drive"
      skipimport provideroptions='{"parents":["test"]}'></export-options>`));
  }

  describe('_isDriveChanged()', () => {
    let element;
    beforeEach(async () => {
      element = await basicFixture();
    });

    it('Dispatches iron-resize event', () => {
      const spy = sinon.spy();
      element.addEventListener('iron-resize', spy);
      element._isDriveChanged();
      assert.isTrue(spy.called);
    });

    it('Calls _listDriveFolders() when true', () => {
      const spy = sinon.spy(element, '_listDriveFolders');
      element.isDrive = true;
      element._isDriveChanged();
      assert.isTrue(spy.called);
    });

    it('Won\'t call _listDriveFolders() when false', () => {
      const spy = sinon.spy(element, '_listDriveFolders');
      element.isDrive = false;
      element._isDriveChanged();
      assert.isFalse(spy.called);
    });
  });

  describe('cancel()', () => {
    let element;
    beforeEach(async () => {
      element = await basicFixture();
    });

    it('Dispatches cancel event', () => {
      const spy = sinon.spy();
      element.addEventListener('cancel', spy);
      element.cancel();
      assert.isTrue(spy.called);
    });
  });

  describe('confirm()', () => {
    let element;
    beforeEach(async () => {
      element = await validFixture();
      await nextFrame();
    });

    it('Dispatches accept event', () => {
      const spy = sinon.spy();
      element.addEventListener('accept', spy);
      element.confirm();
      assert.isTrue(spy.called);
    });

    it('Ignores event when not valid', async () => {
      element.file = '';
      await nextFrame();
      const spy = sinon.spy();
      element.addEventListener('accept', spy);
      element.confirm();
      assert.isFalse(spy.called);
    });

    it('Calls _getValues()', () => {
      const spy = sinon.spy(element, '_getValues');
      element.confirm();
      assert.isTrue(spy.called);
    });

    it('Event has detail', () => {
      const spy = sinon.spy();
      element.addEventListener('accept', spy);
      element.confirm();
      assert.typeOf(spy.args[0][0].detail, 'object');
      assert.deepEqual(spy.args[0][0].detail, element._getValues());
    });
  });

  describe('_getValues()', () => {
    let element;
    beforeEach(async () => {
      element = await fullDataFixture();
      await nextFrame();
    });

    it('Returns object', () => {
      const result = element._getValues();
      assert.typeOf(result, 'object');
    });

    it('Has options', () => {
      const result = element._getValues();
      assert.typeOf(result.options, 'object');
    });

    it('Options has file', () => {
      const result = element._getValues();
      assert.equal(result.options.file, 'test-file.json');
    });

    it('Options has provider', () => {
      const result = element._getValues();
      assert.equal(result.options.provider, 'drive');
    });

    it('Options has skipImport', () => {
      const result = element._getValues();
      assert.isTrue(result.options.skipImport);
    });

    it('Has providerOptions', () => {
      const result = element._getValues();
      assert.typeOf(result.providerOptions, 'object');
    });

    it('Drive has parents', () => {
      const result = element._getValues();
      const opts = result.providerOptions;
      assert.typeOf(opts.parents, 'array');
      assert.lengthOf(opts.parents, 1);
      assert.equal(opts.parents[0].name, 'test');
      assert.isUndefined(opts.parents[0].id);
    });

    it('providerOptions is not set when not Drive export', () => {
      element.provider = 'file';
      const result = element._getValues();
      assert.isUndefined(result.providerOptions);
    });
  });

  describe('_dispatchReadDriveSettings()', () => {
    let element;
    beforeEach(async () => {
      element = await basicFixture();
    });

    it('Dispatches google-drive-list-app-folders event', () => {
      const spy = sinon.spy();
      element.addEventListener('google-drive-list-app-folders', spy);
      element._dispatchReadDriveSettings();
      assert.isTrue(spy.called);
    });

    it('Returns the event', () => {
      const e = element._dispatchReadDriveSettings();
      assert.typeOf(e, 'customevent');
      assert.equal(e.type, 'google-drive-list-app-folders');
    });

    it('Event bubbles', () => {
      const e = element._dispatchReadDriveSettings();
      assert.isTrue(e.bubbles);
    });

    it('Event is cancelable', () => {
      const e = element._dispatchReadDriveSettings();
      assert.isTrue(e.cancelable);
    });

    it('Event has detail', () => {
      const e = element._dispatchReadDriveSettings();
      assert.typeOf(e.detail, 'object');
    });
  });

  describe('_listDriveFolders()', () => {
    let element;
    beforeEach(async () => {
      element = await basicFixture();
    });

    it('Clears driveFolders', () => {
      element.driveFolders = [];
      element._listDriveFolders();
      assert.isUndefined(element.driveFolders);
    });

    it('Calls _dispatchReadDriveSettings()', () => {
      const spy = sinon.spy(element, '_dispatchReadDriveSettings');
      element._listDriveFolders();
      assert.isTrue(spy.called);
    });

    it('Sets driveFolders property', async () => {
      element.addEventListener('google-drive-list-app-folders', function f(e) {
        element.removeEventListener('google-drive-list-app-folders', f);
        e.preventDefault();
        e.detail.result = Promise.resolve([{
          name: 'My APIs',
          id: 'folder1'
        }, {
          name: 'Company\'s APIs',
          id: 'folder2'
        }, {
          name: 'Developing',
          id: 'folder3'
        }]);
      });
      await element._listDriveFolders();
      assert.typeOf(element.driveFolders, 'array');
      assert.lengthOf(element.driveFolders, 3);
    });

    it('Skips driveFolders if missing', async () => {
      element.addEventListener('google-drive-list-app-folders', function f(e) {
        element.removeEventListener('google-drive-list-app-folders', f);
        e.preventDefault();
        e.detail.result = Promise.resolve([]);
      });
      await element._listDriveFolders();
      assert.isUndefined(element.driveFolders);
    });

    it('Ignores errors', async () => {
      element.addEventListener('google-drive-list-app-folders', function f(e) {
        element.removeEventListener('google-drive-list-app-folders', f);
        e.preventDefault();
        /* global Promise */
        e.detail.result = Promise.reject(new Error('test'));
      });
      await element._listDriveFolders();
      assert.isUndefined(element.driveFolders);
    });
  });

  describe('_getDriveFolders()', () => {
    let element;
    beforeEach(async () => {
      element = await basicFixture();
      element.driveFolders = [{
        name: 'My APIs',
        id: 'folder1'
      }, {
        name: 'Company\'s APIs',
        id: 'folder2'
      }, {
        name: 'Developing',
        id: 'folder3'
      }];
    });

    it('Returns empty array when no drive parents', () => {
      const result = element._getDriveFolders();
      assert.deepEqual(result, []);
    });

    it('Returns names array when no driveFolders', () => {
      element.driveFolders = undefined;
      element.providerOptions = {
        parents: ['f1', 'f2']
      };
      const result = element._getDriveFolders();
      assert.deepEqual(result, [{ name: 'f1' }, { name: 'f2' }]);
    });

    it('Returns names and ids', () => {
      element.providerOptions = {
        parents: ['folder1', 'new', 'folder2']
      };
      const result = element._getDriveFolders();
      assert.deepEqual(result, [{ name: 'My APIs', id: 'folder1' }, { name: 'new' },
        { name: 'Company\'s APIs', id: 'folder2' }]);
    });
  });

  describe('_stopEvent()', () => {
    it('Stops propagation', async () => {
      const element = await basicFixture();
      const e = {
        stopPropagation: () => {}
      };
      const spy = sinon.spy(e, 'stopPropagation');
      element._stopEvent(e);
      assert.isTrue(spy.called);
    });
  });

  describe('ongoogledrivelistappfolders', () => {
    let element;
    beforeEach(async () => {
      element = await basicFixture();
    });

    it('Getter returns previously registered handler', () => {
      assert.isUndefined(element.ongoogledrivelistappfolders);
      const f = () => {};
      element.ongoogledrivelistappfolders = f;
      assert.isTrue(element.ongoogledrivelistappfolders === f);
    });

    it('Calls registered function', () => {
      let called = false;
      const f = () => {
        called = true;
      };
      element.ongoogledrivelistappfolders = f;
      element._dispatchReadDriveSettings();
      element.ongoogledrivelistappfolders = null;
      assert.isTrue(called);
    });

    it('Unregisteres old function', () => {
      let called1 = false;
      let called2 = false;
      const f1 = () => {
        called1 = true;
      };
      const f2 = () => {
        called2 = true;
      };
      element.ongoogledrivelistappfolders = f1;
      element.ongoogledrivelistappfolders = f2;
      element._dispatchReadDriveSettings();
      element.ongoogledrivelistappfolders = null;
      assert.isFalse(called1);
      assert.isTrue(called2);
    });
  });

  describe('onaccept', () => {
    let element;
    beforeEach(async () => {
      element = await validFixture();
    });

    it('Getter returns previously registered handler', () => {
      assert.isUndefined(element.onaccept);
      const f = () => {};
      element.onaccept = f;
      assert.isTrue(element.onaccept === f);
    });

    it('Calls registered function', () => {
      let called = false;
      const f = () => {
        called = true;
      };
      element.onaccept = f;
      element.confirm();
      element.onaccept = null;
      assert.isTrue(called);
    });

    it('Unregisteres old function', () => {
      let called1 = false;
      let called2 = false;
      const f1 = () => {
        called1 = true;
      };
      const f2 = () => {
        called2 = true;
      };
      element.onaccept = f1;
      element.onaccept = f2;
      element.confirm();
      element.onaccept = null;
      assert.isFalse(called1);
      assert.isTrue(called2);
    });
  });

  describe('oncancel', () => {
    let element;
    beforeEach(async () => {
      element = await basicFixture();
    });

    it('Getter returns previously registered handler', () => {
      assert.isUndefined(element.oncancel);
      const f = () => {};
      element.oncancel = f;
      assert.isTrue(element.oncancel === f);
    });

    it('Calls registered function', () => {
      let called = false;
      const f = () => {
        called = true;
      };
      element.oncancel = f;
      element.cancel();
      element.oncancel = null;
      assert.isTrue(called);
    });

    it('Unregisteres old function', () => {
      let called1 = false;
      let called2 = false;
      const f1 = () => {
        called1 = true;
      };
      const f2 = () => {
        called2 = true;
      };
      element.oncancel = f1;
      element.oncancel = f2;
      element.cancel();
      element.oncancel = null;
      assert.isFalse(called1);
      assert.isTrue(called2);
    });
  });

  describe('onironresize', () => {
    let element;
    beforeEach(async () => {
      element = await basicFixture();
    });

    it('Getter returns previously registered handler', () => {
      assert.isUndefined(element.onironresize);
      const f = () => {};
      element.onironresize = f;
      assert.isTrue(element.onironresize === f);
    });

    it('Calls registered function', () => {
      let called = false;
      const f = () => {
        called = true;
      };
      element.onironresize = f;
      element._isDriveChanged();
      element.onironresize = null;
      assert.isTrue(called);
    });

    it('Unregisteres old function', () => {
      let called1 = false;
      let called2 = false;
      const f1 = () => {
        called1 = true;
      };
      const f2 = () => {
        called2 = true;
      };
      element.onironresize = f1;
      element.onironresize = f2;
      element._isDriveChanged();
      element.onironresize = null;
      assert.isFalse(called1);
      assert.isTrue(called2);
    });
  });
});
