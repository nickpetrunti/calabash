import {REST, Routes } from "discord.js"
import fs from "node:fs";
import chalk from "chalk";
import config from '../../config.json' with {type: 'json'}
import {data} from "../commands/embed.js";

const commands = [];
const files = fs.readdirSync("./resources/commands/").filter(file => file.endsWith('.js'), {withFileTypes: true});
const rest = new REST().setToken(config.Token);

function Initialize() {
     (async () => {
        await (async () => {
            const promises = files.map(async (file) => {
                const command = await import(`../commands/${file}`);

                // EMBED COMMAND CASE
                if(command.data.name === "embed") {
                    let choices = []
                    for (const file of fs.readdirSync("./resources/embeds/")) {
                        console.log(file)
                        const data = await import(`../embeds/${file}`)

                        choices.push({name: data.embedName, value: data.embedName})
                    }

                    data.addStringOption(option =>
                        option.setName("embed-name")
                            .setDescription("Name of the embed to send")
                            .setRequired(true)
                            .addChoices(...choices))
                }

                commands.push(command.data.toJSON());
            })

            await Promise.all(promises);
        })();
        await (async () => {
            try {
                const result = await rest.put(
                    Routes.applicationGuildCommands(config.clientID, config.guildID),
                    {body: commands}
                )

                console.log(`${chalk.hex("#ffde85").bold("COMMANDS LOADED: ")}${chalk.whiteBright.bold(result.length)}`)
            } catch (error) {
                console.warn(error);
            }
        })();
    })();
}

export {Initialize}