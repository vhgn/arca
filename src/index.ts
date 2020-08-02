import Axios from 'axios';
import { toUrlParameter } from './utilities';
import { Environment, endpoints } from './environments';
import { Exception } from './exception';
import { Currency } from './currencies';
import { Language } from './languages';

export interface RegisterOrderParameters {
	/**
	 * Order identifier inside your system
	 */
	order: string;
	/**
	 * Amount in minimal currency unit
	 */
	amount: number;
	/**
	 * Return URL after payment
	 */
	url: string;
	/**
	 * Currency 3-digit-code in ISO 4217 (defaults to Russian Rubles)
	 */
	currency?: Currency;
	/**
	 * Language 2-letter-code in ISO 639-1 (defaults to Store's language)
	 */
	language?: Language;
	/**
	 * Client identifier in your system (used with Connections)
	 */
	client?: string;
	/**
	 * Additional information to store (should be approved by the bank)
	 */
	json?: object;
	/**
	 * Timeout of session in seconds (defaults to 1200 seconds)
	 */
	timeout?: number;
}

export interface RegisterOrderReturns {
	/**
	 * Order identifier inside ArCa
	 */
	id: string;
	/**
	 * Form URL for payment
	 */
	form: string;
}

export class Client {
	private username: string;
	private password: string;
	private base: string;

	constructor(
		username: string,
		password: string,
		environment = Environment.Production
	) {
		this.username = username;
		this.password = password;
		this.base = endpoints[environment];
	}

	async registerOrder(
		parameters: RegisterOrderParameters
	): Promise<RegisterOrderReturns> {
		const response = await Axios.post(
			this.base + '/register.do',
			toUrlParameter({
				userName: this.username,
				password: this.password,
				orderNumber: parameters.order,
				amount: parameters.amount.toFixed(),
				returnUrl: parameters.url,
				...(parameters.currency && { currency: parameters.currency }),
				...(parameters.language && { language: parameters.language }),
				...(parameters.client && { clientId: parameters.client }),
				...(parameters.json && {
					jsonParams: JSON.stringify(parameters.json),
				}),
				...(parameters.timeout && {
					sessionTimeoutSecs: parameters.timeout.toFixed(),
				}),
			})
		);

		const { errorCode, errorMessage, orderId, formUrl } = response.data;

		if (response.data.errorCode === '0') return { form: formUrl, id: orderId };
		throw new Exception(errorCode, errorMessage);
	}
}

export { Currency, Exception, Language, Environment };
