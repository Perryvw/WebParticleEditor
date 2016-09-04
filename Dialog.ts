export default class Dialog {

	element: HTMLElement;
	onResult: (result: any) => void;

	constructor(element: HTMLElement) {
		this.element = element;
		this.onResult = function() {};
	}

	close() {
		this.onDestroy();
		this.element.parentElement.removeChild(this.element);
	}

	onCreated(params: Object) {

	}

	onDestroy() {

	}

	result(result: any) {
		this.onResult(result);
	}
}
