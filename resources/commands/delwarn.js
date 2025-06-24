import { SlashCommandBuilder, TextInputStyle, PermissionFlagsBits, MessageFlags, EmbedBuilder, bold } from "discord.js";
import database from "../modules/database.js";
import config from "../../config.json" with {type:"json"};

const inDev = false

const commandType = "moderation";

const data = new SlashCommandBuilder()
    .setName("delwarn")
    .setDescription("Purges a warning")
    .addStringOption(option =>
        option
            .setName("warn-id")
            .setDescription("The warning ID you wish to purge")
            .setRequired(true))

async function execute(interaction) {
    const warningDB = await database.fetchDatabase("warnings");
    const warnID = interaction.options.getString("warn-id");

    await warningDB.deleteOne({_id: parseInt(warnID)});
    await warningDB.deleteOne({id: parseInt(warnID)});

    await interaction.reply({content: `Successfully purged warning #${warnID}`, flags:[MessageFlags.Ephemeral]})
}

export {data, execute, inDev, commandType}