import { SlashCommandBuilder, TextInputStyle, PermissionFlagsBits, MessageFlags } from "discord.js";
import database from "../../database.js";
import config from "../../config.json" with {type:"json"};

const inDev = false

const commandType = "moderation";

const data = new SlashCommandBuilder()
    .setName("ban")
    .setDescription("Bans a user from the server")
    .addUserOption(option =>
        option
            .setName("user")
            .setDescription("User to warn")
            .setRequired(true))
    .addStringOption(option =>
        option
            .setName("reason")
            .setDescription("Reason the user is being banned")
            .setRequired(true))

async function execute(interaction) {

        await interaction.reply("Yo im boutta ban this mf")

        /*
        const logEmbed = new EmbedBuilder()
            .setColor(0xFFDD33)
            .setTitle(`Warning [${warnID}]`)
            .setDescription(`${bold("Offender")}: <@${target.id}>\n${bold("Reason")}: ${explanation}\n${bold("Evidence")}: ${hyperlink("Click Here", evidence)}`)
            .setFooter({text: `${interaction.member.user.tag}`, iconURL: interaction.member.user.avatarURL()})
            .setTimestamp()
         */

}

export {data, execute, inDev, commandType}