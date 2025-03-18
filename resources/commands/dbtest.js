import { SlashCommandBuilder } from "discord.js";
import database from "../../database.js";
const inDev = true

const data = new SlashCommandBuilder()
    .setName("database")
    .setDescription("Database functionality test")
    .addStringOption(option =>
        option
            .setName("content")
            .setDescription("The content of the database entry")
            .setRequired(true))

async function execute(interaction) {

    const message = interaction.options.getString("content")

    database.putWarning(interaction.member.user.displayName, message, Math.floor((Date.now() / 1000)));

    await interaction.reply("All set.")
}

export {data, execute, inDev}