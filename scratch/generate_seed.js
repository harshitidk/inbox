import fs from 'fs';
import path from 'path';

// Read the typescript data file
const tsFilePath = path.join(process.cwd(), 'src/inspirationData.ts');
let content = fs.readFileSync(tsFilePath, 'utf8');

// Strip TypeScript annotations to convert it to standard JS object
content = content.replace('export const INSPIRATION_DATA: Record<string, string[]> =', 'const INSPIRATION_DATA =');

// Append module.exports
content += '\nexport default INSPIRATION_DATA;\n';

// Write to a temporary file
const tempJsPath = path.join(process.cwd(), 'scratch/tempInspirationData.js');
fs.writeFileSync(tempJsPath, content, 'utf8');

// Import the JS object dynamically
import(tempJsPath).then(({ default: INSPIRATION_DATA }) => {
  let sql = 'DELETE FROM public.inspirations;\n\n';
  
  for (const [category, urls] of Object.entries(INSPIRATION_DATA)) {
    for (const url of urls) {
      // Escape single quotes for SQL
      const escapedCategory = category.replace(/'/g, "''");
      const escapedUrl = url.replace(/'/g, "''");
      sql += `INSERT INTO public.inspirations (category, image_url) VALUES ('${escapedCategory}', '${escapedUrl}');\n`;
    }
  }
  
  const seedSqlPath = path.join(process.cwd(), 'scratch/seed.sql');
  fs.writeFileSync(seedSqlPath, sql, 'utf8');
  console.log(`Successfully generated seed SQL with ${Object.values(INSPIRATION_DATA).flat().length} rows in scratch/seed.sql`);
  
  // Clean up temporary file
  try {
    fs.unlinkSync(tempJsPath);
  } catch (e) {
    // Ignore error
  }
}).catch(err => {
  console.error('Error importing temp file:', err);
  process.exit(1);
});
