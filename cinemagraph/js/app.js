var V_WIDTH = 320;
var V_HEIGHT = 240;
imageMatrices = [];
$(document).ready(function () {
    var video = initWebcam();
    if (!video) {
        return;
    }
    
    var $imageList = $('.image-list');

    var selectionCanvas = $('#canvas').get(0);
    var resultCanvas = $('#result').get(0);
    
    $('.btn-capture').click(function () {
        // when "Capture" button is clicked, capture all images, and store to imageList
        var captured = 0;
        var total_frame = parseInt($('#total_frame').val(), 10);
        var captureInterval = parseInt($('#interval').val(), 10);
        var placeholder =
                '<div class="captured-image">' +
                '  <div>Image #{count}</div>' +
                '  <canvas id="{canvas_id}" class="captured-canvas" width="{width}" height="{height}"></canvas>' +
                '</div>';
        
        $imageList.children().remove(); // clear prev images
        
        var intervalId = setInterval(function () {
            // capture an image every given interval
            if (captured >= total_frame) {
                clearInterval(intervalId);
                // on done, draw first captured on region selection area
                var first = $imageList.children().first().find('canvas').get(0).getContext('2d');
                var imgData = first.getImageData(0, 0, V_WIDTH, V_HEIGHT);
                selectionCanvas.getContext('2d').putImageData(imgData, 0, 0);
                return;
            }
            
            var canvas_id = "ccanvas_" + ++captured;
            var html = $.t(placeholder, {count: captured, canvas_id: canvas_id, width: V_WIDTH, height: V_HEIGHT});
            $imageList.append(html);
            var targetCanvas = $('#' + canvas_id, $imageList).get(0);
            captureImage(targetCanvas, video);
        }, captureInterval);

    });


    $('.btn-generate').click(function () {
        // convert all captured picture to matrix
        imageMatrices = []; // clear prev matrix
        var canvasList = $imageList.children().find('canvas');
        canvasList.each(function() {
            var m = convertToMatrix(this.getContext('2d').getImageData(0, 0, 320, 240));
            imageMatrices.push(m);
        });
        produceCinemaGraph($imageList.find('canvas'), resultCanvas);
    });
});

// inputs is list of canvas, resultCanvas is where final imageData should be put on
var produceCinemaGraph = function(inputs, resultCanvas) {
    var imgData = inputs[0].getContext('2d').getImageData(0, 0, V_WIDTH, V_HEIGHT);
    reverseImage(resultCanvas, imgData, V_WIDTH, V_HEIGHT);
};

var reverseImage = function (resultCanvas, imgData, width, height) {
    // rgba
    var ctx = resultCanvas.getContext('2d');
    resultData = ctx.createImageData(width, height); // {height, width, data:}
    var imgLength = imgData.data.length;
    for (var i = imgLength; i > 0; i -= 4) {
        resultData.data[imgLength - i] = imgData.data[i - 4];
        resultData.data[imgLength - i + 1] = imgData.data[i - 3];
        resultData.data[imgLength - i + 2] = imgData.data[i - 2];
        resultData.data[imgLength - i + 3] = imgData.data[i - 1];
    }
    
    ctx.putImageData(resultData, 0, 0);

    setTimeout(function() {
        var imgData = matrixToImageData(imageMatrices[0]);
        ctx.putImageData(imgData, 0, 0);
    }, 1000);
};

// capture pixels from `video' at the moment, and save to `canvas'
var captureImage = function (canvas, video) {
    canvas.getContext("2d").drawImage(video, 0, 0, V_WIDTH, V_HEIGHT);
};

var getImageData = function (canvas, x, y) {
    x = x || 0;
    y = y || 0;

    return canvas.getContext('2d').getImageData(x, y, V_WIDTH - x, V_HEIGHT - y);
};

var initWebcam = function () {
    var video = $('#video').get(0);
    navigator.getUserMedia = (navigator.getUserMedia ||
            navigator.webkitGetUserMedia ||
            navigator.mozGetUserMedia ||
            navigator.msGetUserMedia);

    if (navigator.getUserMedia) {
        navigator.getUserMedia(
                {
                    video: true,
                    audio: false
                },
        function (stream) {
            var url = window.URL || window.webkitURL;
            video.src = url ? url.createObjectURL(stream) : stream;
            //video.play();
        },
                function (error) {
                    alert("Unable to start video, " + error.name)
                    return;
                }
        );
    }
    else {
        alert('Sorry, the browser you are using doesn\'t support getUserMedia');
        return;
    }
    return video;
};