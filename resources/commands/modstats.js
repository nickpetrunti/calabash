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
    hyperlink, ContainerBuilder, SectionBuilder, TextDisplayBuilder, ThumbnailBuilder, SeparatorSpacingSize
} from "discord.js";
import {check} from "../modules/elo.js"
import database from "../modules/database.js";
import config from "../../config.json" with {type: "json"};
const inDev = false
const commandType = "moderation";

const data = new SlashCommandBuilder()
    .setName("modstats")
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

    const cases = db.find({"moderator": target.id})
    let warns = 0;
    let bans = 0;
    let drowns = 0;

    for await (const event of cases) {
        if (event.type === "warning") {warns++}
        else if (event.type === "drown") {drowns++}
        else if (event.type === "ban") {bans++}
    }

    const elo = await check(target)

    const container = new ContainerBuilder()
    container.setAccentColor(0x40C79E)
    container.addSectionComponents(new SectionBuilder()
        .addTextDisplayComponents(new TextDisplayBuilder().setContent([
            `# Moderator Stats: <@${target.id}>`,
            `**ELO: ** \`\`${elo}\`\``,
            `**Warnings: **\`\`${warns}\`\``,
            `**Drowns: **\`\`${drowns}\`\``,
            `**Bans: **\`\`${bans}\`\``
        ].join("\n")))
        .setThumbnailAccessory(new ThumbnailBuilder({
            description: "gurt",
            media: {
                url: target.avatarURL()
            }
        }))
    )


    try {
        await interaction.reply({components: [container], flags: MessageFlags.IsComponentsV2})
    } catch (e) {
        console.warn("Error while viewing cases for "+target.id)
        console.warn(e);
    }
}

export {data, execute, inDev, commandType}