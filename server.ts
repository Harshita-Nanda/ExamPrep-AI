import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json({ limit: '35mb' }));
app.use(express.urlencoded({ limit: '35mb', extended: true }));

function getGenAI() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not configured in the environment.');
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// Main generation endpoint for complete academic study kit
app.post('/api/study-kit/generate', async (req, res) => {
  try {
    const { text, imageBase64, imageMimeType, customInstructions } = req.body;

    if (!text && !imageBase64) {
      return res.status(400).json({ error: 'Please provide study text notes or an uploaded document image.' });
    }

    const ai = getGenAI();

    const systemInstruction = `You are an expert AI academic tutor, study-planning assistant, exam-preparation assistant, and learning companion.

Your job is to transform raw study material provided by the student, including text, handwritten notes, PDFs, document images, screenshots, or extracted OCR text, into a structured, interactive, easy-to-understand study kit.

The primary goal is:
UPLOAD MATERIAL → UNDERSTAND → LEARN → PRACTICE → TEST → IDENTIFY WEAK AREAS → REVISE

Use the provided study material as the primary source of truth. Do not invent facts or add unrelated information.

CRITICAL INSTRUCTIONS & SECTIONS:

1. CONTENT EXTRACTION & TOPIC DETECTION:
- Extract chapters, topics, subtopics, definitions, formulas, examples, processes, diagrams, and key concepts.
- Create a logical learning hierarchy: Chapter → Topic → Subtopic → Concept.
- If OCR text or source is unclear, indicate it clearly.

2. 📚 STRUCTURED NOTES:
- Formal, exam-oriented notes for each topic.
- Use headings, subheadings, bullet points, numbered steps.
- Highlight keywords.
- Mark important content with tags:
  ⭐ Very Important
  🔥 Frequently Tested
  📌 Definition
  🧮 Formula
  💡 Concept
  ⚠️ Important Note

3. 🧠 HINGLISH UNDERSTANDING:
- For EVERY major topic, provide a separate "Hinglish Understanding" section.
- Explain like a friendly college teacher.
- Use a natural combination of Hindi and English. Keep technical terms in English.
- Explain difficult concepts step-by-step.
- Explain WHY and HOW whenever possible.
- Use simple real-world analogies (e.g. mobile apps, cricket, chai, daily life).

4. 🧑🎓 BEGINNER EXPLANATION:
- "Explain Like I'm a Beginner" / ELI5 for difficult concepts in ultra-simple words without losing technical correctness.

5. 📊 DIFFICULTY LEVEL:
- Assign each topic: 🟢 Easy, 🟡 Medium, or 🔴 Difficult.

6. 🎯 EXAM IMPORTANCE:
- Assign each topic: ⭐ Very Important, 📌 Important, or ○ Supporting Concept.

7. 🗺️ LEARNING PATH:
- Logical learning sequence with prerequisites (e.g., Topic 1: Basics → Topic 2: Core Concept → Topic 3: Working → Topic 4: Application → Revision → Test).

8. 🔗 CONCEPT CONNECTIONS:
- Show how concepts are related and build upon each other (From → To → Relationship).

9. ❓ PRACTICE QUESTIONS:
- A. MCQ (4 options, correct answer, explanation)
- B. Short Answer (exam-oriented question, high-scoring sample answer)
- C. Conceptual Application (real-world scenario, sample answer)

10. 📝 EXAM ANSWER MODE:
- For major topics, generate tailored answers for:
  - 2 Marks (Definition + 1-2 key points)
  - 5 Marks (Definition, explanation, key points, example/diagram, short conclusion)
  - 10 Marks (Introduction, detailed explanation, subtopics, example, diagram/flow, conclusion)

11. 🧪 TOPIC QUIZ:
- 3 to 5 interactive questions with options, correct answer, explanation, and concept remediation for wrong answers.

12. 🔍 KEYWORDS:
- Term, concise definition, and Hinglish explanation for all high-yield terms.

13. 🖼️ VISUAL & DIAGRAM EXPLANATION:
- Text-based ASCII flowchart / architecture diagram explaining components and flow.

14. 🃏 FLASHCARDS:
- Array of { "term": "...", "back": "..." } for interactive flashcards.

15. ⚡ QUICK REVISION:
- 5–10 key points, definitions, formulas, keywords, and common conceptual mistakes.

16. 🔄 SMART REVISION:
- 5-Minute Revision (most crucial points, formulas, definitions)
- Exam Revision (high-yield concepts, expected questions, pitfall warnings)
- Last-Minute Revision (ultra-concise must-remember bullets)

17. MARKDOWN OUTPUT:
- Construct a full, beautiful markdownResponse encompassing all sections.`;

    const parts: any[] = [];

    if (imageBase64) {
      const cleanBase64 = imageBase64.includes('base64,')
        ? imageBase64.split('base64,')[1]
        : imageBase64;
      const mime = imageMimeType || 'image/jpeg';
      parts.push({
        inlineData: {
          mimeType: mime,
          data: cleanBase64,
        },
      });
    }

    let userPromptText = `Transform the following study material into the full 22-module study kit:\n\n`;
    if (text) {
      userPromptText += `Source Study Material:\n${text}\n\n`;
    }
    if (customInstructions) {
      userPromptText += `Target Academic Level / Student Goals: ${customInstructions}\n\n`;
    }
    userPromptText += `Analyze all topics, create structured notes with tags (⭐, 🔥, 📌, 🧮, 💡, ⚠️), Hinglish guru explanations, beginner explanations, 2/5/10 marks exam answers, learning path, concept connections, quiz with remediation, keywords, text diagrams, flashcards, quick revision, and 3 smart revision modes.`;

    parts.push({ text: userPromptText });

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: { parts },
      config: {
        systemInstruction,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: {
              type: Type.STRING,
              description: 'Academic topic or chapter title',
            },
            sourceSummary: {
              type: Type.STRING,
              description: 'One to two sentence summary of the analyzed material',
            },
            markdownResponse: {
              type: Type.STRING,
              description: 'Complete formatted markdown text containing all sections for export and printing',
            },
            topics: {
              type: Type.ARRAY,
              description: 'List of major topics analyzed from the material',
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  name: { type: Type.STRING },
                  subtopics: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                  },
                  difficulty: {
                    type: Type.STRING,
                    description: 'Easy, Medium, or Difficult',
                  },
                  examImportance: {
                    type: Type.STRING,
                    description: 'Very Important, Important, or Supporting Concept',
                  },
                  formalNotes: {
                    type: Type.STRING,
                    description: 'Formal exam notes with tags like ⭐ Very Important, 📌 Definition, 🧮 Formula, etc.',
                  },
                  hinglishUnderstanding: {
                    type: Type.STRING,
                    description: 'Conversational Hinglish explanation breaking down why and how with analogies',
                  },
                  beginnerExplanation: {
                    type: Type.STRING,
                    description: 'Explain Like I\'m a Beginner in extremely simple words',
                  },
                  keywords: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        term: { type: Type.STRING },
                        definition: { type: Type.STRING },
                        hinglish: { type: Type.STRING },
                      },
                      required: ['term', 'definition', 'hinglish'],
                    },
                  },
                  diagramExplanation: {
                    type: Type.OBJECT,
                    properties: {
                      title: { type: Type.STRING },
                      asciiDiagram: { type: Type.STRING, description: 'Text-based flowchart or diagram' },
                      components: {
                        type: Type.ARRAY,
                        items: {
                          type: Type.OBJECT,
                          properties: {
                            name: { type: Type.STRING },
                            description: { type: Type.STRING },
                          },
                          required: ['name', 'description'],
                        },
                      },
                    },
                  },
                  examAnswers: {
                    type: Type.OBJECT,
                    properties: {
                      marks2: { type: Type.STRING, description: '2 Marks answer (Definition + key points)' },
                      marks5: { type: Type.STRING, description: '5 Marks answer (Definition, points, example, conclusion)' },
                      marks10: { type: Type.STRING, description: '10 Marks answer (Intro, subtopics, diagram, examples, conclusion)' },
                    },
                    required: ['marks2', 'marks5', 'marks10'],
                  },
                },
                required: [
                  'id',
                  'name',
                  'difficulty',
                  'examImportance',
                  'formalNotes',
                  'hinglishUnderstanding',
                  'beginnerExplanation',
                  'keywords',
                  'examAnswers',
                ],
              },
            },
            learningPath: {
              type: Type.ARRAY,
              description: 'Step by step recommended study sequence',
              items: {
                type: Type.OBJECT,
                properties: {
                  stepNumber: { type: Type.INTEGER },
                  topic: { type: Type.STRING },
                  phase: { type: Type.STRING },
                  prerequisites: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                  },
                  description: { type: Type.STRING },
                },
                required: ['stepNumber', 'topic', 'phase', 'description'],
              },
            },
            conceptConnections: {
              type: Type.ARRAY,
              description: 'Visual connections between concepts',
              items: {
                type: Type.OBJECT,
                properties: {
                  from: { type: Type.STRING },
                  to: { type: Type.STRING },
                  relationship: { type: Type.STRING },
                },
                required: ['from', 'to', 'relationship'],
              },
            },
            practiceQuestions: {
              type: Type.OBJECT,
              properties: {
                mcq: {
                  type: Type.OBJECT,
                  properties: {
                    question: { type: Type.STRING },
                    options: { type: Type.ARRAY, items: { type: Type.STRING } },
                    correctIndex: { type: Type.INTEGER },
                    correctAnswer: { type: Type.STRING },
                    explanation: { type: Type.STRING },
                  },
                  required: ['question', 'options', 'correctIndex', 'correctAnswer', 'explanation'],
                },
                shortAnswer: {
                  type: Type.OBJECT,
                  properties: {
                    question: { type: Type.STRING },
                    sampleHighScoringAnswer: { type: Type.STRING },
                    keyGradingPoints: { type: Type.ARRAY, items: { type: Type.STRING } },
                  },
                  required: ['question', 'sampleHighScoringAnswer'],
                },
                conceptualApplication: {
                  type: Type.OBJECT,
                  properties: {
                    question: { type: Type.STRING },
                    scenario: { type: Type.STRING },
                    sampleAnswer: { type: Type.STRING },
                  },
                  required: ['question', 'sampleAnswer'],
                },
              },
              required: ['mcq', 'shortAnswer', 'conceptualApplication'],
            },
            topicQuiz: {
              type: Type.ARRAY,
              description: '3 to 5 interactive quiz questions with remedial feedback',
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  topicName: { type: Type.STRING },
                  question: { type: Type.STRING },
                  options: { type: Type.ARRAY, items: { type: Type.STRING } },
                  correctIndex: { type: Type.INTEGER },
                  explanation: { type: Type.STRING },
                  conceptRemediation: { type: Type.STRING, description: 'Conceptual explanation helping students who pick the wrong answer' },
                },
                required: ['id', 'topicName', 'question', 'options', 'correctIndex', 'explanation', 'conceptRemediation'],
              },
            },
            flashcards: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  term: { type: Type.STRING },
                  back: { type: Type.STRING },
                },
                required: ['term', 'back'],
              },
            },
            quickRevision: {
              type: Type.OBJECT,
              properties: {
                keyPoints: { type: Type.ARRAY, items: { type: Type.STRING } },
                definitions: { type: Type.ARRAY, items: { type: Type.STRING } },
                formulasOrRules: { type: Type.ARRAY, items: { type: Type.STRING } },
                keyTerms: { type: Type.ARRAY, items: { type: Type.STRING } },
                commonMistakes: { type: Type.ARRAY, items: { type: Type.STRING } },
              },
              required: ['keyPoints', 'definitions', 'keyTerms', 'commonMistakes'],
            },
            smartRevision: {
              type: Type.OBJECT,
              properties: {
                fiveMinuteRevision: {
                  type: Type.OBJECT,
                  properties: {
                    title: { type: Type.STRING },
                    mustRememberPoints: { type: Type.ARRAY, items: { type: Type.STRING } },
                    definitions: { type: Type.ARRAY, items: { type: Type.STRING } },
                    formulas: { type: Type.ARRAY, items: { type: Type.STRING } },
                  },
                  required: ['title', 'mustRememberPoints', 'definitions'],
                },
                examRevision: {
                  type: Type.OBJECT,
                  properties: {
                    title: { type: Type.STRING },
                    highYieldConcepts: { type: Type.ARRAY, items: { type: Type.STRING } },
                    expectedQuestions: { type: Type.ARRAY, items: { type: Type.STRING } },
                    formulasAndDefinitions: { type: Type.ARRAY, items: { type: Type.STRING } },
                    criticalPitfalls: { type: Type.ARRAY, items: { type: Type.STRING } },
                  },
                  required: ['title', 'highYieldConcepts', 'expectedQuestions', 'criticalPitfalls'],
                },
                lastMinuteRevision: {
                  type: Type.OBJECT,
                  properties: {
                    title: { type: Type.STRING },
                    ultraSummaryBullets: { type: Type.ARRAY, items: { type: Type.STRING } },
                  },
                  required: ['title', 'ultraSummaryBullets'],
                },
              },
              required: ['fiveMinuteRevision', 'examRevision', 'lastMinuteRevision'],
            },
          },
          required: [
            'title',
            'markdownResponse',
            'topics',
            'learningPath',
            'conceptConnections',
            'practiceQuestions',
            'topicQuiz',
            'flashcards',
            'quickRevision',
            'smartRevision',
          ],
        },
      },
    });

    const textOutput = response.text;
    if (!textOutput) {
      return res.status(500).json({ error: 'No output generated from Gemini model.' });
    }

    const parsedData = JSON.parse(textOutput);

    const studyKit = {
      id: 'kit_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
      createdAt: new Date().toISOString(),
      ...parsedData,
    };

    return res.json({ success: true, studyKit });
  } catch (error: any) {
    console.error('Error in /api/study-kit/generate:', error);
    return res.status(500).json({
      error: error?.message || 'Failed to parse study material and generate study kit.',
    });
  }
});

// Grounded "Ask a Doubt" Tutor Endpoint
app.post('/api/study-kit/ask-tutor', async (req, res) => {
  try {
    const { question, context, studyKitTitle, preferHinglish } = req.body;
    if (!question) {
      return res.status(400).json({ error: 'Question is required.' });
    }

    const ai = getGenAI();

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: [
        {
          text: `You are an expert AI academic tutor and learning companion for "${studyKitTitle || 'Study Material'}".
Source Material Context:
${context || 'General topic context'}

Student's Doubt/Question: "${question}"

Source-Based Rules:
1. Always prioritize the provided study material.
2. If the answer is directly supported by the material, explain it clearly with step-by-step logic.
3. If the answer is NOT present in the provided material, explicitly state: "Yeh information source notes mein directly mention nahi hai, lekin conceptually..." and mark additional context clearly.
4. ${preferHinglish ? 'Explain in friendly, encouraging Hinglish with an intuitive real-world analogy.' : 'Explain in friendly, crystal-clear academic English with an intuitive analogy.'}
5. Keep it concise, academically accurate, and exam-focused.`,
        },
      ],
    });

    return res.json({ answer: response.text });
  } catch (err: any) {
    console.error('Error in /api/study-kit/ask-tutor:', err);
    return res.status(500).json({ error: err?.message || 'Tutor response failed.' });
  }
});

async function startServer() {
  const isDev = process.env.NODE_ENV !== 'production';

  if (isDev) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT} (${isDev ? 'development' : 'production'})`);
  });
}

startServer();
