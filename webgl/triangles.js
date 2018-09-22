// Convert vertices from pixels to clip space coordinates that range (x, y) from -1 to 1
const vertexShaderSource = `
attribute vec2 position;
uniform vec2 resolution; // global variable screen resolution
varying vec2 color; // pass data to fragment shader

void main() {
  // convert position from pixels to range (0, 1)
  vec2 zeroToOne = position / resolution;

  // convert from range (0, 1) to (0, 2)
  vec2 zeroToTwo = zeroToOne * 2.0;

  // convert from range (0, 2) to (-1, 1), i.e. clip space
  vec2 clipSpace = zeroToTwo - 1.0;

  gl_Position = vec4(clipSpace * vec2(1, -1), 0, 1);
}
`;

// Rasterize primitive shapes formed from gl_Position
const fragmentShaderSource = `
precision mediump float; // medium precision

void main() {
  gl_FragColor = vec4(0, 1, 0.5, 1);
}
`;

function createShader(context, type, source) {
  const shader = context.createShader(type);
  context.shaderSource(shader, source);
  context.compileShader(shader);
  const compileStatus = context.getShaderParameter(shader, context.COMPILE_STATUS);
  if (compileStatus) return shader;
  console.error(context.getShaderInfoLog(shader));
  context.deleteShader(shader);
}

function createProgram(context, vertexShader, fragmentShader) {
  const program = context.createProgram();
  context.attachShader(program, vertexShader);
  context.attachShader(program, fragmentShader);
  context.linkProgram(program);
  const linkStatus = context.getProgramParameter(program, context.LINK_STATUS);
  if (linkStatus) return program;
  console.error(context.getProgramInfoLog(program));
  context.deleteProgram(program);
}

function init() {
  // Create WebGL context
  const canvas = document.getElementById("canvas");
  const context = canvas.getContext("webgl");

  // Handle WebGL context creation error
  if (!context) {
    console.error("Unable to initialize WebGL. Your browser or machine may not support it.");
    return;
  }

  // Create shaders and program
  const vertexShader = createShader(context, context.VERTEX_SHADER, vertexShaderSource);
  const fragmentShader = createShader(context, context.FRAGMENT_SHADER, fragmentShaderSource);
  const program = createProgram(context, vertexShader, fragmentShader);
  
  // Create buffer and bind it to bind point ARRAY_BUFFER
  const positionBuffer = context.createBuffer();
  context.bindBuffer(context.ARRAY_BUFFER, positionBuffer);

  // Write data to current buffer
  context.bufferData(context.ARRAY_BUFFER, new Float32Array([
    10, 20,
    80, 20,
    10, 30,
    10, 30,
    80, 20,
    80, 30
  ]), context.STATIC_DRAW);

  // Convert values from clip space to pixels (screen space)
  // Maps range for (x, y) from clip space (-1, +1) to screen space (canvas.width, canvas.height)
  context.viewport(0, 0, context.canvas.width, context.canvas.height);

  // Clear canvas color
  context.clearColor(0, 0, 0, 0);
  context.clear(context.COLOR_BUFFER_BIT);

  context.useProgram(program);

  // Look up location of the resolution uniform in the buffer
  const resolutionUniformLocation = context.getUniformLocation(program, "resolution");

  // Set resolution uniform value on the current program
  context.uniform2f(resolutionUniformLocation, context.canvas.width, context.canvas.height);

  // Look up location of the position attribute in the buffer
  const positionAttributeLocation = context.getAttribLocation(program, "position");

  // Turn position attribute on
  context.enableVertexAttribArray(positionAttributeLocation);

  // Specifiy how to get data from the buffer into the position attribute
  const size = 2; // get 2 elements per iteration
  const type = context.FLOAT; // data is 32 bit floats
  const normalize = false; // do not normalize the data
  const stride = 0; // move foward (size * sizeof(type)) times each iteration to get the next position
  const offset = 0; // start at the beginning of the buffer
  
  // Bind current ARRAY_BUFFER bind point value to the position attribute, now the bind point can be overwritten
  context.vertexAttribPointer(positionAttributeLocation, size, type, normalize, stride, offset);

  // Execute program
  const drawArraysOpts = {
    primitiveType: context.TRIANGLES, // each time, draw a triangle based on the 3 values of gl_Position
    offset: 0,
    count: 6 // Execute vertex shader 3 times, setting each time the position attribute values x and y to the pairs of x and y inside the buffer
  }
  context.drawArrays(drawArraysOpts.primitiveType, drawArraysOpts.offset, drawArraysOpts.count);
}
