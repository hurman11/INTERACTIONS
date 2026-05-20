const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');

const replacements = {
  '#ffffff': '#00E5FF', // Old cyan -> New cyan
  '#888888': '#D946EF', // Old purple -> New magenta
  '#333333': '#FF3B00', // Old orange -> New orange
  '#f0f0f0': '#F8F9FA', // Old white -> New white
  '#000000': '#030305', // Old black -> New black
  '#111111': '#0B0B12', // Old charcoal -> New charcoal
};

function walkDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      walkDir(fullPath);
    } else if (fullPath.endsWith('.jsx') || fullPath.endsWith('.js') || fullPath.endsWith('.css')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      let changed = false;
      
      // We don't want to replace in constants.js since it already has the new colors
      if (fullPath.includes('constants.js') || fullPath.includes('tailwind.config.js')) continue;

      for (const [oldColor, newColor] of Object.entries(replacements)) {
        // Case insensitive regex replace
        const regex = new RegExp(oldColor, 'gi');
        if (regex.test(content)) {
          content = content.replace(regex, newColor);
          changed = true;
        }
      }

      if (changed) {
        fs.writeFileSync(fullPath, content, 'utf8');
        console.log(`Updated ${fullPath}`);
      }
    }
  }
}

walkDir(srcDir);
console.log("Color replacement complete.");
