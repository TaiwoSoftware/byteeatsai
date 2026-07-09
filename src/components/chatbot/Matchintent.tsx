// matchIntent.ts
//
// Very small, dependency-free keyword matcher. No AI API involved.
//
// How it scores a topic against the user's message:
//  - Exact multi-word keyword phrases found in the message score higher
//    than single-word matches, so "shop dashboard" outranks a stray "shop".
//  - The topic with the highest total score wins.
//  - If nothing scores above the minimum threshold, we return null and
//    the caller shows the fallback answer.

import { Topic, topics } from "./ChatbotKnowledge";

function normalize(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, " ") // strip punctuation
    .replace(/\s+/g, " ")
    .trim();
}

export function matchTopic(userInput: string): Topic | null {
  const message = normalize(userInput);
  if (!message) return null;

  let bestTopic: Topic | null = null;
  let bestScore = 0;

  for (const topic of topics) {
    let score = 0;

    for (const keyword of topic.keywords) {
      const normalizedKeyword = normalize(keyword);
      if (!normalizedKeyword) continue;

      if (message.includes(normalizedKeyword)) {
        // Longer / multi-word keywords are more specific, weight them more.
        const wordCount = normalizedKeyword.split(" ").length;
        score += wordCount;
      }
    }

    if (score > bestScore) {
      bestScore = score;
      bestTopic = topic;
    }
  }

  const MIN_SCORE = 1;
  return bestScore >= MIN_SCORE ? bestTopic : null;
}