'use strict';

const fs = require('fs');
const express = require('express');
const { userSchema, idSchema } = require('./validation/scheme');
const { checkParams, checkBody } = require('./validation/validator');
const app = express();
const port = 3000;

const users = [];

app.use(express.json());

// Получение всех пользователей из файла JSON
app.get('/users', (req, res) => {
	fs.readFile('users.json', 'utf8', (err, data) => {
		if (err) {
			console.error(err);
			res.status(500).send('File read error');
			return;
		}

		const users = JSON.parse(data);
		res.send({ users });
	});
});

// Получение конкретного пользователя по идентификатору
app.get('/users/:id', checkParams(idSchema), (req, res) => {
	const userId = req.params.id;

	fs.readFile('users.json', 'utf8', (err, data) => {
		if (err) {
			console.error(err);
			res.status(500).send('File read error');
			return;
		}

		let users;
		try {
			users = JSON.parse(data);
		} catch (err) {
			console.error(err);
			res.status(500).send('Error parsing file');
			return;
		}

		const user = users.find(user => user.id === parseInt(userId));

		if (!user) {
			res.status(404).send({ message: 'User not found' });
			return;
		}

		res.send(user);
	});
});


// Добавление нового пользователя в файл json
app.post('/users', checkBody(userSchema), (req, res) => {
	const newUser = req.body;

	// Check if the users.json file exists
	fs.access('users.json', fs.constants.F_OK, (err) => {
		if (err) {
			// If the file doesn't exist, create an empty array and write to users.json
			fs.writeFile('users.json', '[]', (err) => {
				if (err) {
					console.error(err);
					res.status(500).send('Error creating file');
					return;
				}
				addUser(newUser, res);
			});
		} else {
			addUser(newUser, res);
		}
	});
});

//Функция добавления пользователя
function addUser(newUser, res) {
	fs.readFile('users.json', 'utf8', (err, data) => {
		if (err) {
			console.error(err);
			res.status(500).send('Error reading file');
			return;
		}

		let users;
		try {
			users = JSON.parse(data);
		} catch (err) {
			console.error(err);
			res.status(500).send('Error parsing file');
			return;
		}

		const userId = users.length === 0 ? 1 : users[users.length - 1].id + 1; // Generate user ID

		newUser.id = userId;
		users.push(newUser);

		fs.writeFile('users.json', JSON.stringify(users, null, 2), (err) => {
			if (err) {
				console.error(err);
				res.status(500).send('Error writing to file');
				return;
			}

			res.status(201).send({ message: 'User added', user: newUser });
		});
	});
}

// Изменение пользователя по идентификатору

app.put('/users/:id', checkParams(idSchema), checkBody(userSchema), (req, res) => {
	const userId = req.params.id;

	fs.readFile('users.json', 'utf8', (err, data) => {
		if (err) {
			console.error(err);
			res.status(500).send('Error reading file');
			return;
		}

		let users;
		try {
			users = JSON.parse(data);
		} catch (err) {
			console.error(err);
			res.status(500).send('Error parsing file');
			return;
		}

		const userIndex = users.findIndex(user => user.id === parseInt(userId));

		if (userIndex === -1) {
			res.status(404).send({ message: 'User not found' });
			return;
		}

		const updatedUser = { ...users[userIndex], ...req.body };
		users[userIndex] = updatedUser;

		fs.writeFile('users.json', JSON.stringify(users, null, 2), (err) => {
			if (err) {
				console.error(err);
				res.status(500).send('Error writing to file');
				return;
			}

			res.send({ message: 'User updated', id: userId, user: updatedUser });
		});
	});
});

// Удаление пользователя по идентификатору

app.delete('/users/:id', checkParams(idSchema), (req, res) => {
	const userId = req.params.id;

	fs.readFile('users.json', 'utf8', (err, data) => {
		if (err) {
			console.error(err);
			res.status(500).send('Error reading file');
			return;
		}

		let users;
		try {
			users = JSON.parse(data);
		} catch (err) {
			console.error(err);
			res.status(500).send('Error parsing file');
			return;
		}

		const userIndex = users.findIndex(user => user.id === parseInt(userId));

		if (userIndex === -1) {
			res.status(404).send({ message: 'User not found' });
			return;
		}

		users.splice(userIndex, 1);

		fs.writeFile('users.json', JSON.stringify(users, null, 2), (err) => {
			if (err) {
				console.error(err);
				res.status(500).send('Error writing to file');
				return;
			}

			res.send({ message: 'User deleted', id: userId });
		});
	});
});

// Обработка несуществующего URL
app.use((req, res) => {
	res.status(404);
	res.send({ error: 'URL not found' });
});

app.listen(port, () => {
	console.log(`Example app listening at http://localhost:${port}`);
});
