import { put } from '@vercel/blob';

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const students = [
    { "name": "Абдамитов Акыл Абдамитович", "status": "Активен", "role": "student" },
    { "name": "Абдыкеримова Адеми Мирлановна", "status": "Активен", "role": "student" },
    { "name": "Акынбеков Арсен Маратович", "status": "Активен", "role": "student" },
    { "name": "Алымкулова Нурайым Эрлановна", "status": "Активен", "role": "student" },
    { "name": "Асангалыев Эмирбек Маратжанович", "status": "Активен", "role": "student" },
    { "name": "Бударный Николай Романович", "status": "Активен", "role": "student" },
    { "name": "Буларкиев Ислам Тимурович", "status": "Активен", "role": "student" },
    { "name": "Глушак Илья Дмитриевич", "status": "Активен", "role": "student" },
    { "name": "Дамиров Эдил Эрикович", "status": "Активен", "role": "student" },
    { "name": "Дубайлов Максим Дмитриевич", "status": "Активен", "role": "student" },
    { "name": "Дүйшеев Нурэл Болотович", "status": "Активен", "role": "student" },
    { "name": "Жеенбеков Нуржигит Кубанычбекович", "status": "Активен", "role": "student" },
    { "name": "Искакбеков Байэл Мирланович", "status": "Активен", "role": "student" },
    { "name": "Кадыркулов Шумкар Алтынбекович", "status": "Активен", "role": "student" },
    { "name": "Келгенбаев Ильяз Алмазович", "status": "Активен", "role": "student" },
    { "name": "Мамбетжанов Илияз Абдысаламович", "status": "Активен", "role": "student" },
    { "name": "Мухамеджанов Даниэл Русланович", "status": "Активен", "role": "student" },
    { "name": "Омуров Элдияр Садырович", "status": "Активен", "role": "student" },
    { "name": "Орозалиева Нурайым Алмазбековна", "status": "Активен", "role": "student" },
    { "name": "Орозобаев Нурислам Назаркулович", "status": "Активен", "role": "student" },
    { "name": "Токонова Нурданат Канатбековна", "status": "Активен", "role": "student" },
    { "name": "Турсуналиев Мырзабек Бактыбекович", "status": "Активен", "role": "student" },
    { "name": "Файзулин Амир Ринатович", "status": "Активен", "role": "student" },
    { "name": "Хаписов Азим Азизович", "status": "Активен", "role": "student" },
    { "name": "Чернов Артур Дмитриевич", "status": "Активен", "role": "student" },
    { "name": "Шерикова Адель Бозумбаевна", "status": "Активен", "role": "student" },
    { "name": "Шукуров Салих Жумабекович", "status": "Активен", "role": "student" }
  ];

  await put('students.json', JSON.stringify(students), {
    access: 'public',
    allowOverwrite: true
  });

  res.status(200).json({ message: "students.json инициализирован", count: students.length });
}
