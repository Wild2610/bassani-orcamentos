const form = document.querySelector("#formulario");
const out = document.querySelector("#out");
const dica = document.querySelector("#dica");
const selectTipo = document.querySelector("#tipo");

// quantas peças cada tipo usa em UM lado (vale para aduela e alizar)
const TIPOS = {
  porta:       { nome: "Porta",           verticais: 2, horizontais: 1 },
  janela:      { nome: "Janela",          verticais: 2, horizontais: 2 },
  portaCorrer: { nome: "Porta de correr", verticais: 2, horizontais: 2 },
};

// medidas em cm
const ALIZARES = {
  "7x1.3": { largura: 7,  espessura: 1.3 },
  "5x1":   { largura: 5,  espessura: 1 },
  "7x2":   { largura: 7,  espessura: 2 },
  "10x2":  { largura: 10, espessura: 2 },
};

const LADOS_ALIZAR = 2;
const PRECO_METRO_C = 4347; // R$ por m³
const ESPESSURA_ADUELA = 0.04; // metros

const brl = (v) => v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

// volume (m³) de um conjunto de peças; larguraPeca e espessura em metros
function calcularVolume(tipo, altura, largura, larguraPeca, espessura, lados = 1) {
  const vertical = altura * larguraPeca * espessura * tipo.verticais;
  const horizontal = largura * larguraPeca * espessura * tipo.horizontais;
  return (vertical + horizontal) * lados;
}

function atualizarDica() {
  const t = TIPOS[selectTipo.value];
  const porLado = t.verticais + t.horizontais;
  dica.textContent =
    `${t.nome}: ${porLado} aduelas e ${porLado * LADOS_ALIZAR} alizares (${porLado} por lado)`;
}
selectTipo.addEventListener("change", atualizarDica);
atualizarDica();

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const tipo = TIPOS[selectTipo.value];
  const quantidade = Number(document.querySelector("#quantidade").value);
  const altura = Number(document.querySelector("#altura").value);
  const largura = Number(document.querySelector("#largura").value);
  const larguraAduela = Number(document.querySelector("#extra").value) / 100; // cm -> m
  const alizar = ALIZARES[document.querySelector("#alizar").value];

  const volAduelas = calcularVolume(
    tipo, altura, largura, larguraAduela, ESPESSURA_ADUELA
  );
  const volAlizares = calcularVolume(
    tipo, altura, largura, alizar.largura / 100, alizar.espessura / 100, LADOS_ALIZAR
  );

  const custoAduelas = volAduelas * PRECO_METRO_C;
  const custoAlizares = volAlizares * PRECO_METRO_C;
  const custoUnidade = custoAduelas + custoAlizares;

  const volumeUnidade = volAduelas + volAlizares;
  const volumeTotal = volumeUnidade * quantidade;
  const custoTotal = custoUnidade * quantidade;

  out.innerHTML = `
    <p class="total-label">Custo total (${quantidade} ${quantidade === 1 ? "peça" : "peças"})</p>
    <p class="total">${brl(custoTotal)}</p>
    <dl>
      <dt>Aduelas (por peça)</dt><dd>${brl(custoAduelas)}</dd>
      <dt>Alizares (por peça)</dt><dd>${brl(custoAlizares)}</dd>
      <dt>Custo por peça</dt><dd>${brl(custoUnidade)}</dd>
      <dt>Volume por peça</dt><dd>${volumeUnidade.toFixed(4)} m³</dd>
      <dt>Volume total</dt><dd>${volumeTotal.toFixed(4)} m³</dd>
    </dl>
  `;
  out.classList.add("visible");
});