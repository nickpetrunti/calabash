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
    getVoiceConnection,
    createAudioResource,
    generateDependencyReport
} from "@discordjs/voice"
import fs from "fs";
import path from "path";
import {tts} from "../modules/calabash-ai.js"

const inDev = true
const commandType = "dev";
const disabled = false;

let data = new SlashCommandBuilder()
    .setName("vcspeak")
    .setDescription("Provide calabash wisdom in a voice channel")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addStringOption(option =>
        option
            .setName("message")
            .setDescription("The message to speak in calalang")
            .setRequired(true))

async function execute(interaction) {
    const sound = interaction.options.getString("message");

    if(!interaction.member.voice) {
        await interaction.reply({content:"You must be in a voice channel to use this command.",flags:[MessageFlags.Ephemeral]})
        return;
    }

    await interaction.reply({content:"Successfully played TTS",flags:[MessageFlags.Ephemeral]})

    const player = createAudioPlayer();
    const ttsName = await tts(sound)
    const resource = createAudioResource(`./resources/audio/${ttsName}.mp3`)
    player.play(resource)

    const connection = joinVoiceChannel({
        channelId: interaction.member.voice.channel.id,
        guildId: interaction.guild.id,
        adapterCreator: interaction.guild.voiceAdapterCreator,
        selfDeaf: false
    })

    connection.subscribe(player);

    player.on("idle", () => {
        connection.destroy()
        fs.unlinkSync(`./resources/audio/${ttsName}.mp3`)
    });

    //setTimeout(async () => {connection.destroy()}, 10_000)

}

export {data, execute, inDev, disabled}