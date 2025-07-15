import {
    SlashCommandBuilder,
    TextInputStyle,
    PermissionFlagsBits,
    MessageFlags,
    EmbedBuilder, bold, hyperlink
} from "discord.js";
import database from "../modules/database.js";
import config from "../../config.json" with {type: "json"};
import {schedule} from "../modules/schedule.js";
import chalk from "chalk";
import {update} from "../modules/elo.js";
const inDev = false
const commandType = "moderation";

const data = new SlashCommandBuilder()
    .setName("drown")
    .setDescription("Drowns a user")
    .addUserOption(option =>
        option
            .setName("target")
            .setDescription("User to drown")
            .setRequired(true))
    .addStringOption(option =>
        option
            .setName("reason")
            .setDescription("The reason the user is being drowned")
            .setRequired(true))
    .addStringOption(option =>
        option
            .setName("duration")
            .setDescription("The length of the drown")
            .setRequired(true))
async function execute(interaction) {

    const target = interaction.options.getUser("target");
    const reason = interaction.options.getString("reason");
    const duration = interaction.options.getString("duration").toLowerCase();

    const logEmbed = new EmbedBuilder()
        .setColor(0x66FFA6)
        .setTitle(`Drown [${target.id}]`)
        .setDescription(`${bold("Offender")}: <@${target.id}>\n${bold("Reason")}: ${reason}\n${bold("Duration")}: ${duration}`)
        .setFooter({text: `${interaction.member.user.tag}`, iconURL: interaction.member.user.avatarURL()})
        .setTimestamp()

     const targetMember = interaction.guild.members.cache.get(target.id);

     if(targetMember.roles.cache.find(role => role.name === "drowned")) {
         await interaction.reply({content: `<@${target.id}> is already drowned.`, flags:[MessageFlags.Ephemeral]})
         return;
     }

     // TIME VALIDATION
    let time = 0
    if(duration.endsWith("m")) {
        if(duration.split("m")[0] < 0 || duration.split("m")[0] > 365) {
            await interaction.reply({content: `Drown times must be between 1-365`,flags:[MessageFlags.Ephemeral]})
            return;
        }
        time = parseInt(duration.split("m")[0])*60
        if (duration.split("m")[0] < 5) {
            await update(interaction.member.user, -20)
        }
    } else if(duration.endsWith("h")) {
        if(duration.split("h")[0] < 0 || duration.split("h")[0] > 365) {
            await interaction.reply({content: `Drown times must be between 1-365`,flags:[MessageFlags.Ephemeral]})
            return;
        }
        time = parseInt(duration.split("h")[0])*60*60
        await update(interaction.member.user, 5)
    } else if (duration.endsWith("d")) {
        if(duration.split("d")[0] < 0 || duration.split("d")[0] > 365) {
            await interaction.reply({content: `Drown times must be between 1-365`,flags:[MessageFlags.Ephemeral]})
            return;
        }
        time = parseInt(duration.split("d")[0])*60*60*24
        await update(interaction.member.user, 5)
    } else {
        await interaction.reply({content: `Invalid time specified. (Use only **m/h/d** following the duration.)`, flags:[MessageFlags.Ephemeral]})
        return
    }

     try {
         const warningsDB = await database.fetchDatabase("warnings")
         console.log(chalk.rgb(97, 255, 139).bold(`DROWN: `)+chalk.underline.green(interaction.member.user.tag)+chalk.bold(" >>> ")+chalk.underline.green(target.tag))
         await warningsDB.insertOne({
             target: target.id,
             explanation: reason,
             duration: duration,
             timestamp: Math.floor(Date.now() / 1000),
             moderator: interaction.member.user.id,
             type: "drown"
         })
         await schedule({
             target: target.id,
             trigger: (Math.floor(Date.now() / 1000)) + time,
             action: "remove-role",
             role: "drowned"
         })

         targetMember.roles.add(interaction.guild.roles.cache.find(role => role.name === "drowned"))
         await interaction.reply({content: `Successfully drowned <@${target.id}> `})
         await interaction.guild.channels.cache.get(config.warnLogsID).send({embeds:[logEmbed]});

         const notifEmbed = new EmbedBuilder()
             .setColor(0x66FFA6)
             .setTitle(`You have been drowned in Deepwoken Info`)
             .setDescription(`${bold("Reason")}: ${reason}\n${bold("Duration")}: ${duration}`)
             .setTimestamp()

         target.send({embeds:[notifEmbed]})
             .catch(e => {})

     } catch (e) {
         console.warn(e)
     }

}

export {data, execute, inDev, commandType}