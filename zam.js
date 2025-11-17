// zam.js
import { saveFile, fetchJson, getFiles } from './blob-api.js';

const DUTIES_FILE = 'duties.json';

/**
 * Подтвердить дежурство
 */
export async function confirmDuty(student, date) {
  let duties = [];
  const files = await getFiles();
  const dutyFile = files.blobs.find(b => b.pathname === DUTIES_FILE);

  if (dutyFile) {
    duties = await fetchJson(dutyFile.url);
  }

  duties.push({ student, date, status: 'confirmed' });
  await saveFile(DUTIES_FILE, duties);
  console.log(`Дежурство подтверждено: ${student} на ${date}`);
}
