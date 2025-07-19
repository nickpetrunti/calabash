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
const inDev = true
const commandType = "moderation"
const disabled = false

const data = new SlashCommandBuilder()
    .setName("drownlogs")
    .setDescription("Lists all drowned users scheduled for an undrown")

async function execute(interaction) {
    const db = await database.fetchDatabase("warnings")
    const scheduled = db.find({"role": "drowned"})

    console.log(typeof(scheduled))
}

export {data, execute, inDev, commandType, disabled}