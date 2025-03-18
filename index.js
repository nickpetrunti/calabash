import { Client, Events, GatewayIntentBits, Collection, } from 'discord.js';
import config from './config.json' with {type: 'json'}
import fs from "node:fs";

const client = new Client({intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent]});
client.commands = new Collection();

client.on(Events.ClientReady, activeClient => {
   console.log(`Successfully authenticated as ${activeClient.user.tag}.`)
//   client.guilds.cache.get("883838743172218891").channels.cache.get("1297365478347378769").send({content: "im awake"})
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

client.login(config.Token)
