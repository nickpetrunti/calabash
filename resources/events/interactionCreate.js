import {Events, Message, MessageFlags, EmbedBuilder, hyperlink, bold } from "discord.js"
import {MongoClient} from "mongodb";
import config from '../../config.json' with {type: 'json'}
import database from "../../database.js";

const name = Events.InteractionCreate
async function execute(interaction) {
    if (interaction.isChatInputCommand() || interaction.isUserContextMenuCommand()) {
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
       // ignore for now?
    }


}

export {name, execute}