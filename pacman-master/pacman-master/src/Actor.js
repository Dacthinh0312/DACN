//////////////////////////////////////////////////////////////////////////////////////
// Lớp Actor định nghĩa các chức năng chung cho việc cập nhật dữ liệu vị trí và hướng di chuyển
// của ma quái và Pacman.

// "Ghost" và "Player" kế thừa từ lớp "Actor"

// Hàm tạo (constructor) của Actor
var Actor = function() {

    this.dir = {};          // vector hướng di chuyển
    this.pixel = {};        // vị trí pixel
    this.tile = {};         // vị trí ô (tile)
    this.tilePixel = {};    // vị trí pixel trong ô (tile)
    this.distToMid = {};    // khoảng cách pixel tới giữa ô

    this.targetTile = {};   // vị trí ô đích được dùng để nhắm tới

    this.frames = 0;        // đếm số khung hình (frame)
    this.steps = 0;         // đếm số bước đi

    this.isDrawTarget = false; // có vẽ mục tiêu không
    this.isDrawPath = false;   // có vẽ đường đi không

    this.savedSteps = {};      // lưu lại số bước tại thời điểm t
    this.savedFrames = {};     // lưu lại số khung hình tại thời điểm t
    this.savedDirEnum = {};    // lưu lại hướng di chuyển tại thời điểm t
    this.savedPixel = {};      // lưu lại vị trí pixel tại thời điểm t
    this.savedTargetting = {}; // lưu lại trạng thái nhắm tới tại thời điểm t
    this.savedTargetTile = {}; // lưu lại vị trí ô đích tại thời điểm t
};

// Lưu trạng thái tại thời điểm t
Actor.prototype.save = function(t) {
    this.savedSteps[t] = this.steps;
    this.savedFrames[t] = this.frames;
    this.savedDirEnum[t] = this.dirEnum;
    this.savedPixel[t] = { x:this.pixel.x, y:this.pixel.y };
    this.savedTargetting[t] = this.targetting;
    this.savedTargetTile[t] = { x: this.targetTile.x, y: this.targetTile.y };
};

// Tải trạng thái tại thời điểm t
Actor.prototype.load = function(t) {
    this.steps = this.savedSteps[t];
    this.frames = this.savedFrames[t];
    this.setDir(this.savedDirEnum[t]);
    this.setPos(this.savedPixel[t].x, this.savedPixel[t].y);
    this.targetting = this.savedTargetting[t];
    this.targetTile.x = this.savedTargetTile[t].x;
    this.targetTile.y = this.savedTargetTile[t].y;
};

// Đặt lại vị trí và hướng di chuyển ban đầu
Actor.prototype.reset = function() {
    this.setDir(this.startDirEnum);
    this.setPos(this.startPixel.x, this.startPixel.y);
    this.frames = 0;
    this.steps = 0;
    this.targetting = false;
};

// Đặt vị trí và cập nhật các biến phụ thuộc
Actor.prototype.setPos = function(px,py) {
    this.pixel.x = px;
    this.pixel.y = py;
    this.commitPos();
};

// Trả về vị trí pixel tương đối trong ô (tile) dựa trên pixel của bản đồ
Actor.prototype.getTilePixel = function(pixel,tilePixel) {
    if (pixel == undefined) {
        pixel = this.pixel;
    }
    if (tilePixel == undefined) {
        tilePixel = {};
    }
    tilePixel.x = pixel.x % tileSize;
    tilePixel.y = pixel.y % tileSize;
    if (tilePixel.x < 0) {
        tilePixel.x += tileSize;
    }
    if (tilePixel.y < 0) {
        tilePixel.y += tileSize;
    }
    return tilePixel;
};

// Cập nhật các biến phụ thuộc của vị trí
Actor.prototype.commitPos = function() {

    // sử dụng phương thức teleport của bản đồ nếu có
    if (map) {
        map.teleport(this);
    }

    this.tile.x = Math.floor(this.pixel.x / tileSize);
    this.tile.y = Math.floor(this.pixel.y / tileSize);
    this.getTilePixel(this.pixel,this.tilePixel);
    this.distToMid.x = midTile.x - this.tilePixel.x;
    this.distToMid.y = midTile.y - this.tilePixel.y;
};

// Đặt hướng di chuyển và cập nhật các biến phụ thuộc
Actor.prototype.setDir = function(dirEnum) {
    setDirFromEnum(this.dir, dirEnum);
    this.dirEnum = dirEnum;
};

// Các giá trị sử dụng làm tham số "pattern" trong hàm getStepSizeFromTable()
var STEP_PACMAN = 0;
var STEP_GHOST = 1;
var STEP_PACMAN_FRIGHT = 2;
var STEP_GHOST_FRIGHT = 3;
var STEP_GHOST_TUNNEL = 4;
var STEP_ELROY1 = 5;
var STEP_ELROY2 = 6;

// Hàm lấy kích thước bước đi từ bảng điều khiển tốc độ
Actor.prototype.getStepSizeFromTable = (function(){

    // bảng điều khiển tốc độ (theo Jamey Pittman)
    var stepSizes = (
                         // MỨC 1
    "1111111111111111" + // pac-man (bình thường)
    "0111111111111111" + // ma quái (bình thường)
    "1111211111112111" + // pac-man (sợ)
    "0110110101101101" + // ma quái (sợ)
    "0101010101010101" + // ma quái (đường hầm)
    "1111111111111111" + // elroy 1
    "1111111121111111" + // elroy 2

                         // MỨC 2-4
    "1111211111112111" + // pac-man (bình thường)
    "1111111121111111" + // ma quái (bình thường)
    "1111211112111121" + // pac-man (sợ)
    "0110110110110111" + // ma quái (sợ)
    "0110101011010101" + // ma quái (đường hầm)
    "1111211111112111" + // elroy 1
    "1111211112111121" + // elroy 2

                         // MỨC 5-20
    "1121112111211121" + // pac-man (bình thường)
    "1111211112111121" + // ma quái (bình thường)
    "1121112111211121" + // pac-man (sợ) (không áp dụng cho các mức 17, 19 và 20)
    "0111011101110111" + // ma quái (sợ)  (không áp dụng cho các mức 17, 19 và 20)
    "0110110101101101" + // ma quái (đường hầm)
    "1121112111211121" + // elroy 1
    "1121121121121121" + // elroy 2

                         // MỨC 21+
    "1111211111112111" + // pac-man (bình thường)
    "1111211112111121" + // ma quái (bình thường)
    "0000000000000000" + // pac-man (sợ) không áp dụng
    "0000000000000000" + // ma quái (sợ)  không áp dụng
    "0110110101101101" + // ma quái (đường hầm)
    "1121112111211121" + // elroy 1
    "1121121121121121"); // elroy 2

    return function(level, pattern) {
        var entry;
        if (level < 1) return;
        else if (level==1)                  entry = 0;
        else if (level >= 2 && level <= 4)  entry = 1;
        else if (level >= 5 && level <= 20) entry = 2;
        else if (level >= 21)               entry = 3;
        return stepSizes[entry*7*16 + pattern*16 + this.frames%16];
    };
})();


// Cập nhật vị trí và hành vi
Actor.prototype.update = function(j) {

    // lấy số bước cần tiến trong khung hình này
    var numSteps = this.getNumSteps();
    if (j >= numSteps) 
        return;

    // yêu cầu tiến thêm một bước, và tăng số bước nếu có bước đi
    this.steps += this.step();

    // cập nhật hướng di chuyển của đầu
    this.steer();
};
