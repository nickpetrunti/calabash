import {Events, MessageFlags, hyperlink, bold} from "discord.js"
import config from '../../config.json' with {type: 'json'}

const name = Events.MessageCreate
async function execute(message) {
    const reference = message.reference;
    if (reference) {return}
    if(message.mentions.has(message.client.user.id) && message.author.id !== message.client.user.id) {
        try {
            message.reply({content: "hello"})
        } catch {
            return;
        }
    } else if(message.mentions.has("1080875443873398918")) {
        try {
            message.reply({content: `${hyperlink(bold("inteque is a fraud"), "https://www.youtube.com/watch?v=QbYtXxMcTWs&pp=ygUPaW50ZXF1ZSBleHBvc2Vk")}`});
        } catch {
            return;
        }
    }
}

export {name,execute}