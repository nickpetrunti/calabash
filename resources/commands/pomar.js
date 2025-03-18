import { SlashCommandBuilder } from "discord.js";
const inDev = false

const data = new SlashCommandBuilder()
    .setName("pomar")
    .setDescription("POMAR")

async function execute(interaction) {
    await interaction.reply("pomar")
}

export {data, execute, inDev}