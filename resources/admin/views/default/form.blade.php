<div class="page-wrap">
	<h1><?= $title; ?></h1>
	<form method="post" class="edit-form" id="device-form">
		<div class="fields-wrap"><?=$form?></div>

		<div class="form-buttons">
			<?php if (isset($new) && $new) { ?>
			<a href="/device/" class="btn-cancel">Отмена</a>
			<button type="submit" class="btn btn-submit">Создать</button>
			<?php } else { ?>
			<a href="/<?php
			$routeArray = app('request')->route()->getAction();
			$controllerAction = class_basename($routeArray['controller']);
			list($controller, $action) = explode('@', $controllerAction);
			echo $controller = strtolower(substr($controller, 0, -10));
			?>/<?=$id?>/delete" class="btn-delete">Удалить</a>
				<div class="spacer"></div>
			<a href="/<?=$controller?>/" class="btn-cancel">Отмена</a>
			<button type="submit" class="btn btn-submit">Сохранить</button>
			<?php } ?>
		</div>
	</form>
</div>
