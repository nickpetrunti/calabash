import {REST, Routes } from "discord.js"
import fs from "node:fs";
const commands = [];

import config from './config.json' with {type: 'json'}

const files = fs.readdirSync("./resources/commands/").filter(file => file.endsWith('.js'), {withFileTypes: true});
const rest = new REST().setToken(config.Token);

(async () => {
    await (async () => {
        const promises = files.map(async(file) => {
            const command = await import(`./resources/commands/${file}`);
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

            console.log(`Successfully reloaded ${result.length} application (/) commands.`);
        } catch (error) {
            console.error(error);
        }

        try {
            const cmd = await import(`./resources/commands/calabash.js`)
            const cmd2 = await import(`./resources/commands/pomar.js`)
            rest.put(Routes.applicationGuildCommands( config.clientID, "883838743172218891"), {body: [cmd.data.toJSON(), cmd2.data.toJSON()]});
        } catch (error) {
            console.error(error);
        }
    })();
})();