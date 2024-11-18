
var map;

//  Khởi tạo trạng thái của các nhân vật

// Blinky (Ma đỏ)
blinky.startDirEnum = DIR_LEFT;  // Hướng ban đầu là bên trái
blinky.startPixel = {
    x: 14 * tileSize - 1,  // Vị trí ban đầu của Blinky theo trục x
    y: 14 * tileSize + midTile.y  // Vị trí ban đầu của Blinky theo trục y
};
blinky.cornerTile = {
    x: 28 - 1 - 2,  // Vị trí góc của Blinky trên bản đồ
    y: 0
};
blinky.startMode = GHOST_OUTSIDE;  // Trạng thái bắt đầu là ở ngoài nhà ma
blinky.arriveHomeMode = GHOST_LEAVING_HOME;  // Khi vào nhà ma sẽ chuyển sang trạng thái rời khỏi nhà ma

// Pinky (Ma hồng)
pinky.startDirEnum = DIR_DOWN;  // Hướng ban đầu là xuống dưới
pinky.startPixel = {
    x: 14 * tileSize - 1,  // Vị trí ban đầu của Pinky theo trục x
    y: 17 * tileSize + midTile.y  // Vị trí ban đầu của Pinky theo trục y
};
pinky.cornerTile = {
    x: 2,  // Vị trí góc của Pinky trên bản đồ
    y: 0
};
pinky.startMode = GHOST_PACING_HOME;  // Trạng thái ban đầu của Pinky là di chuyển về nhà ma
pinky.arriveHomeMode = GHOST_PACING_HOME;  // Trạng thái khi về nhà ma là di chuyển trong nhà

// Inky (Ma xanh lá)
inky.startDirEnum = DIR_UP;  // Hướng ban đầu là lên trên
inky.startPixel = {
    x: 12 * tileSize - 1,  // Vị trí ban đầu của Inky theo trục x
    y: 17 * tileSize + midTile.y  // Vị trí ban đầu của Inky theo trục y
};
inky.cornerTile = {
    x: 28 - 1,  // Vị trí góc của Inky trên bản đồ
    y: 36 - 2,
};
inky.startMode = GHOST_PACING_HOME;  // Trạng thái ban đầu của Inky là di chuyển về nhà ma
inky.arriveHomeMode = GHOST_PACING_HOME;  // Trạng thái khi về nhà ma là di chuyển trong nhà

// Clyde (Ma cam)
clyde.startDirEnum = DIR_UP;  // Hướng ban đầu là lên trên
clyde.startPixel = {
    x: 16 * tileSize - 1,  // Vị trí ban đầu của Clyde theo trục x
    y: 17 * tileSize + midTile.y  // Vị trí ban đầu của Clyde theo trục y
};
clyde.cornerTile = {
    x: 0,  // Vị trí góc của Clyde trên bản đồ
    y: 36 - 2,
};
clyde.startMode = GHOST_PACING_HOME;  // Trạng thái ban đầu của Clyde là di chuyển về nhà ma
clyde.arriveHomeMode = GHOST_PACING_HOME;  // Trạng thái khi về nhà ma là di chuyển trong nhà

// Pac-Man
pacman.startDirEnum = DIR_LEFT;  // Hướng ban đầu của Pac-Man là sang trái
pacman.startPixel = {
    x: 14 * tileSize - 1,  // Vị trí ban đầu của Pac-Man theo trục x
    y: 26 * tileSize + midTile.y  // Vị trí ban đầu của Pac-Man theo trục y
};

// Learning Map (Bản đồ học)
var mapLearn = new Map(28, 36, (
    "____________________________" +
    "____________________________" +
    "____________________________" +
    "____________________________" +
    "____________________________" +
    "____________________________" +
    "____________________________" +
    "____________________________" +
    "____________________________" +
    "__||||||||||||||||||||||||__" +
    "__|                      |__" +
    "__| ||||| |||||||| ||||| |__" +
    "__| ||||| |||||||| ||||| |__" +
    "__| ||    ||    ||    || |__" +
    "__| || || || || || || || |__" +
    "||| || || || || || || || |||" +
    "       ||    ||    ||       " +
    "||| ||||| |||||||| ||||| |||" +
    "__| ||||| |||||||| ||||| |__" +
    "__|    ||          ||    |__" +
    "__| || || |||||||| || || |__" +
    "__| || || |||||||| || || |__" +
    "__| ||    ||    ||    || |__" +
    "__| || || || || || || || |__" +
    "||| || || || || || || || |||" +
    "       ||    ||    ||       " +
    "||| |||||||| || |||||||| |||" +
    "__| |||||||| || |||||||| |__" +
    "__|                      |__" +
    "__||||||||||||||||||||||||__" +
    "____________________________" +
    "____________________________" +
    "____________________________" +
    "____________________________" +
    "____________________________" +
    "____________________________"));

mapLearn.name = "Pac-Man";  // Đặt tên cho bản đồ học
mapLearn.wallStrokeColor = "#47b897";  // Màu viền của tường (theo Pac-Man Plus)
mapLearn.wallFillColor = "#000";  // Màu nền của tường (đen)
mapLearn.pelletColor = "#ffb8ae";  // Màu của các viên bi (vàng hồng)
mapLearn.shouldDrawMapOnly = true;  // Chỉ vẽ bản đồ mà không có đối tượng khác

// Original Pac-Man map (Bản đồ gốc của Pac-Man)
var mapPacman = new Map(28, 36, (
    "____________________________" +
    "____________________________" +
    "____________________________" +
    "||||||||||||||||||||||||||||" +
    "|............||............|" +
    "|.||||.|||||.||.|||||.||||.|" +
    "|o||||.|||||.||.|||||.||||o|" +
    "|.||||.|||||.||.|||||.||||.|" +
    "|..........................|" +
    "|.||||.||.||||||||.||.||||.|" +
    "|.||||.||.||||||||.||.||||.|" +
    "|......||....||....||......|" +
    "||||||.||||| || |||||.||||||" +
    "_____|.||||| || |||||.|_____" +
    "_____|.||          ||.|_____" +
    "_____|.|| |||--||| ||.|_____" +
    "||||||.|| |______| ||.||||||" +
    "      .   |______|   .      " +
    "||||||.|| |______| ||.||||||" +
    "_____|.|| |||||||| ||.|_____" +
    "_____|.||          ||.|_____" +
    "_____|.|| |||||||| ||.|_____" +
    "||||||.|| |||||||| ||.||||||" +
    "|............||............|" +
    "|.||||.|||||.||.|||||.||||.|" +
    "|.||||.|||||.||.|||||.||||.|" +
    "|o..||.......  .......||..o|" +
    "|||.||.||.||||||||.||.||.|||" +
    "|||.||.||.||||||||.||.||.|||" +
    "|......||....||....||......|" +
    "|.||||||||||.||.||||||||||.|" +
    "|.||||||||||.||.||||||||||.|" +
    "|..........................|" +
    "||||||||||||||||||||||||||||" +
    "____________________________" +
    "____________________________"));

mapPacman.name = "Pac-Man";  // Đặt tên cho bản đồ gốc
// mapPacman.wallStrokeColor = "#47b897";  // (Màu viền tường theo Pac-Man Plus, đã thay đổi ở dòng dưới)
// Sử dụng màu viền của tường từ bản gốc của Pac-Man
mapPacman.wallStrokeColor = "#2121ff";  // Màu viền tường (xanh dương)
mapPacman.wallFillColor = "#000";  // Màu nền của tường (đen)
mapPacman.pelletColor = "#ffb8ae";  // Màu của các viên bi (vàng hồng)

// Hạn chế các ma không quay hướng tại các vị trí đặc biệt trên bản đồ
mapPacman.constrainGhostTurns = function(tile, openTiles) {
    // Ngừng các ma quay lên tại các ô tile đặc biệt
    if ((tile.x == 12 || tile.x == 15) && (tile.y == 14 || tile.y == 26)) {
        openTiles[DIR_UP] = false;
    }
};

// Levels are grouped into "acts." (Các cấp độ được nhóm lại thành "act.")
// Mỗi act bao gồm nhiều cấp độ, các cấp độ trong cùng một act có độ khó tăng dần.
// Sau khi hoàn thành một act sẽ có một đoạn cắt cảnh.
var getLevelAct = function(level) {
    // Act 1: (levels 1,2)
    // Act 2: (levels 3,4,5)
    // Act 3: (levels 6,7,8,9)
    // Act 4: (levels 10,11,12,13)
    // Act 5: (levels 14,15,16,17)
    // ...
    if (level <= 2) {
        return 1;  // Act 1 cho các cấp độ 1 và 2
    }
    else if (level <= 5) {
        return 2;  // Act 2 cho các cấp độ 3, 4, 5
    }
    else {
        return 3 + Math.floor((level - 6) / 4);  // Các act sau đó
    }
};


var getActColor = function(act) {
    if (gameMode == GAME_PACMAN) {
        return {
            wallFillColor: mapPacman.wallFillColor,
            wallStrokeColor: mapPacman.wallStrokeColor,
            pelletColor: mapPacman.pelletColor,
        };
    }
    else if (gameMode == GAME_MSPACMAN || gameMode == GAME_OTTO) {
        return getMsPacActColor(act);
    }
    else if (gameMode == GAME_COOKIE) {
        return getCookieActColor(act);
    }
};

var getActRange = function(act) {
    if (act == 1) {
        return [1,2];
    }
    else if (act == 2) {
        return [3,5];
    }
    else {
        var start = act*4-6;
        return [start, start+3];
    }
};

var getCookieActColor = function(act) {
    var colors = [
        "#359c9c", "#80d8fc", // turqoise
        "#c2b853", "#e6f1e7", // yellow
        "#86669c", "#f2c1db", // purple
        "#ed0a04", "#e8b4cd", // red
        "#2067c1", "#63e0b6", // blue
        "#c55994", "#fd61c3", // pink
        "#12bc76", "#b4e671", // green
        "#5036d9", "#618dd4", // violet
        "#939473", "#fdfdf4", // grey
    ];
    var i = ((act-1)*2) % colors.length;
    return {
        wallFillColor: colors[i],
        wallStrokeColor: colors[i+1],
        pelletColor: "#ffb8ae",
    };
};

var setNextCookieMap = function() {
    // cycle the colors
    var i;
    var act = getLevelAct(level);
    if (!map || level == 1 || act != getLevelAct(level-1)) {
        map = mapgen();
        var colors = getCookieActColor(act);
        map.wallFillColor = colors.wallFillColor;
        map.wallStrokeColor = colors.wallStrokeColor;
        map.pelletColor = colors.pelletColor;
    }
};

// Ms. Pac-Man map 1

var getMsPacActColor = function(act) {
    act -= 1;
    var mapIndex = (act <= 1) ? act : (act%2)+2;
    var maps = [mapMsPacman1, mapMsPacman2, mapMsPacman3, mapMsPacman4];
    var map = maps[mapIndex];
    if (act >= 4) {
        return [
            {
                wallFillColor: "#ffb8ff",
                wallStrokeColor: "#FFFF00",
                pelletColor: "#00ffff",
            },
            {
                wallFillColor: "#FFB8AE",
                wallStrokeColor: "#FF0000",
                pelletColor: "#dedeff",
            },
            {
                wallFillColor: "#de9751",
                wallStrokeColor: "#dedeff",
                pelletColor: "#ff0000",
            },
            {
                wallFillColor: "#2121ff",
                wallStrokeColor: "#ffb851",
                pelletColor: "#dedeff",
            },
        ][act%4];
    }
    else {
        return {
            wallFillColor: map.wallFillColor,
            wallStrokeColor: map.wallStrokeColor,
            pelletColor: map.pelletColor,
        };
    }
};

var setNextMsPacMap = function() {
    var maps = [mapMsPacman1, mapMsPacman2, mapMsPacman3, mapMsPacman4];

    // The third and fourth maps repeat indefinitely after the second map.
    // (i.e. act1=map1, act2=map2, act3=map3, act4=map4, act5=map3, act6=map4, ...)
    var act = getLevelAct(level)-1;
    var mapIndex = (act <= 1) ? act : (act%2)+2;
    map = maps[mapIndex];
    if (act >= 4) {
        var colors = getMsPacActColor(act+1);
        map.wallFillColor = colors.wallFillColor;
        map.wallStrokeColor = colors.wallStrokeColor;
        map.pelletColor = colors.pelletColor;
    }
};

var mapMsPacman1 = new Map(28, 36, (
    "____________________________" +
    "____________________________" +
    "____________________________" +
    "||||||||||||||||||||||||||||" +
    "|......||..........||......|" +
    "|o||||.||.||||||||.||.||||o|" +
    "|.||||.||.||||||||.||.||||.|" +
    "|..........................|" +
    "|||.||.|||||.||.|||||.||.|||" +
    "__|.||.|||||.||.|||||.||.|__" +
    "|||.||.|||||.||.|||||.||.|||" +
    "   .||.......||.......||.   " +
    "|||.||||| |||||||| |||||.|||" +
    "__|.||||| |||||||| |||||.|__" +
    "__|.                    .|__" +
    "__|.||||| |||--||| |||||.|__" +
    "__|.||||| |______| |||||.|__" +
    "__|.||    |______|    ||.|__" +
    "__|.|| || |______| || ||.|__" +
    "|||.|| || |||||||| || ||.|||" +
    "   .   ||          ||   .   " +
    "|||.|||||||| || ||||||||.|||" +
    "__|.|||||||| || ||||||||.|__" +
    "__|.......   ||   .......|__" +
    "__|.|||||.||||||||.|||||.|__" +
    "|||.|||||.||||||||.|||||.|||" +
    "|............  ............|" +
    "|.||||.|||||.||.|||||.||||.|" +
    "|.||||.|||||.||.|||||.||||.|" +
    "|.||||.||....||....||.||||.|" +
    "|o||||.||.||||||||.||.||||o|" +
    "|.||||.||.||||||||.||.||||.|" +
    "|..........................|" +
    "||||||||||||||||||||||||||||" +
    "____________________________" +
    "____________________________"));

mapMsPacman1.name = "Ms. Pac-Man 1";
mapMsPacman1.wallFillColor = "#FFB8AE";
mapMsPacman1.wallStrokeColor = "#FF0000";
mapMsPacman1.pelletColor = "#dedeff";
mapMsPacman1.fruitPaths = {
             "entrances": [
                 { "start": { "y": 164, "x": 228 }, "path": "<<<<vvv<<<<<<<<<^^^" }, 
                 { "start": { "y": 164, "x": -4 }, "path": ">>>>vvvvvv>>>>>>>>>>>>>>>^^^<<<^^^" }, 
                 { "start": { "y": 92, "x": -4 }, "path": ">>>>^^^^>>>vvvv>>>vvv>>>>>>>>>vvvvvv<<<" }, 
                 { "start": { "y": 92, "x": 228 }, "path": "<<<<vvvvvvvvv<<<^^^<<<vvv<<<" }
             ], 
             "exits": [
                 { "path": "<vvv>>>>>>>>>^^^>>>>" }, 
                 { "path": "<<<<vvv<<<<<<<<<^^^<<<<" }, 
                 { "path": "<<<<<<<^^^^^^<<<<<<^^^<<<<" }, 
                 { "path": "<vvv>>>>>>>>>^^^^^^^^^^^^>>>>" }
             ]
         };

// Ms. Pac-Man map 2

var mapMsPacman2 = new Map(28, 36, (
    "____________________________" +
    "____________________________" +
    "____________________________" +
    "||||||||||||||||||||||||||||" +
    "       ||..........||       " +
    "|||||| ||.||||||||.|| ||||||" +
    "|||||| ||.||||||||.|| ||||||" +
    "|o...........||...........o|" +
    "|.|||||||.||.||.||.|||||||.|" +
    "|.|||||||.||.||.||.|||||||.|" +
    "|.||......||.||.||......||.|" +
    "|.||.|||| ||....|| ||||.||.|" +
    "|.||.|||| |||||||| ||||.||.|" +
    "|......|| |||||||| ||......|" +
    "||||||.||          ||.||||||" +
    "||||||.|| |||--||| ||.||||||" +
    "|......|| |______| ||......|" +
    "|.||||.|| |______| ||.||||.|" +
    "|.||||.   |______|   .||||.|" +
    "|...||.|| |||||||| ||.||...|" +
    "|||.||.||          ||.||.|||" +
    "__|.||.|||| |||| ||||.||.|__" +
    "__|.||.|||| |||| ||||.||.|__" +
    "__|.........||||.........|__" +
    "__|.|||||||.||||.|||||||.|__" +
    "|||.|||||||.||||.|||||||.|||" +
    "   ....||...    ...||....   " +
    "|||.||.||.||||||||.||.||.|||" +
    "|||.||.||.||||||||.||.||.|||" +
    "|o..||.......||.......||..o|" +
    "|.||||.|||||.||.|||||.||||.|" +
    "|.||||.|||||.||.|||||.||||.|" +
    "|..........................|" +
    "||||||||||||||||||||||||||||" +
    "____________________________" +
    "____________________________"));

mapMsPacman2.name = "Ms. Pac-Man 2";
mapMsPacman2.wallFillColor = "#47b8ff";
mapMsPacman2.wallStrokeColor = "#dedeff";
mapMsPacman2.pelletColor = "#ffff00";
mapMsPacman2.fruitPaths = {
             "entrances": [
                 { "start": { "y": 212, "x": 228 }, "path": "<<<<^^^<<<<<<<<^^^<" }, 
                 { "start": { "y": 212, "x": -4 }, "path": ">>>>^^^>>>>>>>>vvv>>>>>^^^^^^<" }, 
                 { "start": { "y": 36, "x": -4 }, "path": ">>>>>>>vvv>>>vvvvvvv>>>>>>>>>vvvvvv<<<" }, 
                 { "start": { "y": 36, "x": 228 }, "path": "<<<<<<<vvv<<<vvvvvvvvvvvvv<<<" }
             ], 
             "exits": [
                 { "path": "vvv>>>>>>>>vvv>>>>" }, 
                 { "path": "vvvvvv<<<<<^^^<<<<<<<<vvv<<<<" }, 
                 { "path": "<<<<<<<^^^^^^^^^^^^^<<<^^^<<<<<<<" }, 
                 { "path": "vvv>>>>>^^^^^^^^^^>>>>>^^^^^^<<<<<^^^>>>>>>>" }
             ]
         };

// Ms. Pac-Man map 3

var mapMsPacman3 = new Map(28, 36, (
    "____________________________" +
    "____________________________" +
    "____________________________" +
    "||||||||||||||||||||||||||||" +
    "|.........||....||.........|" +
    "|.|||||||.||.||.||.|||||||.|" +
    "|o|||||||.||.||.||.|||||||o|" +
    "|.||.........||.........||.|" +
    "|.||.||.||||.||.||||.||.||.|" +
    "|....||.||||.||.||||.||....|" +
    "||||.||.||||.||.||||.||.||||" +
    "||||.||..............||.||||" +
    " ....|||| |||||||| ||||.... " +
    "|.|| |||| |||||||| |||| ||.|" +
    "|.||                    ||.|" +
    "|.|||| || |||--||| || ||||.|" +
    "|.|||| || |______| || ||||.|" +
    "|.     || |______| ||     .|" +
    "|.|| |||| |______| |||| ||.|" +
    "|.|| |||| |||||||| |||| ||.|" +
    "|.||                    ||.|" +
    "|.|||| ||||| || ||||| ||||.|" +
    "|.|||| ||||| || ||||| ||||.|" +
    "|......||....||....||......|" +
    "|||.||.||.||||||||.||.||.|||" +
    "|||.||.||.||||||||.||.||.|||" +
    "|o..||.......  .......||..o|" +
    "|.||||.|||||.||.|||||.||||.|" +
    "|.||||.|||||.||.|||||.||||.|" +
    "|......||....||....||......|" +
    "|.||||.||.||||||||.||.||||.|" +
    "|.||||.||.||||||||.||.||||.|" +
    "|......||..........||......|" +
    "||||||||||||||||||||||||||||" +
    "____________________________" +
    "____________________________"));

mapMsPacman3.name = "Ms. Pac-Man 3";
mapMsPacman3.wallFillColor = "#de9751";
mapMsPacman3.wallStrokeColor = "#dedeff";
mapMsPacman3.pelletColor = "#ff0000";
mapMsPacman3.fruitPaths = {
             "entrances": [
                 { "start": { "y": 100, "x": 228 }, "path": "<<<<<vv<<<<<vvvvvv<<<" }, 
                 { "start": { "y": 100, "x": -4 }, "path": ">>>>>vv>>>>>>>>>>>>>>vvvvvv<<<" }, 
                 { "start": { "y": 100, "x": -4 }, "path": ">>>>>vv>>>>>>>>>>>>>>vvvvvv<<<" }, 
                 { "start": { "y": 100, "x": 228 }, "path": "<<vvvvv<<<vvv<<<<<<<<" }
             ], 
             "exits": [
                 { "path": "<vvv>>>vvv>>>^^^>>>>>^^^^^^^^^^^>>" }, 
                 { "path": "<<<<vvv<<<vvv<<<^^^<<<<<^^^^^^^^^^^<<" }, 
                 { "path": "<<<<vvv<<<vvv<<<^^^<<<<<^^^^^^^^^^^<<" }, 
                 { "path": "<vvv>>>vvv>>>^^^^^^<<<^^^^^^>>>>>^^>>>>>" }
             ]
         };
mapMsPacman3.constrainGhostTurns = function(tile,openTiles,dirEnum) {
    // prevent ghost from turning down when exiting tunnels
    if (tile.y == 12) {
        if ((tile.x == 1 && dirEnum == DIR_RIGHT) || (tile.x == 26 && dirEnum == DIR_LEFT)) {
            openTiles[DIR_DOWN] = false;
        }
    }
};

// Ms. Pac-Man map 4

var mapMsPacman4 = new Map(28, 36, (
    "____________________________" +
    "____________________________" +
    "____________________________" +
    "||||||||||||||||||||||||||||" +
    "|..........................|" +
    "|.||.||||.||||||||.||||.||.|" +
    "|o||.||||.||||||||.||||.||o|" +
    "|.||.||||.||....||.||||.||.|" +
    "|.||......||.||.||......||.|" +
    "|.||||.||.||.||.||.||.||||.|" +
    "|.||||.||.||.||.||.||.||||.|" +
    "|......||....||....||......|" +
    "|||.|||||||| || ||||||||.|||" +
    "__|.|||||||| || ||||||||.|__" +
    "__|....||          ||....|__" +
    "||| ||.|| |||--||| ||.|| |||" +
    "    ||.|| |______| ||.||    " +
    "||||||.   |______|   .||||||" +
    "||||||.|| |______| ||.||||||" +
    "    ||.|| |||||||| ||.||    " +
    "||| ||.||          ||.|| |||" +
    "__|....||||| || |||||....|__" +
    "__|.||.||||| || |||||.||.|__" +
    "__|.||....   ||   ....||.|__" +
    "__|.|||||.|| || ||.|||||.|__" +
    "|||.|||||.|| || ||.|||||.|||" +
    "|.........||    ||.........|" +
    "|.||||.||.||||||||.||.||||.|" +
    "|.||||.||.||||||||.||.||||.|" +
    "|.||...||..........||...||.|" +
    "|o||.|||||||.||.|||||||.||o|" +
    "|.||.|||||||.||.|||||||.||.|" +
    "|............||............|" +
    "||||||||||||||||||||||||||||" +
    "____________________________" +
    "____________________________"));

mapMsPacman4.name = "Ms. Pac-Man 4";
mapMsPacman4.wallFillColor = "#2121ff";
mapMsPacman4.wallStrokeColor = "#ffb851";
mapMsPacman4.pelletColor = "#dedeff";
mapMsPacman4.fruitPaths = {
             "entrances": [
                 { "start": { "y": 156, "x": 228 }, "path": "<<<<vv<<<vv<<<<<<^^^" }, 
                 { "start": { "y": 156, "x": -4 }, "path": ">>>>vv>>>vv>>>>>>vvv>>>^^^^^^" }, 
                 { "start": { "y": 132, "x": -4 }, "path": ">>>>^^^^^>>>^^^>>>vvv>>>vvv>>>>>>vvvvvv<<<" }, 
                 { "start": { "y": 132, "x": 228 }, "path": "<<<<^^<<<vvv<<<vvv<<<" }
             ], 
             "exits": [
                 { "path": "<vvv>>>>>>^^>>>^^>>>>" }, 
                 { "path": "<<<<vvv<<<<<<^^<<<^^<<<<" }, 
                 { "path": "<<<<<<<^^^<<<^^^<<<vv<<<<" }, 
                 { "path": "<vvv>>>>>>^^^^^^^^^>>>vv>>>>" }
             ]
         };
