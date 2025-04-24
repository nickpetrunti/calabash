import { Client, Events, GatewayIntentBits, Collection, } from 'discord.js';
import {run as startSchedule} from "./resources/modules/schedule.js";
import config from './config.json' with {type: 'json'}
import fs from "node:fs";
import {Initialize} from "./handler.js"

const client = new Client({intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent]});
client.commands = new Collection();

client.on(Events.ClientReady, activeClient => {
   Initialize()
   console.log(`Successfully authenticated as ${activeClient.user.tag}.`)
//   client.guilds.cache.get(config.guildID).channels.cache.get("1297365478347378769").send({content: "im awake"})
});

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
