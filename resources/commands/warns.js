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
import config from "../../config.json" with {type: "json"};
const inDev = false

const data = new SlashCommandBuilder()
    .setName("warns2")
    .setDescription("Lists a users warnings")
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

    if(target.id !== interaction.member.user.id && !interaction.member.roles.cache.get(config.moderatorRoleID)) {
        await interaction.reply({content:"You lack the permissions to view this users warnings.",flags:[MessageFlags.Ephemeral]})
        return
    }

    const warnings = db.find({"target": target.id})

    const embed = new EmbedBuilder()
        .setColor(0xA7DB7D)
        .setTitle(`Warnings: ${target.tag} (${target.id})`)

    let description = "";

    for await (const warn of warnings) {
        const timestamp = new Date(warn.timestamp * 1000);

        if (warn.type === "warning") {
            if (warn.rule === "N/A" && warn.evidence === "N/A") {
                /*
                embed.addFields({
                    name: `[${warn.id}]: ${timestamp.getMonth()+1}-${timestamp.getDate()}-${timestamp.getFullYear()}`,
                    value: `Moderator: <@${warn.moderator}>\nReason: ${warn.explanation}`,
                    inline: true
                })
                 */

                description+=`${bold(`[${warn.id}]: ${timestamp.getMonth()+1}-${timestamp.getDate()}-${timestamp.getFullYear()}`)}\nModerator: <@${warn.moderator}>\nReason: ${warn.explanation}\n\n`
            } else {
                /*
                embed.addFields({
                    name: `[${warn.id}]: ${timestamp.getMonth()+1}-${timestamp.getDate()}-${timestamp.getFullYear()}`,
                    value: `Moderator: <@${warn.moderator}>\nRule: ${warn.rule}\nReason: ${warn.explanation}\nEvidence: ${hyperlink("Click Here", warn.evidence)} `,
                    inline: true
                })
                 */
                description+=`${bold(`[${warn.id}]: ${timestamp.getMonth()+1}-${timestamp.getDate()}-${timestamp.getFullYear()}`)}\nModerator: <@${warn.moderator}>\nRule: ${warn.rule}\nReason: ${warn.explanation}\nEvidence: ${hyperlink("Click Here", warn.evidence)}\n\n`
            }
        } else if(warn.type === "drown") {
            /*
            embed.addFields({
                name: ``,
                value: `Moderator: <@${warn.moderator}>\nReason: ${warn.explanation}`,
                inline: true
            })
             */
            description+=`${bold(`[DROWN]: ${timestamp.getMonth()+1}-${timestamp.getDate()}-${timestamp.getFullYear()}`)}\nModerator: <@${warn.moderator}>\nReason: ${warn.explanation}\n\n`
        } else if(warn.type === "ban") {
            /*
            embed.addFields({
                name: `[BAN]: ${timestamp.getMonth()+1}-${timestamp.getDate()}-${timestamp.getFullYear()}`,
                value: `Moderator: <@${warn.moderator}>\nReason: ${warn.explanation}`,
                inline: true
            })
             */
            description+=`${bold(`[BAN]: ${timestamp.getMonth()+1}-${timestamp.getDate()}-${timestamp.getFullYear()}`)}\nModerator: <@${warn.moderator}>\nReason: ${warn.explanation}\n\n`
        }

    }

    embed.setDescription(description)

    try {
        await interaction.reply({embeds: [embed], flags: MessageFlags.Ephemeral})
    } catch (e) {
        console.warn("Error while checking warns for "+target.id)
        console.error(e);
    }
}

export {data, execute, inDev}