import database from "./database.js";
import config from "../../config.json" with {type: 'json'};
import "discord.js"
import {v4 as uuid} from "uuid";
import {bold, EmbedBuilder} from "discord.js";

const schedules = await database.fetchDatabase("scheduled")

export async function run(client) {


    setInterval(async() => {
        const list = schedules.find({action:"remove-role"})
        for await (const schedule of list) {
            if((Date.now() / 1000) >= schedule.trigger) {
                const guild = client.guilds.cache.get(config.guildID)
                const member = guild.members.cache.get(schedule.target)
                try {
                    await member.roles.remove(guild.roles.cache.find(role => role.name === schedule.role))

                    const logEmbed = new EmbedBuilder()
                        .setColor(0x66FFA6)
                        .setTitle(`Undrown [${member.id}]`)
                        .setDescription(`${bold("Offender")}: <@${member.id}>\n${bold("Reason")}: Automated Undrown\n${bold("Duration")}: ${duration}`)
                        .setFooter({text: `${client.user.tag}`, iconURL: client.user.avatarURL()})
                        .setTimestamp()
                    await guild.channels.cache.get(config.warnLogsID).send({embeds:[logEmbed]});
                } catch(e) {await schedules.deleteOne({id: schedule.id}); console.log("Unable to remove Drowned Role"); console.warn(e)}
                await schedules.deleteOne({id: schedule.id})
                    .catch(e=>{console.warn(e)})
            }
        }
    }, 5000)
}

export async function schedule(data) {
    data.id = uuid()
    await schedules.insertOne(data)
}
