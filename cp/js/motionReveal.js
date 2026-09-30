// "motion reveal": show only what changed between frames, amplified,
// glowing on top of a dimmed grayscale of the scene
var MOTION_GAIN = 6;      // how much to amplify small changes
var BACKGROUND_DIM = 0.35; // brightness of the still scene behind the motion

var motionReveal = function(imageList) {
    // assume all image of same size, and imageList is in capture order (oldest first)
    var totalImage = imageList.length;
    var height = imageList[0].length;
    var width = imageList[0][0].length;
    var result = createMultiDArray(height, width);

    for(var y = 0; y < height; ++y) {
        for(var x = 0; x < width; ++x) {
            // average change in brightness between consecutive frames on this (x, y) position
            var motion = 0;
            for(var i = 1; i < totalImage; ++i) {
                motion += Math.abs(luma(imageList[i][y][x]) - luma(imageList[i - 1][y][x]));
            }
            motion = totalImage > 1 ? motion / (totalImage - 1) : 0;
            result[y][x] = heatPixel(luma(imageList[0][y][x]) * BACKGROUND_DIM, motion * MOTION_GAIN);
        }
    }

    return result;
};

var luma = function(pixel) {
    return 0.299 * pixel[0] + 0.587 * pixel[1] + 0.114 * pixel[2];
};

var heatPixel = function(background, heat) {
    // dark red -> orange -> yellow -> white as heat grows
    var clamp = function(v) { return Math.max(0, Math.min(255, v)); };
    return [
        clamp(background + heat),
        clamp(background + (heat - 128) * 1.2),
        clamp(background + (heat - 384) * 1.5),
        255
    ];
};
