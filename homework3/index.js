'use strict';

// Напишите HTTP сервер на express и реализуйте два обработчика “/” и “/about”, где:

// — На каждой странице реализован счетчик просмотров
// — Значение счетчика необходимо сохранять в файл каждый раз, когда обновляется страница
// — Также значение счетчика должно загружаться из файла, когда запускается обработчик страницы
// — Таким образом счетчик не должен обнуляться каждый раз, когда перезапускается сервер.

const express = require('express');
const fs = require('fs');

const app = express();
const port = 3000;

let pageViews = {};

// Чтение данных о просмотрах из файла
try {
	const data = fs.readFileSync('pageViews.json');
	pageViews = JSON.parse(data);
} catch (error) {
	pageViews = {};
}

// Обновление счетчика просмотров
app.use((req, res, next) => {
	const url = req.url;
	if (pageViews[url]) {
		pageViews[url]++;
	} else {
		pageViews[url] = 1;
	}
	fs.writeFileSync('pageViews.json', JSON.stringify(pageViews, null, 2));
	next();
});

// Обработчик для "/"
app.get('/', (req, res) => {
	res.send(`<a href="/about">About</a> <br> Главная страница. <br> Количество просмотров: ${pageViews['/']}`);
});

// Обработчик для "/about"
app.get('/about', (req, res) => {
	res.send(`<a href="/">Index</a> <br> Страница "О нас". <br> Количество просмотров: ${pageViews['/about']}`);
});

app.use((req, res, next) => {
	res.status(404).send("Извините, страница не найдена");
});

// Запуск сервера
app.listen(port, () => {
	console.log(`Сервер запущен на порту ${port}`);
});