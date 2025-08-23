const ribbonFragmentShader = `#version 300 es
precision highp float;

uniform float time;
uniform vec2 vp;
uniform vec3 themeColor;

in vec2 uv;
out vec4 fragColor;

float wave(vec2 p, float freq, float amp, float phase) {
    return sin(p.y * freq + time * phase) * amp;
}

void main() {
    vec2 p = uv;
    float aspect = vp.x / vp.y;
    p.x *= aspect;

    float val = 0.0;
    val += wave(p, 12.0, 0.15, 1.0);
    val += wave(p, 8.0, 0.10, 1.3);
    val += wave(p, 16.0, 0.05, 0.7);

    vec3 color = mix(vec3(0.0), themeColor, smoothstep(-0.2, 0.2, val));
    fragColor = vec4(color, 1.0);
}
`;

window.addEventListener("DOMContentLoaded", () => {
  const canvas = document.getElementById("shader-bg");
  window.webGL = new WebGLHandler(canvas, ribbonFragmentShader);
});

document.getElementById("cast-spell").addEventListener("click", () => {
  const themes = [
    [0.9, 0.5, 0.3],[0.3, 0.6, 0.9],[0.6, 0.9, 0.5],
    [0.8, 0.3, 0.7],[1.0, 0.7, 0.2],[0.2, 0.8, 0.8],
    [0.95,0.2,0.3],[0.2,0.2,0.6]
  ];
  const pick = themes[Math.floor(Math.random() * themes.length)];
  if (window.webGL) window.webGL.currentColor = pick;
});
