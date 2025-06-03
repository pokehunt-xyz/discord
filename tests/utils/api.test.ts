import { AttachmentBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, StringSelectMenuBuilder } from 'discord.js';
import { parseCommandResponse } from '../../src/utils/api';

describe('Embeds', () => {
	it('Should handle no embed', async () => {
		const res = await parseCommandResponse({
			embeds: [],
			files: [],
			buttons: [],
			menus: [],
		});
		expect(res.embeds).toHaveLength(0);
	});

	it('Should handle empty embed', async () => {
		const res = await parseCommandResponse({
			embeds: [{}],
			files: [],
			buttons: [],
			menus: [],
		});
		expect(res.embeds).toHaveLength(0);
	});

	it('Should handle a single embed', async () => {
		const res = await parseCommandResponse({
			embeds: [{ title: 'Force has content' }],
			files: [],
			buttons: [],
			menus: [],
		});
		expect(res.embeds).toHaveLength(1);
		expect(res.embeds[0]).toBeInstanceOf(EmbedBuilder);
	});

	it('Should handle multiple embeds', async () => {
		const res = await parseCommandResponse({
			embeds: [{ title: 'Force has content' }, { title: 'Force has content' }],
			files: [],
			buttons: [],
			menus: [],
		});
		expect(res.embeds).toHaveLength(2);
	});

	it('Should set the title correctly', async () => {
		const res = await parseCommandResponse({ embeds: [{ title: 'Test title' }], files: [], buttons: [], menus: [] });
		expect(res.embeds).toHaveLength(1);
		expect(res.embeds[0].data.title).toBe('Test title');
	});

	it('Should set the fields correctly', async () => {
		const res = await parseCommandResponse({
			embeds: [
				{
					fields: [
						{ name: 'Test name', value: 'Test value' },
						{ name: 'Test name inline', value: 'Test value inline', inline: true },
					],
				},
			],
			files: [],
			buttons: [],
			menus: [],
		});
		expect(res.embeds).toHaveLength(1);
		expect(res.embeds[0].data.fields).toHaveLength(2);
		expect(res.embeds[0].data.fields?.[0].name).toBe('Test name');
		expect(res.embeds[0].data.fields?.[0].value).toBe('Test value');
		expect(res.embeds[0].data.fields?.[0].inline).toBeUndefined();
		expect(res.embeds[0].data.fields?.[1].name).toBe('Test name inline');
		expect(res.embeds[0].data.fields?.[1].value).toBe('Test value inline');
		expect(res.embeds[0].data.fields?.[1].inline).toBeTruthy();
	});

	it('Should set empty fields correctly', async () => {
		const res = await parseCommandResponse({
			embeds: [{ title: 'Force has content', fields: [] }],
			files: [],
			buttons: [],
			menus: [],
		});
		expect(res.embeds).toHaveLength(1);
		expect(res.embeds[0].data.fields).toBeUndefined();
	});

	it('Should set the description correctly', async () => {
		const res = await parseCommandResponse({
			embeds: [{ description: 'Test description' }],
			files: [],
			buttons: [],
			menus: [],
		});
		expect(res.embeds).toHaveLength(1);
		expect(res.embeds[0].data.description).toBe('Test description');
	});

	it('Should set the author correctly', async () => {
		const res = await parseCommandResponse({
			embeds: [{ author: { name: 'Test Author', iconURL: 'https://example.com/icon.png' } }],
			files: [],
			buttons: [],
			menus: [],
		});
		expect(res.embeds).toHaveLength(1);
		expect(res.embeds[0].data.author?.name).toBe('Test Author');
		expect(res.embeds[0].data.author?.icon_url).toBe('https://example.com/icon.png');
	});

	it('Should set the footer correctly', async () => {
		const res = await parseCommandResponse({
			embeds: [{ footer: { text: 'Test footer' } }],
			files: [],
			buttons: [],
			menus: [],
		});
		expect(res.embeds).toHaveLength(1);
		expect(res.embeds[0].data.footer?.text).toBe('Test footer');
	});

	it('should set the image correctly', async () => {
		const res = await parseCommandResponse({
			embeds: [{ image: 'https://example.com/image.png' }],
			files: [],
			buttons: [],
			menus: [],
		});
		expect(res.embeds).toHaveLength(1);
		expect(res.embeds[0].data.image?.url).toBe('https://example.com/image.png');
	});

	it('should set the thumbnail correctly', async () => {
		const res = await parseCommandResponse({
			embeds: [{ thumbnail: 'https://example.com/thumb.png' }],
			files: [],
			buttons: [],
			menus: [],
		});
		expect(res.embeds).toHaveLength(1);
		expect(res.embeds[0].data.thumbnail?.url).toBe('https://example.com/thumb.png');
	});

	it('should set the timestamp correctly', async () => {
		const testDate = new Date();
		const res = await parseCommandResponse({
			embeds: [{ title: 'Force has content', timestamp: testDate }],
			files: [],
			buttons: [],
			menus: [],
		});
		expect(res.embeds).toHaveLength(1);
		expect(res.embeds[0].data.timestamp).toBe(testDate.toISOString());
	});

	it('should set the color correctly', async () => {
		const res = await parseCommandResponse({
			embeds: [{ title: 'Force has content', color: '#FF0000' }],
			files: [],
			buttons: [],
			menus: [],
		});
		expect(res.embeds).toHaveLength(1);
		expect(res.embeds[0].data.color).toBe(16711680); // (Red × 65536) + (Green × 256) + Blue = (255 × 65536) + (0 × 256) + 0 = 16711680
	});
});

describe('Files', () => {
	it('should handle no files', async () => {
		const res = await parseCommandResponse({
			embeds: [],
			files: [],
			buttons: [],
			menus: [],
		});

		expect(res.files).toHaveLength(0);
	});

	it('should handle single file', async () => {
		const res = await parseCommandResponse({
			embeds: [],
			files: [
				{
					name: 'test.txt',
					content: Buffer.from('test content'),
				},
			],
			buttons: [],
			menus: [],
		});

		expect(res.files).toHaveLength(1);
		expect(res.files[0]).toBeInstanceOf(AttachmentBuilder);
		expect(res.files[0].name).toBe('test.txt');
	});

	it('should handle multiple files', async () => {
		const res = await parseCommandResponse({
			embeds: [],
			files: [
				{ name: 'file1.txt', content: Buffer.from('content1') },
				{ name: 'file2.png', content: Buffer.from('content2') },
			],
			buttons: [],
			menus: [],
		});

		expect(res.files).toHaveLength(2);
		expect(res.files[0].name).toBe('file1.txt');
		expect(res.files[1].name).toBe('file2.png');
	});
});

describe('Buttons', () => {
	it('should handle empty buttons', async () => {
		const res = await parseCommandResponse({
			embeds: [],
			files: [],
			buttons: [],
			menus: [],
		});
		expect(res.components).toHaveLength(0);
	});

	it('should parse single button row', async () => {
		const res = await parseCommandResponse({
			embeds: [],
			files: [],
			buttons: [[{ id: 'btn1', label: 'Button 1', style: 'Primary' }]],
			menus: [],
		});

		expect(res.components).toHaveLength(1);
		const row = res.components[0];
		expect(row.components).toHaveLength(1);
		expect(row.components[0]).toBeInstanceOf(ButtonBuilder);
		// @ts-expect-error We know this is a button due to the ButtonBuilder check
		expect(row.components[0].data.label).toBe('Button 1');
		// @ts-expect-error We know this is a button due to the ButtonBuilder check
		expect(row.components[0].data.style).toBe(ButtonStyle.Primary);
	});

	it('should parse multiple button rows', async () => {
		const res = await parseCommandResponse({
			embeds: [],
			files: [],
			buttons: [[{ id: 'btn1', label: 'Button 1', style: 'Primary' }], [{ id: 'btn2', label: 'Button 2', style: 'Secondary' }]],
			menus: [],
		});

		expect(res.components).toHaveLength(2);
		// @ts-expect-error We know this is a button due to the ButtonBuilder check
		expect(res.components[0].components[0].data.label).toBe('Button 1');
		// @ts-expect-error We know this is a button due to the ButtonBuilder check
		expect(res.components[1].components[0].data.label).toBe('Button 2');
	});

	it('should handle disabled buttons', async () => {
		const res = await parseCommandResponse({
			embeds: [],
			files: [],
			buttons: [[{ id: 'btn1', label: 'Disabled', style: 'Primary', disabled: true }]],
			menus: [],
		});

		expect(res.components[0].components[0].data.disabled).toBe(true);
	});

	it('should handle link buttons', async () => {
		const res = await parseCommandResponse({
			embeds: [],
			files: [],
			buttons: [[{ id: 'https://example.com', label: 'Link', style: 'Link' }]],
			menus: [],
		});

		const button = res.components[0].components[0];
		// @ts-expect-error We know this is a button due to the ButtonBuilder check
		expect(button.data.style).toBe(ButtonStyle.Link);
		// @ts-expect-error We know this is a button due to the ButtonBuilder check
		expect(button.data.url).toBe('https://example.com');
	});

	it('should auto-split oversized button arrays (more than 5 buttons)', async () => {
		const res = await parseCommandResponse({
			embeds: [],
			files: [],
			buttons: [
				[
					{ id: 'btn1', label: '1', style: 'Primary' },
					{ id: 'btn2', label: '2', style: 'Primary' },
					{ id: 'btn3', label: '3', style: 'Primary' },
					{ id: 'btn4', label: '4', style: 'Primary' },
					{ id: 'btn5', label: '5', style: 'Primary' },
					{ id: 'btn6', label: '6', style: 'Primary' },
				],
			],
			menus: [],
		});

		expect(res.components).toHaveLength(2);
		expect(res.components[0].components).toHaveLength(5);
		expect(res.components[1].components).toHaveLength(1);
	});

	it('should put buttons together if too many rows', async () => {
		const res = await parseCommandResponse({
			embeds: [],
			files: [],
			buttons: Array(6)
				.fill(0)
				.map((_, i) => [{ id: `btn${i}`, label: `Button ${i}`, style: 'Primary' }]),
			menus: [],
		});

		expect(res.components).toHaveLength(2);
	});

	it('should ignore buttons if too many buttons', async () => {
		const res = await parseCommandResponse({
			embeds: [],
			files: [],
			buttons: Array(26)
				.fill(0)
				.map((_, i) => [{ id: `btn${i}`, label: `Button ${i}`, style: 'Primary' }]),
			menus: [],
		});

		expect(res.components).toHaveLength(5);
	});
});

describe('Menus', () => {
	it('should parse single select menu', async () => {
		const res = await parseCommandResponse({
			embeds: [],
			files: [],
			buttons: [],
			menus: [
				{
					id: 'menu1',
					placeholder: 'Select option',
					options: [
						{ value: 'opt1', label: 'Option 1', description: 'First option' },
						{ value: 'opt2', label: 'Option 2', description: 'Second option' },
					],
					min: 1,
					max: 1,
				},
			],
		});

		expect(res.components).toHaveLength(1);
		const menu = res.components[0].components[0] as StringSelectMenuBuilder;
		expect(menu).toBeInstanceOf(StringSelectMenuBuilder);
		expect(menu.data.placeholder).toBe('Select option');
		expect(menu.data.min_values).toBe(1);
		expect(menu.data.max_values).toBe(1);
		expect(menu.options).toHaveLength(2);
	});

	it('should parse menu with all options', async () => {
		const res = await parseCommandResponse({
			embeds: [],
			files: [],
			buttons: [],
			menus: [
				{
					id: 'menu1',
					placeholder: 'Select option',
					options: [
						{ value: 'opt1', label: 'Option 1', description: 'First option', enabled: true },
						{ value: 'opt2', label: 'Option 2', description: 'Second option', enabled: false },
					],
					min: 0,
					max: 2,
				},
			],
		});

		const menu = res.components[0].components[0] as StringSelectMenuBuilder;
		expect(menu.data.min_values).toBe(0);
		expect(menu.data.max_values).toBe(2);
		expect(menu.options[0].data.default).toBe(true);
		expect(menu.options[1].data.default).toBe(false);
	});

	it('should handle multiple menus', async () => {
		const res = await parseCommandResponse({
			embeds: [],
			files: [],
			buttons: [],
			menus: [
				{ id: 'menu1', placeholder: 'Menu 1', options: [], min: 0, max: 1 },
				{ id: 'menu2', placeholder: 'Menu 2', options: [], min: 0, max: 1 },
			],
		});

		expect(res.components).toHaveLength(2);
	});

	it('should handle empty options', async () => {
		const res = await parseCommandResponse({
			embeds: [],
			files: [],
			buttons: [],
			menus: [
				{
					id: 'menu1',
					placeholder: 'Empty',
					options: [],
					min: 0,
					max: 0,
				},
			],
		});

		const menu = res.components[0].components[0] as StringSelectMenuBuilder;
		expect(menu.data.options).toBeUndefined();
	});
});

describe('Buttons and menus', () => {
	it('should handle combination of buttons and menus', async () => {
		const res = await parseCommandResponse({
			embeds: [],
			files: [],
			buttons: [[{ id: 'btn1', label: 'Button', style: 'Primary' }]],
			menus: [
				{
					id: 'menu1',
					placeholder: 'Select',
					options: [{ value: 'opt1', label: 'Option', description: 'First option' }],
					min: 1,
					max: 1,
				},
			],
		});

		expect(res.components).toHaveLength(2);
		expect(res.components[0].components[0]).toBeInstanceOf(ButtonBuilder);
		expect(res.components[1].components[0]).toBeInstanceOf(StringSelectMenuBuilder);
	});

	it('should respect Discord component limits (max 5 rows total)', async () => {
		const res = await parseCommandResponse({
			embeds: [],
			files: [],
			buttons: Array(3)
				.fill(0)
				.map((_, i) => [{ id: `btn${i}`, label: `Button ${i}`, style: 'Primary' }]),
			menus: Array(3)
				.fill(0)
				.map((_, i) => ({
					id: `menu${i}`,
					placeholder: `Menu ${i}`,
					options: [{ value: 'opt', label: 'Option', description: 'First option' }],
					min: 1,
					max: 1,
				})),
		});

		expect(res.components).toHaveLength(5); // 3 button rows + 2 menu rows (max 5 total)
	});
});
