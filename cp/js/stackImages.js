// combine multiple images to 1, choosing how every (x, y) position is combined
// combinePixels: [[rgba], [rgba], ...] => [rgba]
var stackImages = function(imageList, combinePixels) {
    // assume all image of same size
    var totalImage = imageList.length;
    var height = imageList[0].length;
    var width = imageList[0][0].length;
    var result = createMultiDArray(height, width);

    for(var y = 0; y < height; ++y) {
        for(var x = 0; x < width; ++x) {
            var pixels = [];
            for(var i = 0; i < totalImage; ++i) {
                pixels.push(imageList[i][y][x]); // get pixels from all images, on this (x, y) position
            }
            result[y][x] = combinePixels(pixels);
        }
    }

    return result;
};

// apply `pick' to each channel (r, g, b, a) separately
var perChannel = function(pixels, pick) {
    var result = [];
    for(var c = 0; c < 4; ++c) {
        var values = pixels.map(function(pixel) { return pixel[c]; });
        result.push(pick(values));
    }
    return result;
};

// middle value: whatever is there most of the time, so moving things disappear
var medianPixel = function(pixels) {
    return perChannel(pixels, function(values) {
        values.sort(function(a, b) { return a - b; });
        var mid = Math.floor(values.length / 2);
        return values.length % 2 ? values[mid] : (values[mid - 1] + values[mid]) / 2;
    });
};

// brightest value: bright moving things leave trails (light painting)
var maxPixel = function(pixels) {
    return perChannel(pixels, function(values) { return Math.max.apply(null, values); });
};

// darkest value: dark moving things leave trails
var minPixel = function(pixels) {
    return perChannel(pixels, function(values) { return Math.min.apply(null, values); });
};
