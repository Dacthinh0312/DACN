//////////////////////////////////////////////////////////////////////////////////////
// Tạo tất cả các đối tượng Actor (ma quái và Pacman)

var blinky = new Ghost();  // Tạo đối tượng Ghost cho Blinky
blinky.name = "blinky";    // Đặt tên cho Blinky
blinky.color = "#FF0000";  // Đặt màu sắc cho Blinky (đỏ)
blinky.pathColor = "rgba(255,0,0,0.8)";  // Màu sắc đường đi của Blinky (đỏ với độ mờ 0.8)
blinky.isVisible = true;   // Blinky có hiển thị không (true)

var pinky = new Ghost();   // Tạo đối tượng Ghost cho Pinky
pinky.name = "pinky";      // Đặt tên cho Pinky
pinky.color = "#FFB8FF";   // Đặt màu sắc cho Pinky (hồng nhạt)
pinky.pathColor = "rgba(255,184,255,0.8)";  // Màu sắc đường đi của Pinky (hồng với độ mờ 0.8)
pinky.isVisible = true;    // Pinky có hiển thị không (true)

var inky = new Ghost();    // Tạo đối tượng Ghost cho Inky
inky.name = "inky";       // Đặt tên cho Inky
inky.color = "#00FFFF";   // Đặt màu sắc cho Inky (xanh dương nhạt)
inky.pathColor = "rgba(0,255,255,0.8)";  // Màu sắc đường đi của Inky (xanh dương với độ mờ 0.8)
inky.isVisible = true;    // Inky có hiển thị không (true)

var clyde = new Ghost();   // Tạo đối tượng Ghost cho Clyde
clyde.name = "clyde";     // Đặt tên cho Clyde
clyde.color = "#FFB851";  // Đặt màu sắc cho Clyde (cam nhạt)
clyde.pathColor = "rgba(255,184,81,0.8)";  // Màu sắc đường đi của Clyde (cam nhạt với độ mờ 0.8)
clyde.isVisible = true;   // Clyde có hiển thị không (true)

var pacman = new Player(); // Tạo đối tượng Player cho Pacman
pacman.name = "pacman";    // Đặt tên cho Pacman
pacman.color = "#FFFF00";  // Đặt màu sắc cho Pacman (vàng)
pacman.pathColor = "rgba(255,255,0,0.8)";  // Màu sắc đường đi của Pacman (vàng với độ mờ 0.8)

// Sắp xếp theo thứ tự mà các đối tượng xuất hiện trong bộ nhớ gốc của arcade
// (gợi ý về thứ tự vẽ/cập nhật các đối tượng)
var actors = [blinky, pinky, inky, clyde, pacman];  // Danh sách tất cả các actor (ma quái và Pacman)
var ghosts = [blinky, pinky, inky, clyde];  // Danh sách các ma quái (không có Pacman)
