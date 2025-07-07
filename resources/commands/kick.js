import database from "../modules/database.js";
import config from "../../config.json" with {type: 'json'};
import "discord.js"
import {EmbedBuilder, SlashCommandBuilder, MessageFlags, bold, hyperlink} from "discord.js";
import chalk from "chalk";

const inDev = false
const commandType = "moderation";
const data = new SlashCommandBuilder()
    .setName("kick")
    .setDescription("Removes a member from the server")
    .addUserOption(option =>
        option
            .setName("user")
            .setDescription("User to warn")
            .setRequired(true))
    .addStringOption(option =>
        option
            .setName("reason")
            .setDescription("Kick reason")
            .setRequired(true))

async function execute(interaction) {
    const guild = interaction.guild;
    const author = interaction.member;
    const target = guild.members.cache.get(interaction.options.getUser("user").id)
    const reason = interaction.options.getString("reason")
    const warningsDB = await database.fetchDatabase("warnings")

    if (author.roles.highest.position < target.roles.highest.position) {
        await interaction.reply({content: `You lack the permissions to moderate this user.`, flags:[MessageFlags.Ephemeral]})
        return;
    }

    const logEmbed = new EmbedBuilder()
        .setColor(0xFF724F)
        .setTitle(`Kick [${target.id}]`)
        .setDescription(`${bold("Offender")}: <@${target.id}>\n${bold("Reason")}: ${reason}`)
        .setFooter({text: `${interaction.member.user.tag}`, iconURL: interaction.member.user.avatarURL()})
        .setTimestamp()

    try {
        const notifEmbed = new EmbedBuilder()
            .setColor(0xFF3333)
            .setTitle(`You have been banned from Deepwoken Info`)
            .setDescription(`${bold("Reason: ")}${reason}`)
            .setTimestamp()

        try {
            target.send({embeds: [notifEmbed]})
        } catch(e) {
            console.warn("Unable to notify - kick")
        }

        await target.kick(reason)

        console.log(chalk.rgb(255, 83, 31).bold(`KICK: `)+chalk.underline.green(interaction.member.user.tag)+chalk.bold(" >>> ")+chalk.underline.green(target.tag))

        await warningsDB.insertOne({
            target: target.id,
            explanation: reason,
            timestamp: Math.floor(Date.now() / 1000),
            moderator: author.id,
            type: "kick"
        })

        interaction.guild.channels.cache.get(config.warnLogsID).send({embeds: [logEmbed]})
        await interaction.reply({content: `Successfully kicked <@${target.id}>`, flags:[MessageFlags.Ephemeral]})

    } catch (e) {
        console.warn(`An error occurred while kicking user ${target.id}`)
        await interaction.reply({content: `An error occurred while trying to moderate this user.`, flags:[MessageFlags.Ephemeral]})
    }

}

export {data,execute}