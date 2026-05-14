

export const getScore = (blendshapes, name) => {
  const found = blendshapes.find((b) => b.categoryName === name);
  return found ? found.score : 0;
};

export const detectExpression = (blendshapes) => {
  const smile =
    getScore(blendshapes, "mouthSmileLeft") +
    getScore(blendshapes, "mouthSmileRight");

  const mouthOpen = getScore(blendshapes, "jawOpen");
  const browRaise = getScore(blendshapes, "browInnerUp");

  const sad =
    getScore(blendshapes, "mouthFrownLeft") +
    getScore(blendshapes, "mouthFrownRight");

  if (smile > 0.02) return "😊 Happy";
  if (mouthOpen > 0.0025 && browRaise > 0.001) return "😮 Surprise";
  if (sad > 0.001) return "😢 Sad";
  return "😐 Neutral";
};
