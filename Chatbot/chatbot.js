const fs = require("fs");
const path = require("path");

const intentsPath = path.join(__dirname, "intents.json");
const data = JSON.parse(fs.readFileSync(intentsPath, "utf-8"));

function similarity(a, b) {
  const setA = new Set(a);
  const setB = new Set(b);

  const intersection = new Set([...setA].filter(x => setB.has(x)));
  return intersection.size / (setA.size + setB.size - intersection.size);
}

function tokenize(text) {
  return text.toLowerCase().split(/\s+/);
}

function getBotResponse(userInput) {
  const inputTokens = tokenize(userInput);

  let bestIntent = null;
  let bestScore = 0;

  data.intents.forEach(intent => {
    intent.patterns.forEach(pattern => {
      const score = similarity(
        inputTokens,
        tokenize(pattern)
      );

      if (score > bestScore) {
        bestScore = score;
        bestIntent = intent;
      }
    });
  });

  if (!bestIntent || bestScore < 0.2) {
    bestIntent = data.intents.find(i => i.tag === "fallback");
  }

  const responses = bestIntent.responses;
  return responses[Math.floor(Math.random() * responses.length)];
}

module.exports = { getBotResponse };
