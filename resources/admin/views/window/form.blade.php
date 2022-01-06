<form method="post" data-title="{{$title ?? ''}}" data-cls="window-form <?= $cls ?? '' ?>">
	<?= isset($description) ? '<p>' . $description . '</p>' : '' ?>
	<?= $form->report() ?>
	<div class="fields-wrap"><?= $form->render() ?></div>

	<div class="form-buttons">
		<?=(isset($deleteUrl) ? '<a href="' . $deleteUrl . '" class="btn btn-delete">Удалить</a><div class="spacer"></div>' : '')?>
		<button type="button" class="btn btn-cancel" data-action="close">Отмена</button>
		<button type="submit" class="btn btn-submit">Сохранить</button>
	</div>
</form>
