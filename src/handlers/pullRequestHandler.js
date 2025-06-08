const { parseTerraformChanges } = require('../utils/terraformParser');
const { analyzeIaC } = require('../services/geminiService');

/**
 * The main handler for pull request events.
 * @param {import('probot').Context} context
 */
module.exports = async (context) => {
  const { payload, octokit } = context;
  const repo = context.repo();
  const prNumber = payload.pull_request.number;

  let analysisComment;

  try {
    // 1. Post an initial "in-progress" comment for better UX
    analysisComment = await octokit.issues.createComment({
      ...repo,
      issue_number: prNumber,
      body: '🤖 Echo is analyzing your Terraform changes... Please wait.',
    });

    // 2. Get the diff for the pull request
    const diffResponse = await octokit.pulls.get({
      ...repo,
      pull_number: prNumber,
      mediaType: {
        format: 'diff',
      },
    });
    const diff = diffResponse.data;

    // 3. Parse the diff to extract only added/modified Terraform code
    const terraformChanges = parseTerraformChanges(diff);

    if (Object.keys(terraformChanges).length === 0) {
      await octokit.issues.updateComment({
        ...repo,
        comment_id: analysisComment.data.id,
        body: '🤖 Echo analysis complete. No Terraform (`.tf`) files were changed in this PR.',
      });
      return;
    }

    // 4. Send the extracted code to the AI for analysis
    const analysisResult = await analyzeIaC(terraformChanges);

    // 5. Format the result into a nice Markdown comment
    const finalCommentBody = formatAnalysisResult(analysisResult);

    // 6. Update the initial comment with the final analysis
    await octokit.issues.updateComment({
      ...repo,
      comment_id: analysisComment.data.id,
      body: finalCommentBody,
    });
  } catch (error) {
    context.log.error('Error processing pull request:', error);
    // If an error occurs, update the comment to inform the user
    if (analysisComment) {
      await octokit.issues.updateComment({
        ...repo,
        comment_id: analysisComment.data.id,
        body: `🤖 Echo encountered an error while analyzing your PR. Please check the application logs. \n\n\`\`\`\n${error.message}\n\`\`\``,
      });
    }
  }
};

/**
 * Formats the analysis result from the AI into a Markdown string.
 * @param {object} result - The parsed JSON result from the Gemini API.
 * @returns {string} - A formatted Markdown string.
 */
function formatAnalysisResult(result) {
  return `
### 🤖 Echo: AI-Powered IaC Analysis

Here is the analysis of the Terraform changes in this pull request:

---

#### 💰 Cost Analysis
${result.costAnalysis}

---

#### 🛡️ Security Concerns
${result.securityConcerns}

---

#### ✨ Best Practices & Recommendations
${result.bestPractices}

---
*Analysis powered by Google's Gemini Pro model. This is an automated analysis and should be reviewed by a human.*
  `;
}