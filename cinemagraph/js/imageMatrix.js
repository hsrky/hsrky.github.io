// imageData to matrix representation in list

var convertToMatrix = function(imgData) {
    var height = imgData.height;
    var width = imgData.width;
    var data = imgData.data;
    
    var matrix = [];
    var row = [];
    for(var p = 0; p < data.length; p+=4) {
        var pixel = [];
        pixel[0] = data[p];
        pixel[1] = data[p + 1];
        pixel[2] = data[p + 2];
        pixel[3] = data[p + 3];
        row.push(pixel);
        if(row.length === width) {
            matrix.push(row);
            row = [];
        }
    }
    
    return matrix;
};

var matrixToImageData = function(matrix) {
    var height = matrix.length;
    var width = matrix[0].length;
    
    var canvasHtml = $.t("<canvas width={width} height={height} />", {width: width, height: height});
    var canvasCtx = $(canvasHtml)[0].getContext('2d');
    
    var imageData = canvasCtx.createImageData(width, height);
    var i = 0;
    for(var y = 0; y < height; ++y) {
        for(var x = 0; x < width; ++x) {
            imageData.data[i] = matrix[y][x][0];
            imageData.data[i + 1] = matrix[y][x][1];
            imageData.data[i + 2] = matrix[y][x][2];
            imageData.data[i + 3] = matrix[y][x][3];
            i+=4;
        }
    }
    
    return imageData;    
};

var drawMatrixOnCanvas = function(matrix, canvas) {
    var height = matrix.length;
    var width = matrix[0].length;
    
    var canvasCtx = canvas.getContext('2d');
    var imageData = canvasCtx.createImageData(width, height);
    var i = 0;
    for(var y = 0; y < height; ++y) {
        for(var x = 0; x < width; ++x) {
            imageData.data[i] = matrix[y][x][0];
            imageData.data[i + 1] = matrix[y][x][1];
            imageData.data[i + 2] = matrix[y][x][2];
            imageData.data[i + 3] = matrix[y][x][3];
            i+=4;
        }
    }
    
    canvasCtx.putImageData(imageData, 0, 0);
};