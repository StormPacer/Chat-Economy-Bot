/**
 * @file Inventory check command.
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

const userPath = "./database/users.json";
const fs = require("fs");

/**
 * @type {import('../../../typings').SlashInteractionCommand}
 */
module.exports = {
	// The data needed to register slash commands to Discord.
	data: new SlashCommandBuilder()
		.setName("inventory")
		.setDescription("Shows current user inventory.")
		.addUserOption((option) =>
			option
				.setName("user")
				.setDescription("To check inventory of a specific user.")
		),

	async execute(interaction) {
		/**
		 * @description The "user" argument
		 */
		let user = interaction.options.getUser("user");

		if (!user) {
			user = interaction.user;
		}

		// Tries reading required database file.

		try {
			var jsonString = fs.readFileSync(userPath, {
				encoding: "utf-8",
			});
		} catch (error) {
			log.error(error);
			return process.exit(1);
		}

		// Tries parsing required database file.

		try {
			/**
			 * @type {import('../../../typings').UserDatabase}
			 */
			var userDB = JSON.parse(jsonString);
		} catch (error) {
			log.error(error);
			return process.exit(1);
		}

		// Find the user (index) in the database.

		let dbUser = userDB.find((m) => m.user_id == user.id);
		if (!dbUser) {
			// @ts-ignore Non-existent object, created for the sake of properties!
			dbUser = {};
			dbUser.items = {};
		}

		// Make a stylish embed result!

		const embed = new MessageEmbed()
			.setTitle(`${user.username}'s inventory`)
			.setDescription(`Bank Balance: ${dbUser.balance ? dbUser.balance : 0}`)
			.setTimestamp();

		for (const key of Object.keys(dbUser.items)) {
			embed.addField(`${key}`, `Amount: ${dbUser.items[key]}`);
		}

		await interaction.reply({
			embeds: [embed],
		});

		return;
	},
};
