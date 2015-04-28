var createMultiDArray = function(i, j) {
    var out = new Array(i);
    for(var c = 0; c < i; c++) {
        out[c] = new Array(j);
    }
    
    return out;
};
// combine multiple images to 1, using simple average
var averageImages = function(imageList) {
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
            result[y][x] = averagePixel(pixels);
        }
    }
    
    return result;
};

var averagePixel = function(pixels) {
    // input -> [[rgba], [rgba], [rgba]] => return [rgba]
    var R = 0, G = 0, B = 0, A = 0;
    var totalPixels = pixels.length;
    for(var i = 0; i < totalPixels; ++i) {
        var pixel = pixels[i];
        R += pixel[0];
        G += pixel[1];
        B += pixel[2];
        A += pixel[3];
    }
    
    return [R/totalPixels, G/totalPixels, B/totalPixels, A/totalPixels];
};