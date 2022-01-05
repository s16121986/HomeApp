<?php

namespace App\Services\Scenario\Parser\Node;

class Node {

	public static function prefix(): string {
		return '';
	}

	public static function regexp(): string {

	}

	public static function starts_with($expression): bool {
		return str_starts_with($expression, static::prefix());
	}

}
