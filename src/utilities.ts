export interface StringMap {
	[index: string]: string;
}

export function toUrlParameter(data: StringMap): string {
	const final = [];

	for (const property in data) {
		final.push(property + '=' + data[property]);
	}

	return final.join('&');
}
