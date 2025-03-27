import {
    SlashCommandBuilder,
    TextInputStyle,
    PermissionFlagsBits,
    MessageFlags,
    EmbedBuilder, bold, hyperlink
} from "discord.js";
import database from "../../database.js";
import config from "../../config.json" with {type: "json"};
import {schedule} from "../modules/schedule.js";
const inDev = false
const commandType = "moderation";

const data = new SlashCommandBuilder()
    .setName("undrown")
    .setDescription("Undrowns a user")
    .addUserOption(option =>
        option
            .setName("target")
            .setDescription("User to undrown")
            .setRequired(true))
async function execute(interaction) {
//    if(!interaction.member.roles.cache.has("1011510257232646164") && !interaction.member.permissions.has(PermissionFlagsBits.ManageMessages, true)) return;

    const target = interaction.options.getUser("target");
    const reason = interaction.options.getString("reason");
    const duration = interaction.options.getString("duration").toLowerCase();

    const targetMember = interaction.guild.members.cache.get(target.id);

     if(!targetMember.roles.cache.find(role => role.name === "drowned")) {
         await interaction.reply({content: `<@${target.id}> is not drowned.`, flags:[MessageFlags.Ephemeral]})
         return;
     }

     try {
         targetMember.roles.remove(interaction.guild.roles.cache.find(role => role.name === "drowned"))
         await interaction.reply({content: `Successfully drowned <@${target.id}> `, flags:[MessageFlags.Ephemeral]})
     } catch (e) {
         console.error(e)
     }

}

export {data, execute, inDev, commandType}