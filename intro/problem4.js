// Similar to GL_example1b, but illustrates using a varying variable
// to interpolate a color attribute for each vertex.  (See shader source
// in GL_Example2.html.)

// raw data for some point positions
var numPoints = 3;
var trVertices = new Float32Array([
-0.5, -0.75,
0.5, -0.75,
0.0, 0.75
]
);

var numPoints = 6;
var sqVertices = new Float32Array([
-0.5, -0.5,
0.5, -0.5,
0.5, 0.5,
-0.5, -0.5,
0.5, 0.5,
-0.5, 0.5
]
);

// a color value for each vertex
var colors = new Float32Array([
1.0, 0.0, 0.0, 1.0,  // red
0.0, 1.0, 0.0, 1.0,  // green
0.0, 0.0, 1.0, 1.0,  // blue
]
);


// A few global variables...

// the OpenGL context
var gl;

// handles to buffers on the GPU
var sqvertexbuffer;
var trvertexbuffer;
var colorbuffer;

// handle to the compiled shader program on the GPU
var trshader;
var sqshader;

function sqdraw(color)
{
  // bind the shader
  gl.useProgram(sqshader);

  // bind the buffer
  gl.bindBuffer(gl.ARRAY_BUFFER, sqvertexbuffer);

  // get the index for the a_Position attribute defined in the vertex shader
  var positionIndex = gl.getAttribLocation(sqshader, 'a_Position');
  if (positionIndex < 0) {
    console.log('Failed to get the storage location of a_Position');
    return;
  }

  // "enable" the a_position attribute
  gl.enableVertexAttribArray(positionIndex);

  // associate the data in the currently bound buffer with the a_position attribute
  // (The '2' specifies there are 2 floats per vertex in the buffer.  Don't worry about
  // the last three args just yet.)
  gl.vertexAttribPointer(positionIndex, 2, gl.FLOAT, false, 0, 0);

  // we can unbind the buffer now (not really necessary when there is only one buffer)
  gl.bindBuffer(gl.ARRAY_BUFFER, null);

  let index = gl.getUniformLocation(sqshader, "color");
  gl.uniform4f(index, color[0], color[1], color[2], color[3]); //it just works
  //else gl.uniform4f(index, 1.0, 1.0, 0.0, 1.0);
  //gl.uniform4fv(index, new Float32Array([0.0, 0.0, 1.0, 1.0]));

  // draw, specifying the type of primitive to assemble from the vertices
  gl.drawArrays(gl.TRIANGLES, 0, 6);

  // unbind shader and "disable" the attribute indices
  // (not really necessary when there is only one shader)
  gl.disableVertexAttribArray(positionIndex);
  gl.useProgram(null);

}

// code to actually render our geometry
function trdraw()
{
  // bind the shader
  gl.useProgram(trshader);

  // bind the buffer
  gl.bindBuffer(gl.ARRAY_BUFFER, trvertexbuffer);

  // get the index for the a_Position attribute defined in the vertex shader
  var positionIndex = gl.getAttribLocation(trshader, 'a_Position');
  if (positionIndex < 0) {
    console.log('Failed to get the storage location of a_Position');
    return;
  }

  // "enable" the a_position attribute
  gl.enableVertexAttribArray(positionIndex);

  // associate the data in the currently bound buffer with the a_position attribute
  // (The '2' specifies there are 2 floats per vertex in the buffer.  Don't worry about
  // the last three args just yet.)
  gl.vertexAttribPointer(positionIndex, 2, gl.FLOAT, false, 0, 0);

  // we can unbind the buffer now (not really necessary when there is only one buffer)
  gl.bindBuffer(gl.ARRAY_BUFFER, null);

  // bind the buffer with the color data
  gl.bindBuffer(gl.ARRAY_BUFFER, colorbuffer);

  // get the index for the a_Color attribute defined in the vertex shader
  var colorIndex = gl.getAttribLocation(trshader, 'a_Color');
  if (colorIndex < 0) {
    console.log('Failed to get the storage location of a_Color');
    return;
  }

  // "enable" the a_Color attribute
  gl.enableVertexAttribArray(colorIndex);

  // Associate the data in the currently bound buffer with the a_Color attribute
  // The '4' specifies there are 4 floats per vertex in the buffer
  gl.vertexAttribPointer(colorIndex, 4, gl.FLOAT, false, 0, 0);

  // we can unbind the buffer now
  gl.bindBuffer(gl.ARRAY_BUFFER, null);

  // draw, specifying the type of primitive to assemble from the vertices
  gl.drawArrays(gl.TRIANGLES, 0, 3);
  //gl.drawArrays(gl.LINES, 0, 2);

  // unbind shader and "disable" the attribute indices
  // (not really necessary when there is only one shader)
  gl.disableVertexAttribArray(positionIndex);
  gl.disableVertexAttribArray(colorIndex);
  gl.useProgram(null);

}

// entry point when page is loaded
function main() {

  // basically this function does setup that "should" only have to be done once,
  // while draw() does things that have to be repeated each time the canvas is
  // redrawn

    // get graphics context
  gl = getGraphicsContext("theCanvas");

  // load and compile the shader pair
  sqshader = createProgram(gl, 'sqVertexShader', 'sqFragmentShader');
  trshader = createProgram(gl, 'trVertexShader', 'trFragmentShader');

  // load the vertex data into GPU memory
  sqvertexbuffer = createAndLoadBuffer(sqVertices);
  trvertexbuffer = createAndLoadBuffer(trVertices);

  //load the color data into GPU memory
  colorbuffer = createAndLoadBuffer(colors);


  // specify a fill color for clearing the framebuffer
  gl.clearColor(1.0, 1.0, 1.0, 1.0);

  // we could just call draw() once to see the result, but setting up an animation
  // loop to continually update the canvas makes it easier to experiment with the
  // shaders
  //draw();

  var canvas = document.getElementById("theCanvas");

  var color = new Float32Array([1.0, 1.0, 0.0, 1.0]);

  canvas.onclick = function(event){
    var rect = canvas.getBoundingClientRect();
    var x = event.clientX - rect.left;
    var y = rect.bottom - event.clientY;
    var width = canvas.width * 0.5; //width of triangle relative to canvas
    var height = canvas.height * .75; //ditto
    console.log("X: " +x+ " Y: " + y + " W: "+width + " H: " + height);
    var trycolor = findRGB(x, y, width, height, colors);
    if(trycolor) color = trycolor;
  }

  // define an animation loop
  var animate = function() {
    // clear the framebuffer
    gl.clear(gl.COLOR_BUFFER_BIT);
    trdraw();
    sqdraw(color);

	// request that the browser calls animate() again "as soon as it can"
    requestAnimationFrame(animate);
  };

  // start drawing!
  animate();


}
