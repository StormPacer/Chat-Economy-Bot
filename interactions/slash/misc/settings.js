/**
 * @file Settings command for economy bot.
 * @author Naman Vrati
 * @since 2.0.0
 * @version 2.0.0
 */

// Initialize LeeksLazyLogger

const Logger = require("leekslazylogger");
// @ts-ignore
const log = new Logger({ keepSilent: true });

// Deconstructed the constants we need in this file.

const { SlashCommandBuilder } = require("@discordjs/builders");
const { ChannelType } = require("discord-api-types/v10");

const manager = require("../../../functions/database");

/**
 * @type {import('../../../typings').SlashInteractionCommand}
 */
module.exports = {
	// The data needed to register slash commands to Discord.
	data: new SlashCommandBuilder()
		.setName("settings")
		.setDescription(
			"List of all available properties for the economy of your server!"
		)
		.addSubcommand((subcommand) =>
			subcommand
				.setName("prefix")
				.setDescription("This is a prefix to which bot responds to someone.")
				.addStringOption((option) =>
					option
						.setName("value")
						.setDescription("The new prefix value.")
						.setRequired(true)
				)
		)
		.addSubcommand((subcommand) =>
			subcommand
				.setName("heat_max")
				.setDescription(
					"This is the maximum amount of heat required to trigger an event in chat."
				)
				.addIntegerOption((option) =>
					option
						.setName("value")
						.setDescription("The new maxmimum heat value.")
						.setMaxValue(10000)
						.setMinValue(10)
						.setRequired(true)
				)
		)
		.addSubcommand((subcommand) =>
			subcommand
				.setName("heat_per_msg")
				.setDescription(
					"This is the amount of heat generated per message in chat."
				)
				.addIntegerOption((option) =>
					option
						.setName("value")
						.setDescription("The new heat per message value.")
						.setMaxValue(100)
						.setMinValue(1)
						.setRequired(true)
				)
		)
		.addSubcommand((subcommand) =>
			subcommand
				.setName("cooldown")
				.setDescription(
					"This cooldown (in seconds) will be minimum gap between two chat events."
				)
				.addIntegerOption((option) =>
					option
						.setName("value")
						.setDescription("The new cooldown value (in seconds).")
						.setMaxValue(60 * 60 * 6)
						.setMinValue(10)
						.setRequired(true)
				)
		)
		.addSubcommand((subcommand) =>
			subcommand
				.setName("chat_channel")
				.setDescription("This is the main channel where chat events function.")
				.addChannelOption((option) =>
					option
						.setName("value")
						.setDescription("The new channel.")
						.addChannelTypes(ChannelType.GuildText)
						.setRequired(true)
				)
		)
		.addSubcommand((subcommand) =>
			subcommand
				.setName("bot_channel")
				.setDescription(
					"This is the bot channel where all economy commands should function."
				)
				.addChannelOption((option) =>
					option
						.setName("value")
						.setDescription("The new channel.")
						.addChannelTypes(ChannelType.GuildText)
						.setRequired(true)
				)
		)
		.addSubcommandGroup((group) =>
			group
				.setName("currency")
				.setDescription("Adjust your server's currency settings.")
				.addSubcommand((subcommand) =>
					subcommand
						.setName("name")
						.setDescription("This is the name of your server's currency.")
						.addStringOption((option) =>
							option
								.setName("value")
								.setDescription("The new currency name.")
								.setRequired(true)
						)
				)
				.addSubcommand((subcommand) =>
					subcommand
						.setName("emoji")
						.setDescription(
							"This is the emoji (symbol) of your server's currency."
						)
						.addStringOption((option) =>
							option
								.setName("value")
								.setDescription("The new currency emoji.")
								.setRequired(true)
						)
				)
		),

	ownerOnly: true,
	async execute(interaction) {
		const { options } = interaction;

		// Extract the sub-command used.

		const subCommand = options.getSubcommand();
		const subCommandGroup = options.getSubcommandGroup(false);

		// Find the value of the sub-command executed.

		let value;

		if (subCommandGroup && subCommandGroup == "currency")
			value = options.getString("value", true).trim();

		if (subCommand == "cooldown")
			value = options.getInteger("value", true) * 1000;

		if (subCommand == "prefix") value = options.getString("value", true).trim();

		if (subCommand == "heat_per_msg" || subCommand == "heat_max")
			value = options.getInteger("value");

		if (subCommand == "bot_channel" || subCommand == "chat_channel")
			value = options.getChannel("value")?.id;

		const config = manager.getConfigFile();

		// Now we will update the config object with new value

		if (subCommandGroup && subCommandGroup == "currency") {
			config.settings.currency[subCommand] = value;
		} else {
			config.settings[subCommand] = value;
		}

		// Now we will write the config to config.json

		await manager.putConfigFile(config);

		// Now follow-up after success!

		await interaction.reply({
			content: `Value for \`${subCommand}\` is successfully updated to \`${value}\`!`,
			ephemeral: true,
		});

		return;
	},
};
