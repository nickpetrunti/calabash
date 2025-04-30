import {Events, MessageFlags} from "discord.js"
import config from '../../config.json' with {type: 'json'}
import chalk from "chalk";

const name = Events.ClientReady

// MODULES
import {Initialize} from "../modules/handler.js"

async function execute(client) {
    console.clear()
    Initialize()

    console.log(`${chalk.bold.whiteBright("--> ")}${chalk.hex("#a7db7d").bold("Calabash ")}${chalk.whiteBright.bold(`v.${client.version} `)}${chalk.white("has started.")}${chalk.bold.whiteBright(" <--")}`)
    console.log(chalk.whiteBright("-").repeat(37)+"\n")
}

export {name,execute}