import {Window} from "@core.main"
import EntityField from "../field/entity";

function processContent() {
	const entityField = new EntityField('entity');
	console.log(1)
}

export default class CommandWindow extends Window {
	#id;

	constructor(actionId, commandId) {
		super({
			url: '/action/' + actionId + '/command?id=' + commandId,
			closeAction: 'remove',
			content: processContent
		});

		this.#id = +commandId;
	}
}
