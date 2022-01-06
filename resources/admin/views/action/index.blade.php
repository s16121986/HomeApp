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
			<th>Наименование</th>
			<th>Событие</th>
			<th></th>
			<th class="column-edit"></th>
		</tr>
		<?php foreach ($items as $action) { ?>
		<tr class="item" data-id="<?= $action->id; ?>" data-room="<?= $action->room_id ?? 'home'; ?>">
			<td class="column-id"><?= $action->id; ?></td>
			<td class="column-name"><a href="/action/<?=$action->id?>"><?= $action->name; ?></a></td>
			<td class="column-event"><?= lang($action->event); ?></td>
			<td class="column-enabled">
				<div class="toggle<?= ($action->enabled ? ' on' : ''); ?>"></div>
			</td>
			<td class="column-edit">
				<a href="/action/<?= $action->id; ?>/edit" class="ui-btn btn-edit"></a>
			</td>
		</tr>
		<?php } ?>
	</table>
</div>
