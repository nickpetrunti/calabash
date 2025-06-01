import {Events, MessageFlags, hyperlink, bold} from "discord.js"
import config from '../../config.json' with {type: 'json'}
const name = Events.MessageCreate

// MODULES
import {smartabash, speakabash, lookabash, makeabash} from "../modules/calabash-ai.js"

let whitelistAI = ["1265688654240678010", "1265318758931501076", "1174253869228884008"]

async function execute(message) {
    try {
        const reference = message.reference;
        if (reference) {return}
        if(message.mentions.has(message.client.user.id) && message.author.id !== message.client.user.id) {
            try {
                message.reply({content: "hello"})
            } catch {
                return;
            }
        } else if(message.mentions.has("1080875443873398918")) {
            //     try {
            //         message.reply({content: `${hyperlink(bold("inteque is a fraud"), "https://www.youtube.com/watch?v=QbYtXxMcTWs&pp=ygUPaW50ZXF1ZSBleHBvc2Vk")}`});
            //     } catch {
            //         return;
            //     }
        } else if(message.content.toLowerCase().includes("smartabash, ")) {
            for (const roleID of whitelistAI) {
                if(message.member.roles.cache.has(roleID)) {
                    await smartabash(message)
                    return
                }
            }
        } else if(config.whitelist.includes(message.author.id) && message.content.toLowerCase().includes("speakabash, ")) {
            await speakabash(message)
        } else if(config.whitelist.includes(message.author.id) && message.content.includes("lookabash, ")) {
            await lookabash(message)
        } else if(config.whitelist.includes(message.author.id) && message.content.includes("makeabash, ")) {
            await makeabash(message)
        }
    } catch(e) {
        console.warn(e)
    }
}

export {name,execute}