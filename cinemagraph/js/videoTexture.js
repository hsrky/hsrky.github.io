var createMultiDArray = function(i, j) {
    var out = new Array(i);
    for(var c = 0; c < i; c++) {
        out[c] = new Array(j);
    }
    
    return out;
};
var sumSquareDifferent = function(frames) {
    // frame:
    // [[[r,g,b,a], [r,g,b,a], [r,g,b,a]],
    //  [[r,g,b,a], [r,g,b,a], [r,g,b,a]]]
    // return output[i][j] -> ssd between frame i and j
    var totalFrame = frames.length;
    var output = createMultiDArray(totalFrame, totalFrame);
    for(var i = 0; i < totalFrame; i++) {
        for(var j = 0; j < totalFrame; j++) {
            if(j > i) {
                break; // matrix is symmetrical, don't calc twice
            }
            var current = frames[i];
            var compare = frames[j];
            // FIXME: no found any library that can operate on 320*240 matrices in javascript
            // UNABLE TO CONTINUE..
            //output[i, j] = np.sum(np.power((cur - compare), 2))
            output[i, j] = sum;
            output[j, i] = output[i, j]; // matrix is symmetrical
        }
    }
    
    return output;
};