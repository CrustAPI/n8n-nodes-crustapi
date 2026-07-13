import {
	IAuthenticateGeneric,
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class CrustApiApi implements ICredentialType {
	name = 'crustApiApi';

	displayName = 'CrustAPI API';

	// eslint-disable-next-line n8n-nodes-base/cred-class-field-documentation-url-miscased -- valid HTTPS URL; this plugin rule mis-fires and conflicts with the not-http-url rule
	documentationUrl = 'https://crustapi.com/docs';

	properties: INodeProperties[] = [
		{
			displayName: 'API Key',
			name: 'apiKey',
			type: 'string',
			typeOptions: { password: true },
			default: '',
			required: true,
			description: 'Your CrustAPI key. Get one free at crustapi.com (3,000 credits/month, no card).',
		},
	];

	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			headers: {
				'x-api-key': '={{$credentials.apiKey}}',
			},
		},
	};

	test: ICredentialTestRequest = {
		request: {
			baseURL: 'https://crustapi.com',
			url: '/v1/search',
			qs: { type: 'web', q: 'crustapi' },
		},
	};
}
