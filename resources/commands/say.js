import database from "../modules/database.js";
import config from "../../config.json" with {type: 'json'};
import "discord.js"
import {EmbedBuilder, SlashCommandBuilder, MessageFlags, bold, hyperlink, PermissionFlagsBits} from "discord.js";
import chalk from "chalk";

const inDev = true
const commandType = "moderation";
const data = new SlashCommandBuilder()
    .setName("say")
    .setDescription("Removes a member from the server")
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
    await channel.send({content:message})
}

export {data,execute}