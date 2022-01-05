<div class="page-wrap">
	<h1><?= $title; ?></h1>
	<form method="post" class="edit-form" id="device-form">
		<div class="fields-wrap"><?=$form?></div>

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
