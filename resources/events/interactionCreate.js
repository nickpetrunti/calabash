import {Events, Message, MessageFlags, EmbedBuilder, hyperlink, bold } from "discord.js"
import {MongoClient} from "mongodb";
import config from '../../config.json' with {type: 'json'}
import database from "../../database.js";

const name = Events.InteractionCreate
async function execute(interaction) {
    if (interaction.isChatInputCommand()) {
        //# Chat Input Interaction
        const command = interaction.client.commands.get(interaction.commandName);

        if (!command) {
            console.log(`Invalid Command Executed: ${interaction.commandName}`);
            return;
        }

        if (command.inDev) {
            if (config.whitelist && config.whitelist.indexOf(interaction.user.id) === -1) {
                interaction.reply({content: "You are not whitelisted.", flags: MessageFlags.Ephemeral})
                return;
            }
        }

        try {
            await command.execute(interaction);
        } catch(error) {
            console.error(error);
            if (interaction.replied || interaction.deferred) {
                await interaction.followUp({ content: 'There was an error while executing this command!', flags: MessageFlags.Ephemeral });
            } else {
                await interaction.reply({ content: 'There was an error while executing this command!', flags: MessageFlags.Ephemeral });
            }
        }
        //# End Chat input Interaction
    } else if(interaction.isModalSubmit()) {
        //# Modal Input Submission
        if (interaction.customId == "warningModal") {
            //# Warning

            const target = interaction.fields.getTextInputValue("warningModalTarget");
            const rule = interaction.fields.getTextInputValue("warningModalRule");
            const explanation = interaction.fields.getTextInputValue("warningModalExplanation");
            const evidence = interaction.fields.getTextInputValue("warningModalEvidence");
            const timestamp = Math.floor(Date.now() / 1000);
            const moderatorID = interaction.member.user.id;

            const db = await database.fetchDatabase("warnings")

            let warnID = await db.findOne({title: "warnID"})
            warnID = warnID.value;
            warnID+=1
            await db.updateOne({title: "warnID"}, {$set: {value: warnID}})

            await db.insertOne({
                target: target,
                rule: rule,
                explanation: explanation,
                evidence: evidence,
                timestamp: timestamp,
                moderator: moderatorID,
                id: warnID
            })

            await interaction.reply({content: "Warning successfuly submitted.", flags: MessageFlags.Ephemeral});

            const logEmbed = new EmbedBuilder()
                .setColor(0xFF804A)
                .setTitle(`Warning [${warnID}]`)
                .setDescription(`${bold("Offender")}: <@${target}>\n${bold("Reason")}: ${explanation}\n${bold("Evidence")}: ${hyperlink("Click Here", evidence)}`)
                .setFooter({text: `${interaction.member.user.tag}`, iconURL: interaction.member.user.avatarURL()})
                .setTimestamp()

            try {
                interaction.client.guilds.cache.get("883838743172218891").channels.cache.get(config.warnLogsID).send({embeds: [logEmbed]})
            } catch (e) {console.error(e)}


        }
        //# End Modal Input Submission
    }


}

export {name, execute}