import { SlashCommandBuilder, TextInputStyle, PermissionFlagsBits, MessageFlags, EmbedBuilder, bold } from "discord.js";
import database from "../modules/database.js";
import {ObjectId} from "mongodb";
import {update} from "../modules/elo.js";
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




    let res;
    if(warnID.length === 24) {
        const warning = await warningDB.findOne({_id: new ObjectId(warnID)})
        await update({id: warning.moderator}, -5)
        res = await warningDB.deleteOne({_id: new ObjectId(warnID)});
    } else {
        const warning = await warningDB.findOne({id: parseInt(warnID)})
        await update({id: warning.moderator}, -15)
        res = await warningDB.deleteOne({id: parseInt(warnID)});
    }
    if (res.deletedCount > 0) {
        await interaction.reply({content: `Successfully purged warning #${warnID}`, flags:[MessageFlags.Ephemeral]})

    } else {
        await interaction.reply({content:"Unable to find a warning matching that ID.", flags:[MessageFlags.Ephemeral]})

    }



}

export {data, execute, inDev, commandType}