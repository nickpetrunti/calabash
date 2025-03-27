import { SlashCommandBuilder, TextInputStyle, PermissionFlagsBits, MessageFlags, EmbedBuilder, bold } from "discord.js";
import config from "../../config.json" with {type:"json"};

const inDev = false

const commandType = "moderation";

const data = new SlashCommandBuilder()
    .setName("unban")
    .setDescription("Unbans a user from the server")
    .addStringOption(option =>
        option
            .setName("user-id")
            .setDescription("User to unban")
            .setRequired(true))

async function execute(interaction) {
    const target = interaction.options.getString("user-id")

    const logEmbed = new EmbedBuilder()
        .setColor(0X7096FF)
        .setTitle(`Unban [${target}]`)
        .setDescription(`${bold("Target")}: <@${target}>`)
        .setFooter({text: `${interaction.member.user.tag}`, iconURL: interaction.member.user.avatarURL()})
        .setTimestamp()


    try {
        interaction.guild.channels.cache.get(config.warnLogsID).send({embeds:[logEmbed]})
    } catch(e) {console.warn("Error while logging ban")}

    try {
        await interaction.guild.bans.remove(target)
        interaction.reply({content:`Successfully unbanned <@${target}>.`, flags:[MessageFlags.Ephemeral]})
    } catch(e) {
        await interaction.reply({content:`This user is not banned.`, flags:[MessageFlags.Ephemeral]})
    }

}

export {data, execute, inDev, commandType}