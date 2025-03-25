import { SlashCommandBuilder, ModalBuilder, ActionRowBuilder, TextInputBuilder, TextInputStyle, PermissionFlagsBits, MessageFlags, EmbedBuilder, hyperlink, bold, } from "discord.js";
import database from "../../database.js";
import config from "../../config.json" with {type:"json"};
const inDev = true

const data = new SlashCommandBuilder()
    .setName("warn")
    .setDescription("Warns a user for a rule infraction")
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
    .addUserOption(option =>
        option
            .setName("user")
            .setDescription("User to warn")
            .setRequired(true))

async function execute(interaction) {
//    if(!interaction.member.roles.cache.has("1011510257232646164") && !interaction.member.permissions.has(PermissionFlagsBits.ManageMessages, true)) return;

    const modal = new ModalBuilder()
        .setCustomId("warningModal")
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
        .setLabel("Evidence image link")
        .setStyle(TextInputStyle.Short)

    const rowOne = new ActionRowBuilder().addComponents(ruleInput);
    const rowTwo = new ActionRowBuilder().addComponents(explanationInput);
    const rowThree = new ActionRowBuilder().addComponents(evidenceInput);

    modal.addComponents(rowOne, rowTwo, rowThree);

    await interaction.showModal(modal);

    interaction.awaitModalSubmit({time:60_000}).then(async(result) => {
        const target = interaction.options.getUser("user")
        const rule = result.fields.getTextInputValue("warningModalRule");
        const explanation = result.fields.getTextInputValue("warningModalExplanation");
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

        await result.reply({content: "Warning successfuly submitted.", flags: MessageFlags.Ephemeral});

        const logEmbed = new EmbedBuilder()
            .setColor(0xFFDD33)
            .setTitle(`Warning [${warnID}]`)
            .setDescription(`${bold("Offender")}: <@${target.id}>\n${bold("Reason")}: ${explanation}\n${bold("Evidence")}: ${hyperlink("Click Here", evidence)}`)
            .setFooter({text: `${interaction.member.user.tag}`, iconURL: interaction.member.user.avatarURL()})
            .setTimestamp()

        try {
            interaction.guild.channels.cache.get(config.warnLogsID).send({embeds: [logEmbed]})
        } catch (e) {console.error(e)}
    })

}

export {data, execute, inDev}