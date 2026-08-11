const fs = require('fs');
const path = require('path');

const mockPath = path.join(__dirname, 'lib', 'mock-data.ts');
let content = fs.readFileSync(mockPath, 'utf8');

content = content.replace(/authorName: "([^"]+)",/g, (match, name) => {
  const id = name.toLowerCase().replace(/\s+/g, '-');
  return `authorId: "${id}",\n    authorName: "${name}",`;
});

fs.writeFileSync(mockPath, content, 'utf8');
console.log('Fixed mock-data.ts');
