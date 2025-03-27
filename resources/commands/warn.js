import { SlashCommandBuilder, ModalBuilder, ActionRowBuilder, TextInputBuilder, TextInputStyle, PermissionFlagsBits, MessageFlags, EmbedBuilder, hyperlink, bold, } from "discord.js";
import database from "../../database.js";
import config from "../../config.json" with {type:"json"};
import chalk from "chalk";
const inDev = false
const commandType = "moderation";
//
const data = new SlashCommandBuilder()
    .setName("warn")
    .setDescription("Warns a user for a rule infraction")
    .addUserOption(option =>
        option
            .setName("user")
            .setDescription("User to warn")
            .setRequired(true))

async function execute(interaction) {
//    if(!interaction.member.roles.cache.has("1011510257232646164") && !interaction.member.permissions.has(PermissionFlagsBits.ManageMessages, true)) return;

    const modal = new ModalBuilder()
        .setCustomId(`warningModal-${interaction.member.user.id}`)
        .setTitle("Warning Submission")

    const ruleInput = new TextInputBuilder()
        .setCustomId("warningModalRule")
        .setLabel("Infracted rule")
        .setStyle(TextInputStyle.Short)
        .setPlaceholder("Enter only the rule number")

    const explanationInput = new TextInputBuilder()
        .setCustomId("warningModalExplanation")
        .setLabel("Explanation")
        .setStyle(TextInputStyle.Paragraph)

    const evidenceInput = new TextInputBuilder()
        .setCustomId("warningModalEvidence")
        .setLabel("Evidence message link")
        .setStyle(TextInputStyle.Short)

    const rowOne = new ActionRowBuilder().addComponents(ruleInput);
    const rowTwo = new ActionRowBuilder().addComponents(explanationInput);
    const rowThree = new ActionRowBuilder().addComponents(evidenceInput);

    modal.addComponents(rowOne, rowTwo, rowThree);
    const target = interaction.options.getUser("user")
    const filter = (intr) => intr.customId === `warningModal-${interaction.member.user.id}`;
    await interaction.showModal(modal);

    interaction.awaitModalSubmit({filter, time:30_000}).then(async(result) => {
        console.log(chalk.bgWhiteBright.black.bold(`${interaction.member.user.tag} - ${result.member.user.tag}`))
        const rule = result.fields.getTextInputValue("warningModalRule");
        const explanation = result.fields.getTextInputValue("warningModalExplanation").substring(0,500);
        const evidence = result.fields.getTextInputValue("warningModalEvidence");
        const timestamp = Math.floor(Date.now() / 1000);
        const moderatorID = result.member.user.id;

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

        try {
            await result.reply({content: "Warning successfully submitted.", flags: MessageFlags.Ephemeral});
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
            .catch()
    }).catch(async()=>{
        await interaction.reply("Sorry")
    })

}

export {data, execute, inDev, commandType}