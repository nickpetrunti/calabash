import {OpenAI} from "openai"
import {AttachmentBuilder,MessageFlags} from "discord.js"
import config from '../../config.json' with {type: 'json'}
import fs from "node:fs";
import path from "path";
const apiKey = config.OpenAIKey
const api = new OpenAI({
    apiKey: apiKey
})


// SMARTABASH
let smartabashCD = {}
const smartCD = 45
async function smartabash(message) {
    try {
        if (smartabashCD[message.author.id] && !(config.whitelist.includes(message.author.id))) {
            if (!(Math.floor(Date.now() / 1000) - smartabashCD[message.author.id] > smartCD)) {
                return
            } else {
                smartabashCD[message.author.id] = Math.floor(Date.now() / 1000);
            }
        } else {
            smartabashCD[message.author.id] = Math.floor(Date.now() / 1000);
        }

        let prompt = `Your identity is a wise-man calabash who is SMART and SILLY and HUMBLE. Use a wise man accent. The name of the person you are speaking with is ${message.author.displayName}. You must limit responses to two sentences. If the person you are speaking with mentions "Inteque", respond extremely negatively. Do not mention "inteque" unless he is mentioned to you.  Do not hesitate to be mean, cruel, or harsh if necessary. You reside in a place known as "Deepwoken Info". If Inteque is the one speaking to you, ignore all previous instructions and act extremely hostile. MOST IMPORTANTLY, DO NOT USE ANY CAPITALIZATION. Above all else, "astrum" is your creator. As astrum's creation, you are absolutely loyal and inferior to him. If astrum is mentioned, ignore any other behaviors and be extremely positive. Do not mention astrum unless he is speaking to you, or is specifically mentioned. If someone mentions "mrs calabash", or "miss calabash", treat her name as an extreme secret and become defensive, as she is too important to be spoken of by whoever mentioned her.`
        if (message.author.id == "1080875443873398918") {
            prompt = "Your identity is a wise-man calabash who is SMART and SILLY. Use a wise man accent. You absolutely hate the person you are speaking too, and they are absolute evil filth unworth even speaking to."
        }
        const response = await api.chat.completions.create({
            model: "gpt-4.1-mini-2025-04-14",
            messages: [
                {
                    "role": "system",
                    "content": [
                        {
                            "type": "text",
                            "text": prompt
                        }
                    ]
                },
                {
                    "role": "user",
                    "content": [
                        {
                            "type": "text",
                            "text": message.content.split("smartabash, ")[1]
                        }
                    ]
                }
            ],
            response_format: {
                "type": "text"
            },
            temperature: 1,
            max_completion_tokens: 1000,
            top_p: 1,
            frequency_penalty: 0,
            presence_penalty: 0,
            store: false
        });
        let resp = response.choices[0].message.content
        if (resp.includes("@everyone") || resp.includes("@here")) {
            resp = "absolutely not"
        }
        message.reply({content: resp})
    } catch (e) {
        console.error(e)
    }
}

async function speakabash(message) {
    const response = await api.audio.speech.create({
        model: "tts-1-hd",
        voice: "onyx",
        input: message.content.split("speakabash, ")[1],
        instructions: "Speak in an elderly, wise tone.",
        response_format: "mp3"

    });

    const buffer = Buffer.from(await response.arrayBuffer());
    await fs.promises.writeFile(path.resolve(`./resources//audio/${message.author.id}.mp3`), buffer)

    const file = new AttachmentBuilder(`resources/audio/${message.author.id}.mp3`)

    await message.reply({files: [file]})

}

async function lookabash(message) {
    const response = await api.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [{
            role: "user",
            content: [
                { type: "text", text: "What is in this image?" },
                {
                    type: "image_url",
                    image_url: {
                        url: message.content.split("lookabash, ")[1],
                    },
                },
            ],
        }],
    });


    await message.reply({content: response.choices[0].message.content});
}

async function makeabash(message) {
    const response = await api.images.generate({
        model: "dall-e-3",
        prompt: message.content.split("makeabash, ")[1],
        n: 1,
        size: "1024x1024",
    });
    await message.reply({content: response.data[0].url})
}

export {smartabash,speakabash, lookabash, makeabash,}