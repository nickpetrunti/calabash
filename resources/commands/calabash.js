import { SlashCommandBuilder } from "discord.js";
const inDev = false

const data = new SlashCommandBuilder()
    .setName("calabash")
    .setDescription("CALABASH")

async function execute(interaction) {
    await interaction.reply("calabash")
}

export {data, execute, inDev}