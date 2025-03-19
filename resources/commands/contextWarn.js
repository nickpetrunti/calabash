import { TextInputStyle, PermissionFlagsBits, ContextMenuCommandBuilder, ApplicationCommandType } from "discord.js";
const inDev = true
import {execute as runitup} from "./warn.js";

const data = new ContextMenuCommandBuilder()
    .setName("Warn")
    .setType(ApplicationCommandType.User)

async function execute(interaction) {
    runitup(interaction);
}

export {data, execute, inDev}