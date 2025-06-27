import {
    SlashCommandBuilder,
    SeparatorSpacingSize,
    ButtonStyle,
    MessageFlags,
    PermissionFlagsBits
} from "discord.js";
import fs from "fs";

const inDev = true
const commandType = "dev";
const disabled = false;

let data = new SlashCommandBuilder()
    .setName("embed")
    .setDescription("Posts a pre-created embed to the channel the command is executed in.")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)

async function execute(interaction) {

    const embedData = await import(`../embeds/${interaction.options.getString("embed-name")}.js`)
    await interaction.channel.send({components: [embedData.container], flags: MessageFlags.IsComponentsV2})
}

export {data, execute, inDev, disabled}