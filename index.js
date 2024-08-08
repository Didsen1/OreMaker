const fs = require('fs');
const path = require('path');

// Функция для чтения и парсинга JSON файла
const parseData = (filePath, callback) => {
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Ошибка чтения файла:', err);
            callback(err, null);
            return;
        }

        try {
            // Парсим JSON
            const jsonData = JSON.parse(data);
            callback(null, jsonData); // Вызываем callback с распарсенными данными
        } catch (err) {
            console.error('Ошибка парсинга JSON:', err);
            callback(err, null);
        }
    });
};

// Функция для изменения данных и сохранения в новый JSON файл
const modifyAndSaveData = (originalFilePath, newFilePath) => {
    // Читаем исходный JSON файл
    parseData(originalFilePath, (err, result) => {
        if (err) {
            console.error('Ошибка при обработке данных:', err);
            return;
        }

        // Изменяем значения в соответствии с условиями
        Object.entries(result).forEach(([key, item]) => {
            if (!key.includes('surface') && !key.includes('gold') && !key.includes('platinum')) {
                // Если ключ НЕ содержит 'surface', меняем все значения
                item.width = Math.round(item.width * 1.6); // Изменяем значение ширины
                item.height = Math.round(item.height * 1.6); // Изменяем значение высоты
                item.rarity = Math.round(item.rarity * 7); // Изменяем значение редкости (больше реже)
                item.density = 55; // Изменяем значение плотности (меньше реже)
                item.chance_additional_ore = 10; // Изменяем шанс на попутные руды //ошушение что сейчас это не работает
            }
            if (key.includes('gold') || key.includes('platinum')) {
                item.width = Math.round((item.width / 5) * 1.6); // Изменяем значение ширины
                item.height = Math.round((item.height / 5) * 1.6); // Изменяем значение высоты
                item.rarity = Math.round(item.rarity * 7); // Изменяем значение редкости (больше реже)
                item.density = 55; // Изменяем значение плотности (меньше реже)
            }
            if (key.includes('surface')) {
                // Если ключ СОДЕРЖИТ 'surface', меняем только width и height
                item.width = Math.round(item.width * 1.6); // Изменяем значение ширины
                item.height = Math.round(item.height * 1.6); // Изменяем значение высоты
            }
        });

        // Сохраняем измененные данные в новый JSON файл
        fs.writeFile(newFilePath, JSON.stringify(result, null, 2), (err) => {
            if (err) {
                console.error('Ошибка записи файла:', err);
                return;
            }
            console.log(`Измененный JSON файл сохранен по пути: ${newFilePath}`);
        });
    });
};

// Пути к исходному и новому JSON файлам
const originalFilePath = path.join(__dirname, 'utils', 'origin_ore_spawn_data.json');
const newFilePath = path.join(__dirname, 'utils', 'ore_spawn_data.json');

// Вызываем функцию для изменения данных и сохранения в новый JSON файл
modifyAndSaveData(originalFilePath, newFilePath);
