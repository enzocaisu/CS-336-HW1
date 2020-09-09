/**
 * Represents an RGBA color. Values should normally be in the range [0.0, 1.0].
 * @constructor
 * @param {Number} r - red value (default 0.0)
 * @param {Number} g - green value (default 0.0)
 * @param {Number} b - blue value (default 0.0)
 * @param {Number} a - alpha value (default 1.0)
 */
function Color(r, g, b, a)
{
	this.r = (r ? r : 0.0);
	this.g = (g ? g : 0.0);
	this.b = (b ? b : 0.0);
	this.a = (a ? a : 1.0);
}

/**
 * Interpolates a color value within an isoceles triangle based on an
 * x, y offset from the lower left corner.  The base of the triangle is
 * always aligned with the bottom of the canvas.  Returns null if the given
 * offset does not lie within the rectangle.
 * @param {Number} x - offset from left side
 * @param {Number} y - offset from bottom
 * @param {Number} base - base of triangle
 * @param {Number} height - height of triangle
 * @param {Color[]} colors - colors of the three corners, counterclockwise
 *   from lower left
 * @return {Color} interpolated color at offset (x, y)
 *
 *
 */
function findRGB(x, y, width, height, colors)
{
	var blue = y/height;
	var red = 1.0 - (x)/(width) - (y)/(2.0 * height);
	var green = 1.0 - blue - red;
	var weights = new Float32Array([red, green, blue, 1.0]);
	//console.log(weights[0] + " " + weights[1] + " " + weights[2] + " " + weights[3]);
	if(red < 0 || green < 0 || blue < 0) return null;
	return weights;
}
