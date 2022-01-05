<div class="page-wrap">
	<h1><?= $title; ?></h1>
	<form method="post" class="edit-form" id="action-form">
		<nav class="tabs" id="tabs">
			<div data-id="tab-form">Основные</div>
			<div data-id="tab-condition">Условие срабатывания</div>
		</nav>

		<div class="tab fields-wrap" id="tab-form"><?=$form?></div>

		<div class="tab params-form" id="tab-condition"></div>

		<div class="form-buttons">
			<?php if (isset($new) && $new) { ?>
			<a href="/device/" class="btn-cancel">Отмена</a>
			<button type="submit" class="btn btn-submit">Создать</button>
			<?php } else { ?>
			<a href="/device/<?=$id?>/delete" class="btn-delete">Удалить</a>
			<div class="spacer"></div>
			<a href="/device/" class="btn-cancel">Отмена</a>
			<button type="submit" class="btn btn-submit">Сохранить</button>
			<?php } ?>
		</div>
	</form>
</div>
