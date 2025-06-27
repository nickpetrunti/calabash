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
        '## Deepwoken Info v.23: The Moderation Update',
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

container.addTextDisplayComponents(new TextDisplayBuilder().setContent([
    '### Warning Pipeline',
    '**1.** Provide evidence in <#1354186582491398314>',
    "**2.** Copy the message link, then run `/warn <user>`",
    "**3.** Input the rule violated, explanation, and link to your message containing evidence",
    "-# This process can be more tedious, but allows us to better document warning history.",

    '### Removing Warnings',
    'To remove a warning, simply execute `/delwarn <id>`. A list of a users warnings can be found using `/warns <user>`'
].join("\n")))

container.addSeparatorComponents(separator => separator.setSpacing(SeparatorSpacingSize.Large));

container.addTextDisplayComponents(new TextDisplayBuilder().setContent([
    '### Drowning Pipeline',
    'Simply run `/drown <target> <reason> <duration>`',
    'To undrown, execute `/undrown <target>`'
].join("\n")))

container.addSeparatorComponents(separator => separator.setSpacing(SeparatorSpacingSize.Large));

container.addTextDisplayComponents(new TextDisplayBuilder().setContent([
    '### Carl-Bot Warning Transfer Pipeline',
    '**1.** Execute `/modlog export <target>` to generate a file containing their moderation history.',
    '**2.** Copy the link from the download button, then execute `/transfer <url>`, entering the previously copied URL.',
    '-# Please note that this will not duplicate warnings if you run the command on a user more than once.'
].join("\n")))

container.addSeparatorComponents(separator => separator.setSpacing(SeparatorSpacingSize.Large));

container.addTextDisplayComponents(new TextDisplayBuilder().setContent([
    '### Ban Pipeline',
    '**1.** Execute `/ban <user> <reason>`',
    '**2.** To unban a user, run `/unban <user>`'
].join("\n")))

export {container, embedName}
