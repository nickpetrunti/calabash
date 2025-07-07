import fetch from "node-fetch";
import JSONbig from "json-bigint"
import {
    ContainerBuilder,
    SlashCommandBuilder,
    TextDisplayBuilder,
    SectionBuilder,
    SeparatorSpacingSize,
    MessageFlags,
    ThumbnailBuilder, EmbedBuilder, bold, hyperlink
} from "discord.js";
import {container} from "../embeds/calabash-release.js";
import config from "../../config.json";

const inDev = false;
const commandType = "info"
const data = new SlashCommandBuilder()
    .setName("container")
    .setDescription("Dynamically generates an embed container based on provided JSON data")
    .addStringOption(option =>
        option
            .setName("json")
            .setDescription("URL of the JSON data file")
            .setRequired(true))

async function execute(interaction) {
    try {
        const dataURL = interaction.options.getString("json");
        const dataFetch = await fetch(dataURL);
        const dataBuffer = await dataFetch.buffer();
        const dataString = dataBuffer.toString();
        const data = JSONbig.parse(dataString)
        const container = new ContainerBuilder()


        Object.keys(data).forEach((key) => {
            const sectionData = data[key];
            if (sectionData.type === "text") {
                if(!sectionData.image) {
                    container.addTextDisplayComponents(new TextDisplayBuilder().setContent(sectionData.content.join("\n")))
                } else {
                    const section = new SectionBuilder()
                        .addTextDisplayComponents(new TextDisplayBuilder().setContent(sectionData.content.join("\n")))
                        .setThumbnailAccessory(new ThumbnailBuilder({
                            description: "image",
                            media: {
                                url: sectionData.image
                            }
                        }))
                    container.addSectionComponents(section)
                }
            } else if(sectionData.type === "separator-large") {
                container.addSeparatorComponents(separator => separator.setSpacing(SeparatorSpacingSize.Large));
            } else if(sectionData.type === "separator-small") {
                container.addSeparatorComponents(separator => separator.setSpacing(SeparatorSpacingSize.Small));
            }
        })

        const message = await interaction.channel.send({components: [container], flags: MessageFlags.IsComponentsV2})
        await interaction.reply({content: "Successfully posted container.", flags:[MessageFlags.Ephemeral]})




    } catch(e) {
        await interaction.reply({content: "There was an error while parsing the JSON data.", flags:[MessageFlags.Ephemeral]})
    }

}


export {data, execute, inDev, commandType}