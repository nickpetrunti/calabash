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
import database from "../modules/database.js";
import config from "../../config.json" with {type: "json"};
const inDev = true
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
        console.log(event)
        if (event.type === "warning") {warns++}
        else if (event.type === "drown") {drowns++}
        else if (event.type === "ban") {bans++}
    }

    const elo = ((warns*10) + (bans*25) + (drowns*5)) + 500

    const container = new ContainerBuilder()
    container.setAccentColor(0x40C79E)


        container.addTextDisplayComponents(new TextDisplayBuilder().setContent([
            `# Moderator Stats: <@${target.id}>`,
            `**ELO: ** \`\`${elo}\`\``
        ].join("\n")))


    container.addSeparatorComponents(separator => separator.setSpacing(SeparatorSpacingSize.Large));


    container.addTextDisplayComponents(new TextDisplayBuilder().setContent([
        `**Warnings: **${warns}`,
        `**Drowns: **${drowns}`,
        `**Bans: **${bans}`
    ].join("\n")))


    try {
        await interaction.reply({components: [container], flags: MessageFlags.IsComponentsV2})
    } catch (e) {
        console.warn("Error while viewing cases for "+target.id)
        console.warn(e);
    }
}

export {data, execute, inDev, commandType}