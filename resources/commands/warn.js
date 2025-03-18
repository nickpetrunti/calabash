import { SlashCommandBuilder, ModalBuilder, ActionRowBuilder, TextInputBuilder, TextInputStyle, PermissionFlagsBits } from "discord.js";
import database from "../../database.js";
const inDev = true

const data = new SlashCommandBuilder()
    .setName("warn")
    .setDescription("Warns a user for a rule infraction")
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)

async function execute(interaction) {
//    if(!interaction.member.roles.cache.has("1011510257232646164") && !interaction.member.permissions.has(PermissionFlagsBits.ManageMessages, true)) return;

    const modal = new ModalBuilder()
        .setCustomId("warningModal")
        .setTitle("Warning Submission")

    const userInput = new TextInputBuilder()
        .setCustomId("warningModalTarget")
        .setLabel("Target")
        .setStyle(TextInputStyle.Short)

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

    const rowZero = new ActionRowBuilder().addComponents(userInput);
    const rowOne = new ActionRowBuilder().addComponents(ruleInput);
    const rowTwo = new ActionRowBuilder().addComponents(explanationInput);
    const rowThree = new ActionRowBuilder().addComponents(evidenceInput);

    modal.addComponents(rowZero, rowOne, rowTwo, rowThree);

    await interaction.showModal(modal);

}

export {data, execute, inDev}