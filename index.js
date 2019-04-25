let mysql = require("mysql");
let inquirer = require("inquirer");

let connectionObject = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "root",
  database: "events_db"
});

let connectAndProcess = getdata => {
  console.log("Inside Connection");
  connectionObject.connect(err => {
    if (err) throw err;

    getdata(getUserChoice);
  });
};

let getTopSongsByArtist = getUserChoice => {
  connectionObject.query("select * from top_songs where ?? = ?", ["artist", "The Beatles"], (err, response) => {
    if (err) throw err;
    console.log(response);
    connectionObject.end();
    getUserChoice();
  });
};

let getTopArtists = getUserChoice => {
  connectionObject.query(
    "select artist, count(*) as numberOfTopSongs from top_songs group by artist having count(*) > 1 order by numberOfTopSongs desc",
    (err, response) => {
      if (err) throw err;
      console.log(response);
      connectionObject.end();
      getUserChoice();
    }
  );
};

let getTopSongsByRange = getUserChoice => {
  connectionObject.query("select * from top_songs where ?? between ? and ?", ["raw_total", 35, 40], (err, response) => {
    if (err) throw err;
    console.log(response);
    connectionObject.end();
    getUserChoice();
  });
};

let getSongByTitle = getUserChoice => {
  connectionObject.query("select * from top_songs where ?? = ?", ["song", "My Heart Will Go On"], (err, response) => {
    if (err) throw err;
    console.log(response);
    connectionObject.end();
    getUserChoice();
  });
};

let getUserChoice = () => {
  inquirer
    .prompt([
      {
        type: "list",
        message: "What do you want to do?",
        choices: ["Get Top Songs By Artist", "Get Top Artists", "Get Songs By Range", "Get Song By Title", "Exit"],
        name: "userChoice"
      }
    ])
    .then(response => {
      processUserChoice(response.userChoice);
    });
};

let processUserChoice = userChoice => {
  switch (userChoice) {
    case "Get Top Songs By Artist":
      connectAndProcess(getTopSongsByArtist);
      break;
    case "Get Top Artists":
      connectAndProcess(getTopArtists);
      break;
    case "Get Songs By Range":
      connectAndProcess(getTopSongsByRange);
      break;
    case "Get Song By Title":
      connectAndProcess(getSongByTitle);
      break;
    // case "Exit":
    //   if (connectionObject.state === "connected") connectionObject.end();
  }
};

getUserChoice();
