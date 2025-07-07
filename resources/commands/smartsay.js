import database from "../modules/database.js";
import config from "../../config.json" with {type: 'json'};
import "discord.js"
import {EmbedBuilder, SlashCommandBuilder, MessageFlags, bold, hyperlink, PermissionFlagsBits} from "discord.js";
import chalk from "chalk";
import {calalang} from "../modules/calabash-ai.js"

const inDev = true
const commandType = "moderation";
const data = new SlashCommandBuilder()
    .setName("smartsay")
    .setDescription("Sends a smart message in the provided channel")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addStringOption(option =>
        option
            .setName("message")
            .setDescription("Message to send")
            .setRequired(true))


async function execute(interaction) {
    const message = await interaction.options.getString("message");

    const newMessage = await calalang(message)

    await interaction.channel.send({content:newMessage})
    await interaction.reply({content: "Message sent.",flags:[MessageFlags.Ephemeral]})
}

export {data,execute}