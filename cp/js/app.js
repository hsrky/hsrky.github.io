var V_WIDTH = 320;
var V_HEIGHT = 240;
var imageMatrices = [];
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
        var capture = function() {
            var canvas_id = "ccanvas_" + ++captured;
            var html = $.t(placeholder, {count: captured, canvas_id: canvas_id, width: V_WIDTH, height: V_HEIGHT});
            $imageList.append(html);
            var targetCanvas = $('#' + canvas_id, $imageList).get(0);
            captureImage(targetCanvas, video);
        };
        capture();
        var intervalId = setInterval(function () {
            // capture an image every given interval
            capture();
            if (captured >= total_frame) {
                clearInterval(intervalId);
                $('.btn-generate').prop('disabled', false);
                return;
            }

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
        //produceCinemaGraph($imageList.find('canvas'), resultCanvas);
        average(imageMatrices, resultCanvas);
    });
});

var average = function(images, resultCanvas) {
    var result = averageImages(images);
    drawMatrixOnCanvas(result, resultCanvas);
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