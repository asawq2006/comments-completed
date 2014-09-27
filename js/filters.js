(function(window, document, undefined) {
    // rgb shift for brightness filter; increase to add more brightness
    var BRIGHTNESS_SHIFT = 50;

    // rgb threshold for threshold filter
    var COLOR_THRESHOLD = 255 / 3;

    // weights for each color component when computing grayscale value
    var GRAYSCALE_WEIGHT_RED = 0.33;
    var GRAYSCALE_WEIGHT_BLUE = 0.33;
    var GRAYSCALE_WEIGHT_GREEN = 0.33;

    // base image to filter
    var image = document.getElementsByTagName('img')[0];

    // canvas context for drawing
    var imageCanvas = document.getElementById('image-canvas');
    var canvasContext = imageCanvas.getContext('2d');

    // DOM filter buttons
    var grayscale = document.getElementById('grayscale');
    var brighten = document.getElementById('brighten');
    var threshold = document.getElementById('threshold');
    var reset = document.getElementById('reset');

    /* Returns the image data associated with the canvas. */
    function getImageData() {
        return canvasContext.getImageData(0, 0, imageCanvas.width,
            imageCanvas.height);
    }

    /* Applies the given filter to the canvas. Updates the canvas' image data
     * accordingly.
     *
     * Arguments:
     * filter -- function that takes in an array of pixel values and returns
     *  new, filtered values
     */
    function applyFilter(filter) {
        var data = getImageData();
        data.data = filter(data.data);
        canvasContext.putImageData(data, 0, 0);
    }

    /* Computes the grayscale value of a pixel given its components.
     *
     * Arguments:
     * red -- the red pixel component
     * green -- the green pixel component
     * blue -- the blue pixel component
     */
    function computeGrayscale(red, green, blue) {
        return GRAYSCALE_WEIGHT_RED * red + GRAYSCALE_WEIGHT_BLUE * blue +
            GRAYSCALE_WEIGHT_GREEN * green;
    }

    /* Filters the given pixels to grayscale.
     *
     * Arguments:
     * pixels -- an array of pixel values
     */
    function filterGrayscale(pixels) {
        var red, green, blue;
        var grayscale;

        for (var i = 0; i < pixels.length; i += 4) {
            red = pixels[i];
            green = pixels[i + 1];
            blue = pixels[i + 2];

            // to make a pixel grayscale, set color components to the same value
            grayscale = computeGrayscale(red, green, blue);
            pixels[i] = pixels[i + 1] = pixels[i + 2] = grayscale;
        }

        return pixels;
    }

    /* Brightens the given pixels.
     *
     * Arguments:
     * pixels -- an array of pixel values
     */
    function filterBrighten(pixels) {
        var red, green, blue;

        for (var i = 0; i < pixels.length; i += 4) {
            // add constant adjustment value to red, green, and blue components
            // for brightness
            pixels[i] = pixels[i] + BRIGHTNESS_SHIFT;
            pixels[i + 1] = pixels[i + 1] + BRIGHTNESS_SHIFT;
            pixels[i + 2] = pixels[i + 2] + BRIGHTNESS_SHIFT;
        }

        return pixels;
    }

    /* Applies a threshold filter to the given pixels. Makes all pixels above
     * the threshold black and all pixels below the threshold white.
     *
     * Arguments:
     * pixels -- an array of pixel values
     */
    function filterThreshold(pixels) {
        var red, green, blue;
        var grayscale;

        for (var i = 0; i < pixels.length; i += 4) {
            // compute grayscale value
            red = pixels[i];
            green = pixels[i + 1];
            blue = pixels[i + 2];
            grayscale = computeGrayscale(red, green, blue);

            // compare grayscale to threshold and modify pixels accordingly
            if (grayscale > COLOR_THRESHOLD) {
                pixels[i] = pixels[i + 1] = pixels[i + 2] = 255;
            } else {
                pixels[i] = pixels[i + 1] = pixels[i + 2] = 0;
            }
        }

        return pixels;
    }

    // when window has loaded, the image is ready to be drawn on the canvas
    window.addEventListener('load', function(event) {
        canvasContext.drawImage(image, 0, 0);
         
        // apply appropriate filters based off which buttons were clicked
        grayscale.addEventListener('click', function(event) {
            applyFilter(filterGrayscale);
            event.preventDefault();
        });

        brighten.addEventListener('click', function(event) {
            applyFilter(filterBrighten);
            event.preventDefault();
        });

        threshold.addEventListener('click', function(event) {
            applyFilter(filterThreshold);
            event.preventDefault();
        });

        reset.addEventListener('click', function(event) {
            canvasContext.drawImage(image, 0, 0);
            event.preventDefault();
        });
    });
})(this, this.document);
