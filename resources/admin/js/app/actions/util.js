export function selectFromItems(items, options) {
	let html = '<select>';
	html += optionsFromItems(items, options);
	html += '</select>';

	return html;
}

export function optionsFromItems(items, options) {
	let html = '';
	html += '<option value="">' + (options.placeholder || '') + '</option>';
	items.forEach((item) => {
		html += '<option value="' + item.id + '">' + item.name + '</option>';
	});

	return html;
}

export function optionsFromObject(items) {
	let html = '';
	html += '<option value=""></option>';
	for (let i in items) {
		html += '<option value="' + i + '">' + items[i] + '</option>';
	}

	return html;
}

export function selectFromObject(items) {
	let html = '<select>';
	items.forEach((item) => {
		html += '<option value="' + item.id + '">' + item.name + '</option>';
	});
	html += '</select>';

	return $(html);
}
