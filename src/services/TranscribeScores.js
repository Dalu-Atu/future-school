
import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";

const GEN_AI_MODEL = "gemini-pro-latest";
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(API_KEY);

// ---------------------------------------------------------
// 1. HELPER: Image Compression
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
// 2. HELPER: Retry Delay (Exponential Backoff)
// ---------------------------------------------------------
function getRetryDelay(attempt, baseDelay = 2000, maxDelay = 60000) {
  const delay = Math.min(baseDelay * Math.pow(2, attempt - 1), maxDelay);
  const jitter = delay * 0.2 * (Math.random() - 0.5);
  return Math.floor(delay + jitter);
}

function isTimeoutError(error) {
  const errorStr = error?.toString()?.toLowerCase() || "";
  return (
    errorStr.includes("504") ||
    errorStr.includes("503") ||
    errorStr.includes("gateway timeout") ||
    errorStr.includes("timeout") ||
    error?.status === 504 ||
    error?.status === 503
  );
}

// ---------------------------------------------------------
// 3. HELPER: Fuzzy Name Matching
//    Tries multiple strategies to find the best DB match
//    for a name that Gemini returned but isn't in the DB.
// ---------------------------------------------------------
function fuzzyMatchName(aiName, studentData, usedOfficialNames) {
  const aiWords = aiName
    .toUpperCase()
    .split(/\s+/)
    .filter((w) => w.length > 2); // ignore tiny words like "A", "B"

  let bestMatch = null;
  let bestScore = 0;

  for (const student of studentData) {
    const dbName = student.name.toUpperCase();

    // Skip already-used students
    if (usedOfficialNames.has(dbName)) continue;

    const dbWords = dbName.split(/\s+/).filter((w) => w.length > 2);

    // Strategy 1: Count exact word overlaps
    const exactOverlap = aiWords.filter((w) => dbWords.includes(w)).length;

    // Strategy 2: Count partial/substring overlaps (handles spelling diffs)
    const partialOverlap = aiWords.filter((aiW) =>
      dbWords.some(
        (dbW) =>
          dbW.startsWith(aiW.slice(0, 4)) || aiW.startsWith(dbW.slice(0, 4))
      )
    ).length;

    // Strategy 3: Levenshtein distance on the full joined name
    const aiJoined = aiWords.join("");
    const dbJoined = dbWords.join("");
    const editDist = levenshtein(aiJoined, dbJoined);
    const maxLen = Math.max(aiJoined.length, dbJoined.length);
    const similarityScore = maxLen > 0 ? 1 - editDist / maxLen : 0;

    // Weighted composite score
    const score = exactOverlap * 3 + partialOverlap * 1.5 + similarityScore * 2;

    if (score > bestScore) {
      bestScore = score;
      bestMatch = student;
    }
  }

  // Only accept if the match is reasonably confident
  // Must have at least 1 exact word match OR very high similarity
  const minScore = 3; // e.g. one exact word overlap (weight 3)
  if (bestScore >= minScore) {
    return bestMatch;
  }

  return null;
}

// ---------------------------------------------------------
// 4. HELPER: Levenshtein Distance
// ---------------------------------------------------------
function levenshtein(a, b) {
  const m = a.length,
    n = b.length;
  const dp = Array.from({ length: m + 1 }, (_, i) =>
    Array.from({ length: n + 1 }, (_, j) => (i === 0 ? j : j === 0 ? i : 0))
  );
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      dp[i][j] =
        a[i - 1] === b[j - 1]
          ? dp[i - 1][j - 1]
          : 1 + Math.min(dp[i - 1][j - 1], dp[i - 1][j], dp[i][j - 1]);
    }
  }
  return dp[m][n];
}

// ---------------------------------------------------------
// 5. MAIN FUNCTION
// ---------------------------------------------------------
async function TranscribeScores(
  images,
  studentData,
  subject,
  maxRetries = 3,
  requestTimeout = 120000
) {
  console.log(`Starting transcription for subject: ${subject}`);

  // Build the official student name list to inject into the prompt
  const officialNameList = studentData
    .map((s, i) => `${i + 1}. ${s.name}`)
    .join("\n");

  const model = genAI.getGenerativeModel({
    model: GEN_AI_MODEL,
    generationConfig: {
      temperature: 0.0,
      responseMimeType: "application/json",
      responseSchema: {
        type: SchemaType.ARRAY,
        items: {
          type: SchemaType.OBJECT,
          properties: {
            official_name: {
              type: SchemaType.STRING,
              description:
                "The matched official name EXACTLY as it appears in the provided list, or empty string if no match",
            },
            raw_name: {
              type: SchemaType.STRING,
              description: "Name exactly as written on the sheet",
            },
            firstTest: { type: SchemaType.NUMBER },
            secondTest: { type: SchemaType.NUMBER },
            exam: { type: SchemaType.NUMBER },
          },
          required: [
            "official_name",
            "raw_name",
            "firstTest",
            "secondTest",
            "exam",
          ],
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
        console.error("Image compression error:", e);
        return null;
      }
    })
  ).then((imgs) => imgs.filter(Boolean));

  if (validImages.length === 0) throw new Error("No valid images to process.");

  const prompt = `
You are processing a Nigerian secondary school handwritten score sheet.

TASK:
1. Read every student row in the image carefully.
2. For each row, extract the name as written (raw_name) and the three scores.
3. Match the raw name to the OFFICIAL NAME LIST below using your best judgment.
   - Nigerian names are often written in different orders (surname first vs last)
   - Spellings may differ slightly due to handwriting
   - A person may be listed by first name only, or nickname
   - Match by finding the most likely same person, not just similar text
4. If you cannot confidently match a name, set official_name to "".
5. CRITICAL: When you find a match, copy the official_name CHARACTER FOR CHARACTER exactly
   as it appears in the numbered list below. Do not rephrase, reorder, or alter it in any way.
6. NEVER match a name just because they share one common word like "David" or "Joy".

SCORING RULES:
- firstTest column (max 20): labelled "1st" or "H"
- secondTest column (max 20): labelled "2nd" or "I"
- exam column (max 70): labelled "Ex" or "Exam" or "S"
- If a cell has a dash (-) or is blank, return 0
- Red ink numbers are valid scores, read them normally
- Do NOT skip any row

OFFICIAL NAME LIST (copy official_name EXACTLY from this list):
${officialNameList}

Return one JSON object per student row found in the image.
`;

  let lastError = null;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`🔄 Attempt ${attempt}/${maxRetries}: Calling Gemini...`);

      const apiCallPromise = model.generateContent([prompt, ...validImages]);
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(
          () => reject(new Error(`Timeout after ${requestTimeout}ms`)),
          requestTimeout
        )
      );

      const result = await Promise.race([apiCallPromise, timeoutPromise]);
      const extractedRows = JSON.parse(result.response.text());

      console.log(`✅ AI returned ${extractedRows.length} rows`);

      const scoresMap = new Map();
      const usedOfficialNames = new Set();

      // Track unmatched rows for summary
      const unmatchedRows = [];

      extractedRows.forEach((row) => {
        const rawOfficialName = row.official_name?.trim().toUpperCase() || "";

        // ── Step 1: Try exact DB match ──────────────────────────────────
        let dbStudent = rawOfficialName
          ? studentData.find((s) => s.name.toUpperCase() === rawOfficialName)
          : null;

        let matchMethod = "exact";

        // ── Step 2: Fuzzy fallback if exact failed ──────────────────────
        if (!dbStudent && rawOfficialName) {
          const fuzzy = fuzzyMatchName(
            rawOfficialName,
            studentData,
            usedOfficialNames
          );
          if (fuzzy) {
            console.warn(
              `🔁 FUZZY MATCH: AI said "${rawOfficialName}" → resolved to "${fuzzy.name}" for raw: "${row.raw_name}"`
            );
            dbStudent = fuzzy;
            matchMethod = "fuzzy";
          }
        }

        // ── Step 3: Try matching raw_name directly against DB ───────────
        //    Handles cases where Gemini just echoed the raw name
        if (!dbStudent && row.raw_name) {
          const fuzzy = fuzzyMatchName(
            row.raw_name,
            studentData,
            usedOfficialNames
          );
          if (fuzzy) {
            console.warn(
              `🔁 RAW FUZZY MATCH: raw "${row.raw_name}" → resolved to "${fuzzy.name}"`
            );
            dbStudent = fuzzy;
            matchMethod = "raw-fuzzy";
          }
        }

        // ── Step 4: Give up ─────────────────────────────────────────────
        if (!dbStudent) {
          if (rawOfficialName) {
            console.warn(
              `⚠️ NO MATCH: AI said "${rawOfficialName}" for raw: "${row.raw_name}" — skipped`
            );
          } else {
            console.warn(
              `⚠️ NO MATCH: no name returned for raw: "${row.raw_name}" — skipped`
            );
          }
          unmatchedRows.push(row.raw_name || "(blank)");
          return;
        }

        const officialName = dbStudent.name.toUpperCase();

        // Prevent duplicate assignment
        if (usedOfficialNames.has(officialName)) {
          console.warn(
            `⚠️ DUPLICATE: "${officialName}" already assigned, skipping raw: "${row.raw_name}"`
          );
          return;
        }

        usedOfficialNames.add(officialName);

        const scores = {
          firstTest: Math.min(20, Math.max(0, Number(row.firstTest) || 0)),
          secondTest: Math.min(20, Math.max(0, Number(row.secondTest) || 0)),
          exam: Math.min(70, Math.max(0, Number(row.exam) || 0)),
        };

        const methodLabel =
          matchMethod === "exact"
            ? "✅"
            : matchMethod === "fuzzy"
            ? "🔁"
            : "🔁~";

        console.log(
          `${methodLabel} "${row.raw_name}" → "${officialName}" | 1st:${scores.firstTest} 2nd:${scores.secondTest} Ex:${scores.exam}`
        );

        scoresMap.set(officialName, scores);
      });

      // Merge scores back into studentData
      const finalData = studentData.map((student) => {
        const key = student.name.toUpperCase();
        if (scoresMap.has(key)) {
          return { ...student, [subject]: scoresMap.get(key) };
        }
        return student;
      });

      const matched = scoresMap.size;
      const total = extractedRows.length;
      const unmatched = unmatchedRows.length;

      console.log(
        `✅ Done! Matched ${matched}/${total} rows from sheet to DB.`
      );
      if (unmatched > 0) {
        console.warn(
          `⚠️ ${unmatched} rows could not be matched:\n  ${unmatchedRows.join(
            "\n  "
          )}`
        );
      }

      return finalData;
    } catch (error) {
      lastError = error;
      const isTimeout = isTimeoutError(error);

      console.error(
        `❌ Attempt ${attempt}/${maxRetries} failed:`,
        isTimeout ? "Timeout/Gateway error" : error.message
      );

      if (attempt < maxRetries) {
        const delay = getRetryDelay(attempt);
        console.log(`⏳ Retrying in ${(delay / 1000).toFixed(1)}s...`);
        await new Promise((r) => setTimeout(r, delay));
      }
    }
  }

  throw new Error(
    `Failed after ${maxRetries} attempts. Last error: ${
      lastError?.message || "Unknown error"
    }`
  );
}

export default TranscribeScores;