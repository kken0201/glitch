'use strict';

import './requestAnimationFrame.js';

import Hanabi from './hanabi.js';

window.onload = () => {
  var hanabi = new Hanabi('hanabi');

  window.onclick = () => {
    hanabi.fire();
  }
}
