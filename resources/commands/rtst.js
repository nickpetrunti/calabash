import {
    SlashCommandBuilder,
    MessageFlags,
    PermissionFlagsBits,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    ComponentType
} from "discord.js";

const inDev = true
const commandType = "moderation";
const disabled = false;

const data = new SlashCommandBuilder()
    .setName("rtst")
    .setDescription("Keepler Plorkly Moalp Dpp.....")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)

async function execute(interaction) {
    const actionRow = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId("rtst-post")
                .setLabel("Post")
                .setStyle(ButtonStyle.Primary)
        )

    const response = await interaction.reply({
        content: "BHAALASHAHAH",
        components:[actionRow],
        flags: MessageFlags.Ephemeral,
        withResponse: true
    })

    const collector = response.resource.message.createMessageComponentCollector({componentType: ComponentType.Button, time: 3_600_000})

    await collector.on("collect", async intr => {
        if (!intr.user.id === interaction.user.id) {return}
        intr.reply("Wow!")
        collector.stop()
    })
}

export {data, execute, inDev, disabled}