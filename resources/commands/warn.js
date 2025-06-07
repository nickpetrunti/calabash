import { SlashCommandBuilder, ModalBuilder, ActionRowBuilder, TextInputBuilder, TextInputStyle, PermissionFlagsBits, MessageFlags, EmbedBuilder, hyperlink, bold, } from "discord.js";
import database from "../modules/database.js";
import config from "../../config.json" with {type:"json"};
import chalk from "chalk";
import crypto from "crypto";

const inDev = false
const commandType = "moderation";
const data = new SlashCommandBuilder()
    .setName("warn")
    .setDescription("Warns a user for a rule infraction")
    .addUserOption(option =>
        option
            .setName("user")
            .setDescription("User to warn")
            .setRequired(true))
    .addNumberOption(option =>
        option
            .setName("rule")
            .setDescription("Rule violated")
            .setRequired(true))
    .addStringOption(option =>
        option
            .setName("reason")
            .setDescription("Warning explanation")
            .setRequired(true))
    .addStringOption(option =>
        option
            .setName("evidence")
            .setDescription("Evidence URL")
            .setRequired(true))

async function execute(interaction) {

    const target = interaction.options.getUser("user")
    const rule = interaction.options.getNumber("rule")
    const explanation = interaction.options.getString("reason")
    const evidence = interaction.options.getString("evidence")
    const timestamp = Math.floor(Date.now() / 1000);
    const moderatorID = interaction.member.user.id;

    const db = await database.fetchDatabase("warnings")

    let warnID = await db.findOne({title: "warnID"})
    warnID = warnID.value;
    warnID+=1
    await db.updateOne({title: "warnID"}, {$set: {value: warnID}})

    await db.insertOne({
        target: target.id,
        rule: rule,
        explanation: explanation,
        evidence: evidence,
        timestamp: timestamp,
        moderator: moderatorID,
        id: warnID,
        type: "warning"
    })

    console.log(chalk.rgb(255, 192, 66).bold(`WARN: `)+chalk.underline.green(interaction.member.user.tag)+chalk.bold(" >>> ")+chalk.underline.green(target.tag))

    try {
        await interaction.reply({content: "Warning successfully submitted.", flags: MessageFlags.Ephemeral});
    } catch(e) {}

    const logEmbed = new EmbedBuilder()
        .setColor(0xFFDD33)
        .setTitle(`Warning [${warnID}]`)
        .setDescription(`${bold("Offender")}: <@${target.id}>\n${bold("Rule")}: ${rule}\n${bold("Reason")}: ${explanation}\n${bold("Evidence")}: ${hyperlink("Click Here", evidence)}`)
        .setFooter({text: `${interaction.member.user.tag}`, iconURL: interaction.member.user.avatarURL()})
        .setTimestamp()

    try {
        interaction.guild.channels.cache.get(config.warnLogsID).send({embeds: [logEmbed]})
    } catch (e) {}

    const notifEmbed = new EmbedBuilder()
        .setColor(0xFFDD33)
        .setTitle(`You have been warned in Deepwoken Info`)
        .setDescription(`${bold("Rule")}: ${rule}\n${bold("Reason")}: ${explanation}`)
        .setTimestamp()

    target.send({embeds:[notifEmbed]})
        .catch(e => {console.log(chalk.redBright.bold("FAILURE TO NOTIFY"))})

}

export {data, execute, inDev, commandType}