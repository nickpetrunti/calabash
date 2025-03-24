import {
    SlashCommandBuilder,
    ModalBuilder,
    ActionRowBuilder,
    TextInputBuilder,
    TextInputStyle,
    PermissionFlagsBits,
    EmbedBuilder,
    MessageFlags,
    bold,
    hyperlink
} from "discord.js";
import database from "../../database.js";
const inDev = true

const data = new SlashCommandBuilder()
    .setName("warns")
    .setDescription("Lists a users warnings")
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
    .addUserOption(option =>
        option
            .setName("user")
            .setDescription("User to view"))

async function execute(interaction) {
    const db = await database.fetchDatabase("warnings")
    let target = interaction.options.get("user");
    if (target) {
        target = target.user;
    } else {
        target = interaction.member.user;
    }
    const warnings = db.find({"target": target.id})

    const embed = new EmbedBuilder()
        .setColor(0xA7DB7D)
        .setTitle(`Warnings: ${target.tag} (${target.id})`)

    for await (const warn of warnings) {
        const timestamp = new Date(warn.timestamp * 1000);

        if (warn.type === "warning") {
            embed.addFields({
                name: `[${warn.id}]: ${timestamp.getMonth()+1}-${timestamp.getDate()}-${timestamp.getFullYear()}`,
                value: `Moderator: <@${warn.moderator}>\nRule: ${warn.rule}\nReason: ${warn.explanation}\nEvidence: ${hyperlink("Click Here", warn.evidence)} `,
                inline: true
            })
        } else if(warn.type === "drown") {
            embed.addFields({
                name: `[DROWN]: ${timestamp.getMonth()+1}-${timestamp.getDate()}-${timestamp.getFullYear()}`,
                value: `Moderator: <@${warn.moderator}>\nReason: ${warn.explanation}`,
                inline: true
            })
        }

    }

    try {
        await interaction.reply({embeds: [embed], flags: MessageFlags.Ephemeral})
    } catch (e) {
        console.warn("Error while checking warns for "+target.id)
        console.error(e);
    }
}

export {data, execute, inDev}