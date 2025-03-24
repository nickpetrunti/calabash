import { SlashCommandBuilder,  ModalBuilder, ActionRowBuilder, TextInputBuilder, TextInputStyle, PermissionFlagsBits } from "discord.js";
const inDev = true

const data = new SlashCommandBuilder()
    .setName("transfer")
    .setDescription("Transfer warns from Carl")
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
    .addUserOption(option =>
        option
            .setName("target")
            .setDescription("User to apply warnings to")
            .setRequired(true))

async function execute(interaction) {
    const target = interaction.options.getUser("target");

    const modal = new ModalBuilder()
        .setCustomId(`transferModal-${interaction.member.user.id}`)
        .setTitle("Warning Transfer")

    const transferData = new TextInputBuilder()
        .setCustomId("transferModalData")
        .setLabel("Warning Data")
        .setStyle(TextInputStyle.Paragraph)

    const dataRow = new ActionRowBuilder().addComponents(transferData);

    modal.addComponents(dataRow)

    await interaction.showModal(modal)

    const filter = (interaction) => interaction.customId === `transferModal-${interaction.member.user.id}`;
    interaction
        .awaitModalSubmit({filter, time:30_000})
        .then((modalSubmission) => {
            console.log(modalSubmission.fields.getTextInputValue("transferModalData"))
            modalSubmission.reply({content: "Donezo"})
        })

}

export {data, execute, inDev}