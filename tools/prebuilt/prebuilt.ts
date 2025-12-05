import fs from 'fs';
import fetch from 'node-fetch';
import readLine from 'readline';
import path from 'path';

interface Template {
  name: string;
  codeOriginal?: string;
  codeCustom?: string;
  directory: string;
  filename: string;
  mimeType: string;
  active?: boolean;
}

async function promptValue(question: string, defaultValue?: string): Promise<string> {
  const rl = readLine.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  const prompt = defaultValue ? `${question} (default: ${defaultValue}): ` : `${question}: `;

  return new Promise(resolve => {
    rl.question(prompt, answer => {
      rl.close();
      resolve(answer.trim() || defaultValue || '');
    });
  });
}

async function fetchTemplates(): Promise<Template[]> {
  try {
    // PROMPT THE USER FOR THE BACKEND URL AND FORMAT IT CORRECTLY
    let backendURL = await promptValue('Enter the backend URL:', 'http://localhost:8080/api');

    if (backendURL.endsWith('/')) backendURL = backendURL.slice(0, -1);
    if (!backendURL.endsWith('/api')) backendURL += '/api';

    console.log(`Using backend URL: ${backendURL}`);

    // PROMPT THE USER FOR THE AUTHENTICATION TOKEN AND FORMAT IT CORRECTLY
    let token = await promptValue('Enter your TOKEN');

    if (!token.startsWith('Bearer ')) token = `Bearer ${token}`;

    console.log('Using provided TOKEN for authentication.');

    // SET UP QUERY PARAMETERS TO FILTER ACTIVE TEMPLATES
    const params = new URLSearchParams({
      searchParams: JSON.stringify({ active: true }),
    });

    // FETCH TEMPLATES FROM THE BACKEND
    const response = await fetch(`${backendURL}/templates?${params.toString()}`, {
      method: 'GET',
      headers: {
        Authorization: token,
      },
    });

    // CHECK FOR ERRORS IN THE RESPONSE
    if (!response.ok) throw new Error(`Failed to fetch templates: ${response.statusText}`);

    return (await response.json()) as Template[];
  } catch (e) {
    console.error('Error fetching templates:', e);
    process.exit(1);
  }
}

async function writeOrUpdateFile(filePath: string, content: string) {
  try {
    // CHECK DIRECTORY EXISTS, IF NOT, CREATE IT RECURSIVELY
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) await fs.promises.mkdir(dir, { recursive: true });

    // WRITE OR UPDATE THE FILE WITH THE PROVIDED CONTENT
    await fs.promises.writeFile(filePath, content, 'utf8');
    console.log(`File written/updated at: ${filePath}`);
  } catch (e) {
    console.error('Error prebuilding file:', e);
    process.exit(1);
  }
}

(async () => {
  // Get the absolute path to the project root directory
  const PROJECT_ROOT = fs.realpathSync(process.cwd());

  // Get templates from backend
  const templates = await fetchTemplates();

  // Iterate over each template and log the constructed file path
  for (const template of templates) {
    const dirPath = path.join(PROJECT_ROOT, template.directory, template.filename);
    console.log('🚀 ~ dirPath:', dirPath);

    await writeOrUpdateFile(dirPath, template.codeCustom ?? template.codeOriginal ?? '');
  }
})();
