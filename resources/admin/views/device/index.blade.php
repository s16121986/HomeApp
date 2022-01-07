<div class="page-wrap page-devices">
	<h1><?= $title; ?><a href="/device/create">Добавить</a></h1>

	<div class="tabs-filter-wrap">
		<nav class="tabs" id="module-filter">
			<label>Модуль:</label>
			<div data-id="wirenboard">WirenBoard</div>
			<div data-id="arduino">Arduino</div>
			<div data-id="other">Прочее</div>
		</nav>
		<nav class="tabs" id="group-filter">
			<label>Тип:</label>
			<div data-id="switch">Выключатели</div>
			<div data-id="sensor">Датчик</div>
			<div data-id="light">Освещение</div>
			<div data-id="lightning">Декор. подсветка</div>
			<div data-id="other">Прочее</div>
		</nav>
		<nav class="tabs room-tabs" id="rooms-filter">
			<label>Комната:</label>
			<div data-id="<?= home()->id ?>">Дом</div>
			<?php foreach ($rooms as $room) { ?>
			<div data-id="<?= $room->id ?>"><?= $room->name; ?></div>
			<?php } ?>
		</nav>
		<nav class="tabs" id="status-filter">
			<label>Состояние:</label>
			<div data-id="on">Активные</div>
			<div data-id="off">Не активные</div>
		</nav>
	</div>


	<table class="devices" id="table-devices">
		<tr>
			<th></th>
			<th class="sortable sort asc" data-sort="column-id" data-type="number">ID</th>
			<th data-sort="column-address" data-type="number">Адрес</th>
			<th data-sort="column-module">Модуль</th>
			<th data-sort="column-room">Комната</th>
			<th data-sort="column-name">Группа / Наименование</th>
			<th data-sort="column-name">Yandex</th>
			<th>Основной</th>
			<th>По умолчанию</th>
			<th>Избранное</th>
			<th>Включено</th>
			<th></th>
		</tr>
		<?php
		$empty = function ($value) {
			return empty($value) ? '<span class="empty">NC</span>' : $value;
		};
		$moduleFilter = function ($device) {
			return match (true) {
				str_starts_with($device->module_type, 'App\Home\Modules\Arduino') => 'arduino',
				str_starts_with($device->module_type, 'App\Home\Modules\WirenBoard') => 'wirenboard',
				default => 'other',
			};
		};
		$groupFilter = function ($device) {
			switch (true) {
				case $device->type === 'switch':
					return 'switch';
				case $device->class === 'lightning':
					return 'lightning';
				case $device->key === 'ventilation':
					return 'other';
				default:
					return $device->group_key;
			}
		};
		foreach ($devices as $device) {
		$cls = [$device->group_key, $device->type, $device->key, $device->class];
		$filterAttr = [];
		$filterAttr[] = 'data-room="' . $device->room_id . '"';
		$filterAttr[] = 'data-module="' . $moduleFilter($device) . '"';
		$filterAttr[] = 'data-group="' . $groupFilter($device) . '"';
		$filterAttr[] = 'data-status="' . ($device->enabled ? 'on' : 'off') . '"';
		?>
		<tr class="item <?= join(' ', $cls) ?>" data-id="<?= $device->id; ?>" <?= implode(' ', $filterAttr) ?>">
		<td class="column-icon">
			<div class="icon"></div>
		</td>
		<td class="column-id"><?= $device->id; ?></td>
		<td class="column-address"><?= ($device->channel !== null ? ('<div class="address">' . $device->channel . '</div>') : $empty(null)); ?></td>
		<td class="column-module"><?= $device->module_name; ?></td>
		<td class="column-room"><?= $device->room_name; ?></td>
		<td class="column-name">
			<a href="/device/<?= $device->id; ?>"><?= \App\Enums\Home\DeviceGroup::getLabel($device->group) . ' / ' . $device->name; ?></a>
		</td>
		<td class="column-ya_enabled">
			<div class="toggle<?= ($device->ya_enabled ? ' on' : ''); ?>"></div>
		</td>
		<td class="column-name"><?= $device->ya_name; ?></td>
		<td class="column-main">
			<div class="toggle<?= ($device->main ? ' on' : ''); ?>"></div>
		</td>
		<td class="column-default">
			<div class="toggle<?= ($device->default ? ' on' : ''); ?>"></div>
		</td>
		<td class="column-favorite">
			<div class="toggle<?= ($device->favorite ? ' on' : ''); ?>"></div>
		</td>
		<td class="column-enabled">
			<div class="toggle<?= ($device->enabled ? ' on' : ''); ?>"></div>
		</td>
		<td class="column-edit"><a href="/device/<?= $device->id; ?>/edit" class="ui-btn btn-edit"></a></td>
		</tr>
		<?php } ?>
	</table>

</div>
