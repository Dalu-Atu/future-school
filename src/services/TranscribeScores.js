import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";

 const GEN_AI_MODEL = "gemini-3-pro-preview";
// const GEN_AI_MODEL = "gemini-2.5-flash";
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY; // Added VITE_ prefix
const genAI = new GoogleGenerativeAI(API_KEY);

// ---------------------------------------------------------
// 1. HELPER: Image Compression (Standard)
// ---------------------------------------------------------
async function compressImageForBrowser(
  file,
  maxWidth = 2048,
  maxHeight = 2048,
  quality = 0.85
) {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();

    img.onload = () => {
      let { width, height } = img;
      if (width > maxWidth || height > maxHeight) {
        const ratio = Math.min(maxWidth / width, maxHeight / height);
        width = Math.floor(width * ratio);
        height = Math.floor(height * ratio);
      }
      canvas.width = width;
      canvas.height = height;
      ctx.drawImage(img, 0, 0, width, height);
      resolve(canvas.toDataURL("image/jpeg", quality));
    };

    img.onerror = () => reject(new Error("Failed to load image"));

    if (file instanceof File) {
      const reader = new FileReader();
      reader.onload = (e) => (img.src = e.target.result);
      reader.readAsDataURL(file);
    } else if (typeof file === "string") {
      img.src = file;
    } else {
      reject(new Error("Invalid file type"));
    }
  });
}

// ---------------------------------------------------------
// 2. HELPER: Advanced Fuzzy Matching (The Core Fix)
// ---------------------------------------------------------

// A. Low-level string similarity (Dice Coefficient)
// Returns 0.0 to 1.0 based on character bigrams
function getDiceScore(str1, str2) {
  if (!str1 || !str2) return 0;
  const s1 = str1.toLowerCase().replace(/[^a-z0-9]/g, "");
  const s2 = str2.toLowerCase().replace(/[^a-z0-9]/g, "");

  if (s1 === s2) return 1.0;
  if (s1.length < 2 || s2.length < 2) return 0.0;

  const bigrams1 = new Map();
  for (let i = 0; i < s1.length - 1; i++) {
    const bigram = s1.substring(i, i + 2);
    bigrams1.set(bigram, (bigrams1.get(bigram) || 0) + 1);
  }

  let intersection = 0;
  for (let i = 0; i < s2.length - 1; i++) {
    const bigram = s2.substring(i, i + 2);
    if (bigrams1.get(bigram) > 0) {
      intersection++;
      bigrams1.set(bigram, bigrams1.get(bigram) - 1);
    }
  }

  return (2.0 * intersection) / (s1.length + s2.length - 2);
}

// B. High-level Token Matching
// Splits names into words and finds the best alignment.
// Solves: "A. David" matching "Adegar David"
function calculateMatchScore(rawName, dbName) {
  // normalize and split into tokens (words)
  const tokenize = (n) =>
    n
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, "")
      .split(/\s+/)
      .filter(Boolean);

  const rawTokens = tokenize(rawName);
  const dbTokens = tokenize(dbName);

  if (rawTokens.length === 0 || dbTokens.length === 0) return 0;

  let totalScore = 0;
  let matchedTokens = 0;

  // For every word in the handwritten name...
  for (const rToken of rawTokens) {
    let maxTokenScore = 0;

    // ...find the best matching word in the database name
    for (const dToken of dbTokens) {
      let score = getDiceScore(rToken, dToken);

      // Bonus for initial matching (e.g. "A" matches "Adegar")
      if (rToken.length === 1 && dToken.startsWith(rToken)) {
        score = 0.85;
      }

      if (score > maxTokenScore) {
        maxTokenScore = score;
      }
    }

    totalScore += maxTokenScore;
    matchedTokens++;
  }

  // Average the scores of the tokens
  return totalScore / matchedTokens;
}

// C. Find the Best Student
function findStudent(rawName, studentData) {
  let bestMatch = null;
  let highestScore = 0;

  for (const student of studentData) {
    const score = calculateMatchScore(rawName, student.name);
    if (score > highestScore) {
      highestScore = score;
      bestMatch = student;
    }
  }

  // Threshold set to 0.50 (50%) to catch "messy" matches like your logs showed
  return highestScore >= 0.5
    ? { student: bestMatch, score: highestScore }
    : null;
}

// ---------------------------------------------------------
// 3. MAIN FUNCTION
// ---------------------------------------------------------
async function TranscribeScores(images, studentData, subject, maxRetries = 10) {
  console.log(`Starting transcription for subject: ${subject}`);

  const model = genAI.getGenerativeModel({
    model: GEN_AI_MODEL,
    generationConfig: {
      temperature: 0.1, // Low temp for precision
      responseMimeType: "application/json",
      responseSchema: {
        type: SchemaType.ARRAY,
        items: {
          type: SchemaType.OBJECT,
          properties: {
            raw_name: { type: SchemaType.STRING },
            firstTest: { type: SchemaType.NUMBER },
            secondTest: { type: SchemaType.NUMBER },
            exam: { type: SchemaType.NUMBER },
          },
          required: ["raw_name"],
        },
      },
    },
  });

  // Prepare images
  const validImages = await Promise.all(
    images.map(async (img) => {
      try {
        const b64 = await compressImageForBrowser(img);
        return {
          inlineData: {
            mimeType: "image/jpeg",
            data: b64.split(",")[1],
          },
        };
      } catch (e) {
        console.error("Img Error", e);
        return null;
      }
    })
  ).then((imgs) => imgs.filter(Boolean));

  if (validImages.length === 0) throw new Error("No valid images.");

  // PROMPT: Pure OCR. No Logic.
  const prompt = `
    Read the handwritten score sheet.
    Extract the name EXACTLY as written in the "Names of Students" column.
    Extract scores for 1st Test, 2nd Test, and Exam.
    If a score is missing/dash, return 0.
    Ignore crossed-out rows.
  `;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`Attempt ${attempt}: Asking Gemini...`);
      const result = await model.generateContent([prompt, ...validImages]);
      const extractedRows = JSON.parse(result.response.text());

      console.log(
        `AI found ${extractedRows.length} rows. Running fuzzy match...`
      );

      // We map results to a dictionary for O(1) lookups later
      const scoresMap = new Map();

      extractedRows.forEach((row) => {
        // Attempt to match the AI-read name to your DB
        const match = findStudent(row.raw_name, studentData);

        if (match) {
          console.log(
            `✅ MATCH: "${row.raw_name}" -> "${match.student.name}" (${(
              match.score * 100
            ).toFixed(0)}%)`
          );

          scoresMap.set(match.student.name, {
            firstTest: Math.min(20, Number(row.firstTest) || 0),
            secondTest: Math.min(20, Number(row.secondTest) || 0),
            exam: Math.min(70, Number(row.exam) || 0),
          });
        } else {
          console.warn(`❌ UNMATCHED: "${row.raw_name}" (Not in DB)`);
        }
      });

      // Update the studentData array
      const finalData = studentData.map((student) => {
        if (scoresMap.has(student.name)) {
          return {
            ...student,
            [subject]: scoresMap.get(student.name),
          };
        }
        return student;
      });

      console.log("Processing Complete.");
      return finalData;
    } catch (error) {
      console.error(`Attempt ${attempt} Error:`, error);
      if (attempt === maxRetries) throw "Slow Network Issue";
      await new Promise((r) => setTimeout(r, 2000));
    }
  }
}

export default TranscribeScores;
