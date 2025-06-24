import { SlashCommandBuilder, TextInputStyle, PermissionFlagsBits, MessageFlags, EmbedBuilder, bold } from "discord.js";
import database from "../modules/database.js";
import {ObjectId} from "mongodb";
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

    console.log(await warningDB.findOne({"_id": new ObjectId(warnID)}));
    const res1 = await warningDB.deleteOne({_id: warnID});

    const res = await warningDB.deleteOne({id: parseInt(warnID)});

    console.log(res,res1)

    await interaction.reply({content: `Successfully purged warning #${warnID}`, flags:[MessageFlags.Ephemeral]})
}

export {data, execute, inDev, commandType}