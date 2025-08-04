import {
    ContainerBuilder,
    SlashCommandBuilder,
    TextDisplayBuilder,
    SectionBuilder,
    SeparatorSpacingSize,
    ButtonBuilder,
    ButtonStyle,
    MessageFlags, ThumbnailBuilder
} from "discord.js";
import path from "path";
import { fileURLToPath } from 'url';

const embedName = path.basename(fileURLToPath(import.meta.url), ".js")

const container = new ContainerBuilder()

// HEADER
container.addSectionComponents(new SectionBuilder()
    .addTextDisplayComponents(new TextDisplayBuilder().setContent([
        '## Deepwoken Info: Staff Procedures',
        'Failure to abide by these standards will result in punishment, and potentially demotion.',
        `-# Updated as of <t:${Math.floor(new Date().getTime() / 1000)}:f>`,
    ].join("\n")))
    .setThumbnailAccessory(new ThumbnailBuilder({
        description: "Calabash",
        media: {
            url: "https://cdn.discordapp.com/attachments/1354186582491398314/1387993996445487134/DWIgif.gif?ex=68600664&is=685eb4e4&hm=bbc801ba98ff90fd497fbbf582deea981bf9bcf423656fe5057df12cee3fbe59&"
        }
    }))
)

// DIVIDER
container.addSeparatorComponents(separator => separator.setSpacing(SeparatorSpacingSize.Large));

// EXPECTATIONS
container.addTextDisplayComponents(new TextDisplayBuilder().setContent([
    "# Staff Expectations",
    "**1.** All staff must follow the rules outlined in <#883841673241706538>",
    "**2.** Posts in <#883840765644660736> and <#888259230082146385> must remain strictly on-topic, avoiding banter.",
    "**3.** Repeatedly misusing moderation tools for unofficial purposes will result in a strike.",
    "**4.** Moderators found to be ignoring rule violations due to bias will be given a strike.",
    "**5.** All official mod actions must be done via <@&1350929117154902136>",
    "**6.** Any promotion or demotion must be logged in <#973778696500563978>",
    "**7.** Staff must refrain from scamming users in any Deepwoken server, or in game."
].join("\n")))

// DIVIDER
container.addSeparatorComponents(separator => separator.setSpacing(SeparatorSpacingSize.Large));

// DIVIDER
container.addSeparatorComponents(separator => separator.setSpacing(SeparatorSpacingSize.Large));

// RETIREMENT
container.addTextDisplayComponents(new TextDisplayBuilder().setContent([
    "# Staff Retirement & Demotion",
    "**1.** Staff may retire at any time",
    "**2.** If a staff member wishes to exit retirement, they may be granted a one-time courtesy of reinstatement at the rank below their previous.",
].join("\n")))

// DIVIDER
container.addSeparatorComponents(separator => separator.setSpacing(SeparatorSpacingSize.Large));

// STRIKES
container.addTextDisplayComponents(new TextDisplayBuilder().setContent([
    "# Staff Strikes",
    "Accumulation of two or more staff strikes will result in demotion. Extreme cases may be handled quicker.",
].join("\n")))

export {container, embedName}
