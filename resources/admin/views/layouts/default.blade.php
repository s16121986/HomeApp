<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<?= $meta->head; ?>
<body class="<?= isset($themeClass) ? 'theme-' . $themeClass : '' ?>">
<div class="wrapper">
	<div class="sidebar-menu" id="main-menu">
		<a href="/dashboard/" class="home" title="Домой"></a>
		<?php
		$menu = [
			'settings' => ['/settings/', 'Настройки'],
			'modules' => ['/module/', 'Модули'],
			'devices' => ['/device/', 'Устройства'],
			'scenarios' => ['/scenario/', 'Сценарии'],
			'commands' => ['/action/', 'Команды'],
			'stats' => ['/settings/stats/', 'Статистика'],
			'debug' => ['/settings/debug/', 'Отладка'],
			//'docs' => ['/docs/', 'Документация']
		];
		foreach ($menu as $k => $n) { ?>
		<a href="<?= $n[0] ?>" class="<?= $k ?>" title="<?= $n[1] ?>"></a><?php } ?>
	</div>
	<div id="content" class="content-width content"><?= $content; ?></div>
</div>
</body>
</html>
