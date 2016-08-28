(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var option = {
  glitch: "8",
  waveDistance: "20",
  renderLineHeight: "100",
  cuttingHeight: "3"
};

navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
window.URL = window.URL || window.webkitURL;

function initialize() {
  navigator.getUserMedia({ audio: false, video: true }, function (stream) {
    var video = document.getElementById('webcam');
    video.crossOrigin = 'anonymous';
    video.src = URL.createObjectURL(stream);
    video.play();
    renderStart();
  }, function (error) {
    console.error(error);
  });
}

function renderStart() {
  var video = document.getElementById('webcam');
  var buffer = document.createElement('canvas');
  var display = document.createElement('canvas');
  display.style.width = window.innerWidth + 'px';
  display.style.height = window.innerHeight + 'px';
  display.width = window.innerWidth * window.devicePixelRatio;
  display.height = window.innerHeight * window.devicePixelRatio;

  // キャンバスを配置するdiv要素を作成し、bodyに追加
  var container = document.createElement('div');
  container.className = 'canvas-wrapper';
  container.style.width = window.innerWidth + 'px';
  container.style.height = window.innerHeight + 'px';
  container.style.overflow = 'hidden';
  container.appendChild(display);
  document.body.appendChild(container);

  var bufferContext = buffer.getContext('2d');
  var displayContext = display.getContext('2d');

  var render = function render() {
    requestAnimationFrame(render);
    // var width = video.videoWidth;
    // var height = video.videoHeight;
    var width = video.videoWidth;
    var height = video.videoHeight;
    if (width == 0 || height == 0) {
      return;
    }
    buffer.width = display.width = width;
    buffer.height = display.height = height;
    bufferContext.drawImage(video, 0, 0);

    var src = bufferContext.getImageData(0, 0, width, height); // カメラ画像のデータ
    var dest = bufferContext.createImageData(buffer.width, buffer.height); // 空のデータ（サイズはカメラ画像と一緒）

    // 色調反転
    // var src = bufferContext.getImageData(0, 0, width, height); // カメラ画像のデータ
    // var dest = bufferContext.createImageData(buffer.width, buffer.height); // 空のデータ（サイズはカメラ画像と一緒）
    //
    // for (var i = 0; i < dest.data.length; i += 4) {
    // 	dest.data[i + 0] = 255 - src.data[i + 0]; // Red
    // 	dest.data[i + 1] = 255 - src.data[i + 1]; // Green
    // 	dest.data[i + 2] = 255 - src.data[i + 2]; // Blue
    // 	dest.data[i + 3] = 255;                     // Alpha
    // }

    // エッジ処理
    // var src = bufferContext.getImageData(0, 0, width, height); // カメラ画像のデータ
    // var dest = bufferContext.createImageData(buffer.width, buffer.height); // 空のデータ（サイズはカメラ画像と一緒）
    //
    // for (var y = 1; y < height-1; y += 1) {
    // 	for (var x = 1; x < width-1; x += 1) {
    // 		for (var c = 0; c < 3; c += 1) {
    // 			var i = (y*width + x)*4 + c;
    // 			dest.data[i] = 127 + -src.data[i - width*4 - 4] -   src.data[i - width*4] - src.data[i - width*4 + 4] +
    // 							-src.data[i - 4]       + 8*src.data[i]       - src.data[i + 4] +
    // 							-src.data[i + width*4 - 4] -   src.data[i + width*4] - src.data[i + width*4 + 4];
    // 		}
    // 		dest.data[(y*width + x)*4 + 3] = 255; // Alpha
    // 	}
    // }

    // グリッチ
    var src = bufferContext.getImageData(0, 0, width, height); // カメラ画像のデータ
    var dest = bufferContext.createImageData(buffer.width, buffer.height); // 空のデータ（サイズはカメラ画像と一緒）

    var randR = Math.floor(Math.random() * option.glitch);
    var randG = Math.floor(Math.random() * option.glitch) * 3;
    var randB = Math.floor(Math.random() * option.glitch);
    for (var i = 0, len = src.width * src.height; i < len; i++) {
      // ★ここで使う。少し先にあるRGB値を取得し、設定。
      dest.data[i * 4 + 0] = src.data[(i + randR) * 4 + 0];
      dest.data[i * 4 + 1] = src.data[(i + randG) * 4 + 1];
      dest.data[i * 4 + 2] = src.data[(i + randB) * 4 + 2];
      dest.data[i * 4 + 3] = 255;
    }
    displayContext.putImageData(dest, 0, 0);

    // スリップ
    var startHeight = height * Math.random();
    var endHeight = startHeight + 30 + Math.random() * 40;
    for (var h = startHeight; h < endHeight; h++) {
      if (Math.random() < 0.1) h++;
      var image = bufferContext.getImageData(0, h, height, 1);
      displayContext.putImageData(image, Math.random() * option.waveDistance - option.waveDistance / 2, h);
    }
  };
  render();
}

window.addEventListener('load', initialize);

},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMvS2VudGFLYXRvaC9kZXZlbG9wbWVudHMvY2FudmFzLXdvcmsvZ2xpdGNoL3NyYy9qcy9hcHAuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQSxZQUFZLENBQUM7O0FBRWIsSUFBSSxNQUFNLEdBQUc7QUFDWCxRQUFNLEVBQUUsR0FBRztBQUNYLGNBQVksRUFBRSxJQUFJO0FBQ2xCLGtCQUFnQixFQUFFLEtBQUs7QUFDdkIsZUFBYSxFQUFFLEdBQUc7Q0FDbkIsQ0FBQTs7QUFFRCxTQUFTLENBQUMsWUFBWSxHQUFHLFNBQVMsQ0FBQyxZQUFZLElBQUksU0FBUyxDQUFDLGtCQUFrQixJQUFJLFNBQVMsQ0FBQyxlQUFlLENBQUU7QUFDOUcsTUFBTSxDQUFDLEdBQUcsR0FBRyxNQUFNLENBQUMsR0FBRyxJQUFJLE1BQU0sQ0FBQyxTQUFTLENBQUU7O0FBRTdDLFNBQVMsVUFBVSxHQUFHO0FBQ3JCLFdBQVMsQ0FBQyxZQUFZLENBQ3JCLEVBQUMsS0FBSyxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFDLEVBQzNCLFVBQVMsTUFBTSxFQUFFO0FBQ2hCLFFBQUksS0FBSyxHQUFHLFFBQVEsQ0FBQyxjQUFjLENBQUMsUUFBUSxDQUFDLENBQUM7QUFDM0MsU0FBSyxDQUFDLFdBQVcsR0FBRyxXQUFXLENBQUM7QUFDbkMsU0FBSyxDQUFDLEdBQUcsR0FBRyxHQUFHLENBQUMsZUFBZSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0FBQ3hDLFNBQUssQ0FBQyxJQUFJLEVBQUUsQ0FBQztBQUNiLGVBQVcsRUFBRSxDQUFDO0dBQ2QsRUFDRCxVQUFTLEtBQUssRUFBRTtBQUNmLFdBQU8sQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUM7R0FDckIsQ0FDRCxDQUFDO0NBQ0Y7O0FBRUQsU0FBUyxXQUFXLEdBQUc7QUFDdEIs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LEtBQUssQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUMxRCxRQUFJLEtBQUssR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUM7QUFDdEQsU0FBSSxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsR0FBRyxHQUFHLEdBQUcsQ0FBQyxLQUFLLEdBQUcsR0FBRyxDQUFDLE1BQU0sRUFBRSxDQUFDLEdBQUMsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFDOztBQUV0RCxVQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxLQUFLLENBQUEsR0FBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7QUFDakQsVUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsS0FBSyxDQUFBLEdBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO0FBQ2pELFVBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLEtBQUssQ0FBQSxHQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztBQUNqRCxVQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDO0tBQzFCO0FBQ0gsa0JBQWMsQ0FBQyxZQUFZLENBQUMsSUFBSSxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQzs7O0FBR3RDLFFBQUksV0FBVyxHQUFHLE1BQU0sR0FBRyxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUM7QUFDekMsUUFBSSxTQUFTLEdBQUcsV0FBVyxHQUFHLEVBQUUsR0FBSSxJQUFJLENBQUMsTUFBTSxFQUFFLEdBQUcsRUFBRSxBQUFDLENBQUM7QUFDeEQsU0FBSSxJQUFJLENBQUMsR0FBRyxXQUFXLEVBQUUsQ0FBQyxHQUFHLFNBQVMsRUFBRSxDQUFDLEVBQUUsRUFBQztBQUMxQyxVQUFHLElBQUksQ0FBQyxNQUFNLEVBQUUsR0FBRyxHQUFHLEVBQUMsQ0FBQyxFQUFFLENBQUM7QUFDekIsVUFBSSxLQUFLLEdBQUcsYUFBYSxDQUFDLFlBQVksQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLE1BQU0sRUFBRSxDQUFDLENBQUMsQ0FBQztBQUN4RCxvQkFBYyxDQUFDLFlBQVksQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLE1BQU0sRUFBRSxHQUFFLE1BQU0sQ0FBQyxZQUFZLEdBQUUsTUFBTSxDQUFDLFlBQVksR0FBRyxDQUFDLEFBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztLQUN2RztHQUdILENBQUM7QUFDRixRQUFNLEVBQUUsQ0FBQztDQUNUOztBQUVELE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxNQUFNLEVBQUUsVUFBVSxDQUFDLENBQUMiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgb3B0aW9uID0ge1xuICBnbGl0Y2g6IFwiOFwiLFxuICB3YXZlRGlzdGFuY2U6IFwiMjBcIixcbiAgcmVuZGVyTGluZUhlaWdodDogXCIxMDBcIixcbiAgY3V0dGluZ0hlaWdodDogXCIzXCJcbn1cblxubmF2aWdhdG9yLmdldFVzZXJNZWRpYSA9IG5hdmlnYXRvci5nZXRVc2VyTWVkaWEgfHwgbmF2aWdhdG9yLndlYmtpdEdldFVzZXJNZWRpYSB8fCBuYXZpZ2F0b3IubW96R2V0VXNlck1lZGlhIDtcbndpbmRvdy5VUkwgPSB3aW5kb3cuVVJMIHx8IHdpbmRvdy53ZWJraXRVUkwgO1xuXG5mdW5jdGlvbiBpbml0aWFsaXplKCkge1xuXHRuYXZpZ2F0b3IuZ2V0VXNlck1lZGlhKFxuXHRcdHthdWRpbzogZmFsc2UsIHZpZGVvOiB0cnVlfSxcblx0XHRmdW5jdGlvbihzdHJlYW0pIHtcblx0XHRcdHZhciB2aWRlbyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd3ZWJjYW0nKTtcbiAgICAgIHZpZGVvLmNyb3NzT3JpZ2luID0gJ2Fub255bW91cyc7XG5cdFx0XHR2aWRlby5zcmMgPSBVUkwuY3JlYXRlT2JqZWN0VVJMKHN0cmVhbSk7XG5cdFx0XHR2aWRlby5wbGF5KCk7XG5cdFx0XHRyZW5kZXJTdGFydCgpO1xuXHRcdH0sXG5cdFx0ZnVuY3Rpb24oZXJyb3IpIHtcblx0XHRcdGNvbnNvbGUuZXJyb3IoZXJyb3IpO1xuXHRcdH1cblx0KTtcbn1cblxuZnVuY3Rpb24gcmVuZGVyU3RhcnQoKSB7XG5cdHZhciB2aWRlbyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd3ZWJjYW0nKTtcblx0dmFyIGJ1ZmZlciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2NhbnZhcycpO1xuXHR2YXIgZGlzcGxheSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2NhbnZhcycpO1xuICBkaXNwbGF5LnN0eWxlLndpZHRoID0gd2luZG93LmlubmVyV2lkdGggKyAncHgnO1xuICBkaXNwbGF5LnN0eWxlLmhlaWdodCA9IHdpbmRvdy5pbm5lckhlaWdodCArICdweCc7XG4gIGRpc3BsYXkud2lkdGggPSB3aW5kb3cuaW5uZXJXaWR0aCAqIHdpbmRvdy5kZXZpY2VQaXhlbFJhdGlvO1xuICBkaXNwbGF5LmhlaWdodCA9IHdpbmRvdy5pbm5lckhlaWdodCAqIHdpbmRvdy5kZXZpY2VQaXhlbFJhdGlvO1xuXG4gIC8vIOOCreODo+ODs+ODkOOCueOCkumFjee9ruOBmeOCi2Rpduimgee0oOOCkuS9nOaIkOOBl+OAgWJvZHnjgavov73liqBcbiAgdmFyIGNvbnRhaW5lciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICBjb250YWluZXIuY2xhc3NOYW1lID0gJ2NhbnZhcy13cmFwcGVyJztcbiAgY29udGFpbmVyLnN0eWxlLndpZHRoID0gd2luZG93LmlubmVyV2lkdGggKyAncHgnO1xuICBjb250YWluZXIuc3R5bGUuaGVpZ2h0ID0gd2luZG93LmlubmVySGVpZ2h0ICsgJ3B4JztcbiAgY29udGFpbmVyLnN0eWxlLm92ZXJmbG93ID0gJ2hpZGRlbic7XG4gIGNvbnRhaW5lci5hcHBlbmRDaGlsZChkaXNwbGF5KTtcbiAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChjb250YWluZXIpO1xuXG5cdHZhciBidWZmZXJDb250ZXh0ID0gYnVmZmVyLmdldENvbnRleHQoJzJkJyk7XG5cdHZhciBkaXNwbGF5Q29udGV4dCA9IGRpc3BsYXkuZ2V0Q29udGV4dCgnMmQnKTtcblxuXHR2YXIgcmVuZGVyID0gZnVuY3Rpb24oKSB7XG5cdFx0cmVxdWVzdEFuaW1hdGlvbkZyYW1lKHJlbmRlcik7XG5cdFx0Ly8gdmFyIHdpZHRoID0gdmlkZW8udmlkZW9XaWR0aDtcblx0XHQvLyB2YXIgaGVpZ2h0ID0gdmlkZW8udmlkZW9IZWlnaHQ7XG5cdFx0dmFyIHdpZHRoID0gdmlkZW8udmlkZW9XaWR0aDtcblx0XHR2YXIgaGVpZ2h0ID0gdmlkZW8udmlkZW9IZWlnaHQ7XG5cdFx0aWYgKHdpZHRoID09IDAgfHwgaGVpZ2h0ID09IDApIHtyZXR1cm47fVxuXHRcdGJ1ZmZlci53aWR0aCA9IGRpc3BsYXkud2lkdGggPSB3aWR0aDtcblx0XHRidWZmZXIuaGVpZ2h0ID0gZGlzcGxheS5oZWlnaHQgPSBoZWlnaHQ7XG5cdFx0YnVmZmVyQ29udGV4dC5kcmF3SW1hZ2UodmlkZW8sIDAsIDApO1xuXG5cdFx0dmFyIHNyYyA9IGJ1ZmZlckNvbnRleHQuZ2V0SW1hZ2VEYXRhKDAsIDAsIHdpZHRoLCBoZWlnaHQpOyAvLyDjgqvjg6Hjg6nnlLvlg4/jga7jg4fjg7zjgr9cblx0XHR2YXIgZGVzdCA9IGJ1ZmZlckNvbnRleHQuY3JlYXRlSW1hZ2VEYXRhKGJ1ZmZlci53aWR0aCwgYnVmZmVyLmhlaWdodCk7IC8vIOepuuOBruODh+ODvOOCv++8iOOCteOCpOOCuuOBr+OCq+ODoeODqeeUu+WDj+OBqOS4gOe3ku+8iVxuXG4gICAgLy8g6Imy6Kq/5Y+N6LuiXG4gICAgLy8gdmFyIHNyYyA9IGJ1ZmZlckNvbnRleHQuZ2V0SW1hZ2VEYXRhKDAsIDAsIHdpZHRoLCBoZWlnaHQpOyAvLyDjgqvjg6Hjg6nnlLvlg4/jga7jg4fjg7zjgr9cbiAgICAvLyB2YXIgZGVzdCA9IGJ1ZmZlckNvbnRleHQuY3JlYXRlSW1hZ2VEYXRhKGJ1ZmZlci53aWR0aCwgYnVmZmVyLmhlaWdodCk7IC8vIOepuuOBruODh+ODvOOCv++8iOOCteOCpOOCuuOBr+OCq+ODoeODqeeUu+WDj+OBqOS4gOe3ku+8iVxuICAgIC8vXG4gICAgLy8gZm9yICh2YXIgaSA9IDA7IGkgPCBkZXN0LmRhdGEubGVuZ3RoOyBpICs9IDQpIHtcbiAgICAvLyBcdGRlc3QuZGF0YVtpICsgMF0gPSAyNTUgLSBzcmMuZGF0YVtpICsgMF07IC8vIFJlZFxuICAgIC8vIFx0ZGVzdC5kYXRhW2kgKyAxXSA9IDI1NSAtIHNyYy5kYXRhW2kgKyAxXTsgLy8gR3JlZW5cbiAgICAvLyBcdGRlc3QuZGF0YVtpICsgMl0gPSAyNTUgLSBzcmMuZGF0YVtpICsgMl07IC8vIEJsdWVcbiAgICAvLyBcdGRlc3QuZGF0YVtpICsgM10gPSAyNTU7ICAgICAgICAgICAgICAgICAgICAgLy8gQWxwaGFcbiAgICAvLyB9XG5cblxuICAgIC8vIOOCqOODg+OCuOWHpueQhlxuICAgIC8vIHZhciBzcmMgPSBidWZmZXJDb250ZXh0LmdldEltYWdlRGF0YSgwLCAwLCB3aWR0aCwgaGVpZ2h0KTsgLy8g44Kr44Oh44Op55S75YOP44Gu44OH44O844K/XG4gICAgLy8gdmFyIGRlc3QgPSBidWZmZXJDb250ZXh0LmNyZWF0ZUltYWdlRGF0YShidWZmZXIud2lkdGgsIGJ1ZmZlci5oZWlnaHQpOyAvLyDnqbrjga7jg4fjg7zjgr/vvIjjgrXjgqTjgrrjga/jgqvjg6Hjg6nnlLvlg4/jgajkuIDnt5LvvIlcbiAgICAvL1xuICAgIC8vIGZvciAodmFyIHkgPSAxOyB5IDwgaGVpZ2h0LTE7IHkgKz0gMSkge1xuICAgIC8vIFx0Zm9yICh2YXIgeCA9IDE7IHggPCB3aWR0aC0xOyB4ICs9IDEpIHtcbiAgICAvLyBcdFx0Zm9yICh2YXIgYyA9IDA7IGMgPCAzOyBjICs9IDEpIHtcbiAgICAvLyBcdFx0XHR2YXIgaSA9ICh5KndpZHRoICsgeCkqNCArIGM7XG4gICAgLy8gXHRcdFx0ZGVzdC5kYXRhW2ldID0gMTI3ICsgLXNyYy5kYXRhW2kgLSB3aWR0aCo0IC0gNF0gLSAgIHNyYy5kYXRhW2kgLSB3aWR0aCo0XSAtIHNyYy5kYXRhW2kgLSB3aWR0aCo0ICsgNF0gK1xuICAgIC8vIFx0XHRcdFx0XHRcdFx0LXNyYy5kYXRhW2kgLSA0XSAgICAgICArIDgqc3JjLmRhdGFbaV0gICAgICAgLSBzcmMuZGF0YVtpICsgNF0gK1xuICAgIC8vIFx0XHRcdFx0XHRcdFx0LXNyYy5kYXRhW2kgKyB3aWR0aCo0IC0gNF0gLSAgIHNyYy5kYXRhW2kgKyB3aWR0aCo0XSAtIHNyYy5kYXRhW2kgKyB3aWR0aCo0ICsgNF07XG4gICAgLy8gXHRcdH1cbiAgICAvLyBcdFx0ZGVzdC5kYXRhWyh5KndpZHRoICsgeCkqNCArIDNdID0gMjU1OyAvLyBBbHBoYVxuICAgIC8vIFx0fVxuICAgIC8vIH1cblxuICAgIC8vIOOCsOODquODg+ODgVxuICAgIHZhciBzcmMgPSBidWZmZXJDb250ZXh0LmdldEltYWdlRGF0YSgwLCAwLCB3aWR0aCwgaGVpZ2h0KTsgLy8g44Kr44Oh44Op55S75YOP44Gu44OH44O844K/XG4gICAgdmFyIGRlc3QgPSBidWZmZXJDb250ZXh0LmNyZWF0ZUltYWdlRGF0YShidWZmZXIud2lkdGgsIGJ1ZmZlci5oZWlnaHQpOyAvLyDnqbrjga7jg4fjg7zjgr/vvIjjgrXjgqTjgrrjga/jgqvjg6Hjg6nnlLvlg4/jgajkuIDnt5LvvIlcblxuICAgIHZhciByYW5kUiA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIG9wdGlvbi5nbGl0Y2gpO1xuICAgIHZhciByYW5kRyA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIG9wdGlvbi5nbGl0Y2gpICogMztcbiAgICB2YXIgcmFuZEIgPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiBvcHRpb24uZ2xpdGNoKTtcbiAgICBmb3IodmFyIGkgPSAwLCBsZW4gPSBzcmMud2lkdGggKiBzcmMuaGVpZ2h0OyBpPGxlbjsgaSsrKXtcbiAgICAgIC8vIOKYheOBk+OBk+OBp+S9v+OBhuOAguWwkeOBl+WFiOOBq+OBguOCi1JHQuWApOOCkuWPluW+l+OBl+OAgeioreWumuOAglxuICAgICAgZGVzdC5kYXRhW2kqNCArIDBdID0gc3JjLmRhdGFbKGkgKyByYW5kUikqNCArIDBdO1xuICAgICAgZGVzdC5kYXRhW2kqNCArIDFdID0gc3JjLmRhdGFbKGkgKyByYW5kRykqNCArIDFdO1xuICAgICAgZGVzdC5kYXRhW2kqNCArIDJdID0gc3JjLmRhdGFbKGkgKyByYW5kQikqNCArIDJdO1xuICAgICAgZGVzdC5kYXRhW2kqNCArIDNdID0gMjU1O1xuICAgIH1cblx0XHRkaXNwbGF5Q29udGV4dC5wdXRJbWFnZURhdGEoZGVzdCwgMCwgMCk7XG5cbiAgICAvLyDjgrnjg6rjg4Pjg5dcbiAgICB2YXIgc3RhcnRIZWlnaHQgPSBoZWlnaHQgKiBNYXRoLnJhbmRvbSgpO1xuICAgIHZhciBlbmRIZWlnaHQgPSBzdGFydEhlaWdodCArIDMwICsgKE1hdGgucmFuZG9tKCkgKiA0MCk7XG4gICAgZm9yKHZhciBoID0gc3RhcnRIZWlnaHQ7IGggPCBlbmRIZWlnaHQ7IGgrKyl7XG4gICAgICBpZihNYXRoLnJhbmRvbSgpIDwgMC4xKWgrKztcbiAgICAgICAgdmFyIGltYWdlID0gYnVmZmVyQ29udGV4dC5nZXRJbWFnZURhdGEoMCwgaCwgaGVpZ2h0LCAxKTtcbiAgICAgICAgZGlzcGxheUNvbnRleHQucHV0SW1hZ2VEYXRhKGltYWdlLCBNYXRoLnJhbmRvbSgpKiBvcHRpb24ud2F2ZURpc3RhbmNlLShvcHRpb24ud2F2ZURpc3RhbmNlIC8gMiksIGgpO1xuICAgIH1cblxuXG5cdH07XG5cdHJlbmRlcigpO1xufVxuXG53aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignbG9hZCcsIGluaXRpYWxpemUpO1xuIl19
