<div class="content-default">
	<div class="content-title">
		<?=$layout->breadcrumbs?>
		<div class="h1-wrap">
			<h1><?=$title?></h1>
			<?=$layout->menu('h1')?>
			<div class="spacer"></div>
			<?=$grid->quicksearch?>
			<?=$layout->button('create')?>
		</div>
	</div>

	<div class="card card-grid">
		<div class="card-body">
			<?php if ($grid->search) { ?>
			<form method="get" class="grid-form">
				<?=$grid->search->render()?>
				<button type="submit" class="btn btn-submit">Найти</button>
			</form>
			<?php } ?>
			<?=$grid->render()?>
		</div>
	</div>
</div>
