import { SlashCommandBuilder,  ModalBuilder, ActionRowBuilder, TextInputBuilder, TextInputStyle, PermissionFlagsBits, MessageFlags } from "discord.js";
import database from "../../database.js";
import JSONbig from "json-bigint"
const inDev = true

const data = new SlashCommandBuilder()
    .setName("transfer")
    .setDescription("Transfer warns from Carl")
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
    .addUserOption(option =>
        option
            .setName("target")
            .setDescription("User to apply warnings to")
            .setRequired(true))

async function execute(interaction) {
    const target = interaction.options.getUser("target");

    const modal = new ModalBuilder()
        .setCustomId(`transferModal-${interaction.member.user.id}`)
        .setTitle("Warning Transfer")

    const transferData = new TextInputBuilder()
        .setCustomId("transferModalData")
        .setLabel("Warning Data")
        .setStyle(TextInputStyle.Paragraph)

    const dataRow = new ActionRowBuilder().addComponents(transferData);

    modal.addComponents(dataRow)

    await interaction.showModal(modal)

    const filter = (interaction) => interaction.customId === `transferModal-${interaction.member.user.id}`;
    interaction
        .awaitModalSubmit({filter, time:30_000})
        .then(async(modalSubmission) => {
            const data = modalSubmission.fields.getTextInputValue("transferModalData")

            const db = await database.fetchDatabase("warnings")
            for (let raw of data.split("},")) {
                let warnID = await db.findOne({title: "warnID"})
                warnID = warnID.value;
                warnID+=1
                await db.updateOne({title: "warnID"}, {$set: {value: warnID}})
                if(!raw.endsWith("}")) {raw = raw+"}"}
                const warn = JSONbig.parse(raw)
                        try {
                    console.log(raw)
                            const warningsDB = await database.fetchDatabase("warnings")

                            let timestampData = warn.timestamp.split("T")[0].split("-")
                            if (timestampData[2].includes("0")) { timestampData[2] = timestampData[2].replaceAll("0","")}
                            const timestamp = Math.floor(new Date(timestampData[0],timestampData[1]-1,timestampData[2]).getTime() / 1000)

                            let targetId = warn.offender_id

                            let modId = warn.moderator_id
                            await warningsDB.insertOne({
                                target: targetId.toString(),
                                rule: "N/A",
                                explanation: warn.reason,
                                evidence: "N/A",
                                timestamp: timestamp,
                                moderator: modId.toString(),
                                id: warnID,
                                type: "warning"
                            })
                        } catch(e) {
                            console.error(e)
                        }
            }



            await modalSubmission.reply({content:`Successfully imported ${data.split("},").length} warnings from <@${target.id}>`, flags:[MessageFlags.Ephemeral]})

        })

}

export {data, execute, inDev}