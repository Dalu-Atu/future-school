import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI("AIzaSyDsGHCg6qbL1JIESsoJ9Nr54tgzhCUlJMo");

// Browser-compatible image compression function
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
      // Calculate new dimensions while maintaining aspect ratio
      let { width, height } = img;

      if (width > maxWidth || height > maxHeight) {
        const ratio = Math.min(maxWidth / width, maxHeight / height);
        width = Math.floor(width * ratio);
        height = Math.floor(height * ratio);
      }

      canvas.width = width;
      canvas.height = height;

      // Draw and compress
      ctx.drawImage(img, 0, 0, width, height);

      // Convert to base64 with compression
      const compressedDataUrl = canvas.toDataURL("image/jpeg", quality);

      // Check size (approximate - base64 is ~1.37x larger than binary)
      const sizeInBytes = (compressedDataUrl.length - 22) * 0.75; // Rough estimate

      if (sizeInBytes > 20 * 1024 * 1024) {
        // 20MB limit
        reject(
          new Error(
            "Image size exceeds 20MB limit after compression. Try a smaller image."
          )
        );
      } else {
        resolve(compressedDataUrl);
      }
    };

    img.onerror = () => reject(new Error("Failed to load image"));

    // Handle File object or base64 string
    if (file instanceof File) {
      const reader = new FileReader();
      reader.onload = (e) => {
        img.src = e.target.result;
      };
      reader.readAsDataURL(file);
    } else if (typeof file === "string") {
      img.src = file;
    } else {
      reject(new Error("Invalid file type"));
    }
  });
}

// Updated function for browser compatibility
async function TranscribeScores(images, studentData, subject, maxRetries = 10) {
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
  images = [...images];

  // Extract student names for the AI to reference
  const studentNames = studentData
    .map((student) => student.name)
    .filter(Boolean);

  // Create the comprehensive prompt
  const prompts = `
Provide only the OBJECT code, with no explanations or comments.

You are an AI assistant tasked with analyzing student score sheets from images and matching them to an official student database. Your job is to extract scores from the image(s), identify the correct student from the database, and assign scores accordingly.

------------------------------
🚨 CRITICAL INSTRUCTIONS 🚨
------------------------------

1. 📸 IMAGE ANALYSIS:
   - Go through the names and scores in the provided image(s) **sequentially, one by one, in order of appearance**.

2. 🧑‍🎓 STUDENT DATABASE:
   - Here is the list of official student names:
${studentNames.map((name, index) => `${index + 1}. ${name}`).join("\n")}

3. 📚 SUBJECT:
   - The subject for this score sheet is: **"${subject}"**

4. 📝 SCORE TYPES:
   - Look for the following types of scores (default to 0 if not present):
     - firstTest: First test score (max 20)
     - secondTest: Second test score (max 20)
     - exam: Final exam score (max 70)

5. 🔍 NAME MATCHING RULES (VERY IMPORTANT):
   - Use intelligent fuzzy matching between names from the image and names in the database.
   - Account for:
     • Swapped name order (e.g., "K. ADEBAYO" ↔ "ADEBAYO KESSIANA")
     • Handwriting variations, initials, and abbreviations (e.g., "A. GWENELYN" → "AKPE SADE GWENELYN")
     • Nicknames and shortened forms (e.g., "EMMANUELLA" → "ELLA", "TOBILOBA" → "TOBI", "EMMANUEL" → "EMMA")
     • Missing or extra middle names
     • Diminutive forms and cultural short forms (especially in Nigerian and African naming systems)
   - Do not rely only on exact matches — compare **all combinations of first, middle, and last names** between image entries and the database.
   - Always assign a match only if at least 70% similarity is detected.
   - Skip a name if the confidence level is too low.


6. 🧠 INTELLIGENT MATCHING:
   - For each image name entry:
     - Check all possible name arrangements
     - Compare against the full database name list
     - Use initials, abbreviations, and fuzzy match
     - Consider likely matches even if not exact

7. 🎯 SCORE ASSIGNMENT RULES:
   - Only assign scores if you're confident the name matches a database student.
   - If a student appears in the database but is not confidently found in the image, **do not include** them in the output.
   - If a name appears in the image but cannot be confidently linked to a student in the database, **skip it**.

8. ✅ OUTPUT FORMAT:
Return a **valid JSON array** in the following structure (nothing else):

[
  {
    "name": "EXACT_DATABASE_NAME",
    "${subject}": {
      "firstTest": number,
      "secondTest": number,
      "exam": number
    }
  }
]

9. 🧪 QUALITY ASSURANCE:
   - Check each name and score pair carefully
   - Ensure all scores are in expected ranges (firstTest/secondTest: 0–20, exam: 0–70)
   - Be **conservative**: skip any student if you're not at least 70% confident in the match
   - Do NOT include students who are not found in the image
   - Do NOT include students from the database who are not confidently matched

10. 🎓 MATCHING EXAMPLES:
   - "ADEBAYO K. SKYLAR" → "ADEBAYOR KESSIANA SKYLAR"
   - "A. GWENELYN" → "AKPE SADE GWENELYN"
   - "DELE G." → "DELE GOODNEWS"

Remember:
- Go through each name in the image **in order**.
- Attempt to match **every name**.
- Accuracy is more important than completeness.
- Return ONLY the matched students with their scores.

Now process the image(s) and return the JSON result.
`;

  // Process and format images for browser
  const formattedImages = await Promise.all(
    images.map(async (image) => {
      try {
        // Compress image using browser-compatible method
        const compressedDataUrl = await compressImageForBrowser(image);

        // Extract base64 data and mime type
        const [mimeTypePart, base64Data] = compressedDataUrl.split(",");
        const mimeType = mimeTypePart.match(/:(.*?);/)[1];

        return {
          inlineData: {
            mimeType,
            data: base64Data,
          },
        };
      } catch (error) {
        console.error("Error processing image:", error);
        return null;
      }
    })
  );

  const validImages = formattedImages.filter(Boolean);
  if (validImages.length === 0) {
    throw new Error("No valid images to process.");
  }

  // Retry logic for API calls
  for (let attempts = 0; attempts < maxRetries; attempts++) {
    try {
      console.log(
        `Attempt ${attempts + 1}: Calling Gemini API for score processing...`
      );

      const requestBody = {
        contents: [
          {
            role: "user",
            parts: [{ text: prompts }, ...validImages],
          },
        ],
        generationConfig: {
          temperature: 0.1, // Lower temperature for more consistent results
          topP: 0.8,
          topK: 40,
          maxOutputTokens: 8000,
        },
      };

      const response = await model.generateContent(requestBody);
      const responseText = response.response
        .text()
        .replace(/^```json\s+|\s+```$/g, ""); // Clean code

      console.log("Raw AI Response:", responseText);

      // Parse and validate the response
      let parsedResults;
      try {
        // Extract JSON from response (in case there's extra text)
        const jsonMatch = responseText.match(/\[[\s\S]*\]/);
        if (jsonMatch) {
          parsedResults = JSON.parse(jsonMatch[0]);
        } else {
          throw new Error("No valid JSON array found in response");
        }
      } catch (parseError) {
        console.error("Error parsing AI response:", parseError);
        if (attempts < maxRetries - 1) {
          console.log("Retrying due to parse error...");
          continue;
        }
        throw new Error("Failed to parse AI response as valid JSON");
      }

      // Sanitize and validate results
      const sanitizedResults = parsedResults
        .filter((result) => result.name && result[subject]) // Only include results with name and subject scores
        .map((result) => ({
          name: result.name,
          [subject]: {
            firstTest: Math.max(
              0,
              Math.min(20, Number(result[subject].firstTest) || 0)
            ),
            secondTest: Math.max(
              0,
              Math.min(20, Number(result[subject].secondTest) || 0)
            ),
            exam: Math.max(0, Math.min(100, Number(result[subject].exam) || 0)),
          },
        }));

      // Create lookup map for quick matching
      const resultsMap = new Map();
      sanitizedResults.forEach((result) => {
        resultsMap.set(result.name, result[subject]);
      });

      // Update student data - only update students found by AI, leave others unchanged
      const updatedStudentData = studentData.map((student) => {
        const matchedScores = resultsMap.get(student.name);

        if (matchedScores) {
          // Update this student with AI-found scores
          return {
            ...student,
            [subject]: {
              firstTest: matchedScores.firstTest,
              secondTest: matchedScores.secondTest,
              exam: matchedScores.exam,
            },
          };
        }

        // Return student unchanged if not found by AI
        return student;
      });

      // Log results for debugging
      console.log("AI Processing Results:");
      console.log("- Total students in database:", studentData.length);
      console.log("- Students matched by AI:", sanitizedResults.length);
      console.log(
        "- Updated students:",
        updatedStudentData.filter((student) => resultsMap.has(student.name))
          .length
      );
      console.log(
        "- Unchanged students:",
        updatedStudentData.filter((student) => !resultsMap.has(student.name))
          .length
      );

      return updatedStudentData;
    } catch (error) {
      console.error(
        `Error calling Gemini API (Attempt ${attempts + 1}):`,
        error
      );

      if (
        attempts < maxRetries - 1 &&
        (error.message.includes("fetch failed") ||
          error.message.includes("network") ||
          error.message.includes("timeout"))
      ) {
        console.log("Retrying in 3 seconds...");
        await new Promise((resolve) => setTimeout(resolve, 3000));
      } else {
        throw new Error(
          `Failed to process images after ${attempts + 1} attempts: ${
            error.message
          }`
        );
      }
    }
  }
}

// Helper function to calculate name similarity (Levenshtein distance based)
function calculateNameSimilarity(name1, name2) {
  const normalize = (str) =>
    str
      .toLowerCase()
      .replace(/[^a-z\s]/g, "")
      .trim();
  const n1 = normalize(name1);
  const n2 = normalize(name2);

  if (n1 === n2) return 1.0;

  // Simple similarity calculation
  const longer = n1.length > n2.length ? n1 : n2;
  const shorter = n1.length > n2.length ? n2 : n1;

  if (longer.length === 0) return 1.0;

  const distance = levenshteinDistance(longer, shorter);
  return (longer.length - distance) / longer.length;
}

function levenshteinDistance(str1, str2) {
  const matrix = [];

  for (let i = 0; i <= str2.length; i++) {
    matrix[i] = [i];
  }

  for (let j = 0; j <= str1.length; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= str2.length; i++) {
    for (let j = 1; j <= str1.length; j++) {
      if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        );
      }
    }
  }

  return matrix[str2.length][str1.length];
}

export default TranscribeScores;
