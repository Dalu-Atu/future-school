// import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";

// const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
// const genAI = new GoogleGenerativeAI(API_KEY);

// // ---------------------------------------------------------
// // 1. HELPER: Image Compression
// // ---------------------------------------------------------
// async function compressImageForBrowser(
//   file,
//   maxWidth = 2048,
//   maxHeight = 2048,
//   quality = 0.85
// ) {
//   return new Promise((resolve, reject) => {
//     const canvas = document.createElement("canvas");
//     const ctx = canvas.getContext("2d");
//     const img = new Image();

//     img.onload = () => {
//       let { width, height } = img;
//       if (width > maxWidth || height > maxHeight) {
//         const ratio = Math.min(maxWidth / width, maxHeight / height);
//         width = Math.floor(width * ratio);
//         height = Math.floor(height * ratio);
//       }
//       canvas.width = width;
//       canvas.height = height;
//       ctx.drawImage(img, 0, 0, width, height);
//       resolve(canvas.toDataURL("image/jpeg", quality));
//     };
//     img.onerror = () => reject(new Error("Failed to load image"));

//     if (file instanceof File) {
//       const reader = new FileReader();
//       reader.onload = (e) => (img.src = e.target.result);
//       reader.readAsDataURL(file);
//     } else if (typeof file === "string") {
//       img.src = file;
//     } else {
//       reject(new Error("Invalid file type"));
//     }
//   });
// }

// // ---------------------------------------------------------
// // 2. HELPER: Fuzzy Matching
// // ---------------------------------------------------------
// function getDiceScore(str1, str2) {
//   if (!str1 || !str2) return 0;
//   const s1 = str1.toLowerCase().replace(/[^a-z0-9]/g, "");
//   const s2 = str2.toLowerCase().replace(/[^a-z0-9]/g, "");
//   if (s1 === s2) return 1.0;
//   if (s1.length < 2 || s2.length < 2) return 0.0;
//   const bigrams1 = new Map();
//   for (let i = 0; i < s1.length - 1; i++) {
//     const bigram = s1.substring(i, i + 2);
//     bigrams1.set(bigram, (bigrams1.get(bigram) || 0) + 1);
//   }
//   let intersection = 0;
//   for (let i = 0; i < s2.length - 1; i++) {
//     const bigram = s2.substring(i, i + 2);
//     if (bigrams1.get(bigram) > 0) {
//       intersection++;
//       bigrams1.set(bigram, bigrams1.get(bigram) - 1);
//     }
//   }
//   return (2.0 * intersection) / (s1.length + s2.length - 2);
// }

// function calculateMatchScore(rawName, dbName) {
//   const tokenize = (n) =>
//     n
//       .toLowerCase()
//       .replace(/[^a-z0-9\s]/g, "")
//       .split(/\s+/)
//       .filter(Boolean);
//   const rawTokens = tokenize(rawName);
//   const dbTokens = tokenize(dbName);
//   if (rawTokens.length === 0 || dbTokens.length === 0) return 0;

//   let totalScore = 0;
//   let matchedTokens = 0;

//   for (const rToken of rawTokens) {
//     let maxTokenScore = 0;
//     for (const dToken of dbTokens) {
//       let score = getDiceScore(rToken, dToken);
//       if (rToken.length === 1 && dToken.startsWith(rToken)) score = 0.85;
//       if (score > maxTokenScore) maxTokenScore = score;
//     }
//     totalScore += maxTokenScore;
//     matchedTokens++;
//   }
//   return totalScore / matchedTokens;
// }

// function findStudent(rawName, studentData) {
//   let bestMatch = null;
//   let highestScore = 0;
//   for (const student of studentData) {
//     const score = calculateMatchScore(rawName, student.name);
//     if (score > highestScore) {
//       highestScore = score;
//       bestMatch = student;
//     }
//   }
//   return highestScore >= 0.5
//     ? { student: bestMatch, score: highestScore }
//     : null;
// }

// // ---------------------------------------------------------
// // 3. MAIN FUNCTION (HYBRID MODEL STRATEGY)
// // ---------------------------------------------------------
// async function TranscribeScores(images, studentData, subject, maxRetries = 3) {
//   // Define Models
//   const PRIMARY_MODEL = "gemini-2.0-pro";
//   const FALLBACK_MODEL = "gemini-2.0-flash";

//   console.log(`[Start] Processing subject: ${subject}`);
//   console.log(
//     `[Strategy] Attempt 1-2: ${PRIMARY_MODEL} | Attempt 3+: ${FALLBACK_MODEL}`
//   );

//   // 1. Prepare Images
//   const preparedImages = await Promise.all(
//     images.map(async (img) => {
//       try {
//         const b64 = await compressImageForBrowser(img);
//         return {
//           inlineData: {
//             mimeType: "image/jpeg",
//             data: b64.split(",")[1],
//           },
//         };
//       } catch (e) {
//         console.error("Img Error", e);
//         return null;
//       }
//     })
//   ).then((imgs) => imgs.filter(Boolean));

//   if (preparedImages.length === 0) throw new Error("No valid images.");

//   // 2. Process One Image at a Time (Divide and Conquer)
//   let allExtractedRows = [];

//   const prompt = `
//     Analyze this handwritten score sheet image.
//     1. Transcribe EVERY SINGLE ROW found in the image. Do not stop until you reach the bottom.
//     2. Extract the name from the "Names of Students" column.
//     3. Extract scores for "1st Test", "2nd Test", and "Exam which is the first three column".
//     4. If a score is empty, dash, or illegible, return 0.
//     5. Be precise with numbers (e.g., distinguish between 1, 7, and 9).
//   `;

//   // Loop through each image individually
//   for (let i = 0; i < preparedImages.length; i++) {
//     const imagePart = preparedImages[i];
//     console.log(`📡 Processing Sheet ${i + 1}/${preparedImages.length}...`);

//     for (let attempt = 1; attempt <= maxRetries; attempt++) {
//       // --- 🧠 DYNAMIC MODEL SWITCHING ---
//       // Use Gemini 3 for first 2 attempts. If it fails, switch to Flash 2.0.
//       const currentModelName = attempt <= 2 ? PRIMARY_MODEL : FALLBACK_MODEL;
//       const isPro = currentModelName.includes("pro");

//       console.log(`   Attempt ${attempt}: Using ${currentModelName}...`);

//       try {
//         const model = genAI.getGenerativeModel({
//           model: currentModelName,
//           generationConfig: {
//             temperature: 0.0, // Strictness
//             responseMimeType: "application/json",
//             responseSchema: {
//               type: SchemaType.ARRAY,
//               items: {
//                 type: SchemaType.OBJECT,
//                 properties: {
//                   raw_name: { type: SchemaType.STRING },
//                   firstTest: { type: SchemaType.NUMBER },
//                   secondTest: { type: SchemaType.NUMBER },
//                   exam: { type: SchemaType.NUMBER },
//                 },
//                 required: ["raw_name"],
//               },
//             },
//           },
//         });

//         // Set Timeout: Give Pro 60s, Flash 30s
//         const timeoutDuration = isPro ? 60000 : 30000;
//         const timeout = new Promise((_, reject) =>
//           setTimeout(() => reject(new Error("TIMEOUT")), timeoutDuration)
//         );

//         const result = await Promise.race([
//           model.generateContent([prompt, imagePart]),
//           timeout,
//         ]);

//         const rows = JSON.parse(result.response.text());
//         console.log(
//           `   ✅ Sheet ${i + 1} Success (${currentModelName}): Found ${
//             rows.length
//           } names.`
//         );

//         allExtractedRows = [...allExtractedRows, ...rows];
//         break; // Success, break retry loop and go to next image
//       } catch (error) {
//         console.warn(
//           `   ⚠️ Sheet ${
//             i + 1
//           } Attempt ${attempt} Failed (${currentModelName}): ${
//             error.message || error
//           }`
//         );

//         if (attempt === maxRetries) {
//           console.error(
//             `   ❌ Giving up on Sheet ${i + 1} after ${maxRetries} attempts.`
//           );
//         } else {
//           // Add a small delay before retry
//           await new Promise((r) => setTimeout(r, 2000));
//         }
//       }
//     }
//   }

//   console.log(`[Aggregation] Total raw rows found: ${allExtractedRows.length}`);

//   // 3. Matching Logic
//   const scoresMap = new Map();

//   allExtractedRows.forEach((row) => {
//     const match = findStudent(row.raw_name, studentData);

//     if (match) {
//       scoresMap.set(match.student.name, {
//         firstTest: Math.min(20, Number(row.firstTest) || 0),
//         secondTest: Math.min(20, Number(row.secondTest) || 0),
//         exam: Math.min(70, Number(row.exam) || 0),
//       });
//     } else {
//       console.warn(`❌ UNMATCHED: "${row.raw_name}"`);
//     }
//   });

//   // 4. Update Data
//   const finalData = studentData.map((student) => {
//     if (scoresMap.has(student.name)) {
//       return {
//         ...student,
//         [subject]: scoresMap.get(student.name),
//       };
//     }
//     return student;
//   });

//   console.log("Processing Complete.");
//   return finalData;
// }

// export default TranscribeScores;

import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";

const GEN_AI_MODEL = "gemini-3.1-pro-preview";

// const GEN_AI_MODEL = "gemini-2.5-flash";
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
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

function calculateMatchScore(rawName, dbName) {
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

  for (const rToken of rawTokens) {
    let maxTokenScore = 0;

    for (const dToken of dbTokens) {
      let score = getDiceScore(rToken, dToken);

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

  return totalScore / matchedTokens;
}

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

  return highestScore >= 0.5
    ? { student: bestMatch, score: highestScore }
    : null;
}

// ---------------------------------------------------------
// NEW: Exponential Backoff Helper
// ---------------------------------------------------------
function getRetryDelay(attempt, baseDelay = 2000, maxDelay = 30000) {
  // Exponential backoff: 2s, 4s, 8s, 16s, 30s (capped)
  const delay = Math.min(baseDelay * Math.pow(2, attempt - 1), maxDelay);
  // Add jitter (±20%) to avoid thundering herd
  const jitter = delay * 0.2 * (Math.random() - 0.5);
  return Math.floor(delay + jitter);
}

function is504Error(error) {
  const errorStr = error?.toString()?.toLowerCase() || "";
  return (
    errorStr.includes("504") ||
    errorStr.includes("gateway timeout") ||
    errorStr.includes("timeout") ||
    error?.status === 504
  );
}

// ---------------------------------------------------------
// 3. MAIN FUNCTION WITH RETRY LOGIC
// ---------------------------------------------------------
async function TranscribeScores(
  images,
  studentData,
  subject,
  maxRetries = 5,
  requestTimeout = 60000 // 60 second timeout per request
) {
  console.log(`Starting transcription for subject: ${subject}`);

  const model = genAI.getGenerativeModel({
    model: GEN_AI_MODEL,
    generationConfig: {
      temperature: 0.1,
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

  const prompt = `
    Read the handwritten score sheet.
    Extract the name EXACTLY as written in the "Names of Students" column.
    Extract scores for 1st Test, 2nd Test, and Exam.
    If a score is missing/dash, return 0.
    Ignore crossed-out rows.
  `;

  let lastError = null;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`🔄 Attempt ${attempt}/${maxRetries}: Calling Gemini API...`);

      // Wrap API call with timeout
      const apiCallPromise = model.generateContent([prompt, ...validImages]);

      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(
          () => reject(new Error(`Request timeout after ${requestTimeout}ms`)),
          requestTimeout
        )
      );

      const result = await Promise.race([apiCallPromise, timeoutPromise]);
      const extractedRows = JSON.parse(result.response.text());

      console.log(
        `✅ AI found ${extractedRows.length} rows. Running fuzzy match...`
      );

      const scoresMap = new Map();

      extractedRows.forEach((row) => {
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
          console.warn(`⚠️ UNMATCHED: "${row.raw_name}" (Not in DB)`);
        }
      });

      const finalData = studentData.map((student) => {
        if (scoresMap.has(student.name)) {
          return {
            ...student,
            [subject]: scoresMap.get(student.name),
          };
        }
        return student;
      });

      console.log("✅ Processing Complete!");
      return finalData;
    } catch (error) {
      lastError = error;
      const is504 = is504Error(error);

      console.error(
        `❌ Attempt ${attempt}/${maxRetries} failed:`,
        is504 ? "504 Gateway Timeout" : error.message
      );

      if (attempt < maxRetries) {
        const delay = getRetryDelay(attempt);
        console.log(`⏳ Retrying in ${(delay / 1000).toFixed(1)}s...`);
        await new Promise((r) => setTimeout(r, delay));
      }
    }
  }

  // All retries exhausted
  throw new Error(
    `Failed after ${maxRetries} attempts. Last error: ${
      lastError?.message || "Unknown error"
    }`
  );
}

export default TranscribeScores;
