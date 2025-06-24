import database from "./database.js";
import * as discord from "discord.js"


async function init(user) {
    const eloDB = await database.fetchDatabase("scores")
    console.log("initing")
    await eloDB.insertOne({
        user: user.id,
        elo: 600
    })

    console.log("inserted")

}

export async function update(user, amount) {
    const eloDB = await database.fetchDatabase("scores")
    const currentDocument = await eloDB.findOne({id:user.id})
    if(currentDocument === null) { await init(user); }

    const currentElo =
    await eloDB.updateOne({user: user.id}, {amount: currentElo+amount})

    return currentElo+amount

}

export async function check(user) {
    const eloDB = await database.fetchDatabase("scores")
    const currentDocument = await eloDB.findOne({id:user.id})
    console.log(currentDocument)
    if( currentDocument === null ) {
       await init(user)
    }

    console.log("running it up")

    const elo = await eloDB.findOne({id:user.id})
    console.log(elo)

    return elo.elo

}
