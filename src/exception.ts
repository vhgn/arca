import { StringMap } from './utilities';

const errorMessages: StringMap = {
	'1': 'Order number is already in use',
	'2': 'Order cancelled',
	'3': 'Unknown (prohibited) currency',
	'4': 'A required field is missing',
	'5': 'Error in request parameters',
	'6': 'Wrong parameter value',
	'7': 'System error',
};

export class Exception {
	code: number;
	name: string;
	message: string;

	constructor(code: string, message: string) {
		this.code = Number(code);
		this.name = errorMessages[code];
		this.message = message;
	}
}
