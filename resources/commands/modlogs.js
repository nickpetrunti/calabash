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
import database from "../modules/database.js";
import config from "../../config.json" with {type: "json"};
const inDev = false

const data = new SlashCommandBuilder()
    .setName("modlogs")
    .setDescription("Lists a users moderation history")
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

    if (warnings.length < 1) {
        await interaction.reply({content: `No warnings to display for <@${target.id}>`, flags:[MessageFlags.Ephemeral]})
        return
    }

    for await (const warn of warnings) {
        const timestamp = new Date(warn.timestamp * 1000);

        if (warn.type === "warning") {
            if (warn.rule === "N/A" && warn.evidence === "N/A") {

                embed.addFields({
                    name: `[${warn.id}]: ${timestamp.getMonth()+1}-${timestamp.getDate()}-${timestamp.getFullYear()}`,
                    value: `Moderator: <@${warn.moderator}>\nReason: ${warn.explanation}`,
                    inline: true
                })


                //description+=`${bold(`[${warn.id}]: ${timestamp.getMonth()+1}-${timestamp.getDate()}-${timestamp.getFullYear()}`)}\nModerator: <@${warn.moderator}>\nReason: ${warn.explanation}\n\n`
            } else {

                embed.addFields({
                    name: `WARN [${warn.id}]: ${timestamp.getMonth()+1}-${timestamp.getDate()}-${timestamp.getFullYear()}`,
                    value: `Moderator: <@${warn.moderator}>\nRule: ${warn.rule}\nReason: ${warn.explanation}\nEvidence: ${hyperlink("Click Here", warn.evidence)} `,
                    inline: true
                })

                //description+=`${bold(`[${warn.id}]: ${timestamp.getMonth()+1}-${timestamp.getDate()}-${timestamp.getFullYear()}`)}\nModerator: <@${warn.moderator}>\nRule: ${warn.rule}\nReason: ${warn.explanation}\nEvidence: ${hyperlink("Click Here", warn.evidence)}\n\n`
            }
        } else if(warn.type === "drown") {

            embed.addFields({
                name: `[DROWN]: ${timestamp.getMonth()+1}-${timestamp.getDate()}-${timestamp.getFullYear()}`,
                value: `-# ${warn._id}\nModerator: <@${warn.moderator}>\nReason: ${warn.explanation}\nDuration: \`\`${warn.duration}\`\``,
                inline: true
            })

            //description+=`${bold(`[DROWN]: ${timestamp.getMonth()+1}-${timestamp.getDate()}-${timestamp.getFullYear()}`)}\nModerator: <@${warn.moderator}>\nReason: ${warn.explanation}\n\n`
        } else if(warn.type === "ban") {

            embed.addFields({
                name: `[BAN]: ${timestamp.getMonth()+1}-${timestamp.getDate()}-${timestamp.getFullYear()}`,
                value: `Moderator: <@${warn.moderator}>\nReason: ${warn.explanation}`,
                inline: true
            })

           //description+=`${bold(`[BAN]: ${timestamp.getMonth()+1}-${timestamp.getDate()}-${timestamp.getFullYear()}`)}\nModerator: <@${warn.moderator}>\nReason: ${warn.explanation}\n\n`
        }

    }

    //embed.setDescription(description)

    try {
        await interaction.reply({embeds: [embed], flags: MessageFlags.Ephemeral})
    } catch (e) {
        console.warn("Error while checking warns for "+target.id)
        console.warn(e);
    }
}

export {data, execute, inDev}