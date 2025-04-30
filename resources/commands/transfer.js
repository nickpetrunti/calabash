import { SlashCommandBuilder,  ModalBuilder, ActionRowBuilder, TextInputBuilder, TextInputStyle, PermissionFlagsBits, MessageFlags } from "discord.js";
import database from "../modules/database.js";
import JSONbig from "json-bigint"
import fetch from "node-fetch";

const inDev = false
const commandType = "moderation";
const data = new SlashCommandBuilder()
    .setName("transfer")
    .setDescription("Transfer warns from Carl")
    .addStringOption(option => option
        .setName("url")
        .setDescription("The URl of the moderation log")
        .setRequired(true))

async function execute(interaction) {
    const dataURL = interaction.options.getString("url");
    const dataFetch = await fetch(dataURL);
    const dataBuffer = await dataFetch.buffer();
    const dataString = dataBuffer.toString();
    const data = JSONbig.parse(dataString)

    let total = 0;
    let targetId = 0;
    try {
        const db = await database.fetchDatabase("warnings")
        for (const entry of data) {
            targetId = entry.offender_id.toString();
            if (entry.action === "warn") {
                if (await db.findOne({carlID: entry.case_id})) { continue }
                total++;
                let warnID = await db.findOne({title: "warnID"})
                warnID = warnID.value;
                warnID+=1
                await db.updateOne({title: "warnID"}, {$set: {value: warnID}})

                const warningsDB = await database.fetchDatabase("warnings")

                let timestampData = entry.timestamp.split("T")[0].split("-")
                if (timestampData[2].includes("0")) { timestampData[2] = timestampData[2].replaceAll("0","")}
                const timestamp = Math.floor(new Date(timestampData[0],timestampData[1]-1,timestampData[2]).getTime() / 1000)

                let modId = entry.moderator_id
                await warningsDB.insertOne({
                    target: targetId,
                    rule: "N/A",
                    explanation: entry.reason,
                    evidence: "N/A",
                    timestamp: timestamp,
                    moderator: modId.toString(),
                    id: warnID,
                    type: "warning",
                    carlID: entry.case_id
                })
            } else if(entry.action === "ban") {
                if (await db.findOne({carlID: entry.case_id})) { continue }
                total++;
                const warningsDB = await database.fetchDatabase("warnings")

                let timestampData = entry.timestamp.split("T")[0].split("-")
                if (timestampData[2].includes("0")) { timestampData[2] = timestampData[2].replaceAll("0","")}
                const timestamp = Math.floor(new Date(timestampData[0],timestampData[1]-1,timestampData[2]).getTime() / 1000)

                targetId = entry.offender_id.toString();

                let modId = entry.moderator_id
                await warningsDB.insertOne({
                    target: targetId,
                    explanation: entry.reason,
                    timestamp: timestamp,
                    moderator: modId.toString(),
                    type: "ban",
                    carlID: entry.case_id
                })
            }
        }
    } catch(e) {
        console.warn(e);
        await interaction.reply({content: "An error occurred while importing warnings.",flags:MessageFlags.Ephemeral})
    }

    await interaction.reply({content:`Successfully transferred **${total}** cases from **${targetId}**`, flags: MessageFlags.Ephemeral})

}

export {data, execute, inDev, commandType}