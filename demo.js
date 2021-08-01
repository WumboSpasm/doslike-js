dos.fill.color(1, '#fff', 0, 0, 80, 25);

for (let x = 0; x < char.range.x; x++)
        for (let y = 0; y < char.range.y; y++)
            dos.fill.color(0, '#' + (Math.floor(Math.random() * 7)).toString(16).repeat(3), x, y);

function demo() {
    dos.fill.text('X ' + dos.mouse.x, 0, 0, 4);
    dos.fill.text('Y ' + dos.mouse.y, 0, 1, 4);
    
    dos.fill.text('Last X ' + dos.mouse.last.x, 0, 3, 9);
    dos.fill.text('Last Y ' + dos.mouse.last.y, 0, 4, 9);
    
    dos.fill.text('Idle ' + dos.mouse.idle, 0, 6, 10);
    
    dos.fill.text('FPS ' + dos.fps, 74, 0, 6);
    dos.fill.text('Frame ' + dos.frame, 72, 1, 8);
    
    if ((dos.mouse.x && dos.mouse.y && dos.mouse.last.x && dos.mouse.last.y) != -1) {
        dos.fill.text('', dos.mouse.last.x < char.range.x - 13 ? dos.mouse.last.x + 1 : dos.mouse.last.x - 13, dos.mouse.last.y, 13);
        dos.fill.text('Hello, world!', dos.mouse.x < char.range.x - 13 ? dos.mouse.x + 1 : dos.mouse.x - 13, dos.mouse.y);
    }
    
    for (let x = 0; x < char.range.x; x++)
        for (let y = 0; y < char.range.y; y++)
                dos.fill.color(0, dos.view.color((x + 1) % char.range.x, (y + 1) % char.range.y, 0), x, y);
    
    requestAnimationFrame(demo);
}
demo();