
const circleFragmentShader = `#version 300 es
precision highp float;

uniform float time;
uniform vec2 vp;           // viewport (width, height)
uniform vec3 themeColor;

in vec2 uv;                // 0..1 from the shared vertex shader
out vec4 fragColor;

float sdCircle(vec2 p, vec2 c, float r) {
  return length(p - c) - r;
}

float softCircle(vec2 p, vec2 c, float r, float blur) {
  float d = sdCircle(p, c, r);
  return 1.0 - smoothstep(0.0, blur, d);  // 1 inside, soft edge
}

void main() {
  // Keep shapes circular regardless of aspect
  float aspect = vp.x / vp.y;
  vec2 p = (uv - 0.5) * vec2(aspect, 1.0) + 0.5;

  // Parameters for the ring of circles
  float ringR    = 0.23 + 0.02 * sin(time * 0.3);
  float circleR  = 0.18 + 0.02 * sin(time * 0.6);
  float blur     = 0.02;

  // Sum several circles around the center; slow rotation for playfulness
  float sum = 0.0;
  const int N = 8;
  for (int i = 0; i < N; i++) {
    float a = time * 0.15 + float(i) * 6.2831853 / float(N);
    vec2  c = vec2(0.5) + ringR * vec2(cos(a), sin(a));
    sum += softCircle(p, c, circleR, blur);
  }

  // Central circle to make the middle glow brighter
  sum += softCircle(p, vec2(0.5), 0.12 + 0.02 * sin(time * 0.8), 0.02);

  // Tone mapping-ish curve for a smooth glow
  float glow = 1.0 - exp(-sum);                 // compress
  vec3  color = themeColor * pow(glow, 1.2);    // slightly sharper falloff

  fragColor = vec4(color, 1.0);
}
`;


window.addEventListener("DOMContentLoaded", () => {
  const canvas = document.getElementById("shader-bg");
  // WebGLHandler is defined in ../../shader.js
  window.webGL = new WebGLHandler(canvas, circleFragmentShader);
});


function castSpell() {
  const themes = [
    [0.9, 0.5, 0.3],
    [0.3, 0.6, 0.9],
    [0.6, 0.9, 0.5],
    [0.8, 0.3, 0.7],
    [1.0, 0.7, 0.2],
    [0.2, 0.8, 0.8],
    [0.95, 0.2, 0.3],
    [0.2, 0.2, 0.6],
    [1.0, 0.4, 0.7],
    [0.4, 1.0, 0.8],
    [0.7, 0.3, 0.2],
    [0.3, 1.0, 0.3]
  ];
  const pick = themes[Math.floor(Math.random() * themes.length)];
  if (window.webGL) window.webGL.currentColor = pick;
}
function goToChapter2(chapterFile) {
  window.location.href = "../ch2/chapter2.html";
}



