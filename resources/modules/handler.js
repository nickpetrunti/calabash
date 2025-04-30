import {REST, Routes } from "discord.js"
import fs from "node:fs";
import chalk from "chalk";
import config from '../../config.json' with {type: 'json'}

const commands = [];
const files = fs.readdirSync("./resources/commands/").filter(file => file.endsWith('.js'), {withFileTypes: true});
const rest = new REST().setToken(config.Token);

function Initialize() {
     (async () => {
        await (async () => {
            const promises = files.map(async (file) => {
                const command = await import(`../commands/${file}`);
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
                console.error(error);
            }
        })();
    })();
}

export {Initialize}