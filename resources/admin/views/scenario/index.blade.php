<div class="page-wrap page-scenarios">
	<h1><?= $title; ?><a href="/scenario/create">Добавить</a></h1>

	<table class="default devices" id="table-scenarios">
		<tr>
			<th class="column-id">ID</th>
			<th>Ключ</th>
			<th>Наименование</th>
			<th></th>
			<th class="column-edit"></th>
		</tr>
		<?php
		foreach ($items as $scenario) {
		?>
		<tr class="item" data-id="<?= $scenario->id; ?>">
			<td class="column-id"><?= $scenario->id; ?></td>
			<td class="column-key"><?= $scenario->key; ?></td>
			<td class="column-name"><?= $scenario->name; ?></td>
			<td class="column-enabled">
				<div class="toggle<?= ($scenario->enabled ? ' on' : ''); ?>"></div>
			</td>
			<td class="column-edit">
				<a href="/scenario/<?= $scenario->id; ?>/edit" class="ui-btn btn-edit"></a>
			</td>
		</tr>
		<?php } ?>
	</table>
</div>
