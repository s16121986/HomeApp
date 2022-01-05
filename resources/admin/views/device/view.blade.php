<div class="page-wrap page-devices">
	<h1><?= $title; ?><a href="/device/<?=$device->id?>/edit">Редактировать</a></h1>
	<div class="card">
		<div class="card-body">
			<?php
			echo Format::params([
				'name' => 'Наименование',
				'room' => 'Комната',
				'module' => 'Модуль',
				'type' => 'Тип',
				'channel' => 'Канал'
			], $data);
			?>
		</div>
	</div>

	<div class="card">
		<div class="card-title">Сценарии
			<a href="/action/create?entity=device&entity_id=<?=$device->id?>">Добавить</a>
		</div>
		<div class="card-body">
			<table>
				<tr>
					<th>Событие</th>
					<th>Наименование</th>
					<th>Команда</th>
					<th>Условия</th>
					<th>Статус</th>
				</tr>
				<?php foreach ($actions as $action) { ?>
				<tr>
					<td><?=lang($action->event)?></td>
					<td><a href="/action/<?=$action->id?>/edit"><?=$action->name?></a></td>
					<td><?=$action->command?></td>
					<td></td>
					<td>
						<div class="toggle<?= ($action->enabled ? ' on' : ''); ?>"></div>
					</td>
				</tr>
				<?php } ?>
			</table>
		</div>
	</div>
</div>
