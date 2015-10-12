for (let vendor of ['moz', 'o', 'ms']) {
  window.requestAnimationFrame = window[`${vendor}RequestAnimationFrame`];
  if (window.requestAnimationFrame) {
    break;
  }
}

if (!window.requestAnimationFrame) {
  window.requestAnimationFrame = (callback) => {
    setTimeout(callback, 1000 / 60);
  }
}
