import { SlashCommandBuilder, TextInputStyle, PermissionFlagsBits, MessageFlags, EmbedBuilder, bold } from "discord.js";
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
            .setDescription("User to ban")
            .setRequired(true))
    .addStringOption(option =>
        option
            .setName("reason")
            .setDescription("Reason the user is being banned")
            .setRequired(true))

async function execute(interaction) {
        const target = interaction.options.getUser("user")
        const tMember = interaction.guild.members.cache.get(target.id)
        const reason = interaction.options.getString("reason");
        const warningsDB = await database.fetchDatabase("warnings")

        const logEmbed = new EmbedBuilder()
            .setColor(0xFF3333)
            .setTitle(`Ban [${target.id}]`)
            .setDescription(`${bold("Offender")}: <@${target.id}>\n${bold("Reason")}: ${reason}`)
            .setFooter({text: `${interaction.member.user.tag}`, iconURL: interaction.member.user.avatarURL()})
            .setTimestamp()

        const notifEmbed = new EmbedBuilder()
            .setColor(0xFF3333)
            .setTitle(`You have been banned from Deepwoken Info`)
            .setDescription(`${bold("Reason: ")}${reason}`)
            .setTimestamp()

        await warningsDB.insertOne({
                target: target.id,
                explanation: reason,
                timestamp: Math.floor(Date.now() / 1000),
                moderator: interaction.member.user.id,
                type: "ban"
        })

        try {
                await interaction.guild.bans.create(target.id,{reason:reason})
        } catch(e) {
                console.error(e)
                await interaction.reply({content:`An error occurred while banning this user.`, flags:[MessageFlags.Ephemeral]})
                return
        }

        try {
                tMember.send({embeds:[notifEmbed]})
        } catch(e) {}

        try {
                interaction.guild.channels.cache.get(config.warnLogsID).send({embeds:[logEmbed]})
        } catch(e) {console.warn("Error while logging ban")}

        await interaction.reply({content:`Successfully banned <@${target.id}>.`, flags:[MessageFlags.Ephemeral]})

}

export {data, execute, inDev, commandType}