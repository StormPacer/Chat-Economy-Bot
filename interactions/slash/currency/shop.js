/**
 * @file Server shop command.
 * @author Naman Vrati
 * @since 1.0.0
 * @version 2.0.0
 */

// Initialize LeeksLazyLogger

const Logger = require("leekslazylogger");
// @ts-ignore
const log = new Logger({ keepSilent: true });

// Deconstructed the constants we need in this file.

const { MessageEmbed } = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");

const shopPath = "./database/shop.json";
const fs = require("fs");

/**
 * @type {import('../../../typings').SlashInteractionCommand}
 */
module.exports = {
	// The data needed to register slash commands to Discord.
	data: new SlashCommandBuilder()
		.setName("shop")
		.setDescription("Displays the server shop!"),
	async execute(interaction) {
		// Tries reading required database file.

		try {
			var jsonString = fs.readFileSync(shopPath, {
				encoding: "utf-8",
			});
		} catch (error) {
			log.error(error);
			return process.exit(1);
		}

		// Tries parsing required database file.

		try {
			/**
			 * @type {import('../../../typings').ShopDatabase}
			 */
			var shopDB = JSON.parse(jsonString);
		} catch (error) {
			log.error(error);
			return process.exit(1);
		}

		// Make a stylish embed result!

		const embed = new MessageEmbed()
			.setTitle(`${interaction.guild.name}'s Shop!`)
			.setDescription(
				`${shopDB.map((item) => `${item.name}: ${item.price}💰`).join("\n")}`
			)
			.setTimestamp();

		await interaction.reply({
			embeds: [embed],
		});

		return;
	},
};
