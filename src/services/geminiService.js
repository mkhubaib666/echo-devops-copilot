const { GoogleGenerativeAI } = require('@google/generative-ai');

// Initialize the Gemini client
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro-latest' });

/**
 * Analyzes Terraform code using the Gemini Pro model.
 * @param {Object.<string, string>} terraformChanges - An object of filename: code.
 * @returns {Promise<object>} - A promise that resolves to the parsed JSON analysis.
 */
async function analyzeIaC(terraformChanges) {
  const codeToSend = JSON.stringify(terraformChanges, null, 2);

  const prompt = `
You are "Echo", an expert DevOps engineer and cloud cost analyst. Your task is to analyze Terraform code changes from a GitHub pull request.

Analyze the following Terraform code, provided as a JSON object where keys are filenames and values are the new code added in the pull request:

\`\`\`terraform
${codeToSend}
\`\`\`

Based on the code, provide the following analysis:

1.  **Cost Analysis**: Give a high-level, qualitative cost estimation (e.g., Trivial, Low, Medium, High, Very High). Explain your reasoning by identifying the specific resources that contribute to the cost (e.g., "This introduces a new RDS instance which is a high-cost resource."). Do NOT provide specific dollar amounts.
2.  **Security Concerns**: Identify potential security vulnerabilities. For example, publicly exposed S3 buckets, security groups with overly permissive ingress rules (like 0.0.0.0/0), or hardcoded secrets. If there are no concerns, state that.
3.  **Best Practices**: Check for deviations from standard best practices. For example, missing tags, lack of versioning on S3 buckets, or using fixed versions for providers. Provide actionable recommendations.

Your response MUST be a single, valid JSON object. Do not include any text or markdown formatting before or after the JSON object. The JSON object must have the following keys, with string values containing your analysis in Markdown format:
- "costAnalysis"
- "securityConcerns"
- "bestPractices"

Example response format:
{
  "costAnalysis": "...",
  "securityConcerns": "...",
  "bestPractices": "..."
}
`;

  const result = await model.generateContent(prompt);
  const response = result.response;
  const text = response.text();

  // Clean the response to ensure it's valid JSON
  const cleanedText = text.replace(/```json/g, '').replace(/```/g, '').trim();

  try {
    return JSON.parse(cleanedText);
  } catch (error) {
    console.error('Failed to parse Gemini response as JSON:', cleanedText);
    throw new Error('Received an invalid response from the AI model.');
  }
}

module.exports = { analyzeIaC };