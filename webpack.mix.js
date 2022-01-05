const mix = require('laravel-mix');
const fs = require('fs');
const path = require('path');

const resourcesPath = path.join(__dirname, 'resources');

mix.alias({
	'@core': resourcesPath + '/core/js',
	'@core.main': resourcesPath + '/core/js/main',
	'@site': resourcesPath + '/site/js',
	'@admin': resourcesPath + '/admin/js',

	'~core': resourcesPath + '/core/sass',
	'~core.main': resourcesPath + '/core/sass/main',
	'~site': resourcesPath + '/site/sass',
	'~admin': resourcesPath + '/admin/sass'
});

const getFiles = function (dir, path = '') {
	const readPath = dir + path;
	let files = [];
	fs.readdirSync(readPath)
		.forEach(entry => {
			const stat = fs.statSync(readPath + '/' + entry);
			if (stat.isFile()) {
				if (entry.charAt(0) === '_')
					return;
				files.push(path + '/' + entry);
				return files;
			} else if (stat.isDirectory()) {
				getFiles(dir, path + '/' + entry).forEach(f => files.push(f));
			}
		});
	return files;
};

const mixPath = function (resourcesPath, publicPath, mixMethod) {
	getFiles(resourcesPath + '/page').forEach(function (entry) {
		const entryPath = (function () {
			let a = entry.split('/');
			a.pop();
			return a.length ? '/' + a.join('/') : '';
		})();

		mix[mixMethod](resourcesPath + '/page' + entry, publicPath + '' + entryPath);
	});
};

['home', 'admin'].forEach(d => {
	mixPath('resources/' + d + '/sass', 'public/' + d + '/css', 'sass');
	mixPath('resources/' + d + '/js', 'public/' + d + '/js', 'js');
});
/*

const icons = [];
const svgPath = 'resources/home/svg/';
fs.readdirSync(svgPath)
	.forEach(entry => {
		const svg = fs.readFileSync(svgPath + entry).replaceAll("\n", "").replaceAll("\t", "");
		icons[icons.length] = entry + ': "' + svg + '"';

	});

fs.writeFileSync('resources/home/js/icons.js', '{' + icons.join(',') + '}');
console.log(icons)*/
/**/
