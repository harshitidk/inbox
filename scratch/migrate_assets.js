import fs from 'fs';
import path from 'path';
import { createClient } from '@supabase/supabase-js';

// Parse .env manually
const envPath = path.join(process.cwd(), '.env');
const envContent = fs.readFileSync(envPath, 'utf8');
const env = {};
envContent.split('\n').forEach(line => {
  const match = line.match(/^\s*([\w\.\-]+)\s*=\s*(.*)?\s*$/);
  if (match) {
    let value = match[2] ? match[2].trim() : '';
    if (value.startsWith('"') && value.endsWith('"')) {
      value = value.substring(1, value.length - 1);
    }
    env[match[1]] = value;
  }
});

const supabaseUrl = env.VITE_SUPABASE_URL;
const supabaseAnonKey = env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Error: Supabase config missing from .env');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

const BASE_DIR = path.join(process.cwd(), 'public');

async function migrate() {
  console.log('Starting migration of local assets to Supabase storage...');

  // Fetch all existing database rows to update them
  const { data: dbItems, error: fetchErr } = await supabase
    .from('inspirations')
    .select('*');

  if (fetchErr) {
    console.error('Error fetching database inspirations:', fetchErr);
    process.exit(1);
  }

  console.log(`Found ${dbItems.length} records in public.inspirations table.`);

  let successCount = 0;
  let skipCount = 0;
  let failCount = 0;

  for (const item of dbItems) {
    if (!item.image_url.startsWith('/Assets/inspiration/')) {
      console.log(`Skipping item ${item.id} - already migrated or remote URL: ${item.image_url}`);
      skipCount++;
      continue;
    }

    // Resolve local file path
    const cleanPath = item.image_url.split('?')[0];
    const decodedPath = decodeURIComponent(cleanPath);
    const localFilePath = path.join(BASE_DIR, decodedPath);

    if (!fs.existsSync(localFilePath)) {
      console.error(`File not found locally for item ${item.id}: ${localFilePath}`);
      failCount++;
      continue;
    }

    // Determine target upload path (remove "/Assets/inspiration/" prefix)
    const storagePath = decodedPath.replace(/^\/Assets\/inspiration\//, '');

    try {
      const fileBuffer = fs.readFileSync(localFilePath);
      
      console.log(`Uploading ${storagePath}...`);
      const { error: uploadErr } = await supabase.storage
        .from('inspirations')
        .upload(storagePath, fileBuffer, {
          contentType: getMimeType(localFilePath),
          upsert: true
        });

      if (uploadErr) {
        throw uploadErr;
      }

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('inspirations')
        .getPublicUrl(storagePath);

      if (!urlData || !urlData.publicUrl) {
        throw new Error('Failed to get public URL');
      }

      const publicUrl = urlData.publicUrl;

      // Update database row
      const { error: updateErr } = await supabase
        .from('inspirations')
        .update({ image_url: publicUrl })
        .eq('id', item.id);

      if (updateErr) {
        throw updateErr;
      }

      console.log(`Successfully migrated ${item.id} -> ${publicUrl}`);
      successCount++;
    } catch (err) {
      console.error(`Failed to migrate item ${item.id}:`, err.message);
      failCount++;
    }
  }

  console.log('\nMigration complete!');
  console.log(`Successfully migrated: ${successCount}`);
  console.log(`Skipped (already migrated): ${skipCount}`);
  console.log(`Failed: ${failCount}`);
}

function getMimeType(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  switch (ext) {
    case '.jpg':
    case '.jpeg':
      return 'image/jpeg';
    case '.png':
      return 'image/png';
    case '.gif':
      return 'image/gif';
    case '.webp':
      return 'image/webp';
    case '.svg':
      return 'image/svg+xml';
    default:
      return 'application/octet-stream';
  }
}

migrate();
