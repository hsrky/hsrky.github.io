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
            $('.btn-capture').val('Capturing... ('+ (captured+ 1) +')').prop('disabled', true);
            var canvas_id = "ccanvas_" + ++captured;
            var html = $.t(placeholder, {count: captured, canvas_id: canvas_id, width: V_WIDTH, height: V_HEIGHT});
            $imageList.prepend(html);
            var targetCanvas = $('#' + canvas_id, $imageList).get(0);
            captureImage(targetCanvas, video);
        };
        capture();
        var intervalId = setInterval(function () {
            // capture an image every given interval
            capture();
            if (captured >= total_frame) {
                clearInterval(intervalId);
                $('.btn-capture').val("Capture again").prop('disabled', false);
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
        // captured images are prepended (newest first), effects expect capture order
        imageMatrices.reverse();
        //produceCinemaGraph($imageList.find('canvas'), resultCanvas);
        var effect = effects[$('#effect').val()];
        drawMatrixOnCanvas(effect(imageMatrices), resultCanvas);
    });
});

// effects selectable from the dropdown, each takes list of image matrices and returns 1 matrix
var effects = {
    average: function(images) { return averageImages(images); },
    median: function(images) { return stackImages(images, medianPixel); },
    max: function(images) { return stackImages(images, maxPixel); },
    min: function(images) { return stackImages(images, minPixel); },
    clone: function(images) { return cloneImages(images); },
    timeSmear: function(images) { return timeSmear(images); },
    motionReveal: function(images) { return motionReveal(images); }
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

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        if (!window.isSecureContext) {
            alert('Camera access requires a secure context. Open the page via http://localhost or https:// instead of a plain http:// address.');
        } else {
            alert('Sorry, the browser you are using doesn\'t support getUserMedia');
        }
        return;
    }

    navigator.mediaDevices.getUserMedia({
        video: {width: V_WIDTH, height: V_HEIGHT},
        audio: false
    }).then(function (stream) {
        video.srcObject = stream;
        var playPromise = video.play();
        if (playPromise && playPromise.catch) {
            playPromise.catch(function () {}); // autoplay attribute will retry
        }
    }).catch(function (error) {
        var msg = "Unable to start video, " + error.name;
        if (error.name === 'NotAllowedError') {
            msg += '. Allow camera access for this site in Chrome, and for Chrome in ' +
                    'macOS System Settings > Privacy & Security > Camera.';
        } else if (error.name === 'NotFoundError') {
            msg += '. No camera was found.';
        } else if (error.name === 'NotReadableError') {
            msg += '. The camera may be in use by another application.';
        }
        alert(msg);
    });

    return video;
};
