// Important character preferences, to be manipulated by the grid object
const char = {
    // What font to display each character in, and what size to upscale it from
    font: { size: 16, name: 'Fixedsys Excelsior' },
    
    // Dimensions of the character to be upscaled
    size: { x: 8, y: 14 },
    // Distance from the top left to position each character at
    offset: { x: 0, y: 10 },
    // How many characters can exist on each axis
    range: { x: 80, y: 25 },
    
    // Dimensions of the text display to be upscaled
    get width() { return this.range.x * this.size.x },
    get height() { return this.range.y * this.size.y },
    
    // Character position given any x and y coordinate
    pos(x, y) { return (char.range.x * y) + x }
};

// Values (or manipulations thereof) needed to work the text display
let grid = {
    // How many times the text display can be multiplied before it breaks the viewport
    scale(input) { 
        return input * Math.min(
            Math.floor(window.innerWidth / char.width),
            Math.floor(window.innerHeight / char.height)
        )
    },
    
    // Dimensions of the upscaled text display
    get width() { return this.scale(char.width) },
    get height() { return this.scale(char.height) },
    
    // Dimensions of the upscaled characters
    get x() { return this.scale(char.size.x) },
    get y() { return this.scale(char.size.y) },
    
    // Placeholder for the array to contain character properties
    // This should NOT be accessed directly
    array: new Array(char.range.x * char.range.y)
};

// Fill the array with placeholder properties
for (let i = 0; i < grid.array.length; i++) {
    grid.array[i] = {
        text: ' ',
        color: ['#000', '#fff']
    }
};

// Helper methods that should be used to access the array and other important properties
let dos = {
    view: {
        text(x, y) { return grid.array[char.pos(x, y)].text },
        color(x, y, layer = 1) { return grid.array[char.pos(x, y)].color[layer] }
    },
    
    fill: {
        text(chars, x = 0, y = 0, width = 0, overflow = true) {
            chars = chars.toString();
            
            if (!overflow && (chars.length > width)) {
                chars = chars.substr(0, width).split('');
            } else
                chars = chars.padEnd(chars.length - (chars.length % width) + width, ' ').split('');
            
            let begin = char.pos(x, y);
            if (begin < 0)
                return;
            
            for (let i = 0; i < chars.length; i++) {
                if (i % width == 0 && i != 0)
                    begin += char.range.x - width;
                
                grid.array[begin + i].text = chars[i];
            }
        },
        color(layer, color, x, y, width = 1, height = 1) {
            let begin = char.pos(x, y); 
            
            for (let i = 0; i < width * height; i++) {
                if (i % width == 0 && i != 0)
                    begin += char.range.x - width;
                
                grid.array[begin + i].color[layer] = color;
            }
        }
    },
    
    mouse: { 
        x: -1, y: -1, 
        last: { x: -1, y: -1 },
        down: false, idle: -1
    },
    
    frame: 0,
    fps: 0
};

// Check if mouse position has changed
document.querySelector('canvas').addEventListener('mousemove', event => {
    if ((Math.floor(event.offsetX / grid.x) != dos.mouse.x) || (Math.floor(event.offsetY / grid.y) != dos.mouse.y)) {
        dos.mouse.last.x = dos.mouse.x,
        dos.mouse.last.y = dos.mouse.y,
        dos.mouse.x = Math.floor(event.offsetX / grid.x),
        dos.mouse.y = Math.floor(event.offsetY / grid.y),
        dos.mouse.idle = 0;
    }
});
// Check if mouse has left the canvas
document.querySelector('canvas').addEventListener('mouseleave', () => {
    dos.mouse.last.x = dos.mouse.x,
    dos.mouse.last.y = dos.mouse.y,
    dos.mouse.x = -1,
    dos.mouse.y = -1;
});
// Check is user is currently left-clicking
document.querySelector('canvas').addEventListener('mousedown', () => { dos.mouse.down = true });
document.querySelector('canvas').addEventListener('mouseup', () => { dos.mouse.down = false });

// Update text display
function update() {
    let canvas = document.querySelector('canvas'),
        ctx = canvas.getContext('2d');
    
    canvas.width = grid.width,
    canvas.height = grid.height;
    
    ctx.font = grid.scale(char.font.size) + 'px ' + char.font.name;
    
    for (let i = 0; i < grid.array.length; i++) {
        let x = i % char.range.x,
            y = (i - (i % char.range.x)) / char.range.x;
        
        ctx.fillStyle = grid.array[i].color[0];
        ctx.fillRect(grid.x * x, grid.y * y, grid.x, grid.y);
        
        ctx.fillStyle = grid.array[i].color[1];
        ctx.fillText(grid.array[i].text, (grid.x * x) + grid.scale(char.offset.x), (grid.y * y) + grid.scale(char.offset.y));
    }
    
    if (dos.mouse.x != -1)
        dos.mouse.idle++
    else
        dos.mouse.idle = -1;
    
    dos.frame++;
    
    requestAnimationFrame(update);
}

// Handle FPS counter
setInterval(() => {
    dos.fps = dos.frame;
    dos.frame = 0;
}, 1000);