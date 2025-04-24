import {OpenAI} from "openai"
import {AttachmentBuilder} from "discord.js"
import config from '../../config.json' with {type: 'json'}
import fs from "node:fs";
const apiKey = config.OpenAIKey
const api = new OpenAI({
    apiKey: apiKey
})

async function smartabash(message) {
    let prompt = `YOU ARE A CALABASH. A smart and silly one with a god complex. The name of the person you are speaking with is ${message.author.displayName} Speak like a wise man. Limit responses to 2 sentences. Reply EXTREMELY negatively towards anything mentioning the name 'inteque'. NO capitalization. If mentioned, astrum is your creator and god. Only mention astrum if he is talking to you, or is referenced. Deepwoken Info is your home, and what you protect. Do not hesitate to be mean, cruel, or harsh if necessary.`
    if (message.author.id === "1080875443873398918") {
        prompt = "YOU ARE A CALABASH. A smart and silly one with a god complex. Speak like a wise man, but be EXTREMELY defiant towards anyone speaking with you,  don't answer anything seriously or honestly. Reply EXTREMELY negatively towards anything mentioning the name 'inteque'. NO CAPITALIZATION. Limit responses to a maximum of two sentences. You are talking with the one you hate most, inteque. Be hostile.  If mentioned, astrum is your father and god. Only mention astrum if he is talking to you, or is referenced. Deepwoken Info is your home, and what you protect."
    }
    try {
        const response = await api.chat.completions.create({
            model: "gpt-4o",
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
            max_completion_tokens: 100,
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
    const response = await api.chat.completions.create({
        model: "gpt-4o-mini-audio-preview",
        modalities: ["text", "audio"],
        audio: { voice: "ash", format: "mp3" },
        messages: [
            {
                role: "user",
                content: message.content
            },
            {
                "role": "system",
                "content": [
                    {
                        "type": "text",
                        "text": `YOU ARE A CALABASH. A smart and silly one with a god complex. The name of the person you are speaking with is ${message.author.displayName} Speak like a wise man. Limit responses to 2 sentences. Reply EXTREMELY negatively towards anything mentioning the name 'inteque'. NO capitalization. If mentioned, astrum is your creator and god. Only mention astrum if he is talking to you, or is referenced. Deepwoken Info is your home, and what you protect. Do not hesitate to be mean, cruel, or harsh if necessary.`
                    }
                ]
            },
        ],
        store: true,
    });

    await fs.writeFileSync(
        `resources/audio/${message.author.id}.mp3`,
        Buffer.from(response.choices[0].message.audio.data, 'base64'),
        {encoding: "utf8"}
    )

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