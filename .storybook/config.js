/* import { configure } from '@storybook/svelte';

// automatically import all files ending in *.stories.js
configure(require.context('../stories', true, /\.stories\.js$/), module);
 */

 // simple component
/* import { configure } from '@storybook/svelte';
import '../src/index.css';

const req = require.context('../src', true, /\.stories.js$/);

function loadStories() {
  req.keys().forEach(filename => req(filename));
}

configure(loadStories, module) */

// simple component jest and storyshots
import { configure } from '@storybook/svelte';

import '../src/index.css';
import requireContext from 'require-context.macro';
import 'storybook-chromatic';

const req = requireContext('../src/components', true, /\.stories\.js$/);

function loadStories() {
  req.keys().forEach(filename => req(filename));
}

configure(loadStories, module)