function loadChapter(filename) {
  const container = document.getElementById("chapter-container");
  container.innerHTML = '<p class="loading">Turning the page...</p>';

  fetch("chapters/"+ filename)
    .then(res => res.text())
    .then(html => {
      container.innerHTML = html;
    })
    .catch(() => {
      container.innerHTML = "<p>❌ Oops! Chapter not found.</p>";
    });
}

function goToChapter(chapterFile) {
  window.location.href = "chapters/ch1/chapter1.html";
}

function goToChapter2(chapterFile) {
  window.location.href = "chapters/ch2/chapter2.html";
}

function goToChapter3(chapterFile) {
  window.location.href = "chapters/ch3/chapter3.html";
}

canvas.style.position = "fixed";
canvas.style.top = 0;
canvas.style.left = 0;
canvas.style.width = "100vw";
canvas.style.height = "100vh";
canvas.style.zIndex = 0;
canvas.style.pointerEvents = "none";

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

  const random = themes[Math.floor(Math.random() * themes.length)];
    if (window.webGL) {
    window.webGL.currentColor = random;
    
  }
}




