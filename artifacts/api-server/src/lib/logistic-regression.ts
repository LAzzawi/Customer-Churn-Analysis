export interface TrainingSample {
  features: number[];
  label: number;
}

function sigmoid(z: number): number {
  return 1 / (1 + Math.exp(-z));
}

export function trainLogisticRegression(
  samples: TrainingSample[],
  learningRate = 0.1,
  epochs = 1000
): number[] {
  if (samples.length === 0) return [];
  const numFeatures = samples[0].features.length;
  const weights = new Array(numFeatures + 1).fill(0);

  for (let e = 0; e < epochs; e++) {
    const gradients = new Array(numFeatures + 1).fill(0);
    for (const sample of samples) {
      const z =
        weights[0] + sample.features.reduce((sum, f, i) => sum + weights[i + 1] * f, 0);
      const predicted = sigmoid(z);
      const error = predicted - sample.label;
      gradients[0] += error;
      for (let j = 0; j < numFeatures; j++) {
        gradients[j + 1] += error * sample.features[j];
      }
    }
    for (let j = 0; j <= numFeatures; j++) {
      weights[j] -= (learningRate / samples.length) * gradients[j];
    }
  }
  return weights;
}

export function predict(weights: number[], features: number[]): number {
  const z = weights[0] + features.reduce((sum, f, i) => sum + weights[i + 1] * f, 0);
  return sigmoid(z);
}

export function standardize(
  data: number[][]
): { standardized: number[][]; means: number[]; stds: number[] } {
  const numFeatures = data[0].length;
  const means = new Array(numFeatures).fill(0);
  const stds = new Array(numFeatures).fill(1);

  for (let j = 0; j < numFeatures; j++) {
    const col = data.map((r) => r[j]);
    means[j] = col.reduce((s, v) => s + v, 0) / col.length;
    const variance = col.reduce((s, v) => s + (v - means[j]) ** 2, 0) / col.length;
    stds[j] = Math.sqrt(variance) || 1;
  }

  const standardized = data.map((row) =>
    row.map((v, j) => (v - means[j]) / stds[j])
  );

  return { standardized, means, stds };
}

export function evaluateModel(
  weights: number[],
  testSamples: TrainingSample[],
  threshold = 0.5
): {
  accuracy: number;
  precision: number;
  recall: number;
  f1Score: number;
  auc: number;
  truePositive: number;
  trueNegative: number;
  falsePositive: number;
  falseNegative: number;
} {
  let tp = 0, tn = 0, fp = 0, fn = 0;
  const scores: Array<{ score: number; label: number }> = [];

  for (const sample of testSamples) {
    const score = predict(weights, sample.features);
    scores.push({ score, label: sample.label });
    const pred = score >= threshold ? 1 : 0;
    if (pred === 1 && sample.label === 1) tp++;
    else if (pred === 0 && sample.label === 0) tn++;
    else if (pred === 1 && sample.label === 0) fp++;
    else fn++;
  }

  const accuracy = (tp + tn) / (tp + tn + fp + fn);
  const precision = tp + fp > 0 ? tp / (tp + fp) : 0;
  const recall = tp + fn > 0 ? tp / (tp + fn) : 0;
  const f1Score = precision + recall > 0 ? (2 * precision * recall) / (precision + recall) : 0;

  scores.sort((a, b) => b.score - a.score);
  let auc = 0;
  let positives = 0;
  let negatives = 0;
  for (const s of scores) {
    if (s.label === 1) positives++;
    else { auc += positives; negatives++; }
  }
  auc = positives > 0 && negatives > 0 ? auc / (positives * negatives) : 0.5;

  return { accuracy, precision, recall, f1Score, auc, truePositive: tp, trueNegative: tn, falsePositive: fp, falseNegative: fn };
}
