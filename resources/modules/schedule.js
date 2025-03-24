import database from "../../database.js";
import config from "../../config.json" with {type: 'json'};
import "discord.js"
import {v4 as uuid} from "uuid";

const schedules = await database.fetchDatabase("scheduled")

export async function run(client) {

    setInterval(async() => {
        const list = schedules.find({action:"remove-role"})
        for await (const schedule of list) {
            console.log((Date.now()/1000) +" - "+schedule.trigger)
            if((Date.now() / 1000) >= schedule.trigger) {
                const guild = client.guilds.cache.get(config.guildID)
                const member = guild.members.cache.get(schedule.target)
                await member.roles.remove(guild.roles.cache.find(role => role.name === schedule.role))
                await schedules.deleteOne({id: schedule.id})
            }
        }
    }, 5000)
}

export async function schedule(data) {
    data.id = uuid()
    await schedules.insertOne(data)
}
