<?php

class IfNode extends Statement {

	protected $cond;
	protected $ifNodes = [];
	protected $elseNodes = [];

	public function __construct($cond, $ifNodes, $elseNodes = null) {
		$this->cond = $cond;
	}

	public function parse() {
		$str = substr($this->expression, 3, -1);
		$this->expression = new Expression($str);
		while (true) {
			$line = $this->shift();
			if (!$line || $line === 'endif;')
				break;

			$this->statements[] = StatementFactory::parse($line);
		}
	}

}
