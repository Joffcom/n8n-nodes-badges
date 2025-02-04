import type {
	IDataObject,
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
} from 'n8n-workflow';

import { NodeConnectionType, NodeOperationError } from 'n8n-workflow';

import { makeBadge } from 'badge-maker';

type Format = {
	message: string;
	label?: string;
	labelColor?: string;
	color?: string;
	style?: 'plastic' | 'flat' | 'flat-square' | 'for-the-badge' | 'social';
};

export class Badges implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Badges',
		name: 'badges',
		icon: 'fa:image',
		group: ['transform'],
		version: 1,
		description: 'Create Badges',
		defaults: {
			name: 'Badges',
		},
		inputs: [NodeConnectionType.Main],
		outputs: [NodeConnectionType.Main],
		usableAsTool: true,
		properties: [
			{
				displayName: 'Text',
				name: 'text',
				type: 'string',
				default: '',
				placeholder: 'build',
				description: 'The text for your badge',
			},
			{
				displayName: 'Output Binary Data',
				name: 'outputBinaryData',
				type: 'boolean',
				default: true,
				description: 'Whether to return binary data instead of SVG text',
			},
			{
				displayName: 'Binary Property',
				name: 'binaryPropertyName',
				type: 'string',
				default: 'data',
				displayOptions: {
					show: {
						outputBinaryData: [true],
					},
				},
			},
			{
				displayName: 'File Name',
				name: 'fileName',
				type: 'string',
				default: 'badge.svg',
				description: 'The name of the file',
				displayOptions: {
					show: {
						outputBinaryData: [true],
					},
				},
			},
			{
				displayName: 'Additional Fields',
				name: 'additionalFields',
				type: 'collection',
				placeholder: 'Add Field',
				default: {},
				options: [
					{
						displayName: 'Color',
						name: 'color',
						type: 'options',
						options: [
							{
								name: 'Blue',
								value: 'blue',
							},
							{
								name: 'Bright Green',
								value: 'brightgreen',
							},
							{
								name: 'Critical',
								value: 'critical',
							},
							{
								name: 'Gray',
								value: 'gray',
							},
							{
								name: 'Green',
								value: 'green',
							},
							{
								name: 'Important',
								value: 'important',
							},
							{
								name: 'Inactive',
								value: 'inactive',
							},
							{
								name: 'Informational',
								value: 'informational',
							},
							{
								name: 'Lightgray',
								value: 'lightgray',
							},
							{
								name: 'Orange',
								value: 'orange',
							},
							{
								name: 'Red',
								value: 'red',
							},
							{
								name: 'Success',
								value: 'success',
							},
							{
								name: 'Yellow',
								value: 'yellow',
							},
							{
								name: 'Yellow Green',
								value: 'yellowgreen',
							},
						],
						default: 'green',
						description: 'The color of the badge',
					},
					{
						displayName: 'Label',
						name: 'label',
						type: 'string',
						default: '',
						description: 'The label of the badge',
					},
					{
						displayName: 'Label Color',
						name: 'labelColor',
						type: 'options',
						options: [
							{
								name: 'Blue',
								value: 'blue',
							},
							{
								name: 'Bright Green',
								value: 'brightgreen',
							},
							{
								name: 'Critical',
								value: 'critical',
							},
							{
								name: 'Gray',
								value: 'gray',
							},
							{
								name: 'Green',
								value: 'green',
							},
							{
								name: 'Important',
								value: 'important',
							},
							{
								name: 'Inactive',
								value: 'inactive',
							},
							{
								name: 'Informational',
								value: 'informational',
							},
							{
								name: 'Lightgray',
								value: 'lightgray',
							},
							{
								name: 'Orange',
								value: 'orange',
							},
							{
								name: 'Red',
								value: 'red',
							},
							{
								name: 'Success',
								value: 'success',
							},
							{
								name: 'Yellow',
								value: 'yellow',
							},
							{
								name: 'Yellow Green',
								value: 'yellowgreen',
							},
						],
						default: 'lightgray',
						description: 'The color of the label',
					},
					{
						displayName: 'Style',
						name: 'style',
						type: 'options',
						options: [
							{
								name: 'Flat',
								value: 'flat',
							},
							{
								name: 'Flat Square',
								value: 'flat-square',
							},
							{
								name: 'For The Badge',
								value: 'for-the-badge',
							},
							{
								name: 'Plastic',
								value: 'plastic',
							},
							{
								name: 'Social',
								value: 'social',
							},
						],
						default: 'flat',
						description: 'The style of the badge',
					},
				],
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];

		for (let itemIndex = 0; itemIndex < items.length; itemIndex++) {
			try {
				const text = this.getNodeParameter('text', itemIndex) as string;
				const additionalFields = this.getNodeParameter('additionalFields', itemIndex) as
					| IDataObject
					| undefined;
				const outputBinaryData = this.getNodeParameter('outputBinaryData', itemIndex) as boolean;
				let binaryPropertyName = '';
				let fileName = 'badge.svg';
				if (outputBinaryData === true) {
					binaryPropertyName = this.getNodeParameter('binaryPropertyName', itemIndex) as string;
					fileName = this.getNodeParameter('fileName', itemIndex) as string;
					if (fileName.endsWith('.svg') === false) {
						fileName += '.svg';
					}
				}

				const format: Format = {
					message: text,
				};

				if (additionalFields) {
					if (additionalFields.color) {
						format.color = additionalFields.color as string;
					}

					if (additionalFields.label) {
						format.label = additionalFields.label as string;
					}

					if (additionalFields.labelColor) {
						format.labelColor = additionalFields.labelColor as string;
					}

					if (additionalFields.style) {
						format.style = additionalFields.style as
							| 'plastic'
							| 'flat'
							| 'flat-square'
							| 'for-the-badge'
							| 'social';
					}
				}

				const svg = makeBadge(format);

				if (outputBinaryData) {
					returnData.push({
						json: items[itemIndex].json,
						binary: {
							[binaryPropertyName]: await this.helpers.prepareBinaryData(
								Buffer.from(svg),
								fileName,
								'image/svg+xml',
							),
						},
						pairedItem: itemIndex,
					});
				} else {
					returnData.push({
						json: {
							data: svg,
						},
						pairedItem: itemIndex,
					});
				}
			} catch (error) {
				if (this.continueOnFail()) {
					items.push({ json: this.getInputData(itemIndex)[0].json, error, pairedItem: itemIndex });
				} else {
					if (error.context) {
						error.context.itemIndex = itemIndex;
						throw error;
					}
					throw new NodeOperationError(this.getNode(), error, {
						itemIndex,
					});
				}
			}
		}

		return this.prepareOutputData(returnData);
	}
}
