const fragmentShaderSource = `#version 300 es
precision highp float;

uniform float time;
uniform vec2 vp;
uniform vec3 themeColor;

in vec2 uv;
out vec4 fragColor;

float random(vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
}

float noise(vec2 st) {
    vec2 i = floor(st);
    vec2 f = fract(st);

    float a = random(i);
    float b = random(i + vec2(1.0, 0.0));
    float c = random(i + vec2(0.0, 1.0));
    float d = random(i + vec2(1.0, 1.0));

    vec2 u = f * f * (3.0 - 2.0 * f);

    return mix(a, b, u.x) +
           (c - a) * u.y * (1.0 - u.x) +
           (d - b) * u.x * u.y;
}

float fbm(vec2 st) {
    float value = 0.0;
    float amplitude = 0.5;
    for (int i = 0; i < 5; i++) {
        value += amplitude * noise(st);
        st *= 2.0;
        amplitude *= 0.5;
    }
    return value;
}

void main() {
    vec2 st = uv * 3.0; // scale vapor
    st.x += time * 0.1;
    st.y += sin(time * 0.2) * 0.5;

    float n = fbm(st);
    float brightness = smoothstep(0.4, 1.0, n);

    vec3 color = mix(vec3(0.0), themeColor, brightness);
    fragColor = vec4(color, 1.0);
}
`;


class WebGLHandler {
  vertexShaderSource = `#version 300 es
  precision mediump float;
  const vec2 positions[6] = vec2[6](
    vec2(-1.0, -1.0), vec2(1.0, -1.0),
    vec2(-1.0, 1.0), vec2(-1.0, 1.0),
    vec2(1.0, -1.0), vec2(1.0, 1.0)
  );
  out vec2 uv;
  void main() {
    uv = positions[gl_VertexID] * 0.5 + 0.5;
    gl_Position = vec4(positions[gl_VertexID], 0.0, 1.0);
  }`;

  constructor(canvas, fragmentShaderSource) {
    this.cn = canvas;
    this.gl = canvas.getContext("webgl2");
    this.startTime = Date.now();

    this.resize();
    window.addEventListener("resize", () => this.resize());

    this.program = this.gl.createProgram();
    this.compileShader(this.vertexShaderSource, this.gl.VERTEX_SHADER);
    this.compileShader(fragmentShaderSource, this.gl.FRAGMENT_SHADER);
    this.gl.linkProgram(this.program);
    this.gl.useProgram(this.program);

    this.timeLoc = this.gl.getUniformLocation(this.program, "time");
    this.vpLoc = this.gl.getUniformLocation(this.program, "vp");
    this.colorLoc = this.gl.getUniformLocation(this.program, "themeColor");

    this.currentColor = [0.9, 0.5, 0.3];

    this.render();
  }

  resize() {
    this.cn.width = window.innerWidth;
    this.cn.height = window.innerHeight;
    this.gl.viewport(0, 0, this.cn.width, this.cn.height);
  }

  compileShader(source, type) {
    const shader = this.gl.createShader(type);
    this.gl.shaderSource(shader, source);
    this.gl.compileShader(shader);
    if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
      console.error(this.gl.getShaderInfoLog(shader));
      this.gl.deleteShader(shader);
    }
    this.gl.attachShader(this.program, shader);
  }

  render = () => {
    const t = (Date.now() - this.startTime) / 1000;
    this.gl.uniform1f(this.timeLoc, t);
    this.gl.uniform2fv(this.vpLoc, [this.cn.width, this.cn.height]);
    this.gl.uniform3fv(this.colorLoc, this.currentColor);

    this.gl.drawArrays(this.gl.TRIANGLES, 0, 6);
    requestAnimationFrame(this.render);
  };
}

window.addEventListener("DOMContentLoaded", () => {
  const canvas = document.getElementById("shader-bg");
  window.webGL = new WebGLHandler(canvas, fragmentShaderSource);
});
