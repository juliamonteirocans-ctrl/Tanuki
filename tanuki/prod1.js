const fotos = ["blindbox.png", "miaurango.jpeg", "miauninho.jpeg", "miacha.jpeg"];
let indice = 0;

function mudarFoto(direcao) {
    indice = (indice + direcao + fotos.length) % fotos.length;
    document.getElementById("fotoAtual").src = fotos[indice];
}

const paginas = [
    { titulo: "Blind Box", url: "prod1.html", palavras: ["Blind", "Box", "blind", "box", "blnd", "bx"]},
    { titulo: "Gatinhos", url: "prod2.html", palavras: ["gatinhos", "gatinho", "gato", "gt"]},
    { titulo: "Pokebolas", url: "prod3.html", palavras: ["pokebolas", "pokebola", "poquebola", "poke"]},
    { titulo: "Kuromi", url: "prod4.html", palavras: ["kuromi", "kurmi", "ku", "romi"]},
    { titulo: "Hello Kitty", url: "prod5.html", palavras: ["hello", "kitty", "helo", "kity"]},
    { titulo: "My Melody", url: "prod6.html", palavras: ["my", "melody", "mel", "me"]},
];

const formBusca = document.getElementById("formBusca");
const campoBusca = document.getElementById("campoBusca");
const btnLupa = document.getElementById("btnLupa");
const listaSugestoes = document.getElementById("listaSugestoes");

btnLupa.addEventListener("click", function () {
    const estaAberta = formBusca.classList.contains("aberta");

if (!estaAberta) {
    formBusca.classList.add("aberta");
    campoBusca.focus();
} else if (campoBusca.value.trim() !== "") {
    executarBusca();
} else {
    formBusca.classList.remove("aberta");
}
});

function limparTexto(texto) {
    return texto.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();
}

function ehParecido(a, b) {
    if (a.includes(b) || b.includes(a)) return true;
    const matriz = Array.from({ length: a.length + 1 }, (_, i) => [i]);
    for (let j = 0; j <= b.length; j++) matriz[0][j] = j;
    for (let i = 1; i <= a.length; i++) {
        for (let j = 1; j <= b.length; j++) {
            const custo = a[i - 1] === b[j - 1] ? 0 : 1;
            matriz[i][j] = Math.min(matriz[i - 1][j] + 1, matriz[i][j - 1] + 1, matriz[i - 1][j - 1] + custo);
        }
    }
    return matriz[a.length][b.length] <= 2;
}

function buscarItens(termoDigitado) {
    const termo = limparTexto(termoDigitado);
    if (!termo) return [];
    return paginas.filter((item) =>
        ehParecido(termo, limparTexto(item.titulo)) ||
        item.palavras.some((p) => ehParecido(termo, limparTexto(p)))
    );
}

function executarBusca() {
    const resultados = buscarItens(campoBusca.value);
    if (resultados.length > 0) {
        window.location.href = resultados[0].url;
    } else {
        alert("Item não encontrado!");
    }
}

campoBusca.addEventListener("input", function () {
    const resultados = buscarItens(campoBusca.value);
    listaSugestoes.innerHTML = "";

    if (resultados.length > 0) {
      resultados.forEach((item) => {
        const li = document.createElement("li");
        li.innerHTML = `<a href="${item.url}">${item.titulo}</a>`;
        listaSugestoes.appendChild(li);
      });
      listaSugestoes.style.display = "block";
    } else {
      listaSugestoes.style.display = "none";
    }
});

formBusca.addEventListener("submit", function (e) {
    e.preventDefault();
    executarBusca();
});

document.addEventListener("click", function (e) {
    if (!e.target.closest("#containerBusca")) {
      listaSugestoes.style.display = "none";
    if (campoBusca.value.trim() === "") {
        formBusca.classList.remove("aberta");
    }
}
});