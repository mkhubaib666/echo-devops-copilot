const Diff = require('diff');

/**
 * Parses a unified diff string and extracts added/modified lines
 * from files ending in .tf.
 * @param {string} diffString - The full diff from the GitHub API.
 * @returns {Object.<string, string>} - An object where keys are filenames
 * and values are the added code.
 */
function parseTerraformChanges(diffString) {
  const changes = {};
  const files = Diff.parsePatch(diffString);

  for (const file of files) {
    // We only care about Terraform files
    if (!file.newFileName || !file.newFileName.endsWith('.tf')) {
      continue;
    }

    let addedCode = '';
    for (const hunk of file.hunks) {
      for (const line of hunk.lines) {
        // Collect only added lines
        if (line.startsWith('+')) {
          // Remove the '+' prefix and add the line
          addedCode += line.substring(1) + '\n';
        }
      }
    }

    if (addedCode) {
      // Use the new file name, stripping the 'b/' prefix
      const cleanFileName = file.newFileName.replace(/^b\//, '');
      changes[cleanFileName] = addedCode;
    }
  }

  return changes;
}

module.exports = { parseTerraformChanges };