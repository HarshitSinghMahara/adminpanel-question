import { NextRequest, NextResponse } from 'next/server'

/**
 * Hardcoded AI answer mock — picks one at random on every request.
 * Replace with real LLM call (Anthropic/OpenAI) when ready.
 */
export const HARDCODED_ANSWERS = [
  `This question tests your understanding of a fundamental concept in the subject.

Key Points to Address:

1. Definition and Context: Begin by clearly defining the core concept being tested. Use precise academic language appropriate for the examination level.

2. Mechanism and Process: Explain the underlying mechanism step by step. Break it into digestible stages so that the examiner can follow your reasoning clearly.

3. Clinical and Practical Application: Connect the theoretical knowledge to real-world or clinical scenarios. This demonstrates depth of understanding beyond rote memorization.

4. Mnemonics and High-Yield Facts: Remember key associations and commonly tested facts. These are frequently the deciding factors in competitive examinations.

5. Common Mistakes to Avoid: Students often confuse related but distinct concepts. Ensure you clearly delineate the boundaries of this topic from adjacent ones.

Conclusion: Summarize the essential answer in 2–3 concise sentences that directly address what was asked. Always re-read the question to confirm your answer is complete and on-point.`,

  `Comprehensive Answer:

The question evaluates your grasp of an important examination topic. Here is a structured response:

Introduction:
State the primary concept clearly. Examiners reward candidates who establish the scope of their answer at the outset.

Core Explanation:
- The fundamental principle here involves understanding how individual components interact within the broader system.
- Each sub-component plays a specific role, and disruption at any level produces characteristic findings.
- These findings are frequently tested and should be memorized using reliable associations.

Application:
In clinical or practical settings, this knowledge allows for:
1. Accurate diagnosis or identification
2. Appropriate management strategy selection
3. Prediction of complications or outcomes

High-Yield Summary:
- Remember the classic triad and key features
- Know the exceptions — they are frequently tested
- Understand the pathophysiology, not just the end result

This structured approach will serve you well across MCQ, short answer, and viva formats.`,

  `Expert Answer with Full Explanation:

Understanding this topic requires integrating knowledge from multiple areas of the curriculum. Here is a thorough breakdown:

Part 1 — Foundational Knowledge:
The core concept emerges from established scientific principles. A strong grasp of the basic science enables you to derive answers even when direct recall fails.

Part 2 — Important Associations:
- Associated findings and related conditions
- Key differentiating factors from similar topics
- Statistical and epidemiological relevance

Part 3 — Examination Strategy:
When you encounter this type of question in an examination:
1. Identify the central theme of the question stem
2. Look for discriminating clues — specific words that narrow the answer
3. Eliminate clearly wrong options first
4. Use pathophysiological reasoning to confirm your final choice

Part 4 — Memory Aids:
Create associations using spaced repetition. Link new information to concepts you already know solidly. Visualization and active recall outperform passive reading for long-term retention.

Final Note: Practice questions on this topic regularly. Exposure to varied question formats around the same concept solidifies understanding and improves examination performance significantly.`,

  `Stepwise Answer:

To answer this question effectively, adopt a stepwise approach:

Step 1 — Identify the Core Issue:
Read the question carefully and extract the key concept being tested. Underline or mentally note the critical words in the stem.

Step 2 — Recall Relevant Knowledge:
Retrieve the foundational principles related to this topic. Think in terms of:
- Basic science basis
- Physiological or pathological sequence
- Commonly tested clinical correlates

Step 3 — Structure Your Response:
A well-structured answer includes a definition, explanation, and application. Even in MCQ format, thinking this way helps eliminate distractors.

Step 4 — Verify and Conclude:
Always double-check: does your answer directly address the question asked? Avoid drifting into tangential information that dilutes your response.

Key Takeaway: Mastery comes from understanding concepts deeply, not merely memorizing isolated facts. This question is a good example of why integrated study pays off.`,

  `Answer Guide — High-Yield Focus:

This topic frequently appears in competitive examinations. Here is what you need to know:

Core Fact:
The primary concept can be summarized in a single principle. Build your answer outward from this foundation.

Why This Matters:
Understanding this is clinically or practically significant because it directly impacts decision-making at critical junctures. Examiners test this because it differentiates candidates who truly understand from those who simply memorize.

Common Traps:
- Confusing superficially similar terms or conditions
- Overlooking exceptions that are frequently tested
- Misattributing cause and effect in the underlying mechanism

Remember:
- The classic presentation vs. atypical variants
- Key numbers, thresholds, or timeframes if applicable
- First-line approach and when to deviate from it

One-liner Summary: This topic is high-yield because it bridges basic science and clinical application — understand it at both levels for maximum marks.`,

  `Analytical Answer:

Let us approach this question analytically, breaking it into its component parts:

What Is Being Asked?
The question stem is designed to test whether you can differentiate between closely related concepts. The key discriminator is typically embedded in the phrasing — look carefully.

Background and Context:
This topic sits at the intersection of multiple subject areas. A candidate who has studied in an integrated fashion will recognize the cross-disciplinary relevance.

Detailed Explanation:
- The primary mechanism can be understood as a chain of events, each dependent on the previous
- Disruption at any step produces a predictable downstream effect
- This predictability is what makes the topic examinable and clinically useful

Applied Reasoning:
In practice, this knowledge translates into the ability to:
1. Anticipate consequences
2. Formulate differential diagnoses or solutions
3. Justify the chosen approach with scientific reasoning

Exam Tip: Questions on this topic often include one or two plausible distractors. The correct answer will always align most closely with the core scientific principle — trust the pathophysiology.`,
]

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const _questionText = body.question ?? ''
    void _questionText // unused but kept for future LLM integration

    // Pick a truly random answer each time
    const idx = Math.floor(Math.random() * HARDCODED_ANSWERS.length)
    const answer = HARDCODED_ANSWERS[idx]

    // Stream the answer word by word with a small delay for realism
    const encoder = new TextEncoder()

    const stream = new ReadableStream({
      async start(controller) {
        // Simulate brief initial thinking delay
        await new Promise((r) => setTimeout(r, 250))

        const words = answer.split(' ')
        for (let i = 0; i < words.length; i++) {
          const chunk = (i === 0 ? '' : ' ') + words[i]
          controller.enqueue(encoder.encode(chunk))
          await new Promise((r) => setTimeout(r, 16))
        }
        controller.close()
      },
    })

    return new NextResponse(stream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Transfer-Encoding': 'chunked',
        'Cache-Control': 'no-cache',
      },
    })
  } catch (err) {
    console.error('AI answer error:', err)
    return NextResponse.json({ error: 'Failed to generate answer' }, { status: 500 })
  }
}
