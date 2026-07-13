import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	IDataObject,
	NodeConnectionTypes,
	NodeOperationError,
} from 'n8n-workflow';

export class CrustApi implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'CrustAPI',
		name: 'crustApi',
		icon: 'file:crustapi.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"]}}',
		description: 'Get Google Search, Maps, News, Shopping, and Reviews data as clean JSON',
		defaults: { name: 'CrustAPI' },
		inputs: ['main'],
		outputs: ['main'],
		usableAsTool: true,
		credentials: [{ name: 'crustApiApi', required: true }],
		requestDefaults: {
			baseURL: 'https://crustapi.com/v1',
		},
		properties: [
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				options: [
					{ name: 'Images', value: 'images', description: 'Google image results', action: 'Search google images' },
					{ name: 'Maps', value: 'maps', description: 'Local businesses with ratings, phone, website', action: 'Search google maps' },
					{ name: 'News', value: 'news', description: 'Google News results', action: 'Search google news' },
					{ name: 'Places', value: 'places', description: 'Lean local pack results', action: 'Search google places' },
					{ name: 'Reviews', value: 'reviews', description: 'Google reviews for a business', action: 'Get google reviews' },
					{ name: 'Scrape Webpage', value: 'webpage', description: 'Fetch any URL as clean text and metadata', action: 'Scrape a webpage' },
					{ name: 'Shopping', value: 'shopping', description: 'Google Shopping product results', action: 'Search google shopping' },
					{ name: 'Videos', value: 'videos', description: 'Google video results', action: 'Search google videos' },
					{ name: 'Web Search', value: 'web', description: 'Google web results', action: 'Search google web' },
				],
				default: 'web',
			},
			// query for the search operations
			{
				displayName: 'Query',
				name: 'q',
				type: 'string',
				default: '',
				required: true,
				placeholder: 'e.g. dentists in Miami',
				description: 'What to search for',
				displayOptions: { hide: { operation: ['webpage'] } },
			},
			// url for the scrape operation
			{
				displayName: 'URL',
				name: 'url',
				type: 'string',
				default: '',
				required: true,
				placeholder: 'https://example.com/pricing',
				description: 'The page to scrape',
				displayOptions: { show: { operation: ['webpage'] } },
			},
			{
				displayName: 'Options',
				name: 'options',
				type: 'collection',
				placeholder: 'Add Option',
				default: {},
				displayOptions: { hide: { operation: ['webpage'] } },
				options: [
					{ displayName: 'Country (Gl)', name: 'gl', type: 'string', default: 'us', description: 'Two-letter country code' },
					{ displayName: 'Language (Hl)', name: 'hl', type: 'string', default: 'en', description: 'Two-letter language code' },
					{
						displayName: 'Limit (Maps)',
						name: 'limit',
						type: 'number',
						typeOptions: { minValue: 1 },
						default: 50,
						description: 'Max number of results to return',
					},
					{ displayName: 'Location', name: 'location', type: 'string', default: '', description: 'City or region, e.g. "Austin, TX"' },
					{ displayName: 'Page', name: 'page', type: 'number', default: 1, description: 'Result page' },
					{
						displayName: 'Sort (Reviews)',
						name: 'sortBy',
						type: 'options',
						default: 'mostRelevant',
						options: [
							{ name: 'Highest', value: 'highest' },
							{ name: 'Lowest', value: 'lowest' },
							{ name: 'Most Relevant', value: 'mostRelevant' },
							{ name: 'Newest', value: 'newest' },
						],
						description: 'Order for the Reviews operation',
					},
				],
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const out: INodeExecutionData[] = [];

		for (let i = 0; i < items.length; i++) {
			try {
				const operation = this.getNodeParameter('operation', i) as string;
				const qs: Record<string, string | number> = { type: operation };

				if (operation === 'webpage') {
					qs.url = this.getNodeParameter('url', i) as string;
				} else {
					qs.q = this.getNodeParameter('q', i) as string;
					const options = this.getNodeParameter('options', i, {}) as Record<string, unknown>;
					for (const [k, v] of Object.entries(options)) {
						if (v !== '' && v !== undefined && v !== null) qs[k] = v as string | number;
					}
				}

				const response = await this.helpers.httpRequestWithAuthentication.call(this, 'crustApiApi', {
					method: 'GET',
					baseURL: 'https://crustapi.com/v1',
					url: '/search',
					qs,
					json: true,
				});

				// The array of results lives under a per-type key (organic, places, news, reviews...).
				// Emit one item per result so downstream nodes map fields cleanly; fall back to the whole body.
				const arrayKey = Object.keys(response).find(
					(k) => Array.isArray((response as Record<string, unknown>)[k]),
				);
				const rows = arrayKey ? ((response as Record<string, unknown>)[arrayKey] as unknown[]) : [response];
				for (const row of rows) {
					out.push({ json: row as IDataObject, pairedItem: { item: i } });
				}
			} catch (error) {
				if (this.continueOnFail()) {
					out.push({ json: { error: (error as Error).message }, pairedItem: { item: i } });
					continue;
				}
				throw new NodeOperationError(this.getNode(), error as Error, { itemIndex: i });
			}
		}

		return [out];
	}
}
