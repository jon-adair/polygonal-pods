const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, '.')));

const LAYOUTS_FILE = path.join(__dirname, 'layouts.json');

function readLayouts() {
	if (!fs.existsSync(LAYOUTS_FILE)) return {};
	return JSON.parse(fs.readFileSync(LAYOUTS_FILE, 'utf8'));
}

function writeLayouts(layouts) {
	fs.writeFileSync(LAYOUTS_FILE, JSON.stringify(layouts, null, 2));
}

app.get('/api/layouts', (req, res) => {
	res.json(readLayouts());
});

app.post('/api/layouts/save', (req, res) => {
	const { name, floors } = req.body;
	if (!name || !Array.isArray(floors)) return res.status(400).send('Invalid');
	const layouts = readLayouts();
	layouts[name] = { floors };
	writeLayouts(layouts);
	res.json({ success: true });
});

app.post('/api/layouts/delete', (req, res) => {
	const { name } = req.body;
	const layouts = readLayouts();
	delete layouts[name];
	writeLayouts(layouts);
	res.json({ success: true });
});

app.listen(PORT, () => {
	console.log(`Server running on http://localhost:${PORT}`);
});
