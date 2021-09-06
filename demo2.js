// Style canvas
dos.fill.color(1, [0,1,0], 0, 0, char.range.x, char.range.y);

// Array setup
let prefs = {
    x: 64,
    y: 64,
    range: 64,
    sea: 32,
    spread: 16,
    render: [
        '\u2588',
        '\u2593',
        '\u2592',
        '\u2591',
        ' '
    ],
    fog: 4,
    
    get width() { return this.x * this.spread },
    get height() { return this.y * this.spread }
};

let array = new Array(prefs.width);
for (let x = 0; x < array.length; x++)
    array[x] = new Array(prefs.height);

// Loop array if out of bounds
const access = (x, y) => array[(x + prefs.width) % prefs.width][(y + prefs.height) % prefs.height];

// Generate terrain
function seed() {
    for (let x = 0; x < prefs.width; x += prefs.spread)
        for (let y = 0; y < prefs.height; y += prefs.spread)
            array[x][y] = Math.round(Math.random() * (prefs.range - 1));
}

function square(steps) {
    for (let x = steps; x < prefs.width; x += (steps * 2))
        for (let y = steps; y < prefs.height; y += (steps * 2))
            array[x][y] = Math.round((
                access(x - steps, y - steps) +
                access(x - steps, y + steps) +
                access(x + steps, y - steps) +
                access(x + steps, y + steps)
            ) / 4);
}

function diamond(steps) {
    for (let x = 0; x < prefs.width; x += steps)
        for (let y = 0; y < prefs.height; y += steps)
            if (array[x][y] == undefined)
                array[x][y] = Math.round((
                    access(x - steps, y) +
                    access(x + steps, y) +
                    access(x, y - steps) +
                    access(x, y + steps)
                ) / 4);
}

function generate() {
    seed();
    for (let i = prefs.spread / 2; i >= 1; i /= 2) {
        square(i);
        diamond(i);
    }
}

// Convert to ASCII
function textify(height) {
    let levels = [
            ' ',
            '\u2591',
            '\u2592',
            '\u2593',
            '\u2588'
        ],
        divider = (prefs.range / 2) / levels.length;
    
    for (let i = 1; i <= levels.length; i++)
        if (height < (divider * i) + (prefs.range / 4))
            return levels[i - 1];
    
    return levels[4];
}

// Implement controls
let move = {
    x: 0,
    y: 0,
    z: 0
};

document.addEventListener('keydown', key => {
    switch (key.code) {
        case 'ArrowLeft':
            move.x = -1;
            break;
        case 'ArrowRight':
            move.x = 1;
            break;
        case 'ArrowUp':
            move.y = -1;
            break;
        case 'ArrowDown':
            move.y = 1;
            break;
        case 'KeyW':
            move.z = 1;
            break;
        case 'KeyS':
            move.z = -1;
            break;
        case 'KeyA':
            prefs.fog = Math.min(prefs.range, Math.max(0, prefs.fog - 1));
            break;
        case 'KeyD':
            prefs.fog = Math.min(prefs.range, Math.max(0, prefs.fog + 1));
            break;
    }
});
document.addEventListener('keyup', key => {
    switch (key.code) {
        case 'ArrowLeft':
            move.x = 0;
            break;
        case 'ArrowRight':
            move.x = 0;
            break;
        case 'ArrowUp':
            move.y = 0;
            break;
        case 'ArrowDown':
            move.y = 0;
            break;
        case 'KeyW':
            move.z = 0;
            break;
        case 'KeyS':
            move.z = 0;
            break;
    }
});

let offset = {
    x: 0,
    y: 0,
    z: 48
}

// Render terrain
function init() {
    offset.x = (offset.x + move.x + prefs.width) % prefs.width,
    offset.y = (offset.y + move.y + prefs.height) % prefs.height,
    offset.z = Math.min(prefs.range, Math.max(0, offset.z + move.z));
    
    for (let x = 0; x < char.range.x; x++) {
        for (let y = 0; y < char.range.y; y++) {
            if (access(x + offset.x, y + offset.y) < offset.z) {
                for (let i = 0; i < prefs.render.length; i++)
                    if (access(x + offset.x, y + offset.y) < offset.z - (i * prefs.fog))
                        dos.fill.text(prefs.render[i], x, y);
            } else
                dos.fill.text(prefs.render[0], x, y);
        }
    }
    
    dos.fill.text(offset.z, 0, 0, 2, false);
    dos.fill.text(prefs.fog, 0, 1, 2, false);
    
    requestAnimationFrame(init);
}
generate();
init();