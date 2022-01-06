import {Window} from "@core.main"
import ConditionField from "../field/condition";

function processContent() {
	const entityField = new ConditionField('type');
}

export default class ConditionWindow extends Window {
	#id;

	constructor(actionId, conditionId) {
		super({
			url: '/action/' + actionId + '/condition?id=' + conditionId,
			closeAction: 'remove',
			content: processContent
		});

		this.#id = +conditionId;
	}
}
