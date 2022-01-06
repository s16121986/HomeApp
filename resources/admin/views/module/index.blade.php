<div class="page-wrap page-modules">
	<h1><?= $title?><a href="/module/create">Добавить</a></h1>
	<div class="tabs-filter-wrap">
		<nav class="tabs" id="module-filter">
			<div data-id="wirenboard">WirenBoard</div>
			<div data-id="arduino">Arduino</div>
			<div data-id="other">Прочее</div>
		</nav>
	</div>
	<table class="default devices" id="table-modules">
		<tr>
			<th class="column-icon"></th>
			<th class="column-id sortable sort asc" data-sort="column-id" data-type="number">ID</th>
			<th class="column-address" data-sort="column-address">Адрес</th>
			<th class="column-room" data-sort="column-room">Комната</th>
			<th data-sort="column-name">Наименование</th>
			<th>Устройства</th>
			<th class="column-edit"></th>
		</tr>
		<?php
		$moduleFilter = function ($module) {
			return match (true) {
				str_starts_with($module->type, 'App\Home\Modules\Arduino') => 'arduino',
				str_starts_with($module->type, 'App\Home\Modules\WirenBoard') => 'wirenboard',
				default => 'other',
			};
		};
		foreach ($modules as $module) {
		?>
		<tr class="item <?= $module->getIconClass(); ?>" data-module="<?= $moduleFilter($module) ?>">
			<td class="column-icon">
				<div class="icon"></div>
			</td>
			<td class="column-id"><?= $module->id; ?></td>
			<td class="column-address"><?= $module->address; ?></td>
			<td class="column-room"><?= $module->room_name; ?></td>
			<td class="column-name"><?= $module->name; ?></td>
			<td class="column-devices"><?php
				$devices = \App\Models\Home\Device::query()
					->where('module_id', $module->id)
					->orderBy('home_rooms.name')
					->get();
				foreach ($devices as $device) { ?>
				<div class="<?= $device->enabled ? '' : 'disabled'; ?>"><?= $device->room_name; ?> / <?= $device->name; ?></div>
				<?php } ?></td>
			<td class="column-edit"><a href="/module/<?= $module->id; ?>/edit" class="ui-btn btn-edit"></a></td>
		</tr>
		<?php } ?>
	</table>
</div>
