
//Global variables
//const _canvasWidth = 800;
//const _canvasHeight = playGround.canvasHeight();

//Canvas setup
//const body = document.getElementById('body');
var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');
canvas.width = 1080;
canvas.height = 0;
//Upper and lower canvas definitions
var upperCanvas = document.getElementById('upperCanvas');
var upperCtx = upperCanvas.getContext('2d');
upperCanvas.width = canvas.width;
var lowerCanvas = document.getElementById('lowerCanvas');
var lowerCtx = lowerCanvas.getContext('2d');
lowerCanvas.width = canvas.width;
var canvasTowns = document.getElementById('canvas-towns');
var townsctx = canvasTowns.getContext('2d');
canvasTowns.width = canvas.width;
canvasTowns.height = 100;
//Playground variables
const _cols = 20;
const _rows = 11;
//Playground tiles
var tiles = [];
var capitals = [];
var towns = [];
var ports = [];
//Tiles array for testing purposes
var testTiles = [];
//Highlighted tiles
var hglTiles = [];
//cursor array
var curs = [];
//Array of shore tiles
var shorePath = [];
var shorePath2 = [];
//Current plasyer in game
var currentPlayer;
//list of players
var players = [];
//Current player index
var gameTurn = 0;

//var _tiles = [];
//tile variables
//Radius of hexagon
var _radius = 0; //playGround.r();
//alert(_radius);
//Hex tile height
var _height = 0; //playGround.tileHeight();
//Territories to generate map
var presets = "1,3,1,2,water;0,0,1,2,water;0,1,0,1,water;0,1,0,1,water\n0,3,1,2,water;0,0,1,2,water;0,1,1,1,water;1,1,1,1,water\n1,3,1,2,water;0,0,1,2,water;0,1,0,1,water;0,1,0,1,water\n0,1,1,3,water;0,0,1,2,water;0,1,1,1,water;1,1,0,1,earth;1,2,0,2,earth;1,2,0,0,earth\n0,1,1,3,water;0,0,1,2,water;0,1,1,1,water;0,1,0,1,earth;0,2,0,2,earth;0,2,0,0,earth\n1,2,1,3,water;1,1,1,1,water;0,0,1,2,water;1,1,0,1,water;1,2,0,2,water;1,1,0,1,water;1,2,0,0,water;1,2,0,2,water;0,0,0,2,earth;0,1,0,1,earth;0,2,0,2,earth;0,1,0,3,earth;1,1,0,3,water;1,2,0,4,water;0,0,0,4,water;0,1,0,5,water\n1,2,1,3,water;1,1,1,1,water;0,0,1,2,water;1,1,0,1,water;1,2,0,2,water;1,1,0,1,water;1,2,0,0,water;1,2,0,2,water;0,0,1,2,water;1,1,1,1,water;0,1,0,3,water;1,1,0,3,water;1,2,0,4,water;0,0,0,4,water;0,1,0,5,water"; 
//If is selected capital
var selectedCapital = false;
//let font = 
//ctx.font = '12px Verdana';
//Mouse interactivity
//Mouse object
//Get canvas position to get 0:0 point
//Variables for canvas offsets
var offsetX,offsetY;
let canvasPosition = canvas.getBoundingClientRect();
offsetX=canvasPosition.left;
offsetY=canvasPosition.top;        
function reOffset(){
    var canvasPosition = canvas.getBoundingClientRect();
    offsetX=canvasPosition.left;
    offsetY=canvasPosition.top;        
}
window.onscroll=function(e){ reOffset(); }
window.onresize=function(e){ reOffset(); }
//Zoom the canvas
/*function zoomGame(width,  operation){
    if(operation == 'add'){
        canvas.width = canvas.width + width;         
        displayPlayground();
    }
    else{
        canvas.width = canvas.width - width;
        displayPlayground();

    }
}*/
//console.log('Y position: ' + canvasPosition.y);
const mouse = {
    x: canvas.width/2,
    y: canvas.height,
    click: false
}
//Listen to click event
canvas.addEventListener('mousedown', function(event){
    //Clear shorePath array
    shorePath = [];
    shorePath2 = [];
    updateCanvas();
    updateLowerCnv();    
    hglTiles = [];
    //Set clicked property
    if(gameMng.clicked == 0){
        gameMng.clicked++;
    }
    else{
        gameMng.clicked = 0;
    }
    //Click coordinations
    mouse.click = true;
    mouse.x = event.x - offsetX;//canvasPosition.left;
    mouse.y = event.y - offsetY;//canvasPosition.top;
    //Clicked tile???
    if(gameMng.clicked == 1){
        //Game introduction - selection of capital
        if(gameMng.round == 0){
            //Deamnd to select capital and player
            //getClicked(mouse.x, mouse.y, tiles);
            lowerCtx.fillStyle = 'white';
            let font = getPercent(lowerCanvas.width, 2)+'px Verdana';
            lowerCtx.font = font;
            lowerCtx.fillText('Vyberte si hlavné mesto kliknutím na želané hlavné mesto', getPercent(lowerCanvas.width,10), lowerCanvas.height - 8);
            gameMng.round++;
            gameMng.clicked = 0;      
        }
        else if(gameMng.round == 1){
            getClicked(mouse.x, mouse.y, tiles);
            console.log('Higli: ' + hglTiles[0].id + ' SubType: ' + hglTiles[0].subtype);
            if(isCapital()){     
                //Capital is selected and set
                players.forEach(player => {
                    tiles.forEach(tile=>{
                        //First of hgl tiles is clicked tile, player.name must correspond to tile.playercolor
                        if(tile.id == hglTiles[0] && player.name == tile.playerColor){
                            //Set type to human
                            player.type = 'human';
                            //Set taken prop of tile to taken and
                            tile.taken = true;
                            
                            console.log('Troop on tile: ' + tile.troop.player + ' Troop id: ' + tile.troopId);

                        }
                    });
                });
                
                tiles.forEach(tile => {
                    if(tile.taken == true){
                        //console.log('Army on tile: ' + tile.troop.name);
                    }
                    
                });
                //Can update armys
                selectedCapital = true;  //??
                //Set all capital tiles to taken to change the graphic              
                players.forEach(player => {
                    player.army.forEach(troop => {
                        //set the tile taken property to true
                        troop.setTaken();
                        troop.draw();
                    });
                });
                updateCanvas();
                lowerCtx.fillStyle = 'white';
                let font = getPercent(lowerCanvas.width, 2)+'px Verdana';
                lowerCtx.font = font;
                lowerCtx.fillText('Vybrali ste si hlavné mesto: '+ tiles[hglTiles[0].id - 1].playerColor, getPercent(lowerCanvas.width,10), lowerCanvas.height - 8);                
                //SetCurrent in other place!!!???
                //currentPlayer = setCurrentPlayer();
                currentPlayer = players[0];
                //console.log('Current player after setting the human player: ' + players[0].id);
                
                //console.log('Current player: ' + currentPlayer.id + ' and round: ' + gameMng.round);
                //updateGables();
                
                gameMng.clicked = 0;
                gameMng.round++;
                //gameMng.clicked = 1;
                //Function for set human player etc.
            }
            else{
                gameMng.clicked = 0;
                lowerCtx.fillStyle = 'white';
                let font = getPercent(lowerCanvas.width, 2)+'px Verdana';
                lowerCtx.font = font;
                lowerCtx.fillText('Vyberte si hlavné mesto kliknutím na želané hlavné mesto', getPercent(lowerCanvas.width,10), lowerCanvas.height - 8);
            }
            
            
        }
       
        else{
            getClicked(mouse.x, mouse.y, tiles);
            getNeigbHglts();    
            hglTiles = setPassables();    
            //console.log('Hgl tiles length: ' + hglTiles.length);
            //updateHighlighted();
            //console.log(event);
            lowerCtx.fillStyle = 'white';
            let font = (lowerCanvas.width/100)*2+'px Verdana';
            lowerCtx.font = font;
            lowerCtx.fillText('klik x: ' + mouse.x + ', klik y: ' + mouse.y, (lowerCanvas.width/100)*5, lowerCanvas.height - 8);            
            lowerCtx.fillStyle = 'white';
            let cklickedType = displayClicked();
            lowerCtx.fillText('Tile type: ' + cklickedType, (lowerCanvas.width/100)*55, lowerCanvas.height - 38);
            lowerCtx.fillText('Tile id: ' + hglTiles[0].id + ', Tile row: ' + hglTiles[0].row + ', Tile col: ' + hglTiles[0].col, (lowerCanvas.width/100)*55, lowerCanvas.height - 8);
            //ctx.fillText('Bod pt1x: ' + tile.pt1()[0] + ', bod pt1y: ' + tile.pt1()[1], (canvas.width/100)*65, canvas.height - 70);
            //document.getElementById("demo1").innerHTML = _radius;
            //One turn logic
            //currentPlayer = setCurrentPlayer();
            //currentPlayer = players[0];
            //currentPlayer.turn++;
            //console.log('Current player after setting the game, first game click: ' + currentPlayer.id);
            //makeTurn(currentPlayer);       
            playGame();
            updateHighlighted();
                
            console.log('Current player: ' + currentPlayer.name + ' turn ' + currentPlayer.turn + ' and game turn: ' + gameTurn);
            updateGables();
                
    }
}
    else{
        updateTowns();
    }  
        
   
});

canvas.addEventListener('mouseup', function(event){
    mouse.click = false;
});

window.addEventListener('keyup', (event) =>{
    updateCanvas();
    //curs = [];
    const keyName = event.key;
    console.log(keyName);
    if (keyName == '1') {
      // do not alert when only Control key is pressed.
      mCurs.turnUp();
      curs.push(mCurs);
      return;
    }
    if (keyName == '2') {
        // do not alert when only Control key is pressed.
        
        return;
      }
}, false);
//Assign troop to tile???
function assignTroop(){

} 
//Update lower canvas
function updateLowerCnv(){
    lowerCtx.clearRect(0,0, lowerCanvas.width, lowerCanvas.height);    
}
//Get percento from some value
function getPercent(value, percent){
    let result = 0;
    result = (value/100)*percent;
    return result;
}
//Detect if is clicked capitale tile
function isCapital(){
    let result = false;
    if(hglTiles.length > 0){
        hglTiles.forEach(tile => {
            if(tile.subtype == 'capital'){
                result = true;
            }
        });
    }
    return result;
}
//Find clicked tile and push it to hglTiles array at position 0
function getClicked(mx, my, tiles){
    for(i = 0; i < tiles.length; i++)
    {
        let distance = getDistance(mx, my, tiles[i].x, tiles[i].y);
        if(distance < tiles[i].radius){
            const hglTile = new Tile(tiles[i].x, tiles[i].y);
            hglTile.id = tiles[i].id;
            hglTile.type = tiles[i].type;
            hglTile.subtype = tiles[i].subtype;
            hglTile.row = tiles[i].row;
            hglTile.col = tiles[i].col;
            //console.log(tiles[i].subtype);
            hglTile.neighbours = tiles[i].neighbours;
            hglTile.fillStyle = '#ffffff';            
            //Add highighted to list of highlighted tiles
            hglTiles.push(hglTile);
            //getNeigbHglts(tiles[i]);
        }
    }
}
//Check if the clicked tile can be considered as clicked
function isClickable(){
    let result = false;
    //Must be some tile clicked
    if(hglTiles.length > 0){
        
        //Is taken by a troop of current player
        //console.log('Clicked tile: ' + tiles[hglTiles[0].id-1].id);
        
        if(tiles[hglTiles[0].id-1].troop.player == currentPlayer.name){
            console.log('tiles.troop.player: ' + tiles[hglTiles[0].id-1].troop.player + ' - current player name: ' + currentPlayer.name)
            result = true;
        }
               
    }
    return result;
}
//Set all neigbh to pasables or not
function setPassables(){
    //Passables = changed array
    let passables = []; //hglTiles;
    passables.push(hglTiles[0]);
    //Loop the highlighted tiles from 2nd tile
    for(i = 1; i < hglTiles.length; i++){
        //console.log("First subtype: " + hglTiles[0].subtype);
        //console.log("Neigbhs subtype: " + hglTiles[i].subtype);
        if(hglTiles[0].subtype == 'shore' && hglTiles[i].subtype == 'water'){            
            //passables.splice(i,1);            
        }
        else{
            passables.push(hglTiles[i]);
        }
    }
    return passables;    
}
//Get first circle of neigbours
function getNeigbHglts(){
    
    for(i = 0; i<hglTiles.length; i++){
        for(j=0; j < hglTiles[i].neighbours.length; j++){
            const hglTile = new Tile(hglTiles[i].neighbours[j].x, hglTiles[i].neighbours[j].y); 
            //Must be setted also the other properties???
            hglTile.type = hglTiles[i].neighbours[j].type;
            hglTile.subtype = hglTiles[i].neighbours[j].subtype;
            hglTile.fillStyle = '#ffffff';
            hglTiles.push(hglTile);
        }
        
    }
}

//Get first circle of exact neigbhs: position to centrale tile
function setExactNeigbs(){
    
    testArr = tiles;
    //console.log('TestArr length: ' + testArr.length);
    for(i = 0; i < tiles.length; i++){

        
        for(j=0; j < testArr.length; j++){
            if((testArr[j].x > tiles[i].x-10 && testArr[j].x < tiles[i].x + 10) && (testArr[j].y > tiles[i].y - (2*_height)-10 && testArr[j].y < tiles[i].y - (2*_height)+10)){
                tiles[i].exactNeigbhs[0] = tiles[j];
                //console.log('Neigb 1 of ' + tiles[i].id + ' > ' + tiles[i].exactNeigbhs[0].subtype);
                
            }
            else{
                let dummy = new Tile(1,1);
                tiles[i].exactNeigbhs[0] = dummy;
            }
            
            if((testArr[j].x > tiles[i].x + (_radius*1.5) -10 && testArr[j].x < tiles[i].x + (_radius*1.5) + 10) && (testArr[j].y > tiles[i].y - _height-10 && testArr[j].y < tiles[i].y - _height+10)){
                tiles[i].exactNeigbhs[1] = testArr[j];
                //console.log('Neigb 2 of ' + tiles[i].id + ' > ' + tiles[i].exactNeigbhs[1].subtype);
            }
            else{
                let dummy = new Tile(1,1);
                tiles[i].exactNeigbhs[1] = dummy;
            }
            
            if((testArr[j].x > tiles[i].x + (_radius*1.5) -10 && testArr[j].x < tiles[i].x + (_radius*1.5) + 10) && (testArr[j].y > tiles[i].y + _height-10 && testArr[j].y < tiles[i].y + _height+10)){
                tiles[i].exactNeigbhs[2] = testArr[j];
                //console.log('Neigb 3 of ' + tiles[i].id + ' > ' + tiles[i].exactNeigbhs[2].subtype);
            }
            else{
                let dummy = new Tile(1,1);
                tiles[i].exactNeigbhs[2] = dummy;
            }
            
            if((testArr[j].x > tiles[i].x-10 && testArr[j].x < tiles[i].x + 10) && (testArr[j].y > tiles[i].y + (2*_height)-10 && testArr[j].y < tiles[i].y + (2*_height)+10)){
                tiles[i].exactNeigbhs[3] = testArr[j];
                //console.log('Neigb 4 of ' + tiles[i].id + ' > ' + tiles[i].exactNeigbhs[3].subtype);
            }
            else{
                let dummy = new Tile(1,1);
                tiles[i].exactNeigbhs[3] = dummy;
            }
            
            if((testArr[j].x > tiles[i].x - (_radius*1.5) -10 && testArr[j].x < tiles[i].x - (_radius*1.5) + 10) && (testArr[j].y > tiles[i].y + _height-10 && testArr[j].y < tiles[i].y + _height+10)){
                tiles[i].exactNeigbhs[4] = testArr[j];
                //console.log('Neigb 5 of ' + tiles[i].id + ' > ' + tiles[i].exactNeigbhs[4].subtype);
            }
            else{
                let dummy = new Tile(1,1);
                tiles[i].exactNeigbhs[4] = dummy;
            }
            
            if((testArr[j].x > tiles[i].x - (_radius*1.5) -10 && testArr[j].x < tiles[i].x - (_radius*1.5) + 10) && (testArr[j].y > tiles[i].y + _height-10 && testArr[j].y < tiles[i].y + _height+10)){
                tiles[i].exactNeigbhs[5] = testArr[j];
                //console.log('Neigb 6 of ' + tiles[i].id + ' > ' + tiles[i].exactNeigbhs[5].subtype);
            }
            else{
                let dummy = new Tile(1,1);
                tiles[i].exactNeigbhs[5] = dummy;
            }
            
        }
    }
}

function getSecondNeigbs(tile){
    for(i = 0; i < tile.neighbours.length; i++){

    }
}
function getDistance(mx, my, tx, ty){
    //X dimension
    let distanceX =  Math.abs(Math.abs(tx) - Math.abs(mx));
    //y dimension
    let distanceY =  Math.abs(Math.abs(ty) - Math.abs(my));
    //Addition of x and y dimensions
    let distance = distanceX + distanceY;

    return distance;


}
//Playground
const playGround = {
    //Number of columns
    colsNum : _cols,
    rowsNum : _rows,
    //Bkg color
    background : 'black',
    //Radius of hex
    r : function(){
        //Number of tiles to compute r
        const tlNum = (this.colsNum/2) + (this.colsNum/4) + 0.25;
        //Calc r
        const rad = ((canvas.width-10)/tlNum)/2;
        
        return rad;        
    },
    tileHeight : function(){
        const rad = this.r();
        const tlh = (rad/2)*(Math.tan(1.0472));
        //alert(tlh);        
        return tlh;
    },
    
    canvasHeight : function(){
        const cnvHeight = ((2*this.tileHeight())*(this.rowsNum + 0.7));
        //let cnvHeight = ((2*this.tileHeight())*(this.rowsNum + 0.7));
        return cnvHeight;
    },
    
    lineWidth : 5,
    lineColor : 'white',
    earthColor : '#29a329',
    waterColor : 'blue',
    
    setPlayground : function(){              
        //alert(canvas.height);
        //Playground variables        
        _radius = this.r();
        //alert(_radius);
        //Hex tile height
        _height = this.tileHeight();
        canvas.height = this.canvasHeight();  
        canvas = document.getElementById('canvas');
        ctx = canvas.getContext('2d');
        canvasTowns = document.getElementById('canvas-towns');
        townsctx = canvasTowns.getContext('2d');
        canvasTowns.width = canvas.width;
        canvasTowns.height = canvas.height;
        

    },

    addTilesToArray : function(){
        //variables to be increased in the loop
        var id = 1;
        var rowId = 0;
                
        //var py1 = playGround.tileHeight()+10;        
        var plrad = playGround.r();
        
        //Constant vars in loop
        tlheight = playGround.tileHeight();
        var offx = playGround.r()*1.5;
        //var offy = tlheight;
        var position;
        for(var ro = 0; ro < playGround.rowsNum; ro++){
            //id for rows and cols
            rowId++;
            var colId = 1;
            //On each row add tile height to py point
            var rowPy = tlheight + (tlheight*ro*2.01) + 5;
            var px1 = 5;
            for(var i = 0; i< playGround.colsNum; i++){
                //creates only theoric tiles to be drawn later in drawTiles func
                //Is odd?
                var py = rowPy;
                odd = isOdd(colId);
                if(odd == 0){
                    //added
                    py += tlheight;
                    position = 0;
                }
                else{
                    //added
                    py = rowPy;
                    position = 1;
                }   
                //Creates tile
                tl = new Tile (px1 + this.r(), py);
                //row and col id in a row
                tl.id = id;
                tl.row = rowId;
                tl.col = colId;
                //console.log(tl.row + '/' + tl.col);
                //Set upper or lower position in row
                tl.pos = position;
                tl.fillStyle = 'green';
                
                //Increasing vars
                id++;
                px1 += offx;
                colId++;
                //Set tile type
                //setTileTypeRandom(tl);
                //Add tile to list of tiles
                //setNexts(tl);
                tiles.push(tl);
                //drawHex(tl);
            }
        }
        //tiles = setCorners(tiles);
        //tiles = generateMap(tiles);
        //testTiles = tiles;
        //tiles = setNexts();       
        //setColors(tiles);
        //setNexts(tiles);
        //tiles = setToWater(tiles);
        //checkEdited(tiles);
        return tiles;          
    }

            
    
}
//Game Logic
const gameMng = {
    clicked : 0,
    round : 0,
}

//Set colors for all tiles of playground
function setColors(tiles){
    for(i = 0; i < tiles.length; i++){
        setColor(tiles[i]);
    }
}
//Set color of a tile according to type
function setColor(tile){
    if(tile.type == 'earth' && tile.subtype == 'none'){
        tile.fillStyle = 'green';
    }
    else if(tile.type == 'earth' && tile.subtype == 'shore'){        
            tile.fillStyle = 'green';
    }
    else if(tile.type == 'water'){
        tile.fillStyle = '#3862e0';
    }
    else if(tile.type == 'water1'){
        tile.fillStyle = 'yellow';
    }
}

//Dedetct if tile id is odd
function isOdd(num) { return num % 2;}

//Generate map with earth, water and other attributs
function generateMap(tiles){
    //Random number of events of inserting territory 
    let numEvents = Math.floor(Math.random() * 10)+1;
    //console.log(numEvents);
    
        for(i = 0; i < tiles.length; i++){
            
            //The moment when insert the territory
            let occurence = Math.floor(Math.random() * 30)+1;
            //console.log(occurence);
            if((occurence == 8) && (tiles[i].isEdited == false)){
                //insert territory
                tiles[i].fillStyle = 'blue';
                //tiles[i].type = 'water';
                //tiles[i].isEdited = true;
                tiles[i].isEdited = true;
                tiles[i].type = 'water';
                tiles[i].subtype = 'water';
                //territ = setTerritory(offset, tiles[i]);
                //drawTerrit(territ);
                testTiles.push(tiles[i]);
                numEvents--;
                //console.log('Subtype: ' + tiles[i].subtype);
                //console.log('IsEdited: ' + tiles[i].isEdited);
            }           
        }      
        //console.log('Tiles: ' + tiles.length);
        
    return tiles;
}


//Find and set neigbours tiles of a tile
function setNeighbours(){
    for(i = 0; i < tiles.length; i++){
        for(j = 0; j < testTiles.length; j++){
            let distance = getDistance(testTiles[j].x, testTiles[j].y, tiles[i].x, tiles[i].y);
            if((distance > tiles[i].radius) && (distance < ((tiles[i].radius*1.7)+tiles[i].height))){
                tiles[i].neighbours.push(testTiles[j]);
                //console.log('Neigbh subtype from testTiles: ' + testTiles[j].subtype);
            }
            
        }
        //console.log(i + " Neigbours : " + tiles[i].neighbours.length);
    }
}
//Find and set shore subtype
function setShores(){
    
    //Loop all tiles
    for(i = 0; i < tiles.length; i++){
        if(tiles[i].type == 'earth'){
            //Loop neigh
            let occurence = 0;
            for(j = 0; j < tiles[i].neighbours.length; j++){
                if(tiles[i].neighbours[j].type == 'water'){
                    //console.log("Neigbours: " + tiles[i].neighbours.length);
                    occurence++;
                }
            }
            if(occurence > 0){
                tiles[i].subtype = 'shore';
            }
            else{
                tiles[i].subtype = 'inland';
            }
            
        }
    }
        
}
function findMonoIslands(){
    for(i = 0; i < tiles.length; i++){
        let occurence = 0;
        for(j = 0; j < tiles[i].neighbours.length; j++){
            if(tiles[i].neighbours[j].type == 'water'){
                occurence++;
            }
        }
        if(occurence == 6){
            tiles[i].isMono = true;
            //console.log('Tile ' + tiles[i].id + ' is mono');
        }
        
    }
}
function removeMonos(){
    for(i = 0; i < tiles.length; i++){
        if(tiles[i].isMono == true){
            tiles[i].type = 'water';
            tiles[i].subtype = 'water';
        }
    }
}

function setTerritory(){//offset is a line withe defined tile params from offsets array or file
    //Set test array
    testTiles = tiles;
    //Split presets in individual items
    myPresets = presets.split('\n');
    

    
    //Select 1. preset and set params
    
        //console.log("Preset: " + i);
        //result: 1, 1, water
        
    //For tile in tiles, if tile is water
    for(i = 0; i < tiles.length; i++){
        //If tile.type is water
        if(tiles[i].type == 'water'){
            //Select preset by random index
            let pr = Math.floor(Math.random() * myPresets.length);
            //Split each offset to params
            myOffsets = myPresets[pr].split(';');
            //console.log("Počet offsetov: " + myOffsets.length);
            for(a = 0; a < myOffsets.length; a++){
                let params = myOffsets[a].split(',');
                let multiple = params[1]*1.5;
                //console.log(multiple);
                if(params[0] == 1){                    
                    var xpointAdd = 0 - (multiple*tiles[i].radius);
                    //console.log("X point: minus"); 
                }
                else{
                    var xpointAdd = 0 + (multiple*tiles[i].radius);
                    //console.log("X point: " + xpoint);
                }

                if(params[2] == 1){
                    //params[1].replace('-', '');
                    var ypointAdd = 0 - (params[3]*tiles[i].height);
                    //console.log("X point: " + ypoint);
                }
                else{
                    var ypointAdd = 0 + (params[3]*tiles[i].height);
                    //console.log("X point: " + ypoint);
                }

                //console.log("X point" + a + ":" + xpointAdd);
                //console.log("Y point" + a + ":" + ypointAdd);
                //Test tiles to find offset tiles
                for(j = 0; j < testTiles.length; j++){
                if(((testTiles[j].x > (tiles[i].x + xpointAdd) - 15) && 
                (testTiles[j].x < (tiles[i].x + xpointAdd) + 15)) &&
                    ((testTiles[j].y > (tiles[i].y + ypointAdd) - 15)) && (testTiles[j].y < (tiles[i].y + ypointAdd) + 15)){
                        if(testTiles[j].isEdited == false){
                            //tiles[j].type = params[4];
                            tiles[j].type = params[4];
                            if(params[4] == 'water'){
                                tiles[j].subtype = params[4];
                                //console.log(tiles[j].subtype);
                            }
                            
                            //console.log("Tile type: " + tiles[j].type);
                            //console.log("Param type: " + params[4]);
                            //tiles[j].fillStyle = 'blue';
                            tiles[j].isEdited = true;                        
                            
                        }
                    
                    }
                }
            }
                   
        }    
        
    }
        

    


    //return array of x, y, type???
    return tiles;
}

function setCorners(tiles){
    for(i = 0; i < tiles.length; i++){
        //Left upper corner
        if(tiles[i].row < 4 && tiles[i].col < 4){
            tiles[i].isEdited = true;
            //tiles[i].fillStyle = 'yellow';
        }
        //Right upper corner
        else if((tiles[i].row < 4 && tiles[i].col > _cols - 3)){
                            
                if(tiles[i].row == 3 && tiles[i].col == _cols - 2){
                    //tiles[i].fillStyle = 'black';
                }
                else{
                    tiles[i].isEdited = true;
                    //tiles[i].fillStyle = 'red';
                }             
            
        }
        //Right lower corner
        else if(tiles[i].row > _rows - 3 && tiles[i].col > _cols - 3){
            
            tiles[i].isEdited = true;
            //tiles[i].fillStyle = 'orange';
        }
        //Left lower corner
        else if(tiles[i].row > _rows - 3 && tiles[i].col < 4){
            if(tiles[i].row == _rows - 2 && tiles[i].col == 3){

            }
            else{
                tiles[i].isEdited = true;
                //tiles[i].fillStyle = 'white';                     
            }
                            
        }
        
    }   
    
    //console.log('Tiles: ' + tiles.length);
    return tiles;
}
//Test function
function setToWater(tiles){
    for(i = 0; i < tiles.length; i++){
        
        if(tiles[i].isEdited == false){
            tiles[i].isEdited = true;
            tiles[i].fillStyle = 'blue';
        }
    }
    return tiles;
}

function checkEdited(tiles){
    for(j = 0; j < tiles.length; j++){
        console.log('IsEdited: ' + tiles[j].isEdited);
    }
    
}
//Set ports
function setPorts(){
    //Random number of events of inserting territory 
    let numEvents = Math.floor(Math.random() * 40)+10;
    let shoresnum = getSubtypeNum('shore');
    console.log(shoresnum);
    numEvents = numEvents*(shoresnum/100);
    while(numEvents > 0){
        for(i = 0; i < tiles.length; i++){
            //The moment when insert the territory
            let occurence = Math.floor(Math.random() * 10)+1;
            if((occurence == 8) && (tiles[i].subtype == 'shore')){
                //console.log('shore');
                //Set port            
                tiles[i].subtype = 'port';
                tiles[i].circleFillStyle = 'blue';
                //Create circle
                circle = new Circle(tiles[i]);
                
                ports.push(circle);
                numEvents--;
                //console.log('Subtype: ' + tiles[i].subtype);
                //console.log('IsEdited: ' + tiles[i].isEdited);
            }          
    
        }
    }
}

    function setTowns(){
        //Random number of events of inserting territory 
        let numEvents = Math.floor(Math.random() * 40)+10;
        let inlandnum = getSubtypeNum('inland');
        //console.log(inlandnum);
        numEvents = numEvents*(inlandnum/100);
        while(numEvents > 0){
            for(i = 0; i < tiles.length; i++){
                //The moment when insert the territory
                let occurence = Math.floor(Math.random() * 10)+1;
                if((occurence == 8) && (tiles[i].subtype == 'inland')){
                    //console.log('inland');
                    //Set port            
                    tiles[i].subtype = 'town';
                    tiles[i].circleFillStyle = 'blue';
                    //Create circle
                    circle = new Circle(tiles[i]);
                    
                    towns.push(circle);
                    numEvents--;
                    //console.log('Subtype: ' + tiles[i].subtype);
                    //console.log('IsEdited: ' + tiles[i].isEdited);
                }          
        
            }
        }
        
   
    //console.log('Počet príst: ' + ports.length);    
}

//Let only solitaire towns
function clearTowns(){
    for(i = 0; i < tiles.length; i++){
        //Subtype must be town
        if(tiles[i].subtype == 'town' || tiles[i].subtype == 'capital'){
            //Loop neigbhours
            for(j = 0; j < tiles[i].neighbours.length; j++){
                if(tiles[i].neighbours[j].subtype == 'town'){
                    tiles[i].neighbours[j].subtype = 'inland';
                }
            }
        }        
    }
}
//Update towns array
function updateTownsArray(){
    towns = [];
    for(i = 0; i < tiles.length; i++){
        if(tiles[i].subtype == 'town'){
            //Create circle
            circle = new Circle(tiles[i]);                    
            towns.push(circle);
        }
    }
}
//Get subtype number
function getSubtypeNum(subtype){
    let num = 0;
    for(i = 0; i < tiles.length; i++){
        if(tiles[i].subtype == subtype){
            num++;
        }
    }
    return num;
}
//Set capitals
function setCaps(tiles){
    for(i = 0; i < tiles.length; i++){
        
        if(tiles[i].row == 2 && tiles[i].col == 2){
            tiles[i].subtype = 'capital';
            //Name of player
            tiles[i].playerColor = 'red';
            //console.log(tiles[i].subtype);
            tiles[i].circleFillStyle = 'red';            
            circle = new Circle(tiles[i]);
            capitals.push(circle);
        }
        else if(tiles[i].row == 2 && tiles[i].col == _cols-1){
            tiles[i].subtype = 'capital';
            tiles[i].playerColor = 'violet';
            //console.log(tiles[i].subtype);
            tiles[i].circleFillStyle = 'lavender';
            circle = new Circle(tiles[i]);
            capitals.push(circle);
        }
        else if(tiles[i].row == _rows-1 && tiles[i].col == 2){
            tiles[i].subtype = 'capital';
            tiles[i].playerColor = 'blue';
            //console.log(tiles[i].subtype);
            tiles[i].circleFillStyle = 'DodgerBlue';            
            circle = new Circle(tiles[i]);
            capitals.push(circle);
        }
        else if(tiles[i].row == _rows-1 && tiles[i].col == _cols-1){
            tiles[i].subtype = 'capital';
            tiles[i].playerColor = 'green';
            //console.log(tiles[i].subtype);
            tiles[i].circleFillStyle = 'yellowGreen';
            circle = new Circle(tiles[i]);
            capitals.push(circle);
        }      
        
    }
    return tiles;
}


//Clear edited = true param in tiles
function clearEditedParam(){
    for(i = 0; i < tiles.length; i++){
        tiles[i].isEdited = false;
    }
}
//Function to find nearst tile from given tile
function findNearst(starttile, tiletype){
    let result = [];
    for(i = 0; i < tiles.length; i++){
        if(tiles[i].subtype == tiletype){
            let distance = getDistance(starttile.x, starttile.y, tiles[i].x, tiles[i].y);
            //console.log(distance);
            let myDistance = [distance, tiles[i].id];
            result.push(myDistance);
        }        
    }

    result = sortNearst(result);
    result = orderNearst(result);
    return result;
}
//Sort nearst elements
function sortNearst(nearst){
    let result = [];
    testNearst = nearst;
    //Order in array
    
    for(i = 0; i < nearst.length; i++){
        let weight = 0;
        for(j = 0; j < testNearst.length; j++){
            if(nearst[i][0] > testNearst[j][0]){
                weight++
            }
        }
        let sorted = [weight, nearst[i][0], nearst[i][1]];
        result.push(sorted);
    }

    return result;
}
//Sort array by weight
function orderNearst(nearst){
    let result = [];
    for(i = 0; i < nearst.length; i++){
        for(j = 0; j < nearst.length; j++){
            if(i == nearst[j][0]){
                result.push(nearst[j]);
            }
        }        
    }
    return result;
}
//Go on earth to  subtype tile
function processCornerIslands(){
    process1CornerIsland();
    process2CornerIsland();
    process3CornerIsland();
    process4CornerIsland();
}
//functions to find four corner islands
function process1CornerIsland(){
    setCrossed(tiles[0]);
    for(i = 0; i < tiles.length; i++){
        if(tiles[i].subtype != 'water' && tiles[i].crossed == true && tiles[i].secondCross == false){
            //&& tiles[i].secondCross == false
            //tiles[i].crossed = true;
            tiles[i].secondCross = true;
            setCrossed(tiles[i]);
        }
        else{   
                        
        }
    }
    
    shorePath = getCrossed();
    //console.log('Crossed: ' + shorePath.length);
    
    //console.log('Is island: ' + isIsland(1));
    if(isIsland(1) == true){
        if(hasPorts() == false){
            setCornerPorts();
            //console.log('No ports');
            //set ports()
        }
        else{
            //console.log('Has ports');
        }
    }
    shorePath.forEach(sh =>{
        //console.log(sh.id + 'tile '+ sh.subtype);
    });
}
//Deteck if is there some ports on 
function hasPorts(){
    var result = false;
    let count = 0;
    shorePath.forEach(element =>{
        if(element.subtype == 'port'){
            count++;
        }        
    });
    if(count > 0){
        result = true;
    }
    if(result == true){
        console.log('Has ports');
    }
    else{
        console.log('No ports');
    }
    return result;
}
//Set randomly ports to corner island
function setCornerPorts(){
    let portsnum = Math.floor(Math.random() * 3)+1;
    if(shorePath.length > 0){
        for(a = 0; a < shorePath.length; a++){

        
            if(shorePath[a].subtype == 'shore'){
                tiles[shorePath[a].id-1].subtype = 'port';
                tiles[shorePath[a].id-1].circleFillStyle = 'blue';
                //Create circle
                circle = new Circle(tiles[shorePath[a].id-1]);
                ports.push(circle);
                console.log('Added port at: ' + shorePath[a].id);
                return;
            }       
        
        }  
    }  
    
    for(i = 0; i < portsnum; i++){
        shorePath.forEach(element => {
            let occurence = Math.floor(Math.random() * 3)+1;
            if(occurence == 5 && element.subtype == 'shore'){
                tiles[element.id-1].subtype = 'port';
                tiles[element.id-1].circleFillStyle = 'blue';
                //Create circle
                circle = new Circle(tiles[tiles[element.id-1]]);
                ports.push(circle);
                
            }
        });
    
        
    }

}
//Reset crossed and secondcross
function resetCrossed(){
tiles.forEach(tl => {
    tl.crossed = false;
});
}
function resetSecondCross(){
    tiles.forEach(tl => {
        tl.secondCross = false;
    });
}
function process2CornerIsland(){
    //Reset tiles crossed and secondCross an Shorepath array
    resetCrossed();
    resetSecondCross();
    shorePath = []; 
    //Set first crossed tile and his neigbh    
    setCrossed(tiles[_cols-1]);
    //console.log('First crossed tile: ' + tiles[_cols-1].id);
    //Loop each col in each row
    for(i = 1; i < _rows; i++){
        tiles.forEach(element => {
            //console.log('Tile cole: ' + j);
            if(element.row == i){
                for(j = _cols; j > 1; j--){
                    tiles.forEach(tile => {
                        //console.log('Tile cole: ' + j);
                        if(tile.col == j && tile.subtype != 'water' && tile.crossed == true && tile.secondCross == false){
                            //&& tiles[i].secondCross == false
                            //tiles[i].crossed = true;
                            tile.secondCross = true;
                            setCrossed(tile);
                        }
                        else{   
                                        
                        }
                    });
                    
                }
                //&& tiles[i].secondCross == false
                //tiles[i].crossed = true;
                
            }
            else{   
                            
            }
        });
        //console.log('Tile row: '+ i); 
        //Go from end to start    
        
    }
    
    shorePath = getCrossed();
    //console.log('Crossed: ' + shorePath.length);
    
    //console.log('Is island: ' + isIsland(1));
    if(isIsland(2) == true){
        if(hasPorts() == false){
            setCornerPorts();
            //console.log('No ports');
            //set ports()
        }
        else{
            //console.log('Has ports');
        }
    }
}
//Third corne island
function process3CornerIsland(){
    //Reset tiles crossed and secondCross an Shorepath array
    resetCrossed();
    resetSecondCross();
    shorePath = [];

    //Set first crossed tile and his neigbh    
    let startInd = tiles.length - _cols;
    setCrossed(tiles[startInd]);
    //console.log('First crossed tile: ' + tiles[_cols-1].id);
    //Loop each col in each row
    for(i = _rows; i > 0; i--){
        tiles.forEach(element => {
            //console.log('Tile cole: ' + j);
            if(element.row == i){
                for(j = 1; j < _cols; j++){
                    tiles.forEach(tile => {
                        //console.log('Tile cole: ' + j);
                        if(tile.col == j && tile.subtype != 'water' && tile.crossed == true && tile.secondCross == false){
                            //&& tiles[i].secondCross == false
                            //tiles[i].crossed = true;
                            tile.secondCross = true;
                            setCrossed(tile);
                        }
                        else{   
                                        
                        }
                    });
                    
                }
                //&& tiles[i].secondCross == false
                //tiles[i].crossed = true;
                
            }
            else{   
                            
            }
        });
        //console.log('Tile row: '+ i); 
        //Go from end to start    
        
    }
    
    shorePath = getCrossed();
    //console.log('Crossed: ' + shorePath.length);
    
    //console.log('Is island: ' + isIsland(1));
    if(isIsland(3) == true){
        if(hasPorts() == false){
            setCornerPorts();
            //console.log('No ports');
            //set ports()
        }
        else{
            //console.log('Has ports');
        }
    }
}
//4. corne island
function process4CornerIsland(){
    //Reset tiles crossed and secondCross an Shorepath array
    resetCrossed();
    resetSecondCross();
    shorePath = []; 
    //Set first crossed tile and his neigbh    
    //let startInd = tiles.length - _cols;
    setCrossed(tiles[tiles.length-1]);
    //console.log('First crossed tile: ' + tiles[tiles.length-1].id);
    //Loop each col in each row
    for(i = _rows; i > 0; i--){
        tiles.forEach(element => {
            //console.log('Tile cole: ' + j);
            if(element.row == i){
                for(j = _cols; j > 0; j--){
                    tiles.forEach(tile => {
                        //console.log('Tile cole: ' + j);
                        if(tile.col == j && tile.subtype != 'water' && tile.crossed == true && tile.secondCross == false){
                            //&& tiles[i].secondCross == false
                            //tiles[i].crossed = true;
                            tile.secondCross = true;
                            setCrossed(tile);
                        }
                        else{   
                                        
                        }
                    });
                    
                }
                //&& tiles[i].secondCross == false
                //tiles[i].crossed = true;
                
            }
            else{   
                            
            }
        });
        //console.log('Tile row: '+ i); 
        //Go from end to start    
        
    }
    
    shorePath = getCrossed();
    //console.log('Crossed: ' + shorePath.length);
    
    //console.log('Is island: ' + isIsland(1));
    if(isIsland(4) == true){
        if(hasPorts() == false){
            setCornerPorts();
            //console.log('No ports');
            //set ports()
        }
        else{
            //console.log('Has ports');
        }
    }
}
//Set neigbhs to crossed
function setCrossed(tile){
    for(i = 0; i < tile.neighbours.length; i++){
        if( tile.neighbours[i].subtype != 'water'){
            //tile.neighbours[i].subtype == 'inland' || tile.neighbours[i].subtype == 'town' || tile.neighbours[i].subtype == 'port' || tile.neighbours[i].subtype == 'shore'
            tile.neighbours[i].crossed = true;
            //console.log('Tile id: ' + tile.id + '> neigbh: ' + tile.neighbours[i].id);
        }
    }
}
//Gather the crossed tiles like one groupe
function getCrossed(){
    result = [];
    tiles.forEach(element => {
        if(element.crossed == true){
            let myTile = new Tile(element.x, element.y);
            myTile.fillStyle = 'orange';
            myTile.id = element.id;
            myTile.col = element.col;
            myTile.row = element.row;
            myTile.subtype = element.subtype;
            result.push(myTile);
        }
        
        
    });
    return result;
}
//Is Island?
function isIsland(cornerNum){
    let count = 0;
    let result = true;
    if(cornerNum == 1){
        for(i = 0; i < shorePath.length; i++){
            //console.log('Col num: '+ shorePath[i].col);
            if(shorePath[i].col == _cols-1){
                //console.log('Col num: '+ shorePath[i].col);
                count++;
            }
            if(shorePath[i].row == _rows-1){
                //console.log('Row num: '+ shorePath[i].row);
                count++;
            }
        }
    }
    if(cornerNum == 2){
        for(i = 0; i < shorePath.length; i++){
            //console.log('Col num: '+ shorePath[i].col);
            if(shorePath[i].col == 1){
                //console.log('Col num: '+ shorePath[i].col);
                count++;
            }
            if(shorePath[i].row == _rows-1){
                //console.log('Row num: '+ shorePath[i].row);
                count++;
            }
        }
    }
    if(cornerNum == 3){
        for(i = 0; i < shorePath.length; i++){
            //console.log('Col num: '+ shorePath[i].col);
            if(shorePath[i].col == _cols){
                //console.log('Col num: '+ shorePath[i].col);
                count++;
            }
            if(shorePath[i].row == 1){
                //console.log('Row num: '+ shorePath[i].row);
                count++;
            }
        }
    }
    if(cornerNum == 4){
        for(i = 0; i < shorePath.length; i++){
            //console.log('Col num: '+ shorePath[i].col);
            if(shorePath[i].col == 1){
                //console.log('Col num: '+ shorePath[i].col);
                count++;
            }
            if(shorePath[i].row == 1){
                //console.log('Row num: '+ shorePath[i].row);
                count++;
            }
        }
    }
        
        if(count > 0){
            result = false;
        }         
    

    return result;
}
//Check if is available next shore or port tile
function isNextAvailable(tile){
    let result = false;
    let count = 0;
    //Loop neigbhours
    for(i = 0; i < tile.neighbours.length; i++){
        if((tile.neighbours[i].subtype == 'shore' || tile.neighbours[i].subtype == 'port') && tile.neighbours[i].crossed == false && tile.neighbours[i].secondCross == false){
            count++;
        }
    }
    if(count > 0){
        result = true;
    }

    return true;
}
//Find next available tile from neigbhours
function findNextTile(tile, cross=true){
    let result = 0;
    if(cross == true){
        for(i = 0; i < tile.neighbours.length; i++){
            if((tile.neighbours[i].subtype == 'shore' || tile.neighbours[i].subtype == 'port') && tile.neighbours[i].crossed == false){
                result = tile.neighbours[i].id - 1;
            }
        }
    }
    else{
        for(i = 0; i < tile.neighbours.length; i++){
            if((tile.neighbours[i].subtype == 'shore' || tile.neighbours[i].subtype == 'port') && tile.neighbours[i].secondCross == false){
                result = tile.neighbours[i].id - 1;
            }
        }
    }
    
    return result;
}

function updateCanvas(){
    ctx.clearRect(0,0, canvas.width, canvas.height);    
    //Update tiles
    //Reset opacity
    ctx.globalAlpha = 1;
    for(i = 0; i < tiles.length; i++){
        tiles[i].draw();        
    }
    //Define circle radius here
    for(j = 0; j < capitals.length; j++){
        capitals[j].draw((_radius/100)*60);
    }
    for(p = 0; p < ports.length; p++){
        ports[p].draw((_radius/100)*45);
    }
    for(t = 0; t < towns.length; t++){
        towns[t].draw((_radius/100)*35);
    }
    for(s = 0; s < shorePath.length; s++){
        //shorePath[s].draw();
    }
    if(gameMng.round > 0 && selectedCapital == true){
        updatePlayers();
    }
    
    //curs[0].draw();
    //mCurs.draw(tiles[150]);
    //radiusRate = gameMng.radiusRate();
    //console.log('Radius rate: ' + radiusRate);
}
//Update players armies
function updatePlayers(){
    players.forEach(player => {
        player.army.forEach(troop => {
            troop.draw();
        });
    });
}
//Update towns array
function updateTowns(){
    for(t = 0; t < towns.length; t++){
    
        towns[t].draw((_radius/100)*35);
    
        
    }
}

function updateHighlighted(){
//Update higlighted
//Set opacity
    ctx.globalAlpha = 0.65;
    if(hglTiles.length > 0){
        for(j = 0; j < hglTiles.length; j++){
            if(hglTiles.length > 0){
                hglTiles[j].draw();        
            }
            
        }
    }    

    for(s = 0; s < shorePath.length; s++){
        //shorePath[s].draw();
    }
    /*if(hglTiles.length > 0)
        hglTiles[0].draw();*/
    ctx.globalAlpha = 1;
}

function displayClicked(){
    let output = 'None';
    if(hglTiles.length > 0)
    
        //hglTiles[0].draw();
        {
            output = hglTiles[0].type + ', ' + hglTiles[0].subtype;
        }
        return output;    
}

function displayPlayground(){
    playGround.setPlayground();
    tiles = playGround.addTilesToArray();  
    //Set corners to earth
    tiles = setCorners(tiles);
    //Generation of a map??
    tiles = generateMap(tiles);
    //??
    tiles = setTerritory();    
    //Set neigbhours for each tile
    setNeighbours();    
    
    //Remove all one tile islands
    findMonoIslands();
    removeMonos();    
    //followRow(tiles[0]);
    //Set shore property
    setShores();            
    //set colors for each tile according to type or sub type   
    //setColors(tiles);  
    //Set capitals
    //tiles = setCapitals(tiles);
    tiles = setCaps(tiles);
    
    setPorts();

    setTowns();
    clearTowns();
    updateTownsArray();
    setExactNeigbs();    
    processCornerIslands();
    
    //mCurs.draw(tiles[150]);
    //isIsland(tiles[0]);
    //Find nearst port
    //var nearstPorts = findNearst(tiles[21], 'port');
    //nearstPorts = sortNearst(nearstPorts);
    /*for(a = 0; a < tiles.length; a++){
        console.log('Tile row' + tiles[a].row + ' col: ' + tiles[a].col);
    }*/
    //console.log('Ports number: ' + nearstPorts.length);
    //set colors for each tile according to type or sub type   
    setColors(tiles);      
    //mCurs = new TCursor(tiles[150]);
    //mCurs.draw();
    //curs.push(mCurs);
    //tiles = setToWater(tiles);    
    updateCanvas();
    updateHighlighted();
    
    //console.log('Sucet: '+ gameMng.calculate());
    //console.log('Subtype: '+ tiles[1].subtype);
}
//Set the players
function setGame(){
    let i = 0;
    //Set the players
    tiles.forEach(tile => {
        if(tile.subtype == 'capital'){
            let player = new Player();
            player.id = i;
            i++;
            player.name = tile.playerColor;
            player.fillColor = tile.circleFillStyle;
            player.capital = tile.id;
            console.log('Player id: ' + player.id);
            //Create troop and push it to army of player
            let troop = new Troop(player, tile);
            tile.troopId = troop.id;
            tile.troop = troop;
            //set tile to taken
            //tile.taken = true;
            //set tile for troop where the troop is
            troop.tileId = tile.id;
            //push first troop to player army
            player.army.push(troop);
            //Push player to players array
            players.push(player);
            console.log('Capital color: '+ player.fillColor);         

        }
    }); 
    console.log('Num of players: ' + players.length);
    drawGables();    
    
}
function setCurrentPlayer(){
    currentPlayer = players[gameTurn];
    return currentPlayer;
}
//Redraw gables with highlighted gable
function updateGables(){
    upperCtx.clearRect(0,0, upperCanvas.width, upperCanvas.height);
    var x = getPercent(upperCanvas.width,5);
    let y = getPercent(upperCanvas.height,30);
    let width = getPercent(upperCanvas.height,60);
    let height = getPercent(upperCanvas.height, 50);
    for(i = 0; i < players.length; i++){
        upperCtx.fillStyle = players[i].fillColor;
        upperCtx.strokeStyle = 'white';
        upperCtx.lineWidth = 2;
        if(players[i].id == currentPlayer.id){
            //console.log('players[i].id == currentPlayer.id: ' + players[i].id + ' - ' + currentPlayer.id);
            //Resize current player gable
            y -= getPercent(upperCanvas.height, 20);
            width += getPercent(upperCanvas.height,20);
            height += getPercent(upperCanvas.height,30);
            upperCtx.fillRect(x, y, width, height);
            upperCtx.strokeRect(x, y, width, height);        
            x += width + getPercent(upperCanvas.height,20);
            //upperCtx.fill();
            
        }
        else{
            y = getPercent(upperCanvas.height,30);
            width = getPercent(upperCanvas.height,70);
            height = getPercent(upperCanvas.height, 50);
            upperCtx.fillRect(x, y, width, height);
            upperCtx.strokeRect(x, y, width, height);        
            //upperCtx.fill();
            x += getPercent(upperCanvas.height,90);
        }
    }
}
//Draw gables of players
function drawGables(){
    var x = getPercent(upperCanvas.width,5);
    let y = getPercent(upperCanvas.height,30);
    let width = getPercent(upperCanvas.height,60);
    players.forEach(player => {
        upperCtx.fillStyle = player.fillColor;
        upperCtx.strokeStyle = 'white';
        upperCtx.lineWidth = 2;
        upperCtx.fillRect(x, y, width, getPercent(upperCanvas.height, 50));
        upperCtx.strokeRect(x, y, width, getPercent(upperCanvas.height, 50));        
        //upperCtx.fill();
        x += getPercent(upperCanvas.height,90);
    });
}
//Set the current player id
function setGameTurn(){
    if(gameTurn < 3){
        gameTurn++;
    }
    else{
        gameTurn = 0;
    }
}
//All logic to realise one turn of a player
function playGame(){  
    if(isClickable() == true){
        console.log('Clickable');
        if(currentPlayer.turn < 4){
            console.log(currentPlayer.name + ' on turn ' + currentPlayer.turn);
            currentPlayer.turn++;
        }
        else{
            console.log(currentPlayer.name + ' ' + currentPlayer.turn + ' end');
            currentPlayer.turn = 0;
            //increase the game turn
            setGameTurn();
            //console.log('Game turn from playGame func: ' + gameTurn);
            currentPlayer = players[gameTurn];
        }
    }
    else{
        //console.log('Not Clickable');
        hglTiles = [];
        gameMng.clicked = 0;
    }      
        
}

//Manage turn counting
function setTurn(turn){
    if(turn < 4){
        turn++;
    }
    else{
        turn = 0;
    }

    return turn;
}

//Tile
class Tile {
    constructor(xPoint, yPoint){
        //id of tile
        this.id = 0;
        //Number of row in playground
        this.row = 0;
        //Column number
        this.col = 0;
        //Upper or lower position in row
        this.pos = 0;
        //IsEdited
        this.isEdited = false;
        //Fill color
        this.fillStyle = '#29a329';
        //Fill color for circle
        this.circleFillStyle = 'white';
        //Tile type
        this.type = 'earth';
        //Subtype like shore, forest
        this.subtype = 'non';
        //Color of the capital and so of the player
        this.playerColor = 'none'
        //Taken tile with some troop
        this.taken = false;
        //Troop positioned on the tile
        this.troopId = 0;
        //Only declared
        this.troop = 0;
        
        //center point
        this.x = xPoint;
        this.y = yPoint;
        this.radius = _radius;
        this.height = _height;
        //Neighbours
        this.neighbours = [];
        //Exact position neigbhs
        this.exactNeigbhs = [];
        
        //Is one tile territory?
        this.isMono = false;
        //Past first time
        this.crossed = false;
        //Second crossing
        this.secondCross = false;

        //alert(this.radius);
        this.pt1 = function(){
            var pt1x = this.x - this.radius;
            var pt1y = this.y;
            var coords = [pt1x, pt1y];
            return coords;
        }

        this.pt2 = function(){
            var pt2x = this.x - this.radius/2;
            var pt2y = this.y - this.height;
            var coords = [pt2x, pt2y];
            return coords;
        }

        this.pt3 = function(){
            var pt3x = this.x + this.radius/2;
            var pt3y = this.y - this.height;
            var coords = [pt3x, pt3y];
            return coords;
        }

        this.pt4 = function(){
            var pt4x = this.x + this.radius;
            var pt4y = this.y;
            var coords = [pt4x, pt4y];
            return coords;
        }

        this.pt5 = function(){
            var pt5x = this.x + this.radius/2;
            var pt5y = this.y + this.height;
            var coords = [pt5x, pt5y];
            return coords;
        }
        this.pt6 = function(){
            var pt6x = this.x - this.radius/2;
            var pt6y = this.y + this.height;
            var coords = [pt6x, pt6y];
            return coords;
        }           
       
    }

    draw(){
        
        ctx.fillStyle = this.fillStyle;
        ctx.beginPath();
        //ctx.moveTo(this.x - _radius, this.y);
        //ctx.lineTo(this.x - _radius/2, this.y - _height);
        //ctx.lineTo(this.x + _radius/2, this.y - _height);
        //ctx.lineTo(this.x + _radius, this.y);

        ctx.moveTo(this.pt1()[0], this.pt1()[1]);
        ctx.lineTo(this.pt2()[0], this.pt2()[1]);
        ctx.lineTo(this.pt3()[0], this.pt3()[1]);
        ctx.lineTo(this.pt4()[0], this.pt4()[1]);
        ctx.lineTo(this.pt5()[0], this.pt5()[1]);
        ctx.lineTo(this.pt6()[0], this.pt6()[1]);
        ctx.lineWidth = 1;
        ctx.strokeStyle = '#ffccff';
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        
    } 
      
}
//Circle for towns capitals ports
class Circle{
    constructor(tile){
        //id of tile
        this.id = tile.id;
        //Number of row in playground
        this.row = tile.row;
        //Column number
        this.col = tile.col;
        //Upper or lower position in row
        this.pos = 0;
        //IsEdited
        this.isEdited = false;
        //Fill color
        this.fillStyle = tile.circleFillStyle;        
        //Tile type
        this.type = tile.subtype;
        //Subtype like shore, forest
        this.subtype = 'non';
        this.tile = tile;
        //center point
        this.x = tile.x;
        this.y = tile.y;
        this.radius = _radius;
    }
    draw(radius){        
        ctx.fillStyle = this.fillStyle;                
        ctx.beginPath();
        
        
        
        if(this.type == 'capital' || this.type == 'violet' || this.type == 'green' || this.type == 'blue'){
            if(this.tile.taken == true){
                var xPoint = this.x+getPercent(radius,50);
                radius -= getPercent(radius,40);
                var yPoint = this.y - getPercent(this.tile.height,50);
                ctx.arc(xPoint, yPoint, radius, 0, Math.PI * 2, true);
            ctx.lineWidth = 4;
            ctx.strokeStyle = 'white';
            ctx.moveTo(xPoint + (radius/100)*65, this.y - getPercent(this.tile.height,50));
            ctx.lineWidth = 3;
            ctx.arc(xPoint, yPoint, (radius/100)*65, 0, Math.PI * 2, true);
            }
            else{
                xPoint = this.x;
                yPoint = this.y;
                radius = this.radius/2;  
                ctx.arc(xPoint, yPoint, radius, 0, Math.PI * 2, true);
            ctx.lineWidth = 4;
            ctx.strokeStyle = 'white';
            ctx.moveTo(xPoint + (radius/100)*65, this.y);
            ctx.lineWidth = 3;
            ctx.arc(xPoint, yPoint, (radius/100)*65, 0, Math.PI * 2, true);  
            }
            
            
        }
        else if(this.type == 'port'){            
            ctx.arc(this.x, this.y, radius, 0, Math.PI * 2, true);
            //ctx.lineWidth = 4;            
            ctx.strokeStyle = 'white';
            ctx.moveTo(this.x - (radius/1.5), this.y - (radius/1.5));
            ctx.lineTo(this.x + (radius/1.5), this.y + (radius/1.5));
            ctx.moveTo(this.x - (radius/1.5), this.y + (radius/1.5));
            ctx.lineTo(this.x + (radius/1.5), this.y - (radius/1.5));
            ctx.lineWidth = 2;
        }
        else if(this.type == 'town'){            
            ctx.arc(this.x, this.y, radius, 0, Math.PI * 2, true);
            //ctx.lineWidth = 4;            
            ctx.strokeStyle = 'white';
            
            ctx.lineWidth = 2;
        }

        
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        //console.log(this.id);

    }   
}
//Player
class Player{
    constructor(){
        this.id = 0;
        this.name = 'white';
        //Amry contains the troops
        this.army = [];
        //Type can be AI or human
        this.type = 'AI';
        //Color of player's troops
        this.fillColor = 'white';
        //Capital of player = id of tile
        this.capital = 0;
        this.turn = 0;
    }

}
//Troop for all troops in army
class Troop{
    //Troop will be added to some player army => player in constructor
    constructor(player, tile){
        this.id = player.army.length+1;
        
        this.player = player.name;
        //Color
        this.color = player.fillColor;
        //Draw properties
        this.tileRadius = tile.radius;
        this.tileHeight = tile.height;
        this.x = tile.x;
        this.y = tile.y;
        //Nums reference to percent
        this.moral = 100;
        this.quantity = 100;
        //Infantry = 10, artillery = 100, army = 1000; 
        this.rank = '10';
        //Place where the troop is positioned, coordinates
        this.tileId = tile.id;
        this.tile = tile;
    }
    //Draw troop on tile position
    draw(){
        ctx.fillStyle = this.color;
        ctx.strokeStyle = 'white';
        ctx.lineWidth = 4;
        ctx.fillRect(this.x-this.tileRadius/2, this.y-getPercent(this.tileHeight,10), this.tileRadius/1.5, this.tileRadius/1.4);
        ctx.strokeRect(this.x-this.tileRadius/2, this.y-getPercent(this.tileHeight,10), this.tileRadius/1.5, this.tileRadius/1.4);
    }
    setTaken(){
        tiles.forEach(tile => {
            if(this.tileId == tile.id){
                //console.log('Troop.tileId = ' + this.tileId + ' and tile.id = '+ tile.id);
                tile.taken = true;
                
            }
        });
        //tile.taken = true;
        //this.tile.troop = this;
    }
}




//Player

//Animation

//Runtime
//playGround.setPlayground();
//tiles = playGround.addTilesToArray();
displayPlayground();
setGame();




