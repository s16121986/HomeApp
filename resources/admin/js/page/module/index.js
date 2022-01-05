import "../main"

$(document).ready(function () {
	$('#table-modules').tabsFilter({
		tabs: [{
			selector: '#module-filter',
			dataIndex: 'module'
		}]
	});
});
