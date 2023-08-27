
const ServerID = "9UZ6A5KL";
class annet {
    #lobbyConnections
    #lobbyConnectionstatus
    #lobbys
    #OnRecive
    constructor(lobbysize) {
        this.isHost = true;
        this.me = null;
        this.lobby = [];
        this.#lobbyConnections = [];
        this.#lobbyConnectionstatus = 0;
        this.stage = 0;

        //server stuff
        this.#lobbys = [[ServerID]];
        this.lobbySize = lobbysize != null ? lobbysize : 2;
        this.serverConnection = null;
        this.allConnected = [];

        //bindings
        this.#OnRecive = (ID, DATA) => { console.log("Missing on recive binding");console.log(DATA); }

    }
    init() {
        this.isHost = true;
        this.me = null;
        this.lobby = [];
        this.#lobbyConnections = [];
        this.#lobbyConnectionstatus = 0;
        this.stage = 0;
        this.#recursiveIDGeneration(ServerID);
    }
    #recursiveIDGeneration(id) {
        this.me = new Peer(id);

        this.me.on('error', e => {
            //if the name is taken regenrate
            if (e.message.indexOf("taken") != -1) {
                //as the fist one we try is the host, if this ever happens we arn't it
                this.isHost = false;
                this.#recursiveIDGeneration(ServerID + "-" + round(random(100, 1000)).toString());
            }
            else {
                console.error("this is a hard crash, an error occured in the me pipe");
                console.error(e.message);
                throw e;
            }
        });

        this.me.on('open', id => {
            //ok, so the ID wasn't taken excelent.
            //if we're starting up and are not the host,
            //connect to the host for lobby assignment
            if (!this.isHost && this.stage == 0) {
                this.serverConnection = this.me.connect(ServerID);
                this.serverConnection.on('data', d => {
                    let data = JSON.parse(d);
                    //=========================================================
                    //==    Deal with data sent from the server here         ==
                    //=========================================================
                    if (data.type == "lobbyAssignment") {
                        console.info("assigned to lobby");
                        console.info(data);
                        this.lobby = data.data[0];
                        this.lobbySize = data.data[1];
                        this.stage = 1;
                        this.#connectToLobby();
                    }
                    else if(data.type == "Assurance"){
                        console.info("Server is requesting that we stay calm and wait. checking again in 5");
                        this.#checkIfForgotten();
                    }
                    else {
                        console.warn("recived unknown data from server connection:\n");
                        console.warn(data);
                    }
                });
                this.serverConnection.on('error', e => {
                    console.error("woah, there was an error connecting to the server from client, refreshing");
                    console.error(e);
                    this.init();
                });
            }
            //if we are the host
            if (this.isHost) {
                this.lobby.push(ServerID);
                this.stage = 2;
            }
        });

        this.me.on('connection', conn => {
            let e = false;
            if(this.stage != 3)
            for(let i = 0; i < this.lobby.length; i++){
                if(this.lobby[i] === conn.peer){
                    e = true;
                    break;
                }     
            }
            //if we are the host, and they arn't in out lobby, assign them
            if (this.isHost && !e) {
                console.log("peer " + conn.peer + " connected");
                let lobbyindex = -1;
                for (let i = 0; i < this.#lobbys.length; i++) 
                    if (this.#lobbys[i].length < this.lobbySize) {
                        lobbyindex = i;
                        break;
                    }


                if(lobbyindex == -1){
                    console.info("no empty lobbys found, adding new");
                    lobbyindex = this.#lobbys.push([])-1;
                }
                else if(lobbyindex == 0){
                    console.info("joining host lobby");
                    this.lobby.push(conn.peer);
                }
                    
                this.#lobbys[lobbyindex].push(conn.peer);
                conn.on('open', () => {
                    conn.send(JSON.stringify({ type: "lobbyAssignment", data: [this.#lobbys[lobbyindex],this.lobbySize] }));
                    console.info("Client assigned to lobby");
                    console.info(this.#lobbys[lobbyindex]);
                });
                conn.on('data', d => {
                    let data = JSON.parse(d);
                    console.info("server recived message from "+conn.peer);
                    console.info(data);
                    //=========================================================
                    //==    deal with clients questioning the server here    ==
                    //=========================================================
                    if (data.type == "Am I forgotten") {
                        //as the server we've gotta re-asure the client it will get a match.. eventaully.
                        console.info("client :"+conn.peer+" requests reasurance, complying");
                        conn.send(JSON.stringify({type: "Assurance", data: "Remain calm"}))
                    }
                });
                this.allConnected.push(conn);
            }
            else {
                this.#lobbyConnections.push(conn);
                if(!this.isHost)
                    this.lobby.push(conn.peer);
                conn.on('open', () => {
                    this.#lobbyConnectionstatus++;
                    if (this.#lobbyConnectionstatus >= this.lobby.length-1) {
                        this.stage = 2;
                        if (this.lobby.length >= this.lobbySize)
                            this.stage = 3;
                    }
                    
                });
                conn.on('data', d => {
                    
                    let data = JSON.parse(d);
                    console.info(data);
                    this.#OnRecive(data.ID, data.data);
                });
            }
        });
    }
    #connectToLobby() {
        console.info("connecting to lobby");
        for (let i = 0; i < this.lobby.length; i++) {
            if (this.lobby[i] != this.me._id) {
                let l = this.me.connect(this.lobby[i]);
                l.on('open', () => {
                    this.#lobbyConnectionstatus++;
                    if (this.#lobbyConnectionstatus >= this.lobby.length-1) {
                        this.stage = 2;
                        if (this.lobby.length >= this.lobbySize)
                            this.stage = 3;
                    }
                });
                l.on('data', d => {
                    let data = JSON.parse(d);
                    console.info(data);
                    this.#OnRecive(data.ID, data.data);
                })
                this.#lobbyConnections.push(l);
            }

        }
        this.#checkIfForgotten();
    }
    // bind a function with the paramaters (id, data) to the on recive event.
    bindOnRecive(binding) {
        this.#OnRecive = binding;
    }

    sendToAll(message) {
        if (this.stage >= 2) {
            this.#lobbyConnections.forEach(lc => {
                lc.send(JSON.stringify({ type: 'user', ID: this.me._id, data: message }));
            });
        }
        else {
            throw new Error("pls wait for stage 3");
        }
    }

    #checkIfForgotten(){
        setTimeout(() =>{
                        console.info("checking in with the server");
                        if(this.stage <= 2) {
                            if(this.serverConnection._open == false){
                                this.init();
                                return;
                            } 
                            this.serverConnection.send(JSON.stringify({type: "Am I forgotten", data: "pls tell me"}));
                        }
                    }, 8000);
    }

}