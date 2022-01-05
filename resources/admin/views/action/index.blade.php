<div class="page-wrap page-scenarios">
	<h1><?= $title; ?><a href="/action/create">Добавить</a></h1>

	<div class="tabs-filter-wrap">
		<nav class="tabs room-tabs" id="rooms-filter">
			<div data-id="home">Дом</div>
			<?php foreach ($rooms as $room) { ?>
			<div data-id="<?= $room->id ?>"><?= $room->name; ?></div>
			<?php } ?>
		</nav>
	</div>

	<table class="default devices" id="table-actions">
		<tr>
			<th class="column-id">ID</th>
			<th>Комната</th>
			<th>Наименование</th>
			<th>Событие</th>
			<th></th>
			<th class="column-edit"></th>
		</tr>
		<?php foreach ($items as $scenario) { ?>
		<tr class="item" data-id="<?= $scenario->id; ?>" data-room="<?= $scenario->room_id ?? 'home'; ?>">
			<td class="column-id"><?= $scenario->id; ?></td>
			<td class="column-room"><?= $scenario->room_name ?? 'Дом'; ?></td>
			<td class="column-name"><?= $scenario->name; ?></td>
			<td class="column-event"><?= lang($scenario->event); ?></td>
			<td class="column-command"><?= $scenario->command; ?></td>
			<td class="column-enabled">
				<div class="toggle<?= ($scenario->enabled ? ' on' : ''); ?>"></div>
			</td>
			<td class="column-edit">
				<a href="/action/<?= $scenario->id; ?>/edit" class="ui-btn btn-edit"></a>
			</td>
		</tr>
		<?php } ?>
	</table>
</div>
