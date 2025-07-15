import database from "../modules/database.js";
import config from "../../config.json" with {type: 'json'};
import "discord.js"
import {EmbedBuilder, SlashCommandBuilder, MessageFlags, bold, hyperlink, PermissionFlagsBits} from "discord.js";
import chalk from "chalk";

const inDev = true
const commandType = "moderation";
const data = new SlashCommandBuilder()
    .setName("say")
    .setDescription("Sends a message in the provided channel")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addChannelOption(option =>
        option
            .setName("channel")
            .setDescription("Channel to message")
            .setRequired(true))
    .addStringOption(option =>
        option
            .setName("message")
            .setDescription("Message to send")
            .setRequired(true))


async function execute(interaction) {
    const channel = await interaction.options.getChannel("channel");
    const message = await interaction.options.getString("message");
    try {
        await channel.send({content:message})
        await interaction.reply({content: "Message sent.",flags:[MessageFlags.Ephemeral]})
    } catch(e) {}
}

export {data,execute}