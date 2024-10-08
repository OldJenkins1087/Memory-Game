const elms = {
    red: document.querySelector(".section.red"),
    green: document.querySelector(".section.green"),
    yellow: document.querySelector(".section.yellow"),
    blue: document.querySelector(".section.blue"),
    start: document.querySelector(".start"),
    score: document.querySelector(".score")
}
const game = {
    colors: ["red", "green", "yellow", "blue"],
    gameMemory: [],
    score: 0,
    gameStarted: false,
    userMemory: [],
    lightingUp: false
}

async function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
async function getRandomColor() {
    return game.colors[Math.floor(Math.random() * game.colors.length)];
}
async function lightUp(color) {
    game.lightingUp = true;
    game.gameMemory.push(color);
    for (let i = 0; i < game.gameMemory.length; i++) {
        const currentColor = game.gameMemory[i];
        elms[currentColor].classList.add("light");
        await sleep((game.gameMemory.length > 9) ? 250 : 500);
        elms[currentColor].classList.remove("light");
        if (i < game.gameMemory.length - 1) {
            await sleep((game.gameMemory.length > 9) ? 250 : 500);
        }
    }
    game.lightingUp = false;
}
async function advance() {
    const color = await getRandomColor();
    await lightUp(color);
}
async function start() {
    if (game.gameStarted) return;
    elms.start.style.opacity = 0.5;
    elms.start.disabled = true;
    game.gameStarted = true;
    game.userMemory = [];
    game.gameMemory = [];
    game.score = 0;
    elms.score.innerText = `Score: ${game.score}`;
    await sleep(1000);
    advance();
}
elms.start.addEventListener("click", start);
async function gameOver() {
    game.gameStarted = false;
    elms.start.style.opacity = 1;
    elms.start.disabled = false;
}
async function checkPlayer() {
    for (let i=0; i<game.userMemory.length; i++) {
        if (game.userMemory[i] !== game.gameMemory[i]) {
            await gameOver();
            return true;
        }
    }
    return false;
}
async function colorPressed(color) {
    if (!game.gameStarted) return;
    game.userMemory.push(color);
    failed = await checkPlayer();
    if (failed || game.userMemory.length < game.gameMemory.length) return;
    game.score++;
    elms.score.innerText = `Score: ${game.score}`;
    game.userMemory = [];
    await sleep(100);
    advance();

}
game.colors.forEach(color => {
    elms[color].addEventListener("click", () => {
        if (game.lightingUp) return;
        console.log(`User pressed ${color}`)
        colorPressed(color);
    });
});