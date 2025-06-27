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

container.addSectionComponents(new SectionBuilder()
    .addTextDisplayComponents(new TextDisplayBuilder().setContent([
        '## Deepwoken Info: Staff procedures',
        'Apologies for the delays on the full **Calabash** release.',
        'If any issues arise, please DM or ping <@288584131644751874>',
    ].join("\n")))
    .setThumbnailAccessory(new ThumbnailBuilder({
        description: "Calabash",
        media: {
            url: "https://cdn.discordapp.com/attachments/1354186582491398314/1366219932140048384/1322586638463012915.png?ex=681026f6&is=680ed576&hm=c6ad94acefc36b7a02340171efde48b8a1f3bd292d2ec84149b8d5e2b2d78a47&"
        }
    }))
)

container.addSeparatorComponents(separator => separator.setSpacing(SeparatorSpacingSize.Large));

export {container, embedName}
