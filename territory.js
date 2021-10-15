
//List of territorries
var territorries = {

} 

function hello (text){
    console.log(text);
    }

    hello('Ahoj');

    //Detect if capital is on island and has some port
function isIsland(tile){
    var ind = 0;
    var end = false;
    clearEditedParam();   
    if(tile.Id == 1){
        shoretile = new Tile(tiles[0].x, tiles[0].y);
        shoretile.fillStyle = 'yellow';
        shorePath.push(shoretile);
        ind++;
        while(end == false){
            if(ind >= tiles.length-1 ){
                console.log('Ended at: ' + tiles[ind].Id);
                end = true;
                
            }
            //
            //Condition to end while
            /*if(tiles[ind].col == _cols){
                console.log('Ended at col: ' + tiles[ind].col);
                end = true;
            }*/
            nextShoreTile = new Tile(tiles[ind].x, tiles[ind].y);
            nextShoreTile.neighbours = tiles[ind].neighbours;
            tiles[ind].isEdited = true;
            //console.log('Neig: ' + nextShoreTile.neighbours.length);
            if(tiles[ind].subtype == 'shore' || tiles[ind].subtype == 'port'){
                nextShoreTile.fillStyle = 'orange';
                shorePath.push(nextShoreTile);
                for(j = 0; j < tiles[ind].neighbours.length; j++){
                    if((tiles[ind].neighbours[j].subtype == 'shore' && tiles[ind].neighbours[j].isEdited == false) || (tiles[ind].neighbours[j].subtype == 'port' && tiles[ind].neighbours[j].isEdited == false)){
                        //console.log('ok');
                        // (tiles[ind].neighbours[j].subtype == 'port' && tiles[ind].neighbours[j].isEdited == false)
                        //Must be changed tile in tiles array => tile[ind].neighbours[j].Id-1 reference
                        tiles[tiles[ind].neighbours[j].Id-1].isEdited = true;
                        ind = tiles[tiles[ind].neighbours[j].Id-1].Id - 2;
                        //console.log('Jump to row: ' + tiles[ind].row + ' and col: ' + tiles[ind].col);
                    }
                }
                      
                ind++;
                console.log('Jump to row: ' + tiles[ind].row + ' and col: ' + tiles[ind].col);
                if(tiles[ind].col == _cols){
                    console.log('Ended at row: ' + tiles[ind].row);
                    end = true;
                }
                else if(tiles[ind].row == _rows){
                    console.log('Ended at col: ' + tiles[ind].col);
                    end = true;
                }
                
            }                
            
            else if((tiles[ind].subtype == 'inland' && tiles[ind].row != 1) || (tiles[ind].subtype == 'town' && tiles[ind].row != 1)){
                //nextShoreTile.fillStyle = 'cornsilk';
                //shorePath.push(nextShoreTile);
                for(j = 0; j < tiles[ind].neighbours.length; j++){
                    if((tiles[ind].neighbours[j].subtype == 'shore' && tiles[ind].neighbours[j].isEdited == false) || (tiles[ind].neighbours[j].subtype == 'port' && tiles[ind].neighbours[j].isEdited == false)){
                        //console.log('ok');
                        // (tiles[ind].neighbours[j].subtype == 'port' && tiles[ind].neighbours[j].isEdited == false)
                        //Must be changed tile in tiles array => tile[ind].neighbours[j].Id-1 reference
                        tiles[tiles[ind].neighbours[j].Id-1].isEdited = true;
                        ind = tiles[tiles[ind].neighbours[j].Id-1].Id - 2;
                        //console.log('Jump to row: ' + tiles[ind].row + ' and col: ' + tiles[ind].col);
                    }
                }
                ind++;
            }
            else if(tiles[ind].subtype == 'water'){
                //nextShoreTile.fillStyle = 'cornsilk';
                //shorePath.push(nextShoreTile);
                for(j = 0; j < tiles[ind].neighbours.length; j++){
                    if((tiles[ind].neighbours[j].subtype == 'shore' && tiles[ind].neighbours[j].isEdited == false) || (tiles[ind].neighbours[j].subtype == 'port' && tiles[ind].neighbours[j].isEdited == false)){
                        //console.log('ok');
                        // (tiles[ind].neighbours[j].subtype == 'port' && tiles[ind].neighbours[j].isEdited == false)
                        //Must be changed tile in tiles array => tile[ind].neighbours[j].Id-1 reference
                        tiles[tiles[ind].neighbours[j].Id-1].isEdited = true;
                        ind = tiles[tiles[ind].neighbours[j].Id-1].Id - 2;
                        //console.log('Jump to row: ' + tiles[ind].row + ' and col: ' + tiles[ind].col);
                    }
                }
                ind++;
            }
            /*else if(tiles[ind].subtype == 'town'){
                //nextShoreTile.fillStyle = 'cyan';
                //shorePath.push(nextShoreTile);
                ind++;
            }*/
            
            else{
                ind++;
            }
            
                        

        }
    }
    
    
}