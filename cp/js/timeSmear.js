// slit-scan style "time smear": each row of the result comes from a different moment,
// top row from the first frame, bottom row from the last frame
var timeSmear = function(imageList) {
    // assume all image of same size, and imageList is in capture order (oldest first)
    var totalImage = imageList.length;
    var height = imageList[0].length;
    var width = imageList[0][0].length;
    var result = createMultiDArray(height, width);

    for(var y = 0; y < height; ++y) {
        // position of this row in time, blend the 2 nearest frames so there is no hard band
        var t = height > 1 ? y * (totalImage - 1) / (height - 1) : 0;
        var i0 = Math.floor(t);
        var i1 = Math.min(i0 + 1, totalImage - 1);
        var w = t - i0;
        for(var x = 0; x < width; ++x) {
            result[y][x] = blendPixel(imageList[i0][y][x], imageList[i1][y][x], w);
        }
    }

    return result;
};

var blendPixel = function(p0, p1, w) {
    // input -> [rgba], [rgba], weight of p1 => return [rgba]
    return [
        p0[0] * (1 - w) + p1[0] * w,
        p0[1] * (1 - w) + p1[1] * w,
        p0[2] * (1 - w) + p1[2] * w,
        p0[3] * (1 - w) + p1[3] * w
    ];
};
