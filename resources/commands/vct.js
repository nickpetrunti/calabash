import {
    SlashCommandBuilder,
    SeparatorSpacingSize,
    ButtonStyle,
    MessageFlags,
    PermissionFlagsBits
} from "discord.js";
import {
    createAudioPlayer,
    NoSubscriberBehavior,
    VoiceConnectionStatus,
    AudioPlayerStatus,
    joinVoiceChannel,
    getVoiceConnection, createAudioResource, generateDependencyReport
} from "@discordjs/voice"
import fs from "fs";
import path from "path";
import {tts} from "../modules/calabash-ai.js"

const inDev = true
const commandType = "dev";
const disabled = false;

let data = new SlashCommandBuilder()
    .setName("vct")
    .setDescription("gurt")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addStringOption(option =>
        option
            .setName("file")
            .setDescription("Mp3 file name")
            .setRequired(true))

async function execute(interaction) {
    const sound = interaction.options.getString("file");

    const player = createAudioPlayer();
    player.on(AudioPlayerStatus.Playing, () => {
    });
    player.on('error', error => {
        console.warn(`Error: ${error.message} with resource`);
    });



  //  const resource = createAudioResource(`./resources/mp3/${sound}.mp3`)
    const ttsName = await tts(sound)
    const resource = createAudioResource(`./resources/audio/${ttsName}.mp3`)
    player.play(resource)

    let connection = getVoiceConnection(interaction.guild.id)
    if(!connection) {
        connection = joinVoiceChannel({
            channelId: "914336178629652480",
            guildId: "883838743172218891",
            adapterCreator: interaction.guild.voiceAdapterCreator,
            selfDeaf: false
        })
    } else {console.log("connection found")}

    connection.subscribe(player);

}

export {data, execute, inDev, disabled}