// "clone": every frame's moving subject pasted onto the empty background,
// so someone moving across the scene appears several times in 1 picture
var CLONE_THRESHOLD = 60; // how different from background (sum of r, g, b) a pixel must be to count as subject

var cloneImages = function(imageList) {
    // the median of all frames is the scene without the moving subject
    var background = stackImages(imageList, medianPixel);
    var totalImage = imageList.length;
    var height = background.length;
    var width = background[0].length;
    var result = createMultiDArray(height, width);

    for(var y = 0; y < height; ++y) {
        for(var x = 0; x < width; ++x) {
            // keep the background, unless some frame has a subject on this (x, y) position,
            // where subjects overlap, the one most different from background wins
            var best = background[y][x];
            var bestDiff = CLONE_THRESHOLD;
            for(var i = 0; i < totalImage; ++i) {
                var diff = pixelDifference(imageList[i][y][x], background[y][x]);
                if(diff > bestDiff) {
                    best = imageList[i][y][x];
                    bestDiff = diff;
                }
            }
            result[y][x] = best;
        }
    }

    return result;
};

var pixelDifference = function(p0, p1) {
    return Math.abs(p0[0] - p1[0]) + Math.abs(p0[1] - p1[1]) + Math.abs(p0[2] - p1[2]);
};
