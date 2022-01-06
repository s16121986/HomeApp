<div class="page-wrap">
	<h1><?= $title; ?></h1>
	<div class="card">
		<div class="card-body">
			<?=Format::params([
				'event' => 'Событие',
				'parent' => 'Объект'
			], $data)?>
		</div>
	</div>

	<div class="card">
		<div class="card-title">
			<h2>Условия<a href="#" id="btn-condition-add">Добавить условие</a></h2>

		</div>
		<div class="card-body">
			<?php if ($conditions->isEmpty()) { ?>
			<i>Условия отсутствуют</i>
			<?php } else { ?>
			<table class="default" id="conditions-table">
				<?php foreach ($conditions as $condition) { ?>
				<tr>
					<td><?=lang($condition->type)?></td>
					<td><?=$condition->data?></td>
					<td class="column-edit"><a href="#" data-id="<?=$condition->id?>" class="ui-btn btn-edit"></a></td>
				</tr>
				<?php } ?>
			</table>
			<?php } ?>
		</div>
	</div>

	<div class="card">
		<div class="card-title">
			<h2>Команды<a href="#" id="btn-command-add">Добавить команду</a></h2>

		</div>
		<div class="card-body">
			<?php if ($commands->isEmpty()) { ?>
			<i>Команды отсутствуют</i>
			<?php } else { ?>
			<table class="default" id="commands-table">
				<?php foreach ($commands as $command) { ?>
				<tr>
					<td><?=lang($command->entity)?></td>
					<td><?=$command->entity()?></td>
					<td><?=$command->command?></td>
					<td class="column-edit"><a href="#" data-id="<?=$command->id?>" class="ui-btn btn-edit"></a></td>
				</tr>
				<?php } ?>
			</table>
			<?php } ?>
		</div>
	</div>
</div>
