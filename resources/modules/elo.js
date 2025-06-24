import database from "./database.js";
import * as discord from "discord.js"


async function init(user) {
    const eloDB = await database.fetchDatabase("scores")
    await eloDB.insertOne({
        user: user.id,
        elo: 600
    })
}

export async function update(user, amount) {
    const eloDB = await database.fetchDatabase("scores")
    let currentDocument = await eloDB.findOne({user:user.id})
    if(currentDocument === null) { await init(user); }
    currentDocument = await eloDB.findOne({user:user.id})

    const currentElo = currentDocument.elo
    await eloDB.updateOne({user: user.id}, {$set: {amount: currentElo+amount}})

    return currentElo+amount
}

export async function check(user) {
    const eloDB = await database.fetchDatabase("scores")
    const currentDocument = await eloDB.findOne({user:user.id})
    if( currentDocument === null ) {
       await init(user)
    }

    const elo = await eloDB.findOne({user:user.id})

    return elo.elo
}
