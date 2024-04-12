'use strict';

let countViewsHeadPage = 0;
let countViewsAboutPage = 0;


const http = require('http');
const server = http.createServer((req, res) => {
	if (req.url === '/') {
		res.writeHead(200, { 'Content-Type': 'text/html charset=utf-8' });
		countViewsHeadPage++;
		res.end(`<a href="/about">About</a><h1>Head page</h1> <p> (Head page views: ${countViewsHeadPage}) </p>`);
	} else if (req.url === '/about') {
		res.writeHead(200, { 'Content-Type': 'text/html charset=utf-8' });
		countViewsAboutPage++;
		res.end(`<a href="/">Head</a> <h1>About page</h1> <p> (About page views: ${countViewsAboutPage}) </p>`);
	} else {
		res.writeHead(404, { 'Content-Type': 'text/html charset=utf-8' });
		res.end('<h1>Page not found</h1> <img src="https://http.cat/404">');
	}
})

const port = 3000;
server.listen(port, () => {
	console.log(`Server running at http://localhost:${port}`);
});