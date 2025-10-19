const fs = require('fs');
const path = require('path');

// Function to remove comments from a file
function removeCommentsFromFile(filePath) {
  try {
    // Read file content
    const content = fs.readFileSync(filePath, 'utf8');
    
    // Skip non-JS/JSX files
    if (!filePath.endsWith('.js') && !filePath.endsWith('.jsx')) {
      return;
    }
    
    console.log(`Processing: ${filePath}`);
    
    // Remove different types of comments
    let newContent = content
      // Remove single-line comments
      .replace(/\/\/.*$/gm, '')
      // Remove multi-line comments
      .replace(/\/\*[\s\S]*?\*\//g, '')
      // Remove JSX comments
      .replace(/{\s*\/\*[\s\S]*?\*\/\s*}/g, '')
      .replace(/{\s*\/\/.*\s*}/g, '')
      // Clean up extra newlines
      .replace(/\n\s*\n\s*\n/g, '\n\n');
      
    // Write the content back only if it changed
    if (newContent !== content) {
      fs.writeFileSync(filePath, newContent, 'utf8');
      console.log(`Comments removed: ${filePath}`);
    } else {
      console.log(`No comments found: ${filePath}`);
    }
  } catch (error) {
    console.error(`Error processing ${filePath}:`, error);
  }
}

// Function to process all files in a directory recursively
function processDirectory(directoryPath) {
  const files = fs.readdirSync(directoryPath);
  
  for (const file of files) {
    const fullPath = path.join(directoryPath, file);
    const stats = fs.statSync(fullPath);
    
    if (stats.isDirectory()) {
      // Skip node_modules and .git directories
      if (file !== 'node_modules' && file !== '.git') {
        processDirectory(fullPath);
      }
    } else if (stats.isFile() && (file.endsWith('.js') || file.endsWith('.jsx'))) {
      removeCommentsFromFile(fullPath);
    }
  }
}

// Main execution
const projectRoot = process.argv[2] || '.';
console.log(`Removing comments from JS/JSX files in: ${projectRoot}`);
processDirectory(projectRoot);
console.log('Done removing comments!');