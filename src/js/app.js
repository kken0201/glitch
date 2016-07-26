'use strict';

var option = {
  glitch: "8",
  waveDistance: "20",
  renderLineHeight: "100",
  cuttingHeight: "3"
}

navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia ;
window.URL = window.URL || window.webkitURL ;

function initialize() {
	navigator.getUserMedia(
		{audio: true, video: true},
		function(stream) {
			var video = document.getElementById('webcam');
      video.crossOrigin = 'anonymous';
			video.src = URL.createObjectURL(stream);
			video.play();
			renderStart();
		},
		function(error) {
			console.error(error);
		}
	);
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
  container.style.width = window.innerWidth + 'px';
  container.style.height = window.innerHeight + 'px';
  container.style.overflow = 'hidden';
  container.appendChild(display);
  document.body.appendChild(container);

	var bufferContext = buffer.getContext('2d');
	var displayContext = display.getContext('2d');

	var render = function() {
		requestAnimationFrame(render);
		// var width = video.videoWidth;
		// var height = video.videoHeight;
		var width = video.videoWidth;
		var height = video.videoHeight;
		if (width == 0 || height == 0) {return;}
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
    for(var i = 0, len = src.width * src.height; i<len; i++){
      // ★ここで使う。少し先にあるRGB値を取得し、設定。
      dest.data[i*4 + 0] = src.data[(i + randR)*4 + 0];
      dest.data[i*4 + 1] = src.data[(i + randG)*4 + 1];
      dest.data[i*4 + 2] = src.data[(i + randB)*4 + 2];
      dest.data[i*4 + 3] = 255;
    }
		displayContext.putImageData(dest, 0, 0);

    // スリップ
    var startHeight = height * Math.random();
    var endHeight = startHeight + 30 + (Math.random() * 40);
    for(var h = startHeight; h < endHeight; h++){
      if(Math.random() < 0.1)h++;
        var image = bufferContext.getImageData(0, h, height, 1);
        displayContext.putImageData(image, Math.random()* option.waveDistance-(option.waveDistance / 2), h);
    }


	};
	render();
}

window.addEventListener('load', initialize);
