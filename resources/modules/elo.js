import database from "./database.js";
import * as discord from "discord.js"


function init(user) {
    const eloDB = database.fetchDatabase("scores").then(function() {
        eloDB.insertOne({
            user: user.id,
            elo: 600
        })
    })

}

export async function update(user, amount) {
    const eloDB = await database.fetchDatabase("scores")
    const currentDocument = await eloDB.findOne({id:user.id})
    if(!currentDocument) { init(user) }

    const currentElo =
    await eloDB.updateOne({user: user.id}, {amount: currentElo+amount})

    return currentElo+amount

}

export async function check(user) {
    const eloDB = await database.fetchDatabase("scores")
    const currentDocument = await eloDB.findOne({id:user.id})
    if(! currentDocument ) {
        await eloDB.insertOne({
            user: user.id,
            elo: 600
        })
    }

    const elo = await eloDB.findOne({id:user.id})

    return elo.elo

}
