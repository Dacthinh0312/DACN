// Kích thước của mỗi ô (tile) trong bản đồ, tính bằng pixel.
var tileSize = 8;

// Tọa độ của điểm trung tâm một ô, dùng để tính toán các vị trí như cửa nhà ma.
var midTile = {x:3, y:4};

// Hàm khởi tạo đối tượng `Map` để tạo bản đồ trò chơi.
var Map = function(numCols, numRows, tiles) {

    // Các thuộc tính về kích thước bản đồ.
    this.numCols = numCols;  // Số lượng cột trong bản đồ.
    this.numRows = numRows;  // Số lượng hàng trong bản đồ.
    this.numTiles = numCols * numRows;  // Tổng số ô trong bản đồ.
    this.widthPixels = numCols * tileSize;  // Chiều rộng bản đồ tính bằng pixel.
    this.heightPixels = numRows * tileSize;  // Chiều cao bản đồ tính bằng pixel.

    // Mảng chứa các giá trị của từng ô trên bản đồ (chẳng hạn như '.', 'o', ' ').
    this.tiles = tiles;

    // Tọa độ của cửa (door) nơi ma trở về nhà.
    this.doorTile = {x:13, y:14};
    // Tọa độ của cửa tính theo pixel (dùng `tileSize` để chuyển đổi).
    this.doorPixel = {
        x: (this.doorTile.x + 1) * tileSize - 1, 
        y: this.doorTile.y * tileSize + midTile.y
    };

    // Các vị trí trên trục y của khu vực nhà ma (dự đoán là khu vực giới hạn).
    this.homeTopPixel = 17 * tileSize;
    this.homeBottomPixel = 18 * tileSize;

    // Đối tượng lưu trữ thời gian mà các viên bi (dots) bị ăn.
    this.timeEaten = {};

    // Khởi tạo trạng thái ban đầu của bản đồ.
    this.resetCurrent();

    // Phân tích các viên bi (dots), các đường hầm (tunnels) và tường (walls).
    this.parseDots();
    this.parseTunnels();
    this.parseWalls();
};

// Phương thức `save` lưu trạng thái bản đồ tại thời điểm `t`. (Hiện tại không có chức năng gì).
Map.prototype.save = function(t) {
    // Chưa được triển khai.
};

// Phương thức `eraseFuture` xóa trạng thái các viên bi đã ăn sau một thời điểm `t`.
Map.prototype.eraseFuture = function(t) {
    // Duyệt qua tất cả các ô trong bản đồ.
    var i;
    for (i = 0; i < this.numTiles; i++) {
        // Nếu thời gian ăn viên bi lớn hơn hoặc bằng thời điểm `t`, xóa thông tin này.
        if (t <= this.timeEaten[i]) {
            delete this.timeEaten[i];
        }
    }
};

// Phương thức `load` tải lại trạng thái bản đồ tại thời điểm `t` (hoặc `abs_t`).
Map.prototype.load = function(t, abs_t) {
    var firstTile, curTile;

    // Hàm con `refresh` dùng để làm mới (refresh) một viên bi tại vị trí `i`.
    var refresh = function(i) {
        var x, y;
        x = i % this.numCols;  // Tính tọa độ x từ chỉ số i.
        y = Math.floor(i / this.numCols);  // Tính tọa độ y từ chỉ số i.
        renderer.refreshPellet(x, y);  // Cập nhật lại viên bi tại tọa độ (x, y).
    };

    var i;
    for (i = 0; i < this.numTiles; i++) {
        // Lấy giá trị của ô tại chỉ số i.
        firstTile = this.startTiles[i];

        // Kiểm tra nếu ô này là một viên bi ('.' hoặc 'o').
        if (firstTile == '.' || firstTile == 'o') {
            // Nếu viên bi chưa bị ăn (abs_t <= thời gian ăn viên bi).
            if (abs_t <= this.timeEaten[i]) {
                // Nếu viên bi chưa bị ăn, nhưng trạng thái của viên bi hiện tại không đúng, làm mới nó.
                if (this.currentTiles[i] != firstTile) {
                    this.dotsEaten--;  // Giảm số viên bi đã ăn.
                    this.currentTiles[i] = firstTile;  // Cập nhật lại trạng thái viên bi.
                    refresh.call(this, i);  // Làm mới viên bi tại vị trí i.
                }
            }
            // Nếu viên bi đã bị ăn (abs_t > thời gian ăn viên bi).
            else if (abs_t > this.timeEaten[i]) {
                // Nếu viên bi đã bị ăn, nhưng trạng thái hiện tại không phải là trống, xóa nó.
                if (this.currentTiles[i] != ' ') {
                    this.dotsEaten++;  // Tăng số viên bi đã ăn.
                    this.currentTiles[i] = ' ';  // Xóa viên bi khỏi bản đồ.
                    refresh.call(this, i);  // Làm mới viên bi tại vị trí i.
                }
            }
        }
    }
};


Map.prototype.resetTimeEaten = function()
{
    this.startTiles = this.currentTiles.slice(0);
    this.timeEaten = {};
};

// reset current tiles
Map.prototype.resetCurrent = function() {
    this.currentTiles = this.tiles.split(""); // create a mutable list copy of an immutable string
    this.dotsEaten = 0;
};

// This is a procedural way to generate original-looking maps from a simple ascii tile
// map without a spritesheet.
Map.prototype.parseWalls = function() {

    var that = this;

    // creates a list of drawable canvas paths to render the map walls
    this.paths = [];

    // a map of wall tiles that already belong to a built path
    var visited = {};

    // we extend the x range to suggest the continuation of the tunnels
    var toIndex = function(x,y) {
        if (x>=-2 && x<that.numCols+2 && y>=0 && y<that.numRows)
            return (x+2)+y*(that.numCols+4);
    };

    // a map of which wall tiles that are not completely surrounded by other wall tiles
    var edges = {};
    var i=0,x,y;
    for (y=0;y<this.numRows;y++) {
        for (x=-2;x<this.numCols+2;x++,i++) {
            if (this.getTile(x,y) == '|' &&
                (this.getTile(x-1,y) != '|' ||
                this.getTile(x+1,y) != '|' ||
                this.getTile(x,y-1) != '|' ||
                this.getTile(x,y+1) != '|' ||
                this.getTile(x-1,y-1) != '|' ||
                this.getTile(x-1,y+1) != '|' ||
                this.getTile(x+1,y-1) != '|' ||
                this.getTile(x+1,y+1) != '|')) {
                edges[i] = true;
            }
        }
    }

    // walks along edge wall tiles starting at the given index to build a canvas path
    var makePath = function(tx,ty) {

        // get initial direction
        var dir = {};
        var dirEnum;
        if (toIndex(tx+1,ty) in edges)
            dirEnum = DIR_RIGHT;
        else if (toIndex(tx, ty+1) in edges)
            dirEnum = DIR_DOWN;
        else
            throw "tile shouldn't be 1x1 at "+tx+","+ty;
        setDirFromEnum(dir,dirEnum);

        // increment to next tile
        tx += dir.x;
        ty += dir.y;

        // backup initial location and direction
        var init_tx = tx;
        var init_ty = ty;
        var init_dirEnum = dirEnum;

        var path = [];
        var pad; // (persists for each call to getStartPoint)
        var point;
        var lastPoint;

        var turn,turnAround;

        
        var getStartPoint = function(tx,ty,dirEnum) {
            var dir = {};
            setDirFromEnum(dir, dirEnum);
            if (!(toIndex(tx+dir.y,ty-dir.x) in edges))
                pad = that.isFloorTile(tx+dir.y,ty-dir.x) ? 5 : 0;
            var px = -tileSize/2+pad;
            var py = tileSize/2;
            var a = getClockwiseAngleFromTop(dirEnum);
            var c = Math.cos(a);
            var s = Math.sin(a);
            return {
                // the first expression is the rotated point centered at origin
                // the second expression is to translate it to the tile
                x:(px*c - py*s) + (tx+0.5)*tileSize,
                y:(px*s + py*c) + (ty+0.5)*tileSize,
            };
        };
        while (true) {
            
            visited[toIndex(tx,ty)] = true;

            // determine start point
            point = getStartPoint(tx,ty,dirEnum);

            if (turn) {
                // if we're turning into this tile, create a control point for the curve
                //
                // >---+  <- control point
                //     |
                //     V
                lastPoint = path[path.length-1];
                if (dir.x == 0) {
                    point.cx = point.x;
                    point.cy = lastPoint.y;
                }
                else {
                    point.cx = lastPoint.x;
                    point.cy = point.y;
                }
            }

            // update direction
            turn = false;
            turnAround = false;
            if (toIndex(tx+dir.y, ty-dir.x) in edges) { // turn left
                dirEnum = rotateLeft(dirEnum);
                turn = true;
            }
            else if (toIndex(tx+dir.x, ty+dir.y) in edges) { // continue straight
            }
            else if (toIndex(tx-dir.y, ty+dir.x) in edges) { // turn right
                dirEnum = rotateRight(dirEnum);
                turn = true;
            }
            else { // turn around
                dirEnum = rotateAboutFace(dirEnum);
                turnAround = true;
            }
            setDirFromEnum(dir,dirEnum);

            // commit path point
            path.push(point);

            // special case for turning around (have to connect more dots manually)
            if (turnAround) {
                path.push(getStartPoint(tx-dir.x, ty-dir.y, rotateAboutFace(dirEnum)));
                path.push(getStartPoint(tx, ty, dirEnum));
            }

            // advance to the next wall
            tx += dir.x;
            ty += dir.y;

            // exit at full cycle
            if (tx==init_tx && ty==init_ty && dirEnum == init_dirEnum) {
                that.paths.push(path);
                break;
            }
        }
    };

    // iterate through all edges, making a new path after hitting an unvisited wall edge
    i=0;
    for (y=0;y<this.numRows;y++)
        for (x=-2;x<this.numCols+2;x++,i++)
            if (i in edges && !(i in visited)) {
                visited[i] = true;
                makePath(x,y);
            }
};

// count pellets and store energizer locations
Map.prototype.parseDots = function() {

    this.numDots = 0;
    this.numEnergizers = 0;
    this.energizers = [];

    var x,y;
    var i = 0;
    var tile;
    for (y=0; y<this.numRows; y++) for (x=0; x<this.numCols; x++) {
        tile = this.tiles[i];
        if (tile == '.') {
            this.numDots++;
        }
        else if (tile == 'o') {
            this.numDots++;
            this.numEnergizers++;
            this.energizers.push({'x':x,'y':y});
        }
        i++;
    }
};

// get remaining dots left
Map.prototype.dotsLeft = function() {
    return this.numDots - this.dotsEaten;
};

// determine if all dots have been eaten
Map.prototype.allDotsEaten = function() {
    return this.dotsLeft() == 0;
};

// create a record of tunnel locations
Map.prototype.parseTunnels = (function(){
    
    // starting from x,y and increment x by dx...
    // determine where the tunnel entrance begins
    var getTunnelEntrance = function(x,y,dx) {
        while (!this.isFloorTile(x,y-1) && !this.isFloorTile(x,y+1) && this.isFloorTile(x,y))
            x += dx;
        return x;
    };

    // the number of margin tiles outside of the map on one side of a tunnel
    // There are (2*marginTiles) tiles outside of the map per tunnel.
    var marginTiles = 2;

    return function() {
        this.tunnelRows = {};
        var y;
        var i;
        var left,right;
        for (y=0;y<this.numRows;y++)
            // a map row is a tunnel if opposite ends are both walkable tiles
            if (this.isFloorTile(0,y) && this.isFloorTile(this.numCols-1,y))
                this.tunnelRows[y] = {
                    'leftEntrance': getTunnelEntrance.call(this,0,y,1),
                    'rightEntrance':getTunnelEntrance.call(this,this.numCols-1,y,-1),
                    'leftExit': -marginTiles*tileSize,
                    'rightExit': (this.numCols+marginTiles)*tileSize-1,
                };
    };
})();

// teleport actor to other side of tunnel if necessary
Map.prototype.teleport = function(actor){
    var i;
    var t = this.tunnelRows[actor.tile.y];
    if (t) {
        if (actor.pixel.x < t.leftExit)       actor.pixel.x = t.rightExit;
        else if (actor.pixel.x > t.rightExit) actor.pixel.x = t.leftExit;
    }
};

Map.prototype.posToIndex = function(x,y) {
    if (x>=0 && x<this.numCols && y>=0 && y<this.numRows) 
        return x+y*this.numCols;
};

// define which tiles are inside the tunnel
Map.prototype.isTunnelTile = function(x,y) {
    var tunnel = this.tunnelRows[y];
    return tunnel && (x < tunnel.leftEntrance || x > tunnel.rightEntrance);
};

// retrieves tile character at given coordinate
// extended to include offscreen tunnel space
Map.prototype.getTile = function(x,y) {
    if (x>=0 && x<this.numCols && y>=0 && y<this.numRows) 
        return this.currentTiles[this.posToIndex(x,y)];
    if ((x<0 || x>=this.numCols) && (this.isTunnelTile(x,y-1) || this.isTunnelTile(x,y+1)))
        return '|';
    if (this.isTunnelTile(x,y))
        return ' ';
};

// determines if the given character is a walkable floor tile
Map.prototype.isFloorTileChar = function(tile) {
    return tile==' ' || tile=='.' || tile=='o';
};

// determines if the given tile coordinate has a walkable floor tile
Map.prototype.isFloorTile = function(x,y) {
    return this.isFloorTileChar(this.getTile(x,y));
};

// mark the dot at the given coordinate eaten
Map.prototype.onDotEat = function(x,y) {
    this.dotsEaten++;
    var i = this.posToIndex(x,y);
    this.currentTiles[i] = ' ';
    this.timeEaten[i] = vcr.getTime();
    renderer.erasePellet(x,y);
};
