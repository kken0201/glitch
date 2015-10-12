'use strict';

import './requestAnimationFrame.js';

import Hanabi from './hanabi.js';

window.onclick = () => {
  new Hanabi('hanabi');
}
