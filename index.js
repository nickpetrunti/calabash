import {
   Client,
   GatewayIntentBits,
   Collection,
} from 'discord.js';
import {run as startSchedule} from "./resources/modules/schedule.js";
import config from './config.json' with {type: 'json'}
import chalk from "chalk";
import fs from "node:fs";

const client = new Client({intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent, GatewayIntentBits.GuildVoiceStates]});
client.commands = new Collection();
client.version = "1.3.0"

const commandFiles = fs.readdirSync("./resources/commands/").filter(file => file.endsWith('.js'), {withFileTypes: true});
const eventFiles = fs.readdirSync("./resources/events/").filter(file => file.endsWith('.js'), {withFileTypes: true});

commandFiles.forEach(async(file) => {
   const command = await import(`./resources/commands/${file}`);
   client.commands.set(command.data.name, command);
});

eventFiles.forEach(async(file) => {
   const event = await import(`./resources/events/${file}`);

   client.on(event.name, (...args) => {
      event.execute(...args)
   });
})

process.stdin.on('data', (data) => {
   const general = client.guilds.cache.get(config.guildID).channels.cache.find(ch=>ch.id==="1297365478347378769")
   general.send(data.toString());
});

startSchedule(client);

client.login(config.Token)
