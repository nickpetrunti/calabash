import { SlashCommandBuilder } from "discord.js";
const inDev = false

const data = new SlashCommandBuilder()
    .setName("ongo")
    .setDescription("ongo")

async function execute(interaction) {
    await interaction.reply("ongo")
}

export {data, execute, inDev}