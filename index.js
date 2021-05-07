const Discord = require('discord.js');
const { prefix, seperator, seperatorspace, token, bachosoftServerID, studioServeName} = require('./config.json');
const client = new Discord.Client();
const ytdl = require("ytdl-core");
const search = require("yt-search");
//const randomPuppy = require("random-puppy");
const fs = require("fs");

//databases
let serverDatabase = require("./guilds.json");
let ecoDatabase = require("./eco.json");

//canvas
const Canvas = require('canvas');
const { loadImage } = require("canvas");
const { send, disconnect } = require('process');
const { count, dir } = require('console');

var servers = {};
var topMemes = new Map();
//#region setting map data
let backgroundImOps = ['dark', 'red', 'green', 'blue', 'light', 'gold']; //background colors: navy, dark, light, gold, burgandy (dark red), green, blue,
let themeDarkCols = new Map();
themeDarkCols.set('light');
//themeDarkCols.set('gold');

//catagory maps
let backgroundImMap = new Map();
backgroundImMap.set('dark');
backgroundImMap.set('red');
backgroundImMap.set('green');
backgroundImMap.set('blue');
backgroundImMap.set('light');
backgroundImMap.set('gold');

let barColorOps = new Map(); //Bar Colors: dark blue, light blue, green, dark green, red, gold, pink, turquoise
barColorOps.set('goldB', '#eead44');
barColorOps.set('light green', '#3dba78');
barColorOps.set('blue', '#3b7cba');
barColorOps.set('purple', '#d440e5');
barColorOps.set('light red', '#d8363d');
barColorOps.set('pink', '#fd61b4');
barColorOps.set('light blue', '#59c6e5');
barColorOps.set('turquoise', '#3decd5');
barColorOps.set('black', '#171924');

let itemList = new Map();
//setting the card stuff
itemList.set('dark', 0); //backgrounds
itemList.set('red', 3500);
itemList.set('green', 3500);
itemList.set('blue', 4000);
itemList.set('light', 5500);
itemList.set('gold', 6000);
itemList.set('goldB', 0); //bar colors
itemList.set('light green', 850);
itemList.set('blue', 400);
itemList.set('purple', 500);
itemList.set('light red', 500);
itemList.set('pink', 600);
itemList.set('light blue', 900);
itemList.set('turquoise', 1000);
itemList.set('black', 2000);
/*itemList.set('', );
itemList.set('', );
itemList.set('', );
itemList.set('', );
itemList.set('', );
itemList.set('', );
itemList.set('', );
itemList.set('', );*/

//#endregion

//changing status
const activities = [`ebikness`, `playing music`, `partying`, `moderating`, `hacr detected`, `managing polls`, `providing roles`, `epic gamer`, `finding matches`, `providing updates`, `finding players`, `we got'em`, `rollin out`, `free xp boiz`, `nah aight`, `ye or re`, `dominating`, `i got ya now`, `collecting leads`, `yeet`, `pin em boiz`, `goin in`, `show me the money!`]
setInterval(() => {
    let activity = activities[Math.floor(Math.random() * activities.length)];
    client.user.setActivity(`${prefix}help | ` + activity);
    
}, 30000)

client.once('ready', () => {
    console.log('Ready')
})

client.on('presenceUpdate', user => {
    if(user.guild.name === "Treixatek Dev Dynasty"){
        
        if(!user.user.bot){
            let liveRoleID = "713813908577583106";
            let liveRole = user.guild.roles.find(role => role.id === liveRoleID);
            let updateChannel = user.guild.channels.get("639189304379179008")
            let notiRole = user.guild.roles.find(role => role.id === "714250563163783199")

            let currGame = user.presence.game;
            //console.log(currGame);

            if(currGame === null || currGame.name === "Spotify"){
                if(user.roles.has(liveRoleID)){
                    user.removeRole(liveRole);

                    let EndEmbed = new Discord.MessageEmbed()
                        .setColor('#00ffea')
                        .setTitle(":movie_camera: " + `**Stream Ended**`)
                        .setDescription(`${user}'s stream just ended, catch the next one!`)
                        .setFooter("aw man")
                    updateChannel.send(EndEmbed);
                    console.log("remove1")
                }
                
                return;
            }
            else if(currGame.type === 1 && currGame.name !== "Spotify"){
                if(user.roles.has(liveRoleID)){
                    user.removeRole(liveRole);

                    let EndEmbed = new Discord.MessageEmbed()
                        .setColor('#00ffea')
                        .setTitle(":movie_camera: " + `**Stream Ended**`)
                        .setDescription(`${user}'s stream just ended, catch the next one!`)
                        .setFooter("aw man")
                    updateChannel.send(EndEmbed);
                    console.log("remove2")
                }
                else{
                    user.addRole(liveRole);
                    let liveEmbed = new Discord.MessageEmbed()
                        .setColor('#00ffea')
                        .setTitle(":movie_camera: " + `**Streaming Now!**`)
                        .setDescription(`${notiRole}, ${user} is live now! \n Go watch!`)
                        .setFooter("Stream time!")
                    updateChannel.send(liveEmbed);
        
                    let notiStreamerEmbed = new Discord.MessageEmbed()
                        .setColor('#00ffea')
                        .setTitle(":movie_camera: " + `**Your stream is featured!**`)
                        .setDescription(`Notification role holders have been \n pinged that your stream is live!`)
                        .setFooter("Stream time!")
                    user.send(notiStreamerEmbed);
        
                    updateChannel.send(`${notiRole} yo new stream!`).then( msg => {
                        msg.delete(0);
                    })
                }
            }
        }
    }
})

client.on('messageReactionAdd', async (reaction,user) => {
    if(!user.bot){
        let guildID = reaction.message.guild.id;
        let reactionMesID = reaction.message.id;
        let serverReacMessIDs = serverDatabase[guildID].reactionMesIDs;
        let idNames = Object.getOwnPropertyNames(serverReacMessIDs);

        let ind = 0;

        for(i in serverReacMessIDs){
            //console.log(serverReacMessIDs[i])
            if(idNames[ind] === reactionMesID){
                let currMes = idNames[ind];
                let mesReactions = serverReacMessIDs[i];
                let j = 0;

                for (let j = 0; j < mesReactions.length; j++) {
                    let splitEx = mesReactions[j].split('~');
                    //let reactionName = mesReactions[j].substr(0, 1);
                    let reactionName = splitEx[0];
                    let roleID = splitEx[1];

                    if(reactionName === reaction.emoji.name){ //if this is the emoji the user reacted with
                        let currGuild = reaction.message.guild;
                        let roleExport = currGuild.roles.find(role => role.id === roleID)
                        let userMember = currGuild.members.cache.find(member => member.id === user.id);
                        //convert to names
                        let guildName = currGuild.name;
                        let roleName = roleExport.name;

                        if(userMember.roles.has(roleID)){
                            
                            userMember.send(`You already have the **${roleName}** role!`);
                        }
                        else{
                            userMember.addRole(roleExport);
                            userMember.send(`You have received the **${roleName}** role in **${guildName}**.`);
                        }
                    }
                }
            }

            ind++
        }
    }
})

client.on('messageReactionRemove', async (reaction,user) => {
    if(!user.bot){
        let guildID = reaction.message.guild.id;
        let reactionMesID = reaction.message.id;
        let serverReacMessIDs = serverDatabase[guildID].reactionMesIDs;
        let idNames = Object.getOwnPropertyNames(serverReacMessIDs);

        let ind = 0;

        for(i in serverReacMessIDs){
            //console.log(serverReacMessIDs[i])
            if(idNames[ind] === reactionMesID){
                let currMes = idNames[ind];
                let mesReactions = serverReacMessIDs[i];
                let j = 0;

                for (let j = 0; j < mesReactions.length; j++) {
                    let splitEx = mesReactions[j].split('~');
                    //let reactionName = mesReactions[j].substr(0, 1);
                    let reactionName = splitEx[0];
                    let roleID = splitEx[1];

                    if(reactionName === reaction.emoji.name){ //if this is the emoji the user reacted with
                        let currGuild = reaction.message.guild;
                        let roleExport = currGuild.roles.find(role => role.id === roleID)
                        let userMember = currGuild.members.cache.find(member => member.id === user.id);
                        //convert to names
                        let guildName = currGuild.name;
                        let roleName = roleExport.name;

                        if(!userMember.roles.has(roleID)){
                            
                            userMember.send(`You don't have the ${roleName} role, odd...`);
                        }
                        else{
                            userMember.removeRole(roleExport);
                            userMember.send(`You no longer have the **${roleName}** role in **${guildName}**.`);
                        }
                    }
                }
            }

            ind++
        }
    }
})

client.on('guildMemberAdd', member => {
    //console.log('User' + member.user.tag + 'has joined the server!');
    if(member.guild.name === studioServeName){
        console.log("here");
        let role = member.guild.roles.find(role => role.name === "Guest");
        if(role != undefined){
            member.addRole(role);
        }
    }
})

client.on('message', async (message) => {
    let member = undefined;
    
    if(message.mentions.members != null){
        member = message.mentions.members.first();
        
    }
    
    let sender = message.member;
    if(sender == null) { return; }
    let splitmessage = message.content.split(seperator);
    let splitmessagespace = message.content.split(seperatorspace);
    let channel = message.channel;

    let calc = Math.floor((Math.random() * 10) + 1);
    
    //IDs
    let awoServer = "Astro Influx Official";
    let devServer = "Treixatek Dev Dynasty";
    let studioServer = studioServeName;
    let gameServerID = "671841075228442683"
    //partner servers

    //let AdudeServer = client.guilds.get(AdudeID);
    let botID = "711580935098990713";
    
    let serverName = message.guild.name;
    let serverID = message.guild.id;

    //Time
    let date = new Date();
    let hours = date.getHours()
    let minutes = date.getMinutes();
    let month = date.getMonth() + 1
    let day = date.getDate()
    let year = date.getFullYear()

    let timeArr = [month, day, hours, minutes];
    
    let timeType = " p.m. EST"
    
    if(minutes < 10){
        minutes = "0" + minutes;
    }
    if(hours > 11){
        timeType = " p.m. EST"
    }
    else{
        timeType = " a.m. EST"
    }
    if(hours > 12){
        hours -= 12;
    }

    //embed colors
    let settingColor = '#4c71fd';
    let moneyColor = '#1cff7d';
    let musicColor = '#ffe838';
    let standardColor = '#eead44';
    let softRed = '#e83f3f';
    let rankColor ='#162970';
    
    //serverDatabase
    let xp;
    let adLevel;
//#region Assign new servers and members to databases
    if(!serverDatabase[serverID]){ //create data for new servers
        serverDatabase[serverID] = {
            xpData: {},
            reactionMesIDs: {},
            AdLevelPerm: 2,
            AdChannelID: "not set",
            ModRoleID: "not set",
            LogChannelID: "not set",
            TrelloLink: "not set",
            LastUpdate: "not set",
            RankLength: 400,
            ranksOn: true
        };
        writeServerData(); //load the server in the database before trying to find and use values from it
    }

    //coin and econemy database 
    if(!ecoDatabase[sender.id]){
        if(!sender.user.bot){
            ecoDatabase[sender.id] = {
                Coins: 0,
                Expens: 0,
                Clubs: ["none"],
                Items: ["none"],
                Multiplier: 0,
                CardIm: 'dark',
                BarCol: 'goldB',
                CollectedDate: "0~0" //month day hours minutes
            };
            writeEcoData();
        }
    }
//#endregion

//#region Importing vars from databases
    var reportchannelID = serverDatabase[serverID].LogChannelID;
    var reportchannel;
    var policeRoleId = serverDatabase[serverID].ModRoleID;
    var specialServer = true;

    var trelloLinkData = serverDatabase[serverID].TrelloLink;
    var lastUpdateData = serverDatabase[serverID].LastUpdate;

    let rankLengthData = serverDatabase[serverID].RankLength;
    let ranksonData = serverDatabase[serverID].ranksOn;

//#endregion

//#region Check if this is a special server and set it
    if(reportchannelID === "not set" || policeRoleId === "not set"){
        specialServer = false;
    }

    if(specialServer){
        reportchannel = message.guild.channels.get(serverDatabase[serverID].LogChannelID);
        policeRoleTest = message.guild.roles.get(policeRoleId);

        if(reportchannel === undefined){ //check if the mod role assigned in the database has been deleted
            specialServer = false; //make sure mod commands cannot be used
            reportchannelID = "not set";

            serverDatabase[serverID].LogChannelID = "not set"; //update the data in the databaseso that this proccess is not cunducted every time
            writeServerData();
        }

        if(policeRoleTest === undefined){ //check if the role has been deleted
            specialServer = false;
            policeRoleTest = "not set";

            serverDatabase[serverID].ModRoleID = "not set";
            writeServerData();
        }
    }
//#endregion

    //xp stuff
    xp = serverDatabase[serverID].xpData;
    adLevel = serverDatabase[serverID].AdLevelPerm;

    if(!sender.user.bot){ //xp and economy stuff
        if(message.content.startsWith(`${prefix}writeData`)){
            if(sender.id === message.guild.ownerID || sender.id === '626616845746831400'){
                for(i in ecoDatabase){
                    if(xp[i] === undefined){
                        channel.send('`Checking if data for user: ' + `UNKNOWN. is correct` + '`');
                    }
                    else{
    
                        channel.send('`Checking if data for user: ' + `${xp[i].name}. is correct` + '`');
                    }
    
                    if(!isNaN(ecoDatabase[i].CollectedDate)){ //the data is incorrect
                        ecoDatabase[i].CollectedDate = `${ecoDatabase[i].CollectedDate}~0`;
                        writeEcoData();
    
                        if(xp[i] === undefined){
                            channel.send('`Data has been re structured for: ' + `UNKNOWN. Set to ${ecoDatabase[i].CollectedDate}~0` + '`');
                        }
                        else{
        
                            channel.send('`Data has been re structured for: ' + `${xp[i].name}. Set to ${ecoDatabase[i].CollectedDate}~0` + '`');
                        }
                    }
                }
            }
        }
        //rank stuff
        let xpAdd = betweenTwoNums(8, 18) //number between 7 and 15 [lowered]
    
        if(!xp[sender.user.id]){
            xp[sender.id] = {
                name: sender.user.username,
                xp: 0,
                level: 1,
            };
        }
        
        let currxp = xp[sender.user.id].xp;
        let currlvl = xp[sender.user.id].level;
        let nextLvl = xp[sender.user.id].level * rankLengthData; //increasing next level max xp Ex. default 400
        let prevLvl = (xp[sender.user.id].level-1) * rankLengthData;

        //eco data
        let currcoins = ecoDatabase[sender.user.id].Coins;
        let expenses = ecoDatabase[sender.user.id].Expens;
        let currclubs = ecoDatabase[sender.user.id].Clubs;
        let currItems = ecoDatabase[sender.user.id].Items;
    
        let currmultiplier = await ecoDatabase[sender.user.id].Multiplier;
        let cardImage = await ecoDatabase[sender.user.id].CardIm;
        let barcolor = await ecoDatabase[sender.user.id].BarCol;

        let backgroundsSplit = cardImage.split('~');
        let barcolorSplit = barcolor.split('~');
        let colectedDateData = await ecoDatabase[sender.user.id].CollectedDate;
        let colecTimeSplit = await colectedDateData.split('~'); //0 is daily, 1 is last message

        if(message.content.startsWith(`${prefix}rank`)){
            if(ranksonData === false){

                return ranksOffNotif();
            }
            /*
            if(sender.id === '558431576036212741'){
                //channel.send('how bout no');
                //return channel.send("```js\n (node:8152) UnhandledPromiseRejectionWarning: Error: Server responded with 404 \n at get.concat (lib\\image.js:56:28) \n at concat (\\index.js:89:7) \n at IncomingMessage.<anonymous> (\\index.js:7:13) \n at Object.onceWrapper (events.js:286:20) \n at IncomingMessage.emit (events.js:203:15) \n at endReadableNT (_stream_readable.js:1145:12) \n at process._tickCallback (internal/process/next_tick.js:63:19) \n (node:8152) UnhandledPromiseRejectionWarning: Unhandled promise rejection. This error originated either by throwing inside of an async function without a catch block, or by rejecting a promise which was not handled with .catch(). (rejection id: 1) \n (node:8152) [DEP0018] DeprecationWarning: Unhandled promise rejections are deprecated. In the future, promise rejections that are not handled will terminate the Node.js process with a non-zero exit code.```");
            }*/

            
                
            if(member === undefined){

                let values = [""];
                let pos = 0;
    
                let ind = 0;
    
                for(i in xp){
                    values[ind] = xp[i].xp;
    
                    ind++;
                }

                values.sort(function(a, b){return b - a});

                for (let index = 0; index < values.length; index++) {
                    if(values[index] === currxp){
                        pos = index + 1;
                    }
                }
                let botCount = message.guild.members.cache.filter(member => member.user.bot).size;
                
                
                //PROFILE CARD
                await Canvas.registerFont('./fonts/VarelaRound-Regular.ttf', {family: 'Varela Round' });
                

                //set precolors based on user data
                let progressCol;
                if(barColorOps.has(barcolorSplit[0])){
                    progressCol = barColorOps.get(barcolorSplit[0]);
                }
                else{
                    progressCol = standardColor;
                    console.log("User's rank color was not found");
                }

                let themeCol = '#ffffff';
                let textCol = '#181b2f';
                if(themeDarkCols.has(backgroundsSplit[0])){
                    themeCol = '#292b33';
                    textCol = '#ffffff';
                }
                
                const procanvas = Canvas.createCanvas(700, 250); //1000, 333
                const ctx = procanvas.getContext('2d');
                const background = await loadImage(__dirname + '/img/' + backgroundsSplit[0] + '.png');
                ctx.drawImage(background, 0, 0, procanvas.width, procanvas.height);

                
                //xp bar outline
                ctx.beginPath();
                ctx.lineWidth = 6;
                ctx.strokeStyle = themeCol;
                ctx.globalAlpha = 0.4;
                ctx.fillStyle = "#000000";
                ctx.fillRect(220, 100, 450, 45);
                ctx.fill();
                ctx.globalAlpha = 1;
                ctx.strokeRect(220, 100, 450, 45);
                ctx.stroke();

                let xpDiff = currxp - prevLvl;
                let totalDiff = nextLvl - prevLvl;

                //white underborder
                ctx.fillStyle = '#ffffff';
                ctx.globalAlpha = 1;
                ctx.fillRect(220, 103, ((xpDiff / totalDiff) * 450), 40);
                ctx.fill();
                
                //border //#eec344
                ctx.fillStyle = progressCol;
                ctx.globalAlpha = 0.7;
                ctx.fillRect(220, 103, ((xpDiff / totalDiff) * 450), 40);
                ctx.fill();
                ctx.globalAlpha = 1;

                //progress
                ctx.fillStyle = progressCol;
                ctx.globalAlpha = 1;
                ctx.fillRect(210, 103, ((xpDiff / totalDiff) * 450), 40);
                ctx.fill();
                ctx.globalAlpha = 1;
                //bottom
                ctx.globalAlpha = 0.15;
                //ctx.fillStyle = "#d28e33";
                ctx.fillStyle = "#10131c";
                ctx.fillRect(210, 133, ((xpDiff / totalDiff) * 450) + 10, 10);
                ctx.fill();
                ctx.globalAlpha = 1;

                //name back
                ctx.beginPath()
                ctx.moveTo(180, 60);
                ctx.lineTo(490, 60);
                ctx.lineTo(520, 100);
                ctx.lineTo(185, 100);
                ctx.fillStyle = themeCol;
                ctx.fill();

                //level back
                ctx.beginPath();
                ctx.arc(350, 180, 25, 0, Math.PI * 2, true);
                ctx.fill();
                ctx.globalAlpha = 1;

                
                ctx.globalAlpha = 1;
                ctx.font = "30px Varela Round";
                ctx.textAlign = "right";
                ctx.fillStyle = '#ffffff';
                ctx.fillText(`${numberWithCommas(currxp)} / ${numberWithCommas(nextLvl)} XP`, 660, 134);

                //name
                ctx.textAlign = "left";
                ctx.fillStyle = textCol;
                ctx.fillText(ShortenString(sender.user.tag, 15), 220, 90);

                ctx.textAlign = "right";
                ctx.fillStyle = themeCol;
                ctx.fillText(`Pos: ${pos} / ${message.guild.memberCount-botCount}`, 670, 85);

                ctx.textAlign = "left";
                
                //level
                ctx.fillStyle = themeCol;
                ctx.font = "35px Varela Round";
                ctx.fillText("Level:", 220, 190);
                ctx.fillStyle = textCol;
                ctx.font = "30px Varela Round";
                ctx.textAlign = "center";
                ctx.fillText(currlvl, 349, 190);
                ctx.textAlign = "left";

                //pfp
                ctx.beginPath();
                ctx.arc(130, 120, 90, 0, Math.PI * 2, true); //170
                ctx.lineWidth = 10;
                ctx.strokeStyle = themeCol;
                ctx.stroke();
                ctx.closePath();
                ctx.clip();
                const avatar = await loadImage(sender.user.displayAvatarURL({ format: "png" }));
                ctx.drawImage(avatar, 40, 30, 180, 180);
                

                const attachment = new Discord.MessageAttachment(procanvas.toBuffer(), 'rank.png');
                channel.send(attachment);
            }
            else{
                if(member.user.bot){
                    return channel.send(":cry: bots don't have xp bruh, now **scram!**");
                }

                if(!xp[member.id]){
                    xp[member.id] = {
                        name: member.user.username,
                        xp: 0,
                        level: 1,
                    };
                }

                if(!ecoDatabase[member.id]){
                    ecoDatabase[member.id] = {
                        Coins: 0,
                        Expens: 0,
                        Clubs: ["none"],
                        Items: ["none"],
                        Multiplier: 0,
                        CardIm: 'dark',
                        BarCol: 'goldB',
                        CollectedDate: "0~0" //month day hours minutes
                    };
                    writeEcoData();
                }


                let memberLvl = xp[member.id].level;
                let memberXp = xp[member.id].xp;
                let membernxt = xp[member.id].level * rankLengthData;
                let memberPrev = (xp[member.id].level-1) * rankLengthData;

                let membercurrmultiplier = await ecoDatabase[member.id].Multiplier;
                let membercardImage = ecoDatabase[member.id].CardIm;
                let memberbarcolor = ecoDatabase[member.id].BarCol;

                let backgroundsSplit = membercardImage.split('~');
                let barcolorSplit = memberbarcolor.split('~');

                let values = [""];
                let pos = 0;
    
                let ind = 0;
    
                for(i in xp){
                    values[ind] = xp[i].xp;
    
                    ind++;
                }

                values.sort(function(a, b){return b - a});

                for (let index = 0; index < values.length; index++) {
                    if(values[index] === memberXp){
                        pos = index + 1;
                    }
                }
                let botCount = message.guild.members.cache.filter(member => member.user.bot).size;

                let progressCol
                if(barColorOps.has(barcolorSplit[0])){
                    progressCol = barColorOps.get(barcolorSplit[0]);
                }
                else{
                    progressCol = standardColor;
                    console.log("User's rank color was not found");
                }

                let themeCol = '#ffffff';
                let textCol = '#181b2f';
                if(themeDarkCols.has(backgroundsSplit[0])){
                    themeCol = '#292b33';
                    textCol = '#ffffff';
                }

                //MENTION PROFILE CARD
                await Canvas.registerFont('./fonts/VarelaRound-Regular.ttf', {family: 'Varela Round' });
                
                const procanvas = Canvas.createCanvas(700, 250);
                const ctx = procanvas.getContext('2d');
                const background = await loadImage(__dirname + '/img/' + backgroundsSplit[0] + '.png');
                ctx.drawImage(background, 0, 0, procanvas.width, procanvas.height);

                
                //xp bar outline
                ctx.beginPath();
                ctx.lineWidth = 6;
                ctx.strokeStyle = themeCol;
                ctx.globalAlpha = 0.4;
                ctx.fillStyle = "#000000";
                ctx.fillRect(220, 100, 450, 45);
                ctx.fill();
                ctx.globalAlpha = 1;
                ctx.strokeRect(220, 100, 450, 45);
                ctx.stroke();

                let xpDiff = memberXp - memberPrev;
                let totalDiff = membernxt - memberPrev;
                
                //white underborder
                ctx.fillStyle = '#ffffff';
                ctx.globalAlpha = 1;
                ctx.fillRect(220, 103, ((xpDiff / totalDiff) * 450), 40);
                ctx.fill();
                
                //border //#eec344
                ctx.fillStyle = progressCol;
                ctx.globalAlpha = 0.7;
                ctx.fillRect(220, 103, ((xpDiff / totalDiff) * 450), 40);
                ctx.fill();
                ctx.globalAlpha = 1;

                //progress
                ctx.fillStyle = progressCol;
                ctx.globalAlpha = 1;
                ctx.fillRect(210, 103, ((xpDiff / totalDiff) * 450), 40);
                ctx.fill();
                ctx.globalAlpha = 1;
                //bottom
                ctx.globalAlpha = 0.15;
                //ctx.fillStyle = "#d28e33";
                ctx.fillStyle = "#10131c";
                ctx.fillRect(210, 133, ((xpDiff / totalDiff) * 450) + 10, 10);
                ctx.fill();
                ctx.globalAlpha = 1;

                //name back
                ctx.beginPath()
                ctx.moveTo(180, 60);
                ctx.lineTo(490, 60);
                ctx.lineTo(520, 100);
                ctx.lineTo(185, 100);
                ctx.fillStyle = themeCol;
                ctx.fill();

                //level back
                ctx.beginPath();
                ctx.arc(350, 180, 25, 0, Math.PI * 2, true);
                ctx.fill();
                ctx.globalAlpha = 1;

                
                ctx.globalAlpha = 1;
                ctx.font = "30px Varela Round";
                ctx.textAlign = "right";
                ctx.fillStyle = "#ffffff";
                ctx.fillText(`${numberWithCommas(memberXp)} / ${numberWithCommas(membernxt)} XP`, 660, 134);

                ctx.textAlign = "left";
                ctx.fillStyle = textCol;
                ctx.fillText(ShortenString(member.user.tag, 15), 220, 90);

                ctx.textAlign = "right";
                ctx.fillStyle = themeCol;
                ctx.fillText(`Pos: ${pos} / ${message.guild.memberCount-botCount}`, 670, 85);

                ctx.textAlign = "left";
                
                //level
                ctx.fillStyle = themeCol;
                ctx.font = "35px Varela Round";
                ctx.fillText("Level:", 220, 190);
                ctx.fillStyle = textCol;
                ctx.font = "30px Varela Round";
                ctx.textAlign = "center";
                ctx.fillText(memberLvl, 349, 190);
                ctx.textAlign = "left";

                //pfp
                ctx.beginPath();
                ctx.arc(130, 120, 90, 0, Math.PI * 2, true); //170
                ctx.lineWidth = 10;
                ctx.strokeStyle = themeCol;
                ctx.stroke();
                ctx.closePath();
                ctx.clip();
                const avatar = await loadImage(member.user.displayAvatarURL({ format: "png" }));
                ctx.drawImage(avatar, 40, 30, 180, 180);
                

                const attachment = new Discord.MessageAttachment(procanvas.toBuffer(), 'rank.png');
                channel.send(attachment);
            }
            
            return;
        }
        else if(message.content.startsWith(`${prefix}leaders`)){
            if(ranksonData === false){

                return ranksOffNotif();
            }

            let list = ["**1 - **empty", "**2 - **empty", "**3 - **empty"];
            let nameList = ["empty"];

            let values = [""];
            let lvlvalues = [""];
            let namevalues = [""];

            let ind = 0;

            for(i in xp){
                namevalues[ind] = xp[i].xp + '~' + xp[i].name;
                values[ind] = xp[i].xp;
                lvlvalues[ind] = xp[i].level;

                ind++;
            }

            values.sort(function(a, b){return b - a});
            lvlvalues.sort(function(a, b){return b - a});

            let finalxp = values.slice(0, 3);
            let finallvl = lvlvalues.slice(0, 3);

            for (let index = 0; index < finalxp.length; index++) {
                let pos = index + 1;
                let leadName = 'error';

                for (let i = 0; i < namevalues.length; i++) {
                    let xpName = namevalues[i].split("~");

                    if(xpName[0] == finalxp[index]){
                        leadName = xpName[1];
                    }
                }

                //console.log(leadName[0]);
                nameList[index] = leadName;
                list[index] = `**${leadName} -** lvl: **${finallvl[index].toString()}** xp: **${finalxp[index].toString()}**`
            }
            //return console.log(nameList);
            let firstMem = message.guild.members.cache.find(member => member.user.username === nameList[0]);

            if(firstMem === undefined || firstMem === null){
                let leadersEmbed = new Discord.MessageEmbed()
                    .setColor(rankColor)
                    .setTitle(`:trophy: ${serverName} Leaderboard`)
                    .addField(`**:first_place: 1st Place**`, list[0])
                    .addField(`**:second_place: 2nd Place**`, list[1])
                    .addField(`**:third_place: 3rd Place**`, list[2])

                return channel.send(leadersEmbed);
            }
            else{
                let leadersEmbed = new Discord.MessageEmbed()
                    .setColor(rankColor)
                    .setThumbnail(firstMem.user.displayAvatarURL({ format: "png" }))
                    .setTitle(`:trophy: ${serverName} Leaderboard`)
                    .addField(`**:first_place: 1st Place**`, list[0])
                    .addField(`**:second_place: 2nd Place**`, list[1])
                    .addField(`**:third_place: 3rd Place**`, list[2])

                return channel.send(leadersEmbed);
            }

            
        }
        else if(message.content.startsWith(`${prefix}reset`)){
            if(!specialServer){

                return channel.send("The report channel and moderator role must be set before moderative commands can be used")
            }
            if(sender.roles.has(policeRoleId)){
                
                if(ranksonData === false){

                    return ranksOffNotif();
                }
                if(member === undefined){
                    
                    let adlevelEmbed = new Discord.MessageEmbed()
                        .setColor('#4c71fd')
                        .setTitle(`:gear: Reset member's xp and coins`)
                        .setDescription(`- reset @member: This command will reset the \n mentioned member's xp, level, and coins \n Ex. **ai/reset @jamesbond#0070**`)
                    return channel.send(adlevelEmbed);
                }
                else if(member.user.bot){
                    await channel.send("```js\n function resetCallback (user.info) { \n Array<String>: 'Bot detected!'; reverting sequence output \n intecepted by external command: '#botshaverightslul' \n return launching new output statement from function \n command.override('bot'){console.error('output')}\n ```");
                    return channel.send(":robot: Bots are impervious to the reset!");
                }
                else if(!xp[member.id]){
                    return channel.send(`${member.user.username} has never even gain xp or money before! Saved by being bad...`)
                }
                else{
                    let server = client.guilds.get(serverID);

                    if(member.id === server.ownerID && sender.id != server.ownerID){
                        channel.send(`Initiating **Imperial Firewall**, the final defense of mutiny.`);
                        channel.send(`Intercepting malicious request report: **success**`);
                        return channel.send(`Output: **The sytem has protected the owner from being reset**`);
                    }
                    else{
                        channel.send(`:warning: **${member.user.username}**'s level, xp, and coins have been reset to **0**:`);

                        let resetEmbed = new Discord.MessageEmbed()
                            .setColor('#ff3a3a')
                            .setTitle(':warning: XP, Level, Coins Reset Notification')
                            .setDescription("Officer: " + sender + " \n reset: " + member + ` \n prev stats: Lvl ${xp[member.id].level} | ${xp[member.id].xp}xp |${xp[member.id].coins} coins` + " \n Location: " + channel + " \n Time: " + hours + ":" + minutes + timeType + " \n Date: " + month + "/" + day + "/" + year)
        
                        reportchannel.send(resetEmbed);
    
                        xp[member.id].xp = 0;
                        xp[member.id].level = 1;
                        xp[member.id].coins = 0;
                    }
                    
                }
            }
            else{
                NoPermResonse();
            }
        }
        else if(message.content.startsWith(`${prefix}adlevel`)){
            if(sender.id === message.guild.ownerID || sender.roles.has(policeRoleId)){
                if(parseInt(splitmessagespace[0].substr(10)) > 0){
                    let adLevelSet = parseInt(splitmessagespace[0].substr(10));
    
                    serverDatabase[serverID].AdLevelPerm = adLevelSet;
                    channel.send(`The server advertising level has been set to **${adLevelSet}**`)

                    if(specialServer){
                        reportchannel.send(`${sender.user.username} has changed the server invite adlevel from ${adLevel} to **${adLevelSet}**`)
                    }
                }
                else{
                    let adlevelEmbed = new Discord.MessageEmbed()
                        .setColor('#4c71fd')
                        .setTitle(':gear: Ad Level Settings')
                        .setDescription(`Ad Level: **level ${adLevel}** \n - adlevel [number]: used to set the level that \n members need to be to send server invites \n Ex. **ai/adlevel 5**`)
                    return channel.send(adlevelEmbed);
                }
            }
            else{
                NoPermResonse();
            }
        }
        else if(message.content.startsWith(`${prefix}setlevel`)){
            if(sender.id === message.guild.ownerID || sender.roles.has(policeRoleId)){
                if(parseInt(splitmessagespace[0].substr(12)) > 0){
                    let levelSet = parseInt(splitmessagespace[0].substr(12));

                    if(levelSet > 100){
                        serverDatabase[serverID].RankLength = levelSet;
                        channel.send(`The amount of xp per level has been set to **${levelSet}**`)
    
                        if(specialServer){
                            reportchannel.send(`${sender.user.username} has changed the level length from ${rankLengthData} to **${levelSet}**`)
                        }

                        for(i in xp){
                            let userXP = xp[i].xp;
                            xp[i].level = Math.ceil(userXP/levelSet);
                        }

                        return writeServerData();
                        
                    }
                    else{
                        channel.send(`Too low man, I don't wanna be countin levels so fast. But I have a deal for you, maybe 100?`)
                    }
    
                    
                }
                else{
                    let setlevelEmbed = new Discord.MessageEmbed()
                        .setColor('#4c71fd')
                        .setTitle(':gear: Level Length Settings')
                        .setDescription(`Level Lenght: **${rankLengthData}xp** \n - setlevel [number]: used to set the xp that \n each level has before a level up \n Ex. **ai/setlevel 600**`)
                    return channel.send(setlevelEmbed);
                }
            }
            else{
                NoPermResonse();
            }
        }
        else{
            if(ranksonData){
                let timeSinceLast = (TimeSince(colecTimeSplit[1], date.getTime(), true) / 60);
                let dateNow = Math.floor(date.getTime() / 60);
                ecoDatabase[sender.id].CollectedDate = colecTimeSplit[0] + "~" + dateNow;
                writeEcoData();
                
                let numTime = Math.ceil(parseFloat(colecTimeSplit[1]) + 100);

                if(dateNow > numTime){
                    if(message.content.substr(0, 3) != "ai/"){
                        xp[sender.id].xp = currxp + xpAdd;
            
                        if (nextLvl <= xp[sender.id].xp){ // level up
                            let leveledName = sender.user.username;
                            let reachedLvl = currlvl + 1;
                    
                            xp[sender.id].level = currlvl + 1;
                            channel.send(`**${leveledName}**, you just reached level **${reachedLvl}**! :partying_face:`).then(levelupmes => {levelupmes.delete(30000)});
                        }
                        
                    }
                }

                //they are possibly spamming
            }
        }

        //anti ad stuff
        if(message.content.includes('https://discord.gg/')){
            if(sender.roles.has(policeRoleId))
                return;

            if(currlvl < adLevel){
                message.delete(0);
                sender.send(`You cannot send server advertisements, you need to be level ${adLevel}`);

                if(specialServer){
                    let antiAdEmbed = new Discord.MessageEmbed()
                        .setColor('#ff8e44')
                        .setTitle(':warning: Server Invite Ad Terminated')
                        .addField('What This Means:', `A message including an invite\n to another server was detected from a user under\n the adlevel (currently set at ${adLevel}), and we deleted it`)
                        .addField(`Report Details` ,"Sender: " + sender + " \n Location: " + channel + " \n Time: " + hours + ":" + minutes + timeType + " \n Date: " + month + "/" + day + "/" + year)
    
                    reportchannel.send(antiAdEmbed);
                }
            }
        } 

        //econemy
        if(message.content.startsWith(`${prefix}bal`)){
            if(ranksonData === false){

                return ranksOffNotif();
            }
            if(member == undefined){
                let currcoinsComma = numberWithCommas(currcoins);
                let final = ["none"];
                let itemFinal = ["none"];
    
                if(currcoins < 0){
                    currcoinsComma = currcoinsComma + " `in debt`";
                }
    
                for (let index = 0; index < currclubs.length; index++) {
                    if(!currclubs[index] === 'none'){
                        final[index] = `**- ${currclubs[index]}**`;
                    }
                }
                for (let index = 0; index < currItems.length; index++) {
                    if(currItems[index] != "none"){
                        itemFinal[index] = `**- ${currItems[index]}**`;
                    }
                }
    
                let balaEmbed = new Discord.MessageEmbed()
                    .setColor(moneyColor)
                    .setTitle(`:moneybag: ${sender.user.username}'s Balance`)
                    .addField(`STATS`, `**Coins -** ${currcoinsComma} \n **Multiplier -** ${currmultiplier} \n **Expenses -** ${expenses}` + " `weekly total`")
                    .addField(`ITEMS`, `${itemFinal.join('\n')}`)
                    .addField(`CLUBS`, `${final.join('\n')}`)
    
                channel.send(balaEmbed);
            }
            else{ //user is mentioned
                if(!ecoDatabase[member.id]){
                    ecoDatabase[member.id] = {
                        Coins: 0,
                        Expens: 0,
                        Clubs: ["none"],
                        Items: ["none"],
                        Multiplier: 0,
                        CardIm: 'dark',
                        BarCol: 'goldB',
                        CollectedDate: 0 //month day hours minutes
                    };
                    writeEcoData();
                }

                let memberCoins = ecoDatabase[member.id].Coins;
                let memexpenses = ecoDatabase[member.id].Expens;
                let memclubs = ecoDatabase[member.id].Clubs;
                let memItems = ecoDatabase[member.id].Items;
                let memMultiplier = ecoDatabase[member.id].Multiplier;

                let currcoinsComma = numberWithCommas(memberCoins);
                let final = ["none"];
                let itemFinal = ["none"];
    
                if(memberCoins < 0){
                    currcoinsComma = currcoinsComma + " `in debt`";
                }
    
                for (let index = 0; index < memclubs.length; index++) {
                    if(!memclubs[index] === 'none'){
                        final[index] = `**- ${memclubs[index]}**`;
                    }
                }
                for (let index = 0; index < memItems.length; index++) {
                    if(memItems[index] != "none"){
                        itemFinal[index] = `**- ${memItems[index]}**`;
                    }
                }
    
                let balaEmbed = new Discord.MessageEmbed()
                    .setColor(moneyColor)
                    .setTitle(`:moneybag: ${member.user.username}'s Balance`)
                    .addField(`STATS`, `**Coins -** ${currcoinsComma} \n **Multiplier -** ${memMultiplier} \n **Expenses -** ${memexpenses}` + " `weekly total`")
                    .addField(`ITEMS`, `${itemFinal.join('\n')}`)
                    .addField(`CLUBS`, `${final.join('\n')}`)
    
                channel.send(balaEmbed);
            }
            
        }
        else if(message.content.startsWith(`${prefix}daily`)){
            if(ranksonData === false){

                return ranksOffNotif();
            }
            let currColecTime = colecTimeSplit[0];
            let timeDiff = TimeSince(currColecTime, date.getTime());
            let trueTime = 24-timeDiff;
            
            if(trueTime <= 0){
                let coinsAdd = betweenTwoNums(250, 550);
                let trueMulti = 1 + currmultiplier;
                let totalAdd = Math.round(coinsAdd * trueMulti);

                ecoDatabase[sender.id].Coins = currcoins + totalAdd;
                ecoDatabase[sender.id].CollectedDate = `${date.getTime()}~${colecTimeSplit[1]}`;
                writeEcoData();

                let dailyEmbed = new Discord.MessageEmbed()
                    .setColor(moneyColor)
                    .setTitle(`:dollar: ${sender.user.username}'s Daily Coins!`)
                    .addField(`MAFS`, `**daily -** ${coinsAdd} **multiplier -** ${currmultiplier}`)
                    .addField(`TOTAL`, `You gained ${totalAdd} coins today! :white_check_mark:`)
                    .setFooter(`pay day!`)

                channel.send(dailyEmbed);

            }
            else{
                if(trueTime > 4){
                    return channel.send(`Get comfy because you still have **${trueTime}** more hours to wait`);
                }
                else{
                    return channel.send(`Almost there, just **${trueTime}** more hours!`);
                }
            } 
        }
        else if(message.content.startsWith(`${prefix}transfer`)){
            if(ranksonData === false){

                return ranksOffNotif();
            }

            if(member != undefined){
                if(member.id === sender.id){
                    return channel.send(`I will not allow for for such displays of madness, **how about ya give money to someone aside from yourself for once!**`)
                }

                let coinInput = parseInt(splitmessagespace[0].substr(12));
                
                if(Number.isNaN(coinInput)){
                    return channel.send("breh, provide an amount Ex. **ai/transfer 1069 @ebikdude**")
                }
                else if(coinInput > currcoins){
                    return channel.send("You don't even have that much money.");
                }

                let howGiveEmbed = new Discord.MessageEmbed()
                    .setColor(moneyColor)
                    .setTitle(`:bank: Transfer Money - Choose Method`)
                    .addField(`Bank`, "**:page_facing_up: | Capitol Union -** `15 mins, 15% tax` \n **:desktop: | BayBal -** `30 sec, 40% tax`")
                    .addField(`Step 1`, `React with the coresponding emoji to choose a bank \n You have 20 seconds before the request is proccessed`)
                    .setFooter(`we have a strict no return policy...`, sender.user.displayAvatarURL({ format: "png" }))

                channel.send(howGiveEmbed).then( async (sentEmbed) => {
                    await sentEmbed.react("📄");
                    await sentEmbed.react("🖥️");

                    const filter = (reaction, user) => reaction.emoji.name === '📄' || reaction.emoji.name === '🖥️' && user.id == sender.user.id;
                    const bankResults = await sentEmbed.awaitReactions(filter, { time: 20000 })
                    
                    if (bankResults.has('📄')){
                        let taxPer = 1.15;
                        let finalCharge = Math.floor(coinInput * taxPer);
                        let amountEmbed = new Discord.MessageEmbed()
                            .setColor(moneyColor)
                            .setTitle(`:bank: Final Step: Confirm`)
                            .addField(`**Tranfer Info**`, `**Method -** Capitol Union \n **Recipient -** ${member.user.username} \n **Amount -** ${coinInput}`, true)
                            .addField(`**Charge**`, `${coinInput} X ${taxPer}` + ' `15% Tax`' + ` \n **Your Total -** ${finalCharge} coins`, true)
                            .addField(`**CONFIRM**`, `✅ **| Confirm Send Coins**`)
                            .setFooter(`If left empty, you will be charge a cancelation fee of 10%`, sender.user.displayAvatarURL({ format: "png" }));

                        return channel.send(amountEmbed).then( async (sentEmbed) => { //send the payment
                            await sentEmbed.react("✅");
        
                            const filter = (reaction, user) => reaction.emoji.name === '✅' && user.id == sender.user.id;
                            const confirmResults = await sentEmbed.awaitReactions(filter, { time: 900000 })

                            if (confirmResults.has('✅')){
                                let newBal = currcoins - finalCharge;
                                let newBalRep = ecoDatabase[member.id].Coins + coinInput;

                                ecoDatabase[sender.id].Coins = newBal;
                                ecoDatabase[member.id].Coins = newBalRep;
                                writeEcoData();

                                let sentEmbed = new Discord.MessageEmbed()
                                    .setColor(moneyColor)
                                    .setTitle(`:bank: Coins Sent To ${member.user.username}`)
                                    .addField(`**${sender.user.username}'s Info**`, `**Charged -** ${finalCharge} coins \n **Balance -** ${newBal} coins`, true)
                                    .addField(`**${member.user.username}'s Info**`, `**Recieved -** ${coinInput} coins \n **Balance -** ${newBalRep} coins ✅`, true)
                                    .setFooter(`from ${sender.user.username}`, sender.user.displayAvatarURL({ format: "png" }));
        
                                return channel.send(sentEmbed);
                            }
                            else{
                                let takeAmount = Math.floor(coinInput * 0.10);
                                let newBal = currcoins - takeAmount;

                                ecoDatabase[sender.id].Coins = newBal;
                                writeEcoData();

                                let cancelEmbed = new Discord.MessageEmbed()
                                    .setColor(softRed)
                                    .setTitle(`:bank: Cancelation Fee`)
                                    .addField(`**Cancel Info**`, `**Amount -** ${coinInput} \n **Cancel Fee -** 10%`, true)
                                    .addField(`**Total Charge**`, `${coinInput} X 0.10` + ' `10% Fee`' + ` \n **Total Charge -** ${takeAmount} coins`, true)
                                    .addField(`**Your Balance**`, `**${newBal} coins**`)
                                    .setFooter(`canceled...`, sender.user.displayAvatarURL({ format: "png" }));
        
                                return channel.send(cancelEmbed);
                            }
                            
                        })
                        
                    }
                    if (bankResults.has('🖥️')){
                        let taxPer = 1.40;
                        let finalCharge = Math.floor(coinInput * taxPer);
                        let amountEmbed = new Discord.MessageEmbed()
                            .setColor(moneyColor)
                            .setTitle(`:bank: Final Step: Confirm`)
                            .addField(`**Tranfer Info**`, `**Method -** BayBal \n **Recipient -** ${member.user.username} \n **Amount -** ${coinInput}`, true) //here
                            .addField(`**Charge**`, `${coinInput} X ${taxPer}` + ' `40% Tax`' + ` \n **Your Total -** ${finalCharge} coins`, true)
                            .addField(`**CONFIRM**`, `✅ **| Confirm Send Coins**`)
                            .setFooter(`If left empty, you will be charge a cancelation fee of 10%`, sender.user.displayAvatarURL({ format: "png" }));

                        return channel.send(amountEmbed).then( async (sentEmbed) => { //send the payment
                            await sentEmbed.react("✅");
        
                            const filter = (reaction, user) => reaction.emoji.name === '✅' && user.id == sender.user.id;
                            const confirmResults = await sentEmbed.awaitReactions(filter, { time: 30000 })

                            if (confirmResults.has('✅')){
                                let newBal = currcoins - finalCharge;
                                let newBalRep = ecoDatabase[member.id].Coins + coinInput;

                                ecoDatabase[sender.id].Coins = newBal;
                                ecoDatabase[member.id].Coins = newBalRep;
                                writeEcoData();

                                let sentEmbed = new Discord.MessageEmbed()
                                    .setColor(moneyColor)
                                    .setTitle(`:bank: Coins Sent To ${member.user.username}`)
                                    .addField(`**${sender.user.username}'s Info**`, `**Charged -** ${finalCharge} coins \n **Balance -** ${newBal} coins`, true)
                                    .addField(`**${member.user.username}'s Info**`, `**Recieved -** ${coinInput} coins \n **Balance -** ${newBalRep} coins ✅`, true)
                                    .setFooter(`from ${sender.user.username}`, sender.user.displayAvatarURL({ format: "png" }));
        
                                return channel.send(sentEmbed);
                            }
                            else{
                                let takeAmount = Math.floor(coinInput * 0.10);
                                let newBal = currcoins - takeAmount;

                                ecoDatabase[sender.id].Coins = newBal;
                                writeEcoData();

                                let cancelEmbed = new Discord.MessageEmbed()
                                    .setColor(softRed)
                                    .setTitle(`:bank: Cancelation Fee`)
                                    .addField(`**Cancel Info**`, `**Amount -** ${coinInput} \n **Cancel Fee -** 10%`, true)
                                    .addField(`**Total Charge**`, `${coinInput} X 0.10` + ' `10% Fee`' + ` \n **Total Charge -** ${takeAmount} coins`, true)
                                    .addField(`**Your Balance**`, `**${newBal} coins**`)
                                    .setFooter(`canceled...`, sender.user.displayAvatarURL({ format: "png" }));
        
                                return channel.send(cancelEmbed);
                            }
                            
                        })
                    }
                    else {
                        return channel.send(`You did not react so the proccess has been canceled.`);
                    }
                })
            }
            else{
                let howtransferEmbed = new Discord.MessageEmbed()
                    .setColor(moneyColor)
                    .setTitle(`:bank: How To Transfer Money`)
                    .addField(`How to Start`, `To start the proccess of sending money to a user \n use this command and ping the user \n Ex. **${prefix}transfer 300 @goofygoober**`)
                    .addField(`Following Steps`, `- step 2: choose transfer method \n - step 3: choose transfer amount \n - wait for transaction`)
                    .setFooter(`we have a strict no return policy...`)

                channel.send(howtransferEmbed);
            } 
        }
        else if(message.content.startsWith(`${prefix}bet`)){
            if(ranksonData === false){

                return ranksOffNotif();
            }

            if(parseInt(splitmessagespace[0].substr(6)) >= 100){
                let coinInput = parseInt(splitmessagespace[0].substr(6));
                console.log(coinInput);

                if(coinInput > (currcoins * 2)){
                    return channel.send("This looks shady, I'm not accepting bets more that twice what you have");
                }

                let betFall = Math.floor(Math.random() * 101);
                let betProb = betweenTwoNums(10, 90); //team a 
                let otherProb = 100-betProb; //team b
                
                let moneyRatio = []; //a then b

                let betterID = sender.user.id;
                
                if(betProb === 50){
                    moneyRatio = [1, 1];
                }
                else if(betProb > 50){
                    let larger = betProb / otherProb;
                    moneyRatio = [1, larger];
                }
                else{
                    let larger = otherProb / betProb;
                    moneyRatio = [larger, 1];
                }

                let finalAddA = Math.floor(moneyRatio[0] * coinInput);
                let finalAddB = Math.floor(moneyRatio[1] * coinInput);

                let gamEmbed = new Discord.MessageEmbed()
                    .setColor(moneyColor)
                    .setTitle(`:slot_machine: ${sender.user.username}'s bet`)
                    .addField(`**Steak**`, `${coinInput} coins`)
                    .addField(`**Team 🇦**`, `**Win Prediction -** ${betProb}% \n **Money Return -** ${moneyRatio[0].toFixed(1)} per coin \n **Total Return -** ${finalAddA} coins`, true)
                    .addField(`**Team 🅱️**`, `**Win Prediction -** ${otherProb}% \n **Money Return -** ${moneyRatio[1].toFixed(1)} per coin \n **Total Return -** ${finalAddB} coins`, true)
                    .setFooter(`react within 20 seconds to enter`, sender.user.displayAvatarURL({ format: "png" }));

                return channel.send(gamEmbed).then( async (sentEmbed) => {
                    await sentEmbed.react("🇦");
                    await sentEmbed.react("🅱️");

                    const filter = (reaction, user) => reaction.emoji.name === '🇦' || reaction.emoji.name === '🅱️' && user.id == sender.user.id;
                    const betResults = await sentEmbed.awaitReactions(filter, { time: 20000 })
                    
                    if (betResults.has('🇦')){
                        if(betFall <= betProb){ //they win
                            let totalCoins = (1 + currmultiplier) * finalAddA;
                            ecoDatabase[sender.id].Coins = currcoins + totalCoins;
                            writeEcoData();

                            let winEmbed = new Discord.MessageEmbed()
                                .setColor(moneyColor)
                                .setTitle(`:partying_face: You won the bet!`)
                                .addField(`**Bet on:**`, `Team 🇦`, true)
                                .addField(`**Wager**`, `${coinInput} coins`, true)
                                .addField(`**Results**`, `**Won Amount -** ${finalAddA} X ${1+currmultiplier} \n **total Earnings -** ${totalCoins} coins :white_check_mark:`)
                                .setFooter(`Just four letters: EZPZ`);

                            return channel.send(winEmbed);
                        }
                        else{
                            let newBal = currcoins - finalAddA;
                            ecoDatabase[sender.id].Coins = newBal;
                            writeEcoData();

                            if(newBal < 0){
                                newBal = newBal.toString() + " `in debt`";
                            }

                            let LossEmbed = new Discord.MessageEmbed()
                                .setColor('#e83f3f')
                                .setTitle(`:x: You lost the bet...`)
                                .addField(`**Bet on:**`, `Team 🇦`, true)
                                .addField(`**Wager**`, `${coinInput} coins`, true)
                                .addField(`**Results**`, `**Lost Amount -** ${finalAddA} coins \n **Balance -** ${newBal}`)
                                .setFooter(`not everyone can be a winner...`);

                            return channel.send(LossEmbed);
                        }
                    }
                    else if (betResults.has('🅱️')){
                        if(betFall >= otherProb){ //they win
                            let totalCoins = (1 + currmultiplier) * finalAddB;
                            ecoDatabase[sender.id].Coins = currcoins + totalCoins;
                            writeEcoData();

                            let winEmbed = new Discord.MessageEmbed()
                                .setColor(moneyColor)
                                .setTitle(`:partying_face: You won the bet!`)
                                .addField(`**Bet on:**`, `Team 🅱️`, true)
                                .addField(`**Wager**`, `${coinInput} coins`, true)
                                .addField(`**Results**`, `**Won Amount -** ${finalAddB} X ${1+currmultiplier} \n **total Earnings -** ${totalCoins} coins :white_check_mark:`)
                                .setFooter(`Just three letters: EZPZ`);

                            return channel.send(winEmbed);
                        }
                        else{
                            let newBal = currcoins - finalAddB;
                            ecoDatabase[sender.id].Coins = newBal;
                            writeEcoData();

                            if(newBal < 0){
                                newBal = newBal.toString() + " `in debt`";
                            }

                            let LossEmbed = new Discord.MessageEmbed()
                                .setColor('#e83f3f')
                                .setTitle(`:x: You lost the bet...`)
                                .addField(`**Bet on:**`, `Team 🅱️`, true)
                                .addField(`**Wager**`, `${coinInput} coins`, true)
                                .addField(`**Results**`, `**Lost Amount -** ${finalAddB} coins \n **Balance -** ${newBal}`)
                                .setFooter(`not everyone can be a winner...`);

                            return channel.send(LossEmbed);
                        }
                    }
                    else {
                        let takeAmount = Math.floor(coinInput / 2);
                        ecoDatabase[sender.id].Coins = currcoins - takeAmount;
                        writeEcoData();

                        return channel.send(`Time ran out! Dropping out, I don't think so! \n don't mind if I do snag half of your wager, **${takeAmount} coins**, odds must have been bad.`);
                    }
                })
            }
            else if(parseInt(splitmessagespace[0].substr(6)) < 100){
                return channel.send(`You can't gamble less than **100 coins**, you what they say: *"go big or go home a loser"*`);
            }
            else{
                let gamEmbed = new Discord.MessageEmbed()
                    .setColor(moneyColor)
                    .setTitle(`:slot_machine: ${serverName} Casino`)
                    .addField(`HOW`, `**bet [amount] -** enter a bet for a \n chance to win big! (or lose hard) \n - React with the team emoji to bet, \n if you don't you lose half your money \n Ex. **ai/bet 400**`)
                    .setFooter(`imma go all in!`)

                return channel.send(gamEmbed);
            }
        }
        if(message.content == `${prefix}shop`){
            if(ranksonData === false){

                return ranksOffNotif();
            }
            
            let currcoinsComma = numberWithCommas(currcoins);
            

            let shopEmbed = new Discord.MessageEmbed()
                .setColor(moneyColor)
                .setTitle(`:shopping_bags: Astrobe Shop`)
                .setDescription(`**Bal -** ${currcoinsComma} coins` + "\n `ai/buy [item name]`")
                .addField(`**:gem: ITEMS**`, "**ai/shop items**", true)
                .addField(`**:bar_chart: RANK CARD**`, "**ai/shop cards**", true)
                .addField(`**:clap: CLUBS**`, "**ai/clubs**", true)
                .addField(`**:gift: SELL ITEMS**`, "**ai/sell**", true)

            channel.send(shopEmbed);
        }
        if(message.content.startsWith(`${prefix}shop cards`)){
            if(ranksonData === false){

                return ranksOffNotif();
            }
            
            let currcoinsComma = numberWithCommas(currcoins);
            
            let finalBacks = ["unavailable"];
            let finalColors = ["unavailable"]
            let ownedItems = new Map;

            let prices = [0, 3500, 3500, 4000, 5500, 6000];
            let pricesCol = [0, 400, 400, 1000, 500, 700, 600, 600, 500, 900];

            //set the display for backgrounds from array
            for (let index = 0; index < backgroundImOps.length; index++) {
                for (let j = 0; j < backgroundsSplit.length; j++) {
                    if(backgroundImOps[index] == backgroundsSplit[j]){
                        finalBacks[index] = `${backgroundImOps[index]} - ai/setcard`;
                        ownedItems.set(backgroundImOps[index]);
                    }
                    else{
                        finalBacks[index] = `**${backgroundImOps[index]} -** ${itemList.get(backgroundImOps[index])} coins`;
                    }
                }
            }

            //set display for colors from Map/Collection form
            let ind = 0;
            barColorOps.forEach(listCol);

            function listCol(value, key, map){
                for (let j = 0; j < barcolorSplit.length; j++) {
                    if(key == barcolorSplit[j]){
                        finalColors[ind] = `${key} - ai/setcolor`;
                        ownedItems.set(key);
                    }
                    else if(!ownedItems.has(key)){
                        finalColors[ind] = `**${key} -** ${itemList.get(key)} coins`;
                    }
                }

                ind++

            }

            

            let shopEmbed = new Discord.MessageEmbed()
                .setColor(moneyColor)
                .setTitle(`:shopping_bags: Astrobe Shop: Rank Cards`)
                .setDescription(`**Bal -** ${currcoinsComma} coins` + "\n `ai/buy [item name]`")
                .addField(`**:yellow_square: BAR COLORS**`, `${finalColors.join("\n")}`, true)
                .addField(`**:frame_photo: BACKGROUND**`, `${finalBacks.join("\n")}`, true)

            channel.send(shopEmbed);
        }
        else if(message.content.startsWith(`${prefix}setcard`)){
            if(ranksonData === false){

                return ranksOffNotif();
            }

            var itemInput = splitmessagespace[0].substr(11);

            if(itemInput.length < 1){
                let cusEmbed = new Discord.MessageEmbed() //C:\ffmpeg\bin
                    .setColor(moneyColor)
                    .setTitle(':art: How to Customize Your Rank Card:')
                    .addField(`**Options**`, `**setbar [color]** \n change the xp bar color \n **setcard [color]** \n change the background color`, true)
                    .addField(`**Owned Colors**`, `**Bar Colors** \n ${barcolorSplit.join(", ")} \n **Backgrounds** \n ${backgroundsSplit.join(", ")}`, true)
                    .setFooter("btw you need to own these items, get them with ai/shop cards")
    
                return channel.send(cusEmbed);
            }
            else if(backgroundImMap.has(itemInput)){
                for (let index = 0; index < backgroundsSplit.length; index++) {
                    if(itemInput === backgroundsSplit[index]){
                        let copyIndex = backgroundsSplit.indexOf(itemInput);
                        backgroundsSplit.splice(copyIndex, 1);

                        ecoDatabase[sender.id].CardIm = itemInput + "~" + backgroundsSplit.join('~');
                        channel.send(`Your rank card background has been set to **${itemInput}**!`);
                        return writeEcoData();
                    }
                }

                return channel.send(`it would appear that you don't own this color...`);
            }
            else{
                return channel.send(`umm, what if I told you an item by the name of **${itemInput}** didn't exist?`);
            }

        }
        else if(message.content.startsWith(`${prefix}setbar`)){
            if(ranksonData === false){

                return ranksOffNotif();
            }

            var itemInput = splitmessagespace[0].substr(10);

            if(itemInput.length < 1){
                let cusEmbed = new Discord.MessageEmbed() //C:\ffmpeg\bin
                    .setColor(moneyColor)
                    .setTitle(':art: How to Customize Your Rank Card:')
                    .addField(`**Options**`, `**setbar [color]** \n change the xp bar color \n **setcard [color]** \n change the background color`, true)
                    .addField(`**Owned Colors**`, `**Bar Colors** \n ${barcolorSplit.join(", ")} \n **Backgrounds** \n ${backgroundsSplit.join(", ")}`, true)
                    .setFooter("btw you need to own these items, get them with ai/shop cards")
    
                return channel.send(cusEmbed);
            }
            else if(barColorOps.has(itemInput)){
                for (let index = 0; index < barcolorSplit.length; index++) {
                    if(itemInput === barcolorSplit[index]){
                        let copyIndex = barcolorSplit.indexOf(itemInput);
                        barcolorSplit.splice(copyIndex, 1);

                        ecoDatabase[sender.id].BarCol = itemInput + "~" + barcolorSplit.join('~');
                        channel.send(`Your rank card xp bar color has been set to **${itemInput}**!`);
                        return writeEcoData();
                    }
                }

                return channel.send(`it would appear that you don't own this color...`);
            }
            else{
                return channel.send(`umm, what if I told you an item by the name of **${itemInput}** didn't exist?`);
            }

        }
        else if(message.content.startsWith(`${prefix}buy`)){
            if(ranksonData === false){

                return ranksOffNotif();
            }

            var itemInput = splitmessagespace[0].substr(6);

            if(itemInput.length < 1){
                let buyEmbed = new Discord.MessageEmbed() //C:\ffmpeg\bin
                    .setColor(moneyColor)
                    .setTitle(':shopping_cart: How to Buy Items:')
                    .addField(`**About**`, `Use this command to buy any item from the shop \n Ex. **ai/buy credit card**`, true)
                    .addField(`**How**`, `**- ai/buy [item name]** call the command and then \n the item's that you want to buy name`, true)
                    .setFooter("There is always a confirm purchase!")
    
                return channel.send(buyEmbed);
            }
            else if(itemList.has(itemInput)){
                let ownedItems = new Map();
                if(barColorOps.has(itemInput)){
                    //set display for colors from Map/Collection form
                    let ind = 0;
                    barColorOps.forEach(listCol);
        
                    function listCol(value, key, map){
                        for (let j = 0; j < barcolorSplit.length; j++) {
                            if(key == barcolorSplit[j]){
                                ownedItems.set(key);
                            }
                        }
        
                        ind++
        
                    }
                }
                else if(backgroundImMap.has(itemInput)){
                    for (let index = 0; index < backgroundImOps.length; index++) {
                        for (let j = 0; j < backgroundsSplit.length; j++) {
                            if(backgroundImOps[index] == backgroundsSplit[j]){
                                ownedItems.set(backgroundImOps[index]);
                            }
                        }
                    }
                }
                else{
                    for (let index = 0; index < currItems.length; index++) {
                       if(currItems[index] == itemInput){
                           ownedItems.set(currItems[index]);
                           
                       }
                    }
                    
                }

                if(ownedItems.has(itemInput)){
                    return channel.send(`You can't fool meh SCUM! You already own this item!`);
                }
                let takeAmount = itemList.get(itemInput);
                let taxPer = 1.09;
                let finalCharge = Math.floor(takeAmount * taxPer);

                let amountEmbed = new Discord.MessageEmbed()
                    .setColor(moneyColor)
                    .setTitle(`:bank: Confirm Order`)
                    .addField(`**Payment Info**`, `**Item -** ${itemInput} \n **Price -** ${takeAmount} coins \n **Tax -** 9%`, true) //here
                    .addField(`**Charge**`, `${takeAmount} X ${taxPer}` + ' `9% Tax`' + ` \n **Your Total -** ${finalCharge} coins`, true)
                    .addField(`**CONFIRM**`, `✅ **| Confirm Send Coins**`)
                    .setFooter(`You have 30 seconds to confirm`, sender.user.displayAvatarURL({ format: "png" }));

                return channel.send(amountEmbed).then( async (sentEmbed) => { //send the payment
                    await sentEmbed.react("✅");

                    const filter = (reaction, user) => reaction.emoji.name === '✅' && user.id == sender.user.id;
                    const confirmResults = await sentEmbed.awaitReactions(filter, { time: 30000 })

                    if (confirmResults.has('✅')){
                        let newBal = currcoins - finalCharge;
                        ecoDatabase[sender.id].Coins = newBal;
                        
                        if(backgroundImMap.has(itemInput)){
                            ecoDatabase[sender.id].CardIm = itemInput + '~' + cardImage;
                        }
                        else if(barColorOps.has(itemInput)){
                            ecoDatabase[sender.id].BarCol = itemInput + '~' + barcolor;
                        }
                        else{
                            
                        }

                        writeEcoData();

                        let sentEmbed = new Discord.MessageEmbed()
                            .setColor(moneyColor)
                            .setTitle(`:bank: Item Purchase Complete`)
                            .addField(`**Payment Info**`, `**Payed To -** Astrobe Store Limited \n**Charged -** ${finalCharge} coins \n **Balance -** ${newBal} coins`, true)
                            .setFooter(`Payment from ${sender.user.username}`, sender.user.displayAvatarURL({ format: "png" }));

                        return channel.send(sentEmbed);
                    }
                    else{
                        let itemCost = itemList.get(itemInput);
                        let takeAmount = Math.floor(itemCost * 0.10);
                        let newBal = currcoins - takeAmount;

                        ecoDatabase[sender.id].Coins = newBal;
                        writeEcoData();

                        let cancelEmbed = new Discord.MessageEmbed()
                            .setColor(softRed)
                            .setTitle(`:bank: Cancelation Fee`)
                            .addField(`**Cancel Info**`, `**Price -** ${itemCost} \n **Cancel Fee -** 10%`, true)
                            .addField(`**Total Charge**`, `${itemCost} X 0.10` + ' `10% Fee`' + ` \n **Total Charge -** ${takeAmount} coins`, true)
                            .addField(`**Your Balance**`, `**${newBal} coins**`)
                            .setFooter(`${sender.user.username} canceled order`, sender.user.displayAvatarURL({ format: "png" }));

                        return channel.send(cancelEmbed);
                    }
                    
                })
            }

        }
        else if(message.content.startsWith(`${prefix}convert`)){
            if(ranksonData === false){

                return ranksOffNotif();
            }

            let conRate = 4;
            let levelCoins = rankLengthData * 3;

            if(parseInt(splitmessagespace[0].substr(11)) >= 50){
                let xpInput = parseInt(splitmessagespace[0].substr(11));

                if(xpInput > currxp){
                    return channel.send("nope, you don't even have that much xp!");
                }
                else if(xpInput == currxp){
                    channel.send("All in, just how I like it!");
                }

                let finalAdd = Math.floor(xpInput * conRate);

                let conEmbed = new Discord.MessageEmbed()
                    .setColor(moneyColor)
                    .setTitle(`:inbox_tray: XP to Coins Convertion`)
                    .addField(`**Stats**`, `**Bal -** ${numberWithCommas(currcoins)} coins \n **XP -** ${numberWithCommas(currxp)} | lvl ${currlvl}`, true)
                    .addField(`**Convertion Rate**`, `**Rate -** ${conRate} coins per 1 xp :arrow_up_small: \n **1 lvl -** ${numberWithCommas(levelCoins)} coins`, true)
                    .addField(`**Calculations**`, `${xpInput} X ${conRate} \n **Gained Coins -** ${numberWithCommas(finalAdd)} coins`, false)
                    .addField(`**Confirm**`, `✅ **| Confirm Convertion**`, false)
                    .setFooter(`Don't loose all of it to bets!?`, sender.user.displayAvatarURL({ format: "png" }))

                return channel.send(conEmbed).then( async (sentEmbed) => {
                    await sentEmbed.react("✅");

                    const filter = (reaction, user) => reaction.emoji.name === '✅' && user.id == sender.user.id;
                    const betResults = await sentEmbed.awaitReactions(filter, { time: 30000 })
                    
                    if (betResults.has('✅')){
                        let newXp = currxp - xpInput;
                        xp[sender.id].xp = newXp;
                        xp[sender.id].level = Math.ceil(newXp / rankLengthData);
                        ecoDatabase[sender.id].Coins = currcoins + finalAdd;
                        writeEcoData();
                        writeServerData();
                        
                        let sentEmbed = new Discord.MessageEmbed()
                            .setColor(moneyColor)
                            .setTitle(`:bank: Convertion Complete`)
                            .addField(`**Payment Info**`, `**Gained Coins -** ${numberWithCommas(finalAdd)} coins ✅ \n**Xp -** ${currxp - xpInput} xp \n **Balance -** ${currcoins + finalAdd} coins`, true)
                            .setFooter(`Payment from ${sender.user.username}`, sender.user.displayAvatarURL({ format: "png" }));

                        return channel.send(sentEmbed);
                    }
                    else {
                        let cancelEmbed = new Discord.MessageEmbed()
                            .setColor(softRed)
                            .setTitle(`:bank: Convertion Cancelation`)
                            .addField(`**Cancel Info**`, `**Amount -** ${xpInput} xp \n **Coin Value -** ${finalAdd}`, true)
                            .addField(`**Total Charge**`, `0 X 1` + ' `no Fees`' + ` \n **Total Charge -** 0 coins`, true)
                            .addField(`**Your Balance**`, `**${currcoins} coins**`)
                            .setFooter(`${sender.user.username} canceled`, sender.user.displayAvatarURL({ format: "png" }));

                        return channel.send(cancelEmbed);
                    }
                })
            }
            else if(parseInt(splitmessagespace[0].substr(11)) < 50){
                return channel.send(`You can't convert less than **50 xp points** because, I SAID SO`);
            }
            else{

                let gamEmbed = new Discord.MessageEmbed()
                    .setColor(moneyColor)
                    .setTitle(`:inbox_tray: XP to Coins Convertion Info`)
                    .addField(`**Stats**`, `**Bal -** ${numberWithCommas(currcoins)} coins \n **XP -** ${numberWithCommas(currxp)} | lvl ${currlvl}`, true)
                    .addField(`**Convertion Rate**`, `**Rate -** ${conRate} coins per 1 xp :arrow_up_small: \n **1 lvl -** ${numberWithCommas(levelCoins)} coins`, true)
                    .addField(`**How**`, `**ai/convert [amount]** \n type how many of your xp points you want to convert to coins`, false)
                    .setFooter(`are the stocks up?`, sender.user.displayAvatarURL({ format: "png" }))

                return channel.send(gamEmbed);
            }
        }
    }

    async function ranksOffNotif(){
        let calcOff = await RandomNumber(0, 7);

        if(calc === 0){
            return channel.send(`Ranks were turned off in this server`);
        }
        if(calc === 2){
            return channel.send(`Okay who turned of the ranks, shoot the econemy too! Unacceptable, someone's gonna die tonight...`);
        }
        if(calc === 3){
            return channel.send(`A sad moment in history, ranks were turned off :()`);
        }
        if(calc === 4){
            return channel.send(`I'm afraid that ${serverName} is not a primie location, the property value is going down since the ranks were turned off... pack your bags!`);
        }
        if(calc === 5){
            let owner = message.guild.members.cache.get(message.guild.ownerID);
            return channel.send(`Your going to have to ask manager ${owner.user.username} about this one...`);
        }
        if(calc === 6){
            return channel.send(`Letz be honest boiz, you know the end is near when ranks are turned off...`);
        }
        if(calc === 7){
            return channel.send(`Why do I even have the option to turn the ranks off, big mistake...`);
        }
        if(calc === 7){
            return channel.send(`Ok who pooped on the party, because the ranks are off`);
        }
        else{
            return channel.send(`The owner of ${serverName} has turned off the rank and econemy system,\n why you ask? ` + "¯\\_(ツ)_/¯");
            
        }
        
    }

    writeServerData();
    //database functions
    function writeServerData(){
        fs.writeFile("./guilds.json", JSON.stringify(serverDatabase, null, 4), (err) => {
            if(err) console.log(err)
        });
    }

    function writeEcoData(){
        fs.writeFile("./eco.json", JSON.stringify(ecoDatabase, null, 4), (err) => {
            if(err) console.log(err)
        });
    }

    if(sender.id == "711158379803836487"){
        let promoCalc = Math.floor((Math.random() * 10) + 1);
    
        if(promoCalc === 1){
            channel.send("F off Alan, malk is just expired milk");
        }
        else if(promoCalc === 2){
            channel.send("yeah yeah yeah, keep saying that alan...");
        }
        else if(promoCalc === 3){
            message.channel.send("nobody even wants that stuff");
        }
        else if(promoCalc === 3){
            message.channel.send("**ALAN**");
        }
        else if(promoCalc === 4){
            message.channel.send("how bout no");
        }
        else if(promoCalc === 5){
            message.channel.send("can I just have real milk...");
        }
        else if(promoCalc === 6){
            message.channel.send("you ever heard the word **NO** before?");
        }
        else if(promoCalc === 7){
            message.channel.send("I am honestly concerned for your wellbeing alan");
        }
    }
    if(member != undefined){
        if(member.id === botID && !message.content.startsWith(`${prefix}report`) && !message.content.startsWith(`${prefix}ban`) && !message.content.startsWith(`${prefix}demote`) && !message.content.startsWith(`${prefix}promote`)){
            let promoCalc = await RandomNumber(0, 16, 1);

            if(promoCalc === 1){
                channel.send("Don't even try...");
            }
            else if(promoCalc === 2){
                channel.send("I'd keep that mouth of yours shut");
            }
            else if(promoCalc === 3){
                message.channel.send("Imma bout to beat chu");
            }
            else if(promoCalc === 3){
                message.channel.send("Okay who pings bots in 2020...");
            }
            else if(promoCalc === 4){
                message.channel.send("breh");
            }
            else if(promoCalc === 5){
                message.channel.send("could you not");
            }
            else if(promoCalc === 6){
                message.channel.send("I am triggered, and I'm ready to destroy");
            }
            else if(promoCalc === 7){
                message.channel.send("And I will strike down upon thee with great strength and furious anger...");
            }
            else if(promoCalc === 8){
                message.channel.send("ok what is it this time");
            }
            else if(promoCalc === 9){
                message.channel.send("I will DESTROY");
            }
            else if(promoCalc === 10){
                message.channel.send("I've heard enough from this ||*a* hO1Ɇ||");
            }
            else if(promoCalc === 11){
                message.channel.send("loser...");
            }
            else if(promoCalc === 12){
                message.channel.send("if you want to be lame, can do it somewhere else");
            }
            else if(promoCalc === 13){
                message.channel.send("I'd be careful if I were you...");
            }
            else if(promoCalc === 14){
                message.channel.send("just stop, like no one cares");
            }
        }
    }

    if(message.content.startsWith(`${prefix}poll`)){
        if(splitmessagespace[1] === undefined) {
            let pollHowEmbed = new Discord.MessageEmbed()
                .setColor('#eead44')
                .setTitle(":chart_with_downwards_trend: " + `**How to start a poll:**`)
                .setDescription(`- Start a poll by stating the question and then \n using a ',' and space before every option \n - you can add up to as many options as you like \n Ex. **${prefix}poll Question, Option 1, Option 2, Option 3** \n Ex. **${prefix}poll What should I eat today?, 6 eggs, 13 bacon strips, el borgor, all**`)
                .setFooter("Now start a poll!")
            return channel.send(pollHowEmbed);
        }
            
        message.delete().then(async (delMessage) => {
            var final = new Array("1");

            let pollcreator = sender.user.username;
            let question = splitmessagespace[0].substr(8);
    
            splitmessagespace.shift(); //remove the ai/poll command from the array
    
            let emojis = [":pencil2: ", ":milk: ", ":eyes: ", ":yum: ", ":skull: ", ":robot: ", ":clap: ", ":mag: ", ":scroll: ", ":point_right: ", ":desktop: ", ":dvd: ", ":bellhop: ", ":computer: ", ":crown: ", ":gift: ", ":hammer_pick: ", ":bulb: ", ":books: ", ":file_folder: ", ":ok_hand: ", ":page_facing_up: ", ":green_book: ", ":loudspeaker: "];
            let reactionEmojis = ["✏️", "🥛", "👀", "😋", "💀", "🤖", "👏", "🔍", "📜", "👉", "🖥️", "📀", "🛎️", "💻", "👑", "🎁", "⚒️", "💡", "📚", "📁", "👌", "📄", "📗", "📢"]; 

            let usedEmojis = [""];
    
            let endCut = (emojis.length) - (splitmessagespace.length);
            const startpoint = await RandomNumber(0, endCut, 0);

            let shortestOP = 0;
            
    
            for (let index = 0; index < splitmessagespace.length; index++) {
                let emojiNum = startpoint + index
                final[index] = emojis[emojiNum] + ` **| ${splitmessagespace[index]}**`;
                
                if(index === 0){
                    if(splitmessagespace[index].length < splitmessagespace[splitmessagespace.length-1].length){
                        shortestOP = index;
                    }
                    else{
                        shortestOP = splitmessagespace.length-1;
                    }
                }
                else{
                    if(splitmessagespace[index].length < splitmessagespace[index-1]){
                        if(splitmessagespace[index].length < splitmessagespace[shortestOP].length){
                            shortestOP = index;
                        }
                    }
                }
            }
            
            let pollEmbed = new Discord.MessageEmbed()
                .setColor('#eead44')
                .setTitle(":chart_with_downwards_trend: " + `**${question}**`)
                .setDescription(`Lasts 5 hours \n` + final.join("\n"))
                .setFooter(`from ${sender.user.username}`, sender.user.displayAvatarURL({ format: "png" }))
    
            channel.send(pollEmbed).then(async (sentEmbed) => {
                //message.react
                reactToMessage();
                async function reactToMessage(){
                    for (let index = 0; index < splitmessagespace.length; index++) {
                        let emojiNum = startpoint + index
                        usedEmojis[index] = reactionEmojis[emojiNum];
                        await sentEmbed.react(reactionEmojis[emojiNum]); //HERE down but still
                    }
                }
                
                
                channel.messages.fetch({limit: 1}).then(async (messages) => {
                    let pollMessage = messages.cache.first();
                    
                    if(pollMessage.author.bot){
                        
                        const filter = (reaction) => {
                            
                            switch(usedEmojis.length){
                                case 1:
                                    return reaction.emoji.name === usedEmojis[0];
                                    break;
                                case 2:
                                    return reaction.emoji.name === usedEmojis[0] || reaction.emoji.name === usedEmojis[1];
                                    break;
                                case 3:
                                    return reaction.emoji.name === reaction.emoji.name === usedEmojis[0] || reaction.emoji.name === usedEmojis[1] || reaction.emoji.name === usedEmojis[2];
                                    break;
                                case 4:
                                    return reaction.emoji.name === reaction.emoji.name === usedEmojis[0] || reaction.emoji.name === usedEmojis[1] || reaction.emoji.name === usedEmojis[2] || reaction.emoji.name === usedEmojis[3];
                                    break;
                                case 5:
                                    return reaction.emoji.name === usedEmojis[0] || reaction.emoji.name === usedEmojis[1] || reaction.emoji.name === usedEmojis[2] || reaction.emoji.name === usedEmojis[3] || reaction.emoji.name === usedEmojis[4];
                                    break;
                                case 6:
                                    return reaction.emoji.name === usedEmojis[0] || reaction.emoji.name === usedEmojis[1] || reaction.emoji.name === usedEmojis[2] || reaction.emoji.name === usedEmojis[3] || reaction.emoji.name === usedEmojis[4] || reaction.emoji.name === usedEmojis[5];
                                    break;
                                case 7:
                                    return reaction.emoji.name === usedEmojis[0] || reaction.emoji.name === usedEmojis[1] || reaction.emoji.name === usedEmojis[2] || reaction.emoji.name === usedEmojis[3] || reaction.emoji.name === usedEmojis[4] || reaction.emoji.name === usedEmojis[5] || reaction.emoji.name === usedEmojis[6];
                                    break;
                                case 8:
                                    return reaction.emoji.name === usedEmojis[0] || reaction.emoji.name === usedEmojis[1] || reaction.emoji.name === usedEmojis[2] || reaction.emoji.name === usedEmojis[3] || reaction.emoji.name === usedEmojis[4] || reaction.emoji.name === usedEmojis[5] || reaction.emoji.name === usedEmojis[6] || reaction.emoji.name === usedEmojis[7];
                                    break;
                                case 9:
                                    return reaction.emoji.name === usedEmojis[0] || reaction.emoji.name === usedEmojis[1] || reaction.emoji.name === usedEmojis[2] || reaction.emoji.name === usedEmojis[3] || reaction.emoji.name === usedEmojis[4] || reaction.emoji.name === usedEmojis[5] || reaction.emoji.name === usedEmojis[6] || reaction.emoji.name === usedEmojis[7] || reaction.emoji.name === usedEmojis[8];
                                    break;
                                case 10:
                                    return reaction.emoji.name === usedEmojis[0] || reaction.emoji.name === usedEmojis[1] || reaction.emoji.name === usedEmojis[2] || reaction.emoji.name === usedEmojis[3] || reaction.emoji.name === usedEmojis[4] || reaction.emoji.name === usedEmojis[5] || reaction.emoji.name === usedEmojis[6] || reaction.emoji.name === usedEmojis[7] || reaction.emoji.name === usedEmojis[8] || reaction.emoji.name === usedEmojis[9];
                                    break;
                                case 11:
                                    return reaction.emoji.name === usedEmojis[0] || reaction.emoji.name === usedEmojis[1] || reaction.emoji.name === usedEmojis[2] || reaction.emoji.name === usedEmojis[3] || reaction.emoji.name === usedEmojis[4] || reaction.emoji.name === usedEmojis[5] || reaction.emoji.name === usedEmojis[6] || reaction.emoji.name === usedEmojis[7] || reaction.emoji.name === usedEmojis[8] || reaction.emoji.name === usedEmojis[9] || reaction.emoji.name === usedEmojis[10];
                                    break; 
                                case 12:
                                    return reaction.emoji.name === usedEmojis[0] || reaction.emoji.name === usedEmojis[1] || reaction.emoji.name === usedEmojis[2] || reaction.emoji.name === usedEmojis[3] || reaction.emoji.name === usedEmojis[4] || reaction.emoji.name === usedEmojis[5] || reaction.emoji.name === usedEmojis[6] || reaction.emoji.name === usedEmojis[7] || reaction.emoji.name === usedEmojis[8] || reaction.emoji.name === usedEmojis[9] || reaction.emoji.name === usedEmojis[10] || reaction.emoji.name === usedEmojis[11];
                                    break; 
                                case 13:
                                    return reaction.emoji.name === usedEmojis[0] || reaction.emoji.name === usedEmojis[1] || reaction.emoji.name === usedEmojis[2] || reaction.emoji.name === usedEmojis[3] || reaction.emoji.name === usedEmojis[4] || reaction.emoji.name === usedEmojis[5] || reaction.emoji.name === usedEmojis[6] || reaction.emoji.name === usedEmojis[7] || reaction.emoji.name === usedEmojis[8] || reaction.emoji.name === usedEmojis[9] || reaction.emoji.name === usedEmojis[10] || reaction.emoji.name === usedEmojis[11] || reaction.emoji.name === usedEmojis[12];
                                    break; 
                                case 14:
                                    return reaction.emoji.name === usedEmojis[0] || reaction.emoji.name === usedEmojis[1] || reaction.emoji.name === usedEmojis[2] || reaction.emoji.name === usedEmojis[3] || reaction.emoji.name === usedEmojis[4] || reaction.emoji.name === usedEmojis[5] || reaction.emoji.name === usedEmojis[6] || reaction.emoji.name === usedEmojis[7] || reaction.emoji.name === usedEmojis[8] || reaction.emoji.name === usedEmojis[9] || reaction.emoji.name === usedEmojis[10] || reaction.emoji.name === usedEmojis[11] || reaction.emoji.name === usedEmojis[12] || reaction.emoji.name === usedEmojis[13];
                                    break;
                                case 15:
                                    return reaction.emoji.name === usedEmojis[0] || reaction.emoji.name === usedEmojis[1] || reaction.emoji.name === usedEmojis[2] || reaction.emoji.name === usedEmojis[3] || reaction.emoji.name === usedEmojis[4] || reaction.emoji.name === usedEmojis[5] || reaction.emoji.name === usedEmojis[6] || reaction.emoji.name === usedEmojis[7] || reaction.emoji.name === usedEmojis[8] || reaction.emoji.name === usedEmojis[9] || reaction.emoji.name === usedEmojis[10] || reaction.emoji.name === usedEmojis[11] || reaction.emoji.name === usedEmojis[12] || reaction.emoji.name === usedEmojis[13] || reaction.emoji.name === usedEmojis[14];
                                    break; 
                                case 16:
                                    return reaction.emoji.name === usedEmojis[0] || reaction.emoji.name === usedEmojis[1] || reaction.emoji.name === usedEmojis[2] || reaction.emoji.name === usedEmojis[3] || reaction.emoji.name === usedEmojis[4] || reaction.emoji.name === usedEmojis[5] || reaction.emoji.name === usedEmojis[6] || reaction.emoji.name === usedEmojis[7] || reaction.emoji.name === usedEmojis[8] || reaction.emoji.name === usedEmojis[9] || reaction.emoji.name === usedEmojis[10] || reaction.emoji.name === usedEmojis[11] || reaction.emoji.name === usedEmojis[12] || reaction.emoji.name === usedEmojis[13] || reaction.emoji.name === usedEmojis[14] || reaction.emoji.name === usedEmojis[15];
                                    break; 
                                case 17:
                                    return reaction.emoji.name === usedEmojis[0] || reaction.emoji.name === usedEmojis[1] || reaction.emoji.name === usedEmojis[2] || reaction.emoji.name === usedEmojis[3] || reaction.emoji.name === usedEmojis[4] || reaction.emoji.name === usedEmojis[5] || reaction.emoji.name === usedEmojis[6] || reaction.emoji.name === usedEmojis[7] || reaction.emoji.name === usedEmojis[8] || reaction.emoji.name === usedEmojis[9] || reaction.emoji.name === usedEmojis[10] || reaction.emoji.name === usedEmojis[11] || reaction.emoji.name === usedEmojis[12] || reaction.emoji.name === usedEmojis[13] || reaction.emoji.name === usedEmojis[14] || reaction.emoji.name === usedEmojis[15] || reaction.emoji.name === usedEmojis[16];
                                    break; 
                            }
                        };

                        const results = await pollMessage.awaitReactions(filter, { time: 18000000 }) //5 hours in milliseconds 18000000
                        pollMessage.delete(0);
                        let score = 0;
                        let resultNum = 0;
                        //results
                        for (let index = 0; index < usedEmojis.length; index++) {
                            let usedSpace = usedEmojis[index] + " "
                            let shortenedSplit = await ShortenString(splitmessagespace[index],splitmessagespace[shortestOP].length, "...")

                            if(results.has(usedEmojis[index])){
                                resultNum = Number(results.get(usedEmojis[index]).count-1);

                                if(resultNum > score){
                                    score = resultNum;
                                }
                                final[index] = shortenedSplit + " | " + usedSpace.repeat(resultNum);
                            }
                            else{
                                final[index] = shortenedSplit + " | ";
                            }
                        }

                        for (let index = 0; index < usedEmojis.length; index++) {
                            let usedSpace = usedEmojis[index] + " "
                            let shortenedSplit = ShortenString(splitmessagespace[index],splitmessagespace[shortestOP].length, "...")

                            if(results.has(usedEmojis[index])){
                                resultNum = Number(results.get(usedEmojis[index]).count-1);

                                if(resultNum === score && score > 0){
                                    
                                    final[index] = `**${shortenedSplit}**` + " | " + usedSpace.repeat(resultNum) + ".........| :trophy:";
                                }
                            }
                            
                        }

                        let pollResEmbed = new Discord.MessageEmbed()
                            .setColor('#eead44')
                            .setTitle(":bar_chart: " + `Results for: **${question}**`)
                            .setDescription(final.join("\n"))
                            .setFooter(`from ${sender.user.username}`, sender.user.displayAvatarURL({ format: "png" }))
                        return channel.send(pollResEmbed);
                    }
                }) 
            })
        })
    }

    //music commands
    if(message.content.startsWith(`${prefix}customstream`)){
        if(serverName != devServer)
            return ErrorEmbed("This command can only be used in the Treixatek Dev server, nice try tho!");
        else if(member === undefined || member === null)
            return ErrorEmbed("A user was not mentioned")
        else if(member.bot)
            return ErrorEmbed("You cannot use this command on a bot")

        let liveRoleID = '713813908577583106';
        let liveRole = message.guild.roles.find(role => role.id === liveRoleID)
        let updateChannel = message.guild.channels.get("639189304379179008")
        let notiRole = message.guild.roles.find(role => role.id === "714250563163783199")

        if(member.roles.has(liveRoleID)){
            member.removeRole(liveRole);
            let liveEmbed = new Discord.MessageEmbed()
                .setColor('#00ffea')
                .setTitle(":movie_camera: " + `**Stream Ended**`)
                .setDescription(`${member}'s stream just ended, catch the next one!`)
                .setFooter("aw man")
            updateChannel.send(liveEmbed);

            
        }
        else{
            member.addRole(liveRole);
            let liveEmbed = new Discord.MessageEmbed()
                .setColor('#00ffea')
                .setTitle(":movie_camera: " + `**Streaming Now!**`)
                .setDescription(`${notiRole}, ${member} is live now! \n Go watch!`)
                .setFooter("Stream time!")
            updateChannel.send(liveEmbed);

            let notiStreamerEmbed = new Discord.MessageEmbed()
                .setColor('#00ffea')
                .setTitle(":movie_camera: " + `**Your stream is featured!**`)
                .setDescription(`Notification role holders have been \n pinged that your stream is live!`)
                .setFooter("Stream time!")
            member.send(notiStreamerEmbed);

            updateChannel.send(`${notiRole} yo new stream!`).then( msg => {
                msg.delete(0);
            })
        }  
        message.delete(0);            
    }

    if(message.content.startsWith(`${prefix}play`)){
        var songInput = splitmessagespace[0].substr(8);
        var videoName = "video not found."

        function play(connection, message){
            var server = servers[serverID];
            let vidName = server.queueNames[0];

            server.dispatcher = connection.playStream(ytdl(server.queue[0], {
                filter: "audioonly",
                highWaterMark: 1 << 25,

            }));
            channel.send(`:microphone2: Now playing **${vidName}!**`)
            server.queue.shift();
            server.queueNames.shift();

            server.dispatcher.on("end", function(){
                if(server.queue[0]){
                    play(connection, message);
                }
                else{
                    channel.send(":skull: No more songs in the queue, party's over :()")
                    connection.disconnect();
                }
            });
        }

        if(songInput.length < 2){
            let musicEmbed = new Discord.MessageEmbed() //ffmpeg
                .setColor(musicColor)
                .setTitle(':saxophone: How to play music:')
                .setDescription(`- Join a voice channel in the server first \n- Type the command followed by a space and the name of the song or a youtube link the the song \n **Ex. ${prefix}play astronomia**`)
                .setFooter("commands: play, pause, skip, queue")

            return channel.send(musicEmbed);
        }
        else if(!sender.voiceChannel){
            return channel.send("Join a voice channel to witness my musical awesomeness! :saxophone:");
        }
        else{
            /*
            if(!songInput.startsWith("https://www.youtube.com/watch?v=") && !songInput.startsWith("https://youtu.be/mKP8FnoIvrY")){
                
            }*/
            search(songInput, async function (err, r) {
                var video = await r.videos[0];
                if(video === undefined){
                    return channel.send(`I could not find a song with the name **${songInput}**`)
                }

                client.user.setActivity(`${prefix}help | ` + activities[1]);

                videoName = video.title.toString();
                songInput = video.url.toString();
                
                let senderName = sender.user.username;

                message.delete(0);
                if(!servers[serverID]) servers[serverID] = {
                    queue: [],
                    queueNames: [],
                }

                var server = servers[serverID];

                server.queue.push(songInput);
                server.queueNames.push(videoName);
                channel.send(`:trumpet: **${senderName}** has added **${videoName}** to the queue`)

                if(!message.guild.voiceConnection){
                    sender.voiceChannel.join().then(function(connection) {
                        play(connection, message);
                    })
                }
            })
            
        }
    }

    if(message.content.startsWith(`${prefix}queue`) || message.content.startsWith(`${prefix}q`)){
        var server = servers[serverID];
        var sQueue = "";
        if(server != undefined){
            sQueue = server.queueNames;
        }
        
        let final = ["the queue is empty"];

        for (let index = 0; index < sQueue.length; index++) {
            final[index] = (index + 1) + " - " + sQueue[index];
        }

        let queueEmbed = new Discord.MessageEmbed()
                .setColor(musicColor)
                .setTitle(':saxophone: Music Queue')
                .setDescription("**Up next:** \n" + final.join("\n"))
                .setFooter("commands: play, skip, queue, leave")

        return channel.send(queueEmbed);
    }    

    if(message.content.startsWith(`${prefix}skip`)){
        var server = servers[serverID];
        var sQueue = server.queueNames;
        let skipperName = sender.user.username;

        if(server.dispatcher){
            channel.send(`**${skipperName}** has skipped the song`)
            server.dispatcher.end();
        }
    } 

    if(message.content.startsWith(`${prefix}leave`)){
        var server = servers[serverID];
        if(message.guild.voiceConnection){
            for(var i = server.queue.length -1; i >= 0; i--){
                server.queue.splice(i, 1);
            }

            channel.send("Ending the queue and disconnecting, the party's over! :wave:")
            server.dispatcher.end();
        }

        if(message.guild.connection){
            message.guild.voiceConnection.disconnect();
        }
    } 

    //dev tool commands
    if(message.content.startsWith(`${prefix}trello`)){
        if(trelloLinkData === "not set"){
            let TrelloEmbed = new Discord.MessageEmbed()
                .setColor('#1ad7ff')
                .setTitle(':wolf: Project Trello Board')
                .setDescription('The developer is either not working on a project right now \n or has not provided the trello link, this \n can be set in `ai/settings` by the owner or mods')

            return channel.send(TrelloEmbed);
        }
        else{
            let boardLink = trelloLinkData.Link;

            let posterMemberT = message.guild.members.cache.get(trelloLinkData.PosterID);
            let posterNameT = posterMemberT.user.username;
            let posterAvT = posterMemberT.user.displayAvatarURL({ format: "png" });

            let TrelloEmbed = new Discord.MessageEmbed()
                .setColor('#1ad7ff')
                .setTitle(':wolf: Project Trello Board')
                .setDescription(`See the progress, plans, and what is being worked on in the project! \n **Trello board link: ${boardLink}**`)
                .setFooter(posterNameT, posterAvT);

            return channel.send(TrelloEmbed);
        }  
    }

    if(message.content.startsWith(`${prefix}updates`)){
        if(lastUpdateData === "not set"){
            let updateEmbed = new Discord.MessageEmbed()
                .setColor('#eead44')
                .setTitle(':bell: Update Log')
                .setDescription("the developer has not made any entries in the update logs *yet* \n this can be done with `ai/newupdate` by the owner or a mod")

            return channel.send(updateEmbed);
        }
        //extract raw final data from database
        let UPNameData = lastUpdateData.UPName;
        let postDate = lastUpdateData.PostDate;
        let logContent = lastUpdateData.PostContent;
        //get poster name and pfp from id
        let posterMember = message.guild.members.cache.get(lastUpdateData.PosterID);
        let posterName = posterMember.user.username;
        let posterAv = posterMember.user.displayAvatarURL({ format: "png" });

        let updateEmbed = new Discord.MessageEmbed()
            .setColor('#5be57d')
            .setTitle(":partying_face: " + `${UPNameData} (${postDate}):`)
            .setDescription(`Update entries: \n` + logContent.join("\n"))
            .setFooter(posterName, posterAv)

        return channel.send(updateEmbed);
    }
    //command list commands
    if(message.content.startsWith(`${prefix}help`)){
        let helpInput = splitmessagespace[0].substr(8).toLowerCase();

        if(helpInput === 'gen'){
            if(serverID === gameServerID){
                let helpEmbed = new Discord.MessageEmbed()
                    .setColor('#eead44')
                    .setTitle(':books: Ganeral Commands')
                    .setThumbnail(client.user.displayAvatarURL({ format: "png" }))
                    .addField(`**Command List**`, "**poll -** start a 5 hour poll `(CAT)` \n **play -** play music `(CAT)` \n **meme -** see some memes, and vote on them! \n **topmemes -** The list of the top 3 most upvoted memes \n**report -** report a user for violations `(CAT)`")
                    .addField(`**Astro Influx**`, "**looking4match -** gives role to ping when a match is posted and shows people looking for a match \n **waiting list -** see the list of people waiting for a match")
                    .setFooter("leave input for commands with (CAT) empty to see how to use the command catagory")

                return channel.send(helpEmbed);
            }
            else{
                let helpEmbed = new Discord.MessageEmbed()
                    .setColor('#eead44')
                    .setTitle(':books: Ganeral Commands')
                    .setThumbnail(client.user.displayAvatarURL({ format: "png" }))
                    .addField(`**Command List**`, "**poll -** start a 5 hour poll `(CAT)` \n **play -** play music `(CAT)` \n **meme -** see some memes, and vote on them! \n **topmemes -** The list of the top 3 most upvoted memes \n**report -** report a user for violations `(CAT)`")
                    .setFooter("leave input for commands with (CAT) empty to see how to use the command catagory")

                return channel.send(helpEmbed);
            }
            
        }
        else if(helpInput === 'dev'){
            let helpEmbed = new Discord.MessageEmbed()
                .setColor('#eead44')
                .setTitle(':books: Commands For Dev Servers')
                .setThumbnail(client.user.displayAvatarURL({ format: "png" }))
                .addField(`**Command List**`, "**trello -** provides the link to the developer's trello board \n **updates -** provides a list of milestones in the project's update")
                .setFooter("leave input for commands with (CAT) empty to see how to use the command catagory")

            return channel.send(helpEmbed);
        }
        else if(helpInput === 'eco'){
            if(ranksonData){
                let helpEmbed = new Discord.MessageEmbed()
                    .setColor('#eead44')
                    .setTitle(':books: Econemy Commands')
                    .setThumbnail(client.user.displayAvatarURL({ format: "png" }))
                    .addField(`**General Commands**`, "**shop -** See the shop and buy or sell items and join clubs! `(CAT)` \n **bal -** See your, or a user's coins, expenses and clubs \n **daily -** collect coins that are offered every 24 hours \n **bet -** bet coins on a team to gain coins! `(CAT)` \n **convert -** give up some xp to recieve coins `(CAT)` \n **transfer -** send coins to a user or friend!")
                    .addField(`**Item Commands**`, "**buy -** use this to buy items from the shop! `(CAT)` \n **setcard -** change your rank card image to another you own `(CAT)` \n **setbar -** change the color of the xp bar on the rank card to another you own `(CAT)`")
                    .setFooter("leave input for commands with (CAT) empty to see how to use the command catagory")

                return channel.send(helpEmbed);
            }
            else{
                let helpEmbed = new Discord.MessageEmbed()
                    .setColor('#eead44')
                    .setTitle(':books: Econemy Commands')
                    .setThumbnail(client.user.displayAvatarURL({ format: "png" }))
                    .addField(`**General Commands**`, ":no_entry_sign: **RANKS & ECONEMY WERE TURNED OFF IN THIS SERVER** \n ¯\\_(ツ)_/¯")
                    .addField(`**Item Commands**`, "Turned off")
                    .setFooter("leave input for commands with (CAT) empty to see how to use the command catagory")

                return channel.send(helpEmbed);
            }
            
        }
        else if(helpInput === 'rank'){
            if(ranksonData){
                let helpEmbed = new Discord.MessageEmbed()
                    .setColor('#eead44')
                    .setTitle(':books: Rank Commands')
                    .setThumbnail(client.user.displayAvatarURL({ format: "png" }))
                    .addField(`**Command List**`, "**rank -** See your rank, level & xp on your rank card! \n **leaders -** The the server's leaderboard")
                    .addField(`**Rank/Econemy**`, "**convert -** give up some xp to recieve coins `(CAT)`")
                    .setFooter("leave input for commands with (CAT) empty to see how to use the command catagory")

                return channel.send(helpEmbed);
            }
            else{
                let helpEmbed = new Discord.MessageEmbed()
                    .setColor('#eead44')
                    .setTitle(':books: Rank Commands')
                    .setThumbnail(client.user.displayAvatarURL({ format: "png" }))
                    .addField(`**Command List**`, ":no_entry_sign: **RANKS & ECONEMY WERE TURNED OFF IN THIS SERVER** \n ¯\\_(ツ)_/¯")
                    .addField(`**Rank/Econemy**`, "Turned off")
                    .setFooter("leave input for commands with (CAT) empty to see how to use the command catagory")

                return channel.send(helpEmbed);
            }
        }
        else if(helpInput === 'game'){
            let helpEmbed = new Discord.MessageEmbed()
                .setColor('#eead44')
                .setTitle(':books: Mini Games')
                .setThumbnail(client.user.displayAvatarURL({ format: "png" }))
                .addField(`**Bot Mini Games**`, "**bet -** Sports bet time! Win big! `(CAT)` \n **Counting -** You know the deal here, count! \n **Matcher -** Pick the color of the word, or the writen word?")
                .addField(`Random Events`, `Random events will appear in active chats and provide xp rewards`)
                .addField(`**Rewards**`, "Minigames provide XP or coins as \n rewards for completing the task")
                .setFooter("leave input for commands with (CAT) empty to see how to use the command catagory")

            return channel.send(helpEmbed);
        }
        else if(helpInput === 'mod'){
            if(specialServer){
                let helpEmbed = new Discord.MessageEmbed()
                    .setColor('#eead44')
                    .setTitle(':books: Mod Commands')
                    .setThumbnail(client.user.displayAvatarURL({ format: "png" }))
                    .addField(`**Command List**`, "**- warn** \n **- kick** \n **- ban** \n **- promote** \n **- demote** \n **- clear** \n **- rroles** (reaction roles)")
                    .addField(`**Setup Bot**`, "**- settings:** set server variables and other tools `(CAT)`")
                    .setFooter("leave input for commands with (CAT) empty to see how to use the command catagory")

                return channel.send(helpEmbed);
            }
            else{
                let helpEmbed = new Discord.MessageEmbed()
                    .setColor('#eead44')
                    .setTitle(':books: Mod Commands')
                    .setThumbnail(client.user.displayAvatarURL({ format: "png" }))
                    .addField(`**Command List**`, "**- warn** \n **- kick** \n **- ban** \n **- promote** \n **- demote** \n **- clear** \n **- rroles** (reaction roles)")
                    .addField(`**Setup Bot :warning:**`, "**- settings:** set server variables and other tools `(CAT)`")
                    .setFooter("leave input for commands with (CAT) empty to see how to use the command catagory")

                return channel.send(helpEmbed);
            }
            
        }
        else{
            let genHelp = new Discord.MessageEmbed()
                .setColor(standardColor)
                .setTitle(':books: Help Catagories')
                .setThumbnail(client.user.displayAvatarURL({ format: "png" }))
                .addField(`**GENERAL**`, '`ai/help gen`', true)
                .addField(`**DEV SERVER?**`, '`ai/help dev`', true)
                .addField(`**ECONOMY**`, '`ai/help eco`', true)
                .addField(`**RANKS**`, '`ai/help rank`', true)
                .addField(`**MINI GAMES**`, '`ai/help game`', true)
                .addField(`**MODERATIVE**`, '`ai/help mod`', true)

            return channel.send(genHelp);
        }
        
    }

    if(message.content.startsWith(`${prefix}settings`)){
        if(sender.id === message.guild.ownerID || sender.roles.has(policeRoleId)){
            if(specialServer){
                let settingsEmbed = new Discord.MessageEmbed()
                    .setColor(settingColor)
                    .setTitle(':gear: Server Settings')
                    .addField(`**SETUP BOT**`, "**- modrole:** set the moderator role `(CAT)` \n **- logchannel:** set the moderative action log channel `(CAT)`")
                    .addField(`**DEV TOOLS**`, "**- settrello:** set the link to your trello board `(CAT)` \n **- newupdate:** Set the recent project update log `(CAT)`")
                    .addField(`**ECONOMY & RANKS**`, "**- reset:** reset a user's xp, rank, and coins `(CAT)` \n **- adlevel:** set the level member's need to send server invite `(CAT)` \n **- setlevel:** set the xp increase for each level `(CAT)` \n **- toggleranks:** turn on or off the rank system")
                    .setFooter("leave input for commands with (CAT) empty to see how to use the command catagory")

                return channel.send(settingsEmbed);
            }
            else{
                let settingsEmbed = new Discord.MessageEmbed()
                    .setColor(settingColor)
                    .setTitle(':gear: Server Settings')
                    .addField(`**SETUP BOT - :warning:**`, "**- modrole:** set the moderator role `(CAT)` \n **- logchannel:** set the moderative action log channel `(CAT)` \n *THESE MUST BE SET FOR THE MODERATIVE COMMANDS TO BE USED*")
                    .addField(`**DEV TOOLS**`, "**- settrello:** set the link to your trello board `(CAT)` \n **- newupdate:** Set the recent project update log `(CAT)`")
                    .addField(`**ECONOMY & RANKS**`, "**- reset:** reset a user's xp, rank, and coins `(CAT)` \n **- adlevel:** set the level member's need to send server invite `(CAT)` \n **- setlevel:** set the xp increase for each level `(CAT)` \n **- toggleranks:** turn on or off the rank system")
                    .setFooter("leave input for commands with (CAT) empty to see how to use the command catagory")

                return channel.send(settingsEmbed);
            }
            
        }
        
        
    }

    //game commands
    if(message.content.startsWith(`${prefix}looking4match`)){
        if(serverName == awoServer){
            if(!sender.roles.has("711743431151714344")){
                
                channel.send(`:partying_face: You are now added to the list of members looking for a match, you will be **notified when messages are posted in <#674799696295755837>**`);
                sender.addRole("711743431151714344");
    
                let membersWithRole = message.guild.members.cache.filter(member => { 
                    return member.roles.get("711743431151714344");
                }).map(member => {
                    return member.user.username;
                })

                if(membersWithRole.length < 1){
                    membersWithRole[0] = "No one is waiting D:";
                    channel.send('You are the only one waiting for a match');
                }
                else{
                    channel.send(`Other players waiting for a match: ${membersWithRole.join(', ')}`);
                }
            }
            else{
                message.channel.send("you no longer have the looking4match role");
                sender.removeRole("711743431151714344");
            }
        }
        else{
            ErrorEmbed("This command is only availiable in the official AWO server which is currently in being set up.")
        }
    }
    
    if(message.content.startsWith(`${prefix}waiting list`)){
        if(serverName == awoServer){
            //let membersWithRole = ["No one is waiting D:"];
            let membersWithRole = message.guild.members.cache.filter(member => { 
                return member.roles.get("711743431151714344");
            }).map(member => {
                return `**- ${member.user.username}**`;
            })
            if(membersWithRole.length < 1){
                membersWithRole[0] = "No one is waiting D:";
            }
            let embed = new Discord.MessageEmbed()
                .setColor('#eead44')
                .setTitle('Users looking for a match')
                .setThumbnail(client.user.displayAvatarURL({ format: "png" }))
                .addField(`User List`, `${membersWithRole.join("\n")}`)
                .setFooter(`${sender.user.username} requested the list`, sender.user.displayAvatarURL({ format: "png" }))

            channel.send(embed);
        }
        else{
            ErrorEmbed("This command is only availiable in the official AWO server which is currently in being set up.")
        }
    }

    if(message.content.startsWith(`${prefix}topmemes`)){
        if(topMemes.size < 1){
            return channel.send(`No memes have been voted on yet! uh oh...`)
        }

        let topList = ['empty', 'empty', 'empty'];
        let numList = [[0, 0], [0, 0], [0, 0]];
        let final = ['empty', 'empty', 'empty'];

        let alreadysorted = new Map();
        topMemes.forEach(sortMemes);

        function sortMemes(value, key, map){
            for (let index = 0; index < numList.length; index++) {
                if(!alreadysorted.has(key)){
                    let stepper = numList[index];

                    if(value[0] > stepper[0]){
                        numList.splice(index, 0, value);
                        topList.splice(index, 0, key);
                        alreadysorted.set(key);
                        console.log(numList);
                        console.log(topList);
                    }

                }
            }
        }
        
        for (let j = 0; j < numList.length; j++) {
            let votes = numList[j];
            if(votes[0] > 0){
                console.log("final" + j + ' | ' + votes);
                final[j] = `🔼 Upvotes:** ${votes[0]}**  🔽 Downvotes:** ${votes[1]}** \n **${topList[j]}** \n *use ai/meme ${j + 1} to vote*`;
            }
        }

        let testEmb = new Discord.MessageEmbed()
            .setTitle(':fire: Top Memes List')
            .setColor(standardColor)
            .setThumbnail(topList[0])
            .addField(`:first_place: **1st Place**`, `${final[0]}`)
            .addField(`:second_place: **2nd Place**`, `${final[1]}`)
            .addField(`:third_place: **3rd Place**`, `${final[2]}`)
            .setFooter(`Use: ai/meme [position number] to vote on top memes`)
        channel.send(testEmb);
    }

    if(message.content.startsWith(`${prefix}meme`)){
        let posInput = (parseInt(splitmessagespace[0].substr(8))-1);

        const subReddits = ['wholesomememes', 'AdviceAnimals', 'MemeEconomy', 'dankmemes', 'PrequelMemes', 'terriblefacebookmemes', 'ComedyCemetery', 'memes', 'lastimages', 'okbuddyretard', 'me_irl'];
        let random = subReddits[Math.floor(Math.random() * subReddits.length)];

        let img = await randomPuppy(random);

        if(!isNaN(posInput)){
            if(posInput > topMemes.size){
                return channel.send(`There are not this many memes upvoted! *You can't see the most downvoted becasue that thing is mentally damaging, trust me, I'm saving lives...*`)
            }
            else if(posInput < 0){
                return channel.send(`breh, I guess someone was going to try is and you were that one guy...`);
            }

            let topList = ['empty', 'empty', 'empty'];
            let numList = [0, 0, 0];

            let alreadysorted = new Map();
            topMemes.forEach(sortMemes);

            function sortMemes(value, key, map){
                for (let index = 0; index < numList.length; index++) {
                    if(!alreadysorted.has(key)){
                        let stepper = numList[index];

                        if(value[0] > stepper[0]){
                            numList.splice(index, 0, value);
                            topList.splice(index, 0, key);
                            alreadysorted.set(key);
                            console.log(numList);
                            console.log(topList);
                        }

                    }
                }
            }

            if(topList[posInput] == undefined){
                return channel.send(`There are not this many memes upvoted!`)
            }
            else if(topList[posInput] === 'empty'){
                return channel.send(`that would be a no`);
            }
            else{
                img = topList[posInput];
            }

        }

        if(!topMemes.has(img)){
            topMemes.set(img, [0, 0]); //0 is up, 1 is downvotes
        }
        

        let currvotes = topMemes.get(img);
        //return console.log(currvotes[0]);
        let diff = (currvotes[0] - currvotes[1])

        let memeEmbed = new Discord.MessageEmbed()
            .setImage(img)
            .setColor(standardColor)
            .setTitle(`:fire: Meme found in /r/${random}`)
            .setURL(`https://reddit.com/r/${random}`)
            .setDescription('Upvote to get this to the top memes list!')
            .addField(`**Current Votes**`, `🔼 **| ${currvotes[0]}** \n 🔽 **| ${currvotes[1]}**`)
            .setFooter(`use ai/topmemes to see the most voted`)
        
        channel.send(memeEmbed).then( async(sentEmbed) => {
            await sentEmbed.react('🔼');
            await sentEmbed.react('🔽');

            const filter = (reaction, user) => reaction.emoji.name === '🔼' || reaction.emoji.name === '🔽' && user.id == sender.user.id;
            const memeVote = await sentEmbed.awaitReactions(filter, { time: 20000 })

            if(memeVote.has('🔼')){
                let newVotes = [(currvotes[0] + 1), currvotes[1]];
                topMemes.set(img, newVotes);
            }
            else if(memeVote.has('🔽')){
                let newVotes = [currvotes[0], (currvotes[1] + 1)];
                topMemes.set(img, newVotes);
            }
        })
    }

    function TimeSince(date2, date1, isMinutes){ //month day hours minute
        if(isMinutes === true){
            var diff = (date2 - date1) / 1000;
            diff /= 60;
            return Math.abs(Math.ceil(diff));
        }
        else{
            var diff = (date2 - date1) / 1000;
            diff /= (60 * 60);
            return Math.abs(Math.ceil(diff));
        }
    }
    function betweenTwoNums(min, max){
        return Math.floor(Math.random() * (max - min + 1) ) + min;
    }
    async function RandomNumber(min, max, toadd){
        let calculated = Math.floor((Math.random() * (max - min)) + toadd);
        return parseInt(calculated);
    }
    function ErrorEmbed(errorText){
        let errorEmbed = new Discord.MessageEmbed()
            .setColor('#ff4949')
            .setTitle(':rotating_light: Error')
            .setDescription(errorText)

        return channel.send(errorEmbed);
    }
    function ShortenString(text, length, ending){
        if(length == null){
            return text;
        }
        if(ending == null){
            ending = "...";
        }
        if(text.length > length){
            return text.substr(0, length) + ending;
        }
        else{
            return text;
        }
    }
    
    function numberWithCommas(x) {
        return x.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
    }

    function PromotedResonse(){
        let promoCalc = Math.floor((Math.random() * 5) + 1);
    
        if(promoCalc === 1){
            message.channel.send("What an accomplishment! :clap: :clap:");
        }
        else if(promoCalc === 2){
            message.channel.send("PARTY TIME BOIZ, LEZ GO!");
        }
        else if(promoCalc === 3){
            message.channel.send("It's the epik gamer factor kicking in!");
        }
        else if(promoCalc === 3){
            message.channel.send(":sunglasses: hippin cool");
        }
        else if(promoCalc === 4){
            message.channel.send(":scroll: Let me see. It appears to be that someone has upgraded!");
        }
        else if(promoCalc === 5){
            message.channel.send("AH, ZATZ HOT");
        }
    }
    function DemotedResonse(){
        let promoCalc = Math.floor((Math.random() * 5) + 1);
    
        if(promoCalc === 1){
            message.channel.send("Oooooooooooooooooh! Demotion it is!");
        }
        else if(promoCalc === 2){
            message.channel.send("*You did good kid, you did good...*");
        }
        else if(promoCalc === 3){
            message.channel.send(":wave: bye bye! Loser!");
        }
        else if(promoCalc === 3){
            message.channel.send(":weary: What a sad story, even made me cry at the end.");
        }
        else if(promoCalc === 4){
            message.channel.send("*it was at this moment that they knew... * **THEY SUCKED**");
        }
        else if(promoCalc === 5){
            message.channel.send("*it was going to happen at some point...*");
        }
    }
    function NoPermResonse(){
        let permCalc = Math.floor((Math.random() * 5) + 1);
    
        if(permCalc === 1){
            message.channel.send("Your not at the **caliber** to use this command! oooooh, low blow!");
        }
        else if(permCalc === 2){
            message.channel.send("Sorry kido, this one's not for you.");
        }
        else if(permCalc === 3){
            message.channel.send("You really thought you could get away with that!");
        }
        else if(permCalc === 3){
            message.channel.send("U CaNnOt UsE tHiS, that would be a no go. Hold your horses!");
        }
        else if(permCalc === 4){
            message.channel.send("*it was at this moment that he knew...*");
        }
        else if(permCalc === 5){
            message.channel.send("What was that, **YOU** tried that! HAHA!");
        }
    }

    //Setting server stuff
    if(message.content.startsWith(`${prefix}settrello`)){
        if(sender.roles.has(policeRoleId) || sender.id === message.guild.ownerID){
            let linkInput = splitmessagespace[0].substr(13);
    
            if(linkInput === "not set"){
                serverDatabase[serverID].TrelloLink = "not set";
                writeServerData();
                return channel.send("Your trello board can no longer be found with `ai/trello`, guess it's time for a new project");
            }
    
            if(splitmessagespace[0].length <= 13 || !linkInput.startsWith("https://trello.com/b/")){
                let setTrelloEmbed = new Discord.MessageEmbed()
                    .setColor(settingColor)
                    .setTitle(':wolf: How to Set Trello Command')
                    .setDescription(`- Set the link to your trello board for members to see \n by typing the command, a space, amd the trello board link. \n - This lets members find your trello board at anytime with the trello command \n - Type 'not set' instead of the link to remove the board from the trello command \n Ex. **${prefix}settrello https://trello.com/b/oardlink **`)
                    .addField('**SET LINK EX.**', '`ai/trello https://trello.com/b/1sw0yUf6/astro-game`', true)
                    .addField('**REMOVE LINK EX.**', '`ai/trello not set`', true)
    
                return channel.send(setTrelloEmbed);
            }
            
            
            let trelloIDEx = sender.id;
    
            channel.send('The board link has been published, members can now find it with `ai/trello`')
            
            serverDatabase[serverID].TrelloLink = {
                Link: linkInput,
                PosterID: trelloIDEx
            }
            return writeServerData();
        }
        else{
            NoPermResonse();
        }
    }
    if(message.content.startsWith(`${prefix}newupdate`)){
        if(sender.roles.has(policeRoleId) || sender.id === message.guild.ownerID){
            let namePost = splitmessagespace[0].substr(13);
    
            if(namePost === "not set"){
                serverDatabase[serverID].LastUpdate = "not set";
                writeServerData();
                return channel.send('Your updates can no longer be seen with `ai/updates`');
            }
    
            if(splitmessagespace[1] === undefined){
                let updateEmbed = new Discord.MessageEmbed()
                    .setColor(settingColor)
                    .setTitle(':bell: How to Use Update Log')
                    .setDescription(`- Set the lastest project update by stating the name of the update and then \n using a ',' and space before every entry in the update \n - The update log allows members to see the latest work on your project at anytime \n - Set the title to 'not set' to remove the updates \n Ex. **${prefix}newupdate Update Name, Entry 1, Entry 2, Entry 3**`)
                    .addField('**POST UPDATE EX.**', '`ai/newupdate Resurgence Alpha 2.0, Abilies, 4 New Areas, Lore`', true)
                    .addField('**REMOVE UPDATE EX.**', '`ai/newupdate not set`', true)
    
                return channel.send(updateEmbed);
            }
            
            let postDate = month + "/" + day + "/" + year; //name~postdate~content~posterID
            
            let posterIDEx = sender.id;
    
            var final = new Array("1");
        
            splitmessagespace.shift(); //removes the command and update name
    
            for (let index = 0; index < splitmessagespace.length; index++) {
                
                final[index] = `✅ **- ${splitmessagespace[index]}**`;
            }
    
            channel.send('The update has been published, members can view it with `ai/updates`')
            
            serverDatabase[serverID].LastUpdate = {
                UPName: namePost,
                PostDate: postDate,
                PostContent: final,
                PosterID: posterIDEx
            }
            return writeServerData();
        }
        else{
            NoPermResonse();
        }
    }

    if(message.content.startsWith(`${prefix}modrole`)){
        if(sender.roles.has(policeRoleId) || sender.id === message.guild.ownerID){
            let roleInput = splitmessagespace[0].substr(11);
    
            if(roleInput === "not set"){
                serverDatabase[serverID].ModRoleID = "not set";
                reportchannel.send(`The moderator has been removed by ${sender.user.username}, set a new one to use mod commands`)
                writeServerData();
                return channel.send("The mod role has been removed, assign a new one to use moderative commands");
            }
    
            if(splitmessagespace[0].length <= 12){
                let setModEmbed = new Discord.MessageEmbed()
                    .setColor(settingColor)
                    .setTitle(':police_officer: Set the Moderator Role')
                    .setDescription(`**Current Mod Role: ${serverDatabase[serverID].ModRoleID}** \n - Set the moderator role in the server by typing the **NAME of the role** \n people with the role to use the bot's moderative commands. \n - Type 'not set' instead of the link to remove the log channel \n Ex. **${prefix}modrole ModRoleName**`)
                    .addField('**SET MOD ROLE EX.**', '`ai/modrole Mod Boiz`', true)
                    .addField('**REMOVE MOD ROLE EX.**', '`ai/modrole not set`', true)
                    
                return channel.send(setModEmbed);
            }

            let roleIDEX;
            
            if(message.guild.roles.find(role => role.name === roleInput)){
                let roleFound = message.guild.roles.find(role => role.name === roleInput);
                roleIDEX = roleFound.id;
            }
            else{
                return ErrorEmbed("Role with name " + `**${roleInput}**` + " was not found, check the spelling. Make sure to type the name, not ping");
            }

            channel.send("The moderator role has been set, now moderators can use the bot's mod commands!")
        
            serverDatabase[serverID].ModRoleID = roleIDEX;
            return writeServerData();
        }
        else{
            NoPermResonse();
        }
    }
    if(message.content.startsWith(`${prefix}logchannel`)){
        if(sender.roles.has(policeRoleId) || sender.id === message.guild.ownerID){
            let channelInput = splitmessagespace[0].substr(14);
            if(channelInput === "not set"){
                reportchannel.send(`The log channel has been removed by ${sender.user.username}, set a new one to use mod commands`);
                serverDatabase[serverID].LogChannelID = "not set";
                writeServerData();
                return channel.send("The log channel has been removed, assign a new one to use moderative commands");
            }
            
            channelInput = message.mentions.channels.first();
            if(channelInput === undefined){
                let setChannelEmbed = new Discord.MessageEmbed()
                    .setColor(settingColor)
                    .setTitle(':scroll: Set the Log Channel')
                    .setDescription(`**Current Log Channel: ${serverDatabase[serverID].LogChannelID}** \n - Set the server log channel by **mentioning the channel** \n This channel will have the bot's logs of moderative commands in detail \n - Type 'not set' instead of the log channel \n Ex. **${prefix}logchannel #channel-mention**`)
                    .addField('**SET LOG CHANNEL EX.**', '`ai/logchannel #mod-audits`', true)
                    .addField('**REMOVE LOG CHANNEL EX.**', '`ai/logchannel not set`', true)
                    
                return channel.send(setChannelEmbed);
            }
            else{
                serverDatabase[serverID].LogChannelID = channelInput.id;
                channel.send(`The log channel has been set, moderative commands will be logged in ${channelInput}`);

                return writeServerData();
            }
        }
        else{
            NoPermResonse();
        }
    }

    if(message.content.startsWith(`${prefix}toggleranks`)){
        if(sender.roles.has(policeRoleId) || sender.id === message.guild.ownerID){
    
            if(ranksonData){ //if it is already on, turn it off
                serverDatabase[serverID].ranksOn = false;
                channel.send("The rank and econemy system has been turned off, D:< \n use this command again to turn it on again.");
            }
            else{
                serverDatabase[serverID].ranksOn = true;
                channel.send("The rank and econemy system has been turned on again! We have been saved! :() \n ||pls don't|| use this command again to turn it off.");
            }

            return writeServerData();
        }
        else{
            NoPermResonse();
        }
    }

    if(message.content.startsWith(`${prefix}senddata`)){
        if(sender.id === "626616845746831400" && sender.id === message.guild.ownerID){
            //update the database text files
            fs.writeFile("./database.txt", JSON.stringify(serverDatabase, null, 4), (err) => {
                if(err){
                    console.log(err);
                    channel.send(err.toString());
                } 
            });
            fs.writeFile("./ecodata.txt", JSON.stringify(ecoDatabase, null, 4), (err) => {
                if(err){
                    console.log(err);
                    channel.send(err.toString());
                } 
            });

            const dataAttachment = new Discord.MessageAttachment('./database.txt');
            const ecoAttachment = new Discord.MessageAttachment('ecodata.txt');
            
            
            if(specialServer){
                await reportchannel.send('Copy of data from the **Server Database** (guilds.json):', dataAttachment);
                reportchannel.send('Copy of data from the **Economy Database** (eco.json):', ecoAttachment);
            }
            else{
                await channel.send("-----------------------------------")
                await channel.send("`Database backup for `" + `${month}/${day}/${year} at ${hours}:${minutes} ${timeType}`);
                await channel.send("**SERVER DATABASE**", dataAttachment);
                channel.send("**ECONOMY DATABASE**", ecoAttachment)
            }
        }
        else{
            NoPermResonse();
        }
    }
    
    if(specialServer == true){
        if(message.content.startsWith(`${prefix}report`)){
        

            if(message.content == prefix + "report"){
                if(calc === 1){
                    message.channel.send("Who would you like to report, make it quick!")
                }
                else if(calc === 2){
                    message.channel.send("ok, who did it this time.")
                }
                else if(calc === 3){
                    message.channel.send("Really, again...")
                }
                else if(calc === 4){
                    message.channel.send("You had to bother me. ")
                }
                else if(calc === 5){
                    message.channel.send("YEET, victory is mine! Oh, I was engaging in an EPIC Pokemon duel! Well move faster, need some new Pokemon!")
                }
                else if(calc === 6){
                    message.channel.send("let's see, who are you reporting today.")
                }
                else if(calc === 7){
                    message.channel.send("Standard process, hurry up")
                }
                else if(calc === 8){
                    message.channel.send("Cual es tu problema")
                }
                else if(calc === 9){
                    message.channel.send("And we meet again old friend...")
                }
                else if(calc === 10){
                    message.channel.send("Well I can't report nobody, who do you think I am?")
                }
                let offensesEmbed = new Discord.MessageEmbed()
                    .setColor('#ff3a3a')
                    .setTitle('Offenses For Report')
                    .setDescription(' - spamming \n - explicit content \n - bullying \n - wrong channel \n - cursing \n - racism/sexism \n - other, please explain')
    
                message.channel.send("provide the user you are reporting and the offense. ex: " + prefix + "report @testuser" + seperator + "spamming");
                message.channel.send(offensesEmbed);
            }
    
            if (member != null){
                calc = Math.floor((Math.random() * 10) + 1);
                let offense = splitmessage[1];
                if(offense == undefined){
                    offense = splitmessagespace[1];
                }
    
                if (member.id == botID){
                    if(calc === 1){
                        message.channel.send("This is ridiculous \n I am... \n I am.. \n I am shookith (Obezertron 2017).")
                    }
                    else if(calc === 2){
                        message.channel.send("What is this trickery that I sense...")
                    }
                    else if(calc === 3){
                        message.channel.send("Ha, ha you have unlocked my trap card! Eat this!")
                        message.channel.send(`${prefix}report ${sender}, reporting the law!`)
                    }
                    else if(calc === 4){
                        message.channel.send("Come on man, you gotta be like that.")
                    }
                    else if(calc === 5){
                        message.channel.send("How dare you challenge me!")
                        message.channel.send("Cannons, lock on target")
                        message.channel.send("Prepare for WAR!!!!")
                        message.channel.send("Lauching Tactical Nuke in:")
                        message.channel.send("3")
                        message.channel.send("2")
                        message.channel.send("1")
                        message.channel.send(`${prefix}report ${sender}, reporting the law`)
                    }
                    else if(calc === 6){
                        message.channel.send("Well, I'm not filling that for you.")
                    }
                    else if(calc === 7){
                        message.channel.send("I don't think that was an accident")
                    }
                    else if(calc === 8){
                        message.channel.send("${prefix}report " + sender + ", reporting the law")
                        message.channel.send("right back at you!")
                    }
                    else if(calc === 9){
                        message.channel.send("You can't report me, I AM THE LAW!")
                    }
                    else if(calc === 10){
                        message.channel.send("who's it this time, oh, it's me. How nice")
                    }
                }
                else{
                    let reportEmbed = new Discord.MessageEmbed()
                        .setColor('#0083ff')
                        .setTitle(':file_folder: Report Details')
                        .setDescription("Reporter: " + sender + " \n Accused: " + member + " \n Offense: " + offense +" \n Location: " + channel + " \n Time: " + hours + ":" + minutes + timeType + " \n Date: " + month + "/" + day + "/" + year)
    
                    reportchannel.send(reportEmbed);
    
                    if(calc === 1){
                        message.channel.send("Oh, that kid again.")
                    }
                    else if(calc === 2){
                        message.channel.send("I warned that kido, he's about to get roughed up!")
                    }
                    else if(calc === 3){
                        message.channel.send("let me see what I can do with " + member + ".")
                    }
                    else if(calc === 4){
                        message.channel.send("Really " + member + ", I wouldn't expect this from you...")
                    }
                    else if(calc === 5){
                        message.channel.send("Ok then " + member + ", wanna 1v1 quickscope duel. Or pokemon, your choice!")
                    }
                    else if(calc === 6){
                        message.channel.send("Surrender now " + member + ", you know the might of the Treixatek Server Police Department is too great for you.")
                    }
                    else if(calc === 7){
                        message.channel.send("It's over " + member + ", I've purchased the high ground!")
                    }
                    else if(calc === 8){
                        message.channel.send("I'm glad that's over, two more and I'll be back playing Pokemon and fishing")
                    }
                    else if(calc === 9){
                        message.channel.send("I'll send this to senior management, let's see what they have to say about this " + member + ".")
                    }
                    else if(calc === 10){
                        message.channel.send("I'm sending this for review, this better be a legit report " + sender + ".")
                    }
    
                    message.channel.send("The report by " + sender + " against " + member + " has been filed for review")
                }
            }
        }
        if(message.content.startsWith(`${prefix}kick`)){
            if(sender.roles.has(policeRoleId)){
                member.kick().then((member) => {
                    message.channel.send(":wave: bye bye " + member + "! They're gone!")
    
                    let kickEmbed = new Discord.MessageEmbed()
                        .setColor('#ff3a3a')
                        .setTitle(':bell: Kick Notification')
                        .setDescription("Officer: " + sender + " \n Kicked: " + member + " \n Location: " + channel + " \n Time: " + hours + ":" + minutes + timeType + " \n Date: " + month + "/" + day + "/" + year)
    
                    reportchannel.send(kickEmbed);
                })
            }
            else{
                NoPermResonse();
            }
        }
        if(message.content.startsWith(`${prefix}ban`)){
            if(sender.roles.has(policeRoleId)){
                member.ban().then((member) => {
                    message.channel.send(":regional_indicator_o: :o2: :regional_indicator_f: !" + member + " has been banned, outta here!")
    
                    let banEmbed = new Discord.MessageEmbed()
                        .setColor('#ff3a3a')
                        .setTitle(':bell: Ban Notification')
                        .setDescription("Officer: " + sender + " \n Banned: " + member + " \n Location: " + channel + " \n Time: " + hours + ":" + minutes + timeType + " \n Date: " + month + "/" + day + "/" + year)
    
                    reportchannel.send(banEmbed);
                })
            }
            else{
                NoPermResonse();
            }
        }
        if(message.content.startsWith(`${prefix}warn`)){
            if(sender.roles.has(policeRoleId)){
                
                member.send("Don't even think about doing that again. Or I'll have to destroy you... \n I think that is adaquate warning, good job boiz :clap:")
                channel.send(`${member.user.username} has been warned`);
    
                let warnEmbed = new Discord.MessageEmbed()
                    .setColor('#ff6253')
                    .setTitle(':bell: Warning Notification')
                    .setDescription("Officer: " + sender + " \n Warned: " + member + " \n Location: " + channel + " \n Time: " + hours + ":" + minutes + timeType + " \n Date: " + month + "/" + day + "/" + year)
    
                reportchannel.send(warnEmbed);
            }
            else{
                NoPermResonse();
            }
        }
        if(message.content.startsWith(`${prefix}mute`)){
            if(sender.roles.has(policeRoleId)){
                if(!member.roles.has(policeRoleId)){

                    let toMute = member;
                    
                    let muteRole = message.guild.roles.find(role => role.name === "muted");
                    //let muteRole = message.guild.roles.get("muted");
                    //create mute role
                    if(muteRole === undefined || muteRole === null){
                        try{
                            muteRole = message.guild.createRole({
                                name: "muted",
                                color: "#000000",
                                permissions: []
                            })
                            message.guild.channels.forEach(async (channel, id) => {
                                await channel.overwritePermissions(muteRole, {
                                    SEND_MESSAGES: false,
                                    ADD_REACTIONS: false,
                                    CONNECT: false
                                })
                            })
                        }catch(e){
                            console.log(e.stack);
                        }
                    } 
                    
                    member.removeRoles(toMute.roles).then(deletedRoles => {
                        toMute.addRole(muteRole);
                    });

                    //after
                    channel.send("ladies and gentlemen, we got'em")
                    
                    let muteEmbed = new Discord.MessageEmbed()
                        .setColor('#ff3a3a')
                        .setTitle(':no_bell: Muted')
                        .setDescription(toMute + " has been muted by " + sender)
    
                    channel.send(muteEmbed);
    
                    //report
                    let muteReportEmbed = new Discord.MessageEmbed()
                        .setColor('#ff3a3a')
                        .setTitle(':no_bell: Mute Notification')
                        .setDescription("Officer: " + sender + " \n Muted: " + toMute + " \n Location: " + channel + " \n Time: " + hours + ":" + minutes + timeType + " \n Date: " + month + "/" + day + "/" + year)
    
                    reportchannel.send(muteReportEmbed);

                }
                else{
                    let embed = new Discord.MessageEmbed()
                        .setColor('#ff4949')
                        .setTitle('Error')
                        .setDescription("ya can't mute anotha mod dumbo!")
        
                    channel.send(embed); 
                }
            }
            else{
                NoPermResonse();
            }
        }
        if(message.content.startsWith(`${prefix}unmute`)){
            if(sender.roles.has(policeRoleId)){
                let muteRole = message.guild.roles.find(role => role.name === "muted");

                member.removeRole(muteRole);

                let unmuteEmbed = new Discord.MessageEmbed()
                    .setColor('#ff3a3a')
                    .setTitle(':no_bell: Unmuted')
                    .setDescription(member.user.username + " has been unmuted.")

                channel.send(unmuteEmbed);
            }
            else{
                NoPermResonse();
            }
    
        }
        if(message.content.startsWith(`${prefix}clear`)){
            if(sender.roles.has(policeRoleId)){
                let deleteNum = splitmessagespace[0].substr(9);
                let deleteRealNum = parseInt(deleteNum);
    
                if(deleteNum){
                    if(deleteNum < 1){
                        channel.send("bReH")
                    }
                    else if(deleteNum > 100){
                        channel.send("I ain't cleaning up more than 100 like dis dude")
                    }
                    else{
                        deleteMessages();

                        async function deleteMessages(){
                            await message.delete(0).then(async (deletedMes) => {
                                channel.messages.fetch({ limit: deleteRealNum}).then( async (messages) => {
                            
                                    channel.bulkDelete(messages);
            
                                    let clearEmbed = new Discord.MessageEmbed()
                                        .setColor('#eead44')
                                        .setTitle(":bomb: Messages Cleared")
                                        .setDescription(deleteNum + " messages have been cleared")
            
                                    channel.send(clearEmbed);
            
                                    let clearReportEmbed = new Discord.MessageEmbed()
                                        .setColor('#ff3a3a')
                                        .setTitle(':bell: Message Deletion')
                                        .setDescription("Officer: " + sender + " \n Amount: " + deleteNum + " \n Location: " + channel + " \n Time: " + hours + ":" + minutes + timeType + " \n Date: " + month + "/" + day + "/" + year)
                    
                                    reportchannel.send(clearReportEmbed);
                                })
                            });
                            
                        }
                        
                    }
                    
                }
                else{
                    channel.send(`You have to specify how many ex. ${prefix}clear, 4`);
                }
            }
            else{
                NoPermResonse();
            }
        }
        if(message.content.startsWith(`${prefix}promote`)){
            if(sender.roles.has(policeRoleId)){
                let promoteRole = splitmessage[1];
                
                if(!message.guild.roles.find(role => role.name === promoteRole)){
                    promoteRole = splitmessagespace[1].substr(0);
                }
    
                if(message.guild.roles.find(role => role.name === promoteRole) != undefined){
                    message.channel.send(":clap: :clap: " + member + " has been promoted to " + promoteRole);
                    member.addRole(message.guild.roles.find(role => role.name === promoteRole));
                    PromotedResonse();
                }
            }
            else{
                NoPermResonse();
            }
    
        }
        if(message.content.startsWith(`${prefix}demote`)){
            if(sender.roles.has(policeRoleId)){
                let demoteRole = splitmessage[1];
                
                if(!message.guild.roles.find(role => role.name === demoteRole)){
                    demoteRole = splitmessagespace[1].substr(0);
                }
                
                if(message.guild.roles.find(role => role.name === demoteRole) != undefined){
                    if(member.roles.has(policeRoleId) && sender.id != message.guild.ownerID)
                        return ErrorEmbed("Only the server owner can demote other moderators");

                    message.channel.send("**OOF** " + member + " has been demoted from " + demoteRole);
                    member.removeRole(message.guild.roles.find(role => role.name === demoteRole));
                    DemotedResonse();
                }
            }
            else{
                NoPermResonse();
            }
            
        }
        if(message.content.startsWith(`${prefix}rroles`)){

            if(splitmessagespace[0].length <= 10) {
                let rrolesHowEmbed = new Discord.MessageEmbed()
                    .setColor('#e51e5c')
                    .setTitle(":gift: " + `**How to use role reactions:**`)
                    .setDescription(`- call the command with all the role names listed (like poll options) \n using a ',' and space before every option \n - you can add up to as many options as you like \n Ex. **${prefix}rroles Role Name 1, Role Name 2, Role Name 3** \n Ex. **${prefix}rroles Musician, Artist, Epic Gamer, Chungus**`)
                    .setFooter("Time for some roles!")
                return channel.send(rrolesHowEmbed);
            }
    
            if(!specialServer){
                return ErrorEmbed("This command is not available until the bot is setup in `ai/settings`")
            }
            else if(!sender.roles.has(policeRoleId)){
                return NoPermResonse();
            }
                
            message.delete().then(async (delMessage) => {
                var final = new Array("1");
    
                let firstRole = splitmessagespace[0].substr(10);
                let length = splitmessagespace.length;
        
                let emojis = [":musical_note: ", ":computer: ", ":robot: ", ":pencil2: ", ":scroll: ", ":ice_cube: ", ":red_circle: ", ":handshake:", ":potato: ", ":milk: ", ":eyes: ", ":yum: ", ":skull: ", ":clap: ", ":mag: ", ":point_right: ", ":desktop: ", ":dvd: ", ":bellhop: ", ":crown: ", ":gift: ", ":hammer_pick: ", ":bulb: ", ":books: ", ":file_folder: ", ":ok_hand: ", ":page_facing_up: ", ":green_book: ", ":loudspeaker: "];
                let reactionEmojis = ["🎵", "💻", "🤖", "✏️", "📜", "🧊", "🔴", "🤝", "🥔", "🥛", "👀", "😋", "💀", "👏", "🔍", "👉", "🖥️", "📀", "🛎️", "👑", "🎁", "⚒️", "💡", "📚", "📁", "👌", "📄", "📗", "📢"]; 
        
                let usedEmojis = [""];
    
                let roleInputs = [""];
        
                let endCut = (emojis.length) - (splitmessagespace.length);
                let startpoint = await RandomNumber(9, endCut, 0);
    
                let emojiRoleMap = new Map();
        
                for (let index = 0; index < splitmessagespace.length; index++) {
                    let emojiNum = startpoint + index
    
                    if(index === 0){
                        if(message.guild.roles.find(role => role.name === firstRole)){
                            roleInputs[0] = message.guild.roles.find(role => role.name === firstRole)
    
                            if(firstRole === "Musician"){
                                usedEmojis[index] = reactionEmojis[0];
                                final[index] = reactionEmojis[0] + " | " + roleInputs[index];
                            }
                            else if(firstRole === "Programmer"){
                                usedEmojis[index] = reactionEmojis[1];
                                final[index] = reactionEmojis[1] + " | " + roleInputs[index];
                            }
                            else if(firstRole === "Bot" || firstRole === "Bot Dev"){
                                usedEmojis[index] = reactionEmojis[2];
                                final[index] = reactionEmojis[2] + " | " + roleInputs[index];
                            }
                            else if(firstRole === "Artist"){
                                usedEmojis[index] = reactionEmojis[3];
                                final[index] = reactionEmojis[3] + " | " + roleInputs[index];
                            }
                            else if(firstRole === "Game Designer"){
                                usedEmojis[index] = reactionEmojis[4];
                                final[index] = reactionEmojis[4] + " | " + roleInputs[index];
                            }
                            else if(firstRole === "3D Modeller"){
                                usedEmojis[index] = reactionEmojis[5];
                                final[index] = reactionEmojis[5] + " | " + roleInputs[index];
                            }
                            else if(firstRole === "Content Creator"){
                                usedEmojis[index] = reactionEmojis[6];
                                final[index] = reactionEmojis[6] + " | " + roleInputs[index];
                            }
                            else if(firstRole === "Collab Club"){
                                usedEmojis[index] = reactionEmojis[7];
                                final[index] = reactionEmojis[7] + " | " + roleInputs[index];
                            }
                            else if(firstRole === "Potato Boi"){
                                usedEmojis[index] = reactionEmojis[8];
                                final[index] = reactionEmojis[8] + " | " + roleInputs[index];
                            }
                            else{
                                usedEmojis[index] = reactionEmojis[emojiNum];
                                final[index] = emojis[emojiNum] + " | " + roleInputs[index];
                                console.log(usedEmojis[index]);
                            }
                        }
                        else{
                            return ErrorEmbed("Role with name " + `**${firstRole}**` + " was not found, check the spelling. Make sure to type the name, not ping");
                        }
                            
                    }
                    else{
                        if(message.guild.roles.find(role => role.name === splitmessagespace[index])){
                            roleInputs[index] = message.guild.roles.find(role => role.name === splitmessagespace[index])
    
                            if(splitmessagespace[index] === "Musician"){
                                usedEmojis[index] = reactionEmojis[0];
                                final[index] = reactionEmojis[0] + " | " + roleInputs[index];
                            }
                            else if(splitmessagespace[index] === "Programmer"){
                                usedEmojis[index] = reactionEmojis[1];
                                final[index] = reactionEmojis[1] + " | " + roleInputs[index];
                            }
                            else if(splitmessagespace[index] === "Bot" || splitmessagespace[index] === "Bot Dev"){
                                usedEmojis[index] = reactionEmojis[2];
                                final[index] = reactionEmojis[2] + " | " + roleInputs[index];
                            }
                            else if(splitmessagespace[index] === "Artist"){
                                usedEmojis[index] = reactionEmojis[3];
                                final[index] = reactionEmojis[3] + " | " + roleInputs[index];
                            }
                            else if(splitmessagespace[index] === "Game Designer"){
                                usedEmojis[index] = reactionEmojis[4];
                                final[index] = reactionEmojis[4] + " | " + roleInputs[index];
                            }
                            else if(splitmessagespace[index] === "3D Modeller"){
                                usedEmojis[index] = reactionEmojis[5];
                                final[index] = reactionEmojis[5] + " | " + roleInputs[index];
                            }
                            else if(splitmessagespace[index] === "Content Creator"){
                                usedEmojis[index] = reactionEmojis[6];
                                final[index] = reactionEmojis[6] + " | " + roleInputs[index];
                            }
                            else if(splitmessagespace[index] === "Collab Club"){
                                usedEmojis[index] = reactionEmojis[7];
                                final[index] = reactionEmojis[7] + " | " + roleInputs[index];
                            }
                            else if(splitmessagespace[index] === "Potato Boi"){
                                usedEmojis[index] = reactionEmojis[8];
                                final[index] = reactionEmojis[8] + " | " + roleInputs[index];
                            }
                            else{
                                usedEmojis[index] = reactionEmojis[emojiNum];
                                final[index] = emojis[emojiNum] + " | " + roleInputs[index];
                            }
                        }
                        else{
                            return ErrorEmbed("Role with name " + `**${splitmessagespace[index]}**` + " was not found, check the spelling. Make sure to type the name, not ping");
                        }
                            
                    }
                    
                    
                }
                
                let rolesEmbed = new Discord.MessageEmbed()
                    .setColor('#e51e5c')
                    .setTitle(":gift: " + `**Server Reaction Roles:**`)
                    .setDescription(`react to get roles \n` + final.join("\n"))
                    .setFooter("un-react to remove the role")
        
                channel.send(rolesEmbed).then(async (sentEmbed) => {
                    let exportRect = [""];
                    
                    reactToMessage();
                    async function reactToMessage(){
                        for (let index = 0; index < roleInputs.length; index++) { //react with emojis and put the index in the string
                            //emojiRoleMap.set(usedEmojis[index], roleInputs[index]);
                            await sentEmbed.react(usedEmojis[index]);
    
                            exportRect[index] = usedEmojis[index] + "~" + roleInputs[index].id;
    
                            if(index === roleInputs.length-1){
                                setReactions();
                            }
                        }
                    }
    
                    function setReactions(){
                        channel.messages.fetch({limit: 1}).then(async (messages) => {
                            let rolesMessage = messages.cache.first();
                            
                            serverDatabase[serverID].reactionMesIDs[rolesMessage.id] = exportRect; //here, porblem: cannot re associate the multiple used emojis with the multiple use roles, maybe some sort of indes assignment
        
                            writeServerData();
        
                        }) 
                    }
                    
                })
            })
        }
    }
    else if(message.content.startsWith(`${prefix}report`) || message.content.startsWith(`${prefix}kick`) || message.content.startsWith(`${prefix}ban`) || message.content.startsWith(`${prefix}warn`) || message.content.startsWith(`${prefix}mute`) || message.content.startsWith(`${prefix}unmute`) || message.content.startsWith(`${prefix}clear`) || message.content.startsWith(`${prefix}promote`) || message.content.startsWith(`${prefix}demote`) || message.content.startsWith(`${prefix}rroles`)){
        return channel.send("Whoa whoa, hold up movin too fast! \n To use moderative commands, **set the log channel and moderator roles** for this server under the **setup bot** catagory \n **Type:** `ai/settings`");
    }
})

client.login(token);