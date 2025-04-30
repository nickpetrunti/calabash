import { SlashCommandBuilder } from "discord.js";
const inDev = false

const data = new SlashCommandBuilder()
    .setName("roll")
    .setDescription("Generates a random number")
    .addIntegerOption(option =>
        option
            .setName("maximum")
            .setDescription("Highest value to be rolled")
            .setRequired(true))

async function execute(interaction) {
    const max = interaction.options.getInteger("maximum");
    await interaction.reply(`You rolled a \`\`${Math.floor(Math.random()*(max - 0) + 0)}\`\``)
}

export {data, execute, inDev}