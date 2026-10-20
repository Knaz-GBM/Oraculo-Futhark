
"use strict";

const assert = require("node:assert/strict");
const {
  SPREADS,
  shuffle,
  drawRunes,
  getInterpretation
} = require("../scripts/oracle.js");

const runes = Array.from({ length: 24 }, (_, index) => ({
  id: index + 1,
  symbol: `r${index + 1}`,
  name: `Runa${index + 1}`,
  meaning: `Significado ${index + 1}`,
  light: [`Luz ${index + 1}`],
  shadow: [`Sombra ${index + 1}`]
}));

function deterministicRandom() {
  return 0.42;
}

for (const count of [1, 3, 5]) {
  const cards = drawRunes(runes, count, deterministicRandom);

  assert.equal(cards.length, count, `A tiragem de ${count} deve ter ${count} runas.`);

  const ids = cards.map((card) => card.rune.id);
  assert.equal(new Set(ids).size, count, "Não pode haver runas repetidas.");

  cards.forEach((card, index) => {
    assert.equal(card.position, SPREADS[count].positions[index]);
    assert.ok(["normal", "invertida"].includes(card.orientation));
  });
}

const original = [...runes];
shuffle(runes, deterministicRandom);
assert.deepEqual(runes, original, "O embaralhamento não deve alterar o array original.");

assert.throws(
  () => drawRunes(runes, 2),
  RangeError,
  "Uma tiragem de 2 runas deve ser rejeitada."
);

assert.throws(
  () => drawRunes(runes.slice(0, 2), 3),
  RangeError,
  "Uma tiragem não pode pedir mais runas do que existem."
);

const normalCard = {
  rune: runes[0],
  orientation: "normal"
};

const reversedCard = {
  rune: runes[0],
  orientation: "invertida"
};

assert.deepEqual(getInterpretation(normalCard), runes[0].light);
assert.deepEqual(getInterpretation(reversedCard), runes[0].shadow);

console.log("OK: todos os testes do oráculo passaram.");
