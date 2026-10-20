
(function (root) {
  "use strict";

  const SPREADS = {
    1: {
      name: "Foco",
      positions: ["Foco"]
    },
    3: {
      name: "Saga",
      positions: ["Origem", "Provação", "Caminho"]
    },
    5: {
      name: "Jornada",
      positions: [
        "Situação",
        "Raiz",
        "Tensão",
        "Recurso",
        "Próximo passo"
      ]
    }
  };

  function shuffle(items, random = Math.random) {
    const result = [...items];

    for (let i = result.length - 1; i > 0; i--) {
      const j = Math.floor(random() * (i + 1));
      [result[i], result[j]] = [result[j], result[i]];
    }

    return result;
  }

  function drawRunes(runes, count, random = Math.random) {
    if (!Array.isArray(runes)) {
      throw new TypeError("A lista de runas deve ser um array.");
    }

    if (!Number.isInteger(count) || !SPREADS[count]) {
      throw new RangeError("A tiragem deve conter 1, 3 ou 5 runas.");
    }

    if (runes.length < count) {
      throw new RangeError("Não há runas suficientes para esta tiragem.");
    }

    const selected = shuffle(runes, random).slice(0, count);

    return selected.map((rune, index) => ({
      rune,
      position: SPREADS[count].positions[index],
      orientation: random() < 0.5 ? "normal" : "invertida"
    }));
  }

  function escapeHTML(value) {
    return String(value ?? "").replace(/[&<>"']/g, (char) => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;"
    })[char]);
  }

  function getInterpretation(card) {
    const values = card.orientation === "invertida"
      ? card.rune.shadow
      : card.rune.light;

    return Array.isArray(values) ? values : [];
  }

  function renderCard(card) {
    const rune = card.rune;
    const reversed = card.orientation === "invertida";
    const interpretation = getInterpretation(card);
    const polarity = reversed ? "Tensão simbólica" : "Potência simbólica";
    const safeId = encodeURIComponent(String(rune.id));

    return `
      <article class="card oracle-card ${reversed ? "is-reversed" : ""}">
        <div class="eyebrow">${escapeHTML(card.position)}</div>

        <div class="oracle-rune ${reversed ? "rune-reversed" : ""}"
             aria-label="Runa ${escapeHTML(rune.name)}, posição ${escapeHTML(card.orientation)}">
          ${escapeHTML(rune.symbol)}
        </div>

        <div class="oracle-orientation">
          ${reversed ? "↓ Invertida" : "↑ Normal"}
        </div>

        <h2>${escapeHTML(rune.name)}</h2>
        <p>${escapeHTML(rune.meaning)}</p>

        <p class="oracle-polarity">
          <b>${polarity}:</b>
          ${interpretation.map(escapeHTML).join(", ") || "Sem interpretação cadastrada"}.
        </p>

        <a class="btn oracle-link" href="runa.html?id=${safeId}">
          Abrir ficha da runa ↗
        </a>
      </article>
    `;
  }

  function renderReading(cards, question, spreadCount) {
    const spread = SPREADS[spreadCount];
    const safeQuestion = escapeHTML(question.trim());

    const cardsHTML = cards.map(renderCard).join("");

    const narrative = cards.map((card) =>
      `<li><b>${escapeHTML(card.position)}:</b> ${escapeHTML(card.rune.name)} — ${escapeHTML(card.rune.meaning)}.</li>`
    ).join("");

    return `
      <div class="oracle-heading">
        <div class="eyebrow">Tiragem concluída</div>
        <h2>${escapeHTML(spread.name)}</h2>
        ${safeQuestion
          ? `<p class="muted"><b>Tema:</b> ${safeQuestion}</p>`
          : `<p class="muted">Uma leitura simbólica sem pergunta registrada.</p>`
        }
      </div>

      <div class="grid oracle-grid">${cardsHTML}</div>

      <article class="card oracle-synthesis">
        <h2>Fio narrativo</h2>
        <p class="muted">
          Leia as posições em conjunto. Elas sugerem perguntas para reflexão,
          não uma sequência inevitável de acontecimentos.
        </p>
        <ol>${narrative}</ol>
        <p><b>Para refletir:</b> qual destas ideias é útil para sua situação?
          Qual delas você precisa questionar?</p>
      </article>
    `;
  }

  function initOracle() {
    const questionInput = document.getElementById("question");
    const spreadSelect = document.getElementById("spread");
    const drawButton = document.getElementById("draw");
    const clearButton = document.getElementById("clear");
    const output = document.getElementById("result");

    if (!questionInput || !spreadSelect || !drawButton ||
        !clearButton || !output) {
      return;
    }

    drawButton.addEventListener("click", function () {
      const runes = root.RUNES;
      const count = Number(spreadSelect.value);

      if (!Array.isArray(runes) || runes.length === 0) {
        output.innerHTML = `
          <div class="notice" role="alert">
            Não foi possível carregar as runas. Verifique se data/runes.js
            está disponível.
          </div>
        `;
        return;
      }

      try {
        const cards = drawRunes(runes, count);
        output.innerHTML = renderReading(
          cards,
          questionInput.value,
          count
        );
      } catch (error) {
        output.innerHTML = `
          <div class="notice" role="alert">
            Não foi possível realizar a tiragem. Confira a seleção e tente novamente.
          </div>
        `;
      }
    });

    clearButton.addEventListener("click", function () {
      questionInput.value = "";
      spreadSelect.value = "3";
      output.innerHTML = "";
      questionInput.focus();
    });
  }

  const api = {
    SPREADS,
    shuffle,
    drawRunes,
    getInterpretation,
    renderCard,
    renderReading,
    initOracle
  };

  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }

  if (root.document) {
    if (root.document.readyState === "loading") {
      root.document.addEventListener("DOMContentLoaded", initOracle);
    } else {
      initOracle();
    }
  }
})(typeof window !== "undefined" ? window : globalThis);
