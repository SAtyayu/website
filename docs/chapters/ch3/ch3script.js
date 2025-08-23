// Firefly shader
const fireflyFragmentShader = `#version 300 es
precision highp float;

uniform float time;
uniform vec2 vp;
uniform vec3 themeColor;

in vec2 uv;
out vec4 fragColor;

#define FIREFLIES 30

float rand(vec2 co){ return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453); }

void main() {
    vec2 p = uv;
    p = p * 2.0 - 1.0;
    p.x *= vp.x/vp.y;

    vec3 color = vec3(0.0);

    for(int i=0;i<FIREFLIES;i++){
        float fi = float(i);
        vec2 pos = vec2(
            rand(vec2(fi, 0.0) + time*0.1)*2.0 -1.0,
            rand(vec2(0.0, fi) + time*0.2)*2.0 -1.0
        );
        float size = 0.02 + 0.01*rand(vec2(fi,fi));
        float glow = exp(-10.0 * distance(p,pos)*distance(p,pos));
        color += themeColor * glow * size;
    }
    fragColor = vec4(color,1.0);
}
`;

window.addEventListener("DOMContentLoaded", () => {
    const canvas = document.getElementById("shader-bg");
    window.webGL = new WebGLHandler(canvas, fireflyFragmentShader);
});

// Cast a Spell interaction
document.getElementById("cast-spell").addEventListener("click", () => {
    const themes = [
        [0.9, 0.5, 0.3],[0.3, 0.6, 0.9],[0.6, 0.9, 0.5],
        [0.8, 0.3, 0.7],[1.0, 0.7, 0.2],[0.2, 0.8, 0.8],
        [0.95,0.2,0.3],[0.2,0.2,0.6],[1.0,0.4,0.7]
    ];
    const pick = themes[Math.floor(Math.random() * themes.length)];
    if (window.webGL) window.webGL.currentColor = pick;
});

// Quiz logic
const quizData = [
    { q: "HTML: Which tag is used for a hyperlink?", a: ["<a>", "<link>", "<href>", "<p>"], correct: 0 },
    { q: "CSS: Which property changes text color?", a: ["color", "background", "font-size", "margin"], correct: 0 },
    { q: "JS: Which keyword declares a variable?", a: ["let", "various", "constantly", "variable"], correct: 0 }
];

let currentQuestion = 0;
function showQuestion() {
    const quizQuestion = document.getElementById("quiz-question");
    const quizOptions = document.getElementById("quiz-options");
    const nextBtn = document.getElementById("next-question");
    const result = document.getElementById("quiz-result");

    if(currentQuestion >= quizData.length){
        quizQuestion.style.display = "none";
        quizOptions.style.display = "none";
        nextBtn.style.display = "none";
        result.style.display = "block";
        result.textContent = "✨ Quiz Completed! Congratulations, young wizard!";
        return;
    }

    const q = quizData[currentQuestion];
    quizQuestion.textContent = q.q;
    quizOptions.innerHTML = "";

    q.a.forEach((option, index) => {
        const btn = document.createElement("button");
        btn.textContent = option;
        btn.onclick = () => {
            if(index === q.correct){
                alert("✅ Correct!");
            } else {
                alert("❌ Wrong! The correct answer is: " + q.a[q.correct]);
            }
            currentQuestion++;
            showQuestion();
        };
        quizOptions.appendChild(btn);
    });
}

showQuestion();
