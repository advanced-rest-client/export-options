import '@advanced-rest-client/arc-demo-helper/arc-demo-helper.js';
import '../export-options.js';

function init() {
  const opts = document.querySelector('export-options');
  opts.onaccept = (e) => {
    const values = JSON.stringify(e.detail, null, 2);
    document.querySelector('output').innerText = values;
  };
  opts.ongoogledrivelistappfolders = (e) => {
    /* global Promise */
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
  };
}

window.customElements.whenDefined('export-options').then(() => init());
