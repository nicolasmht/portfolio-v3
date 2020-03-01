class ScrollingText {

    constructor(canvasRef) {
        
        this.canvas = canvasRef;
        this.ctx = canvasRef.getContext('2d');

        this.canvas.width = canvasRef.width = window.innerWidth;
        this.canvas.height = canvasRef.height = window.innerHeight;

        this.radio = this.canvas.width / this.canvas.height;

        this.text = 'Work';
        this.textArray = this.text.replace(/\s/g,'').toUpperCase().split('');
        this.charArray = []; // { char: 'N', x: 0, y: 0, width: 0 }
        this.spaceBetweenChar = 25;

        this.speed = { velocity: -2, translateX: 0 };

        this.timePassed = 0;
        this.time = Date.now();
        this.deltaTime = 0;

        this.ctx.font = "8rem Cardo";
        this.ctx.strokeStyle = "#333";
        this.ctx.lineWidth = 1;
        this.ctx.textAlign = 'left';
        this.ctx.textBaseline = 'center';
        this.ctx.direction = 'ltr';

        this.currentCharInLeft = 0;
        this.currentCharInRight = 0;
        this.numberAutomaticlly = null;
     
        this.createSentenceVisible();
    }

    charactersDraw = () => {
        this.charArray.forEach((char, index) => {

            this.ctx.save();
    
            this.ctx.translate(char.x, 100);

            this.ctx.transform(1, 0, this.speed.velocity * 0.01, 1, 0, 0);
            // this.ctx.clip();
    
            this.ctx.strokeText(char.char, 0, this.canvas.height / 2 - 75);
    
            this.ctx.restore();
        });
    }

    createSentenceVisible = () => {
        let widthOfSentence = 0,
            currentCharacter = 0,
            totalCharacters = 0;
    
        while (widthOfSentence < this.canvas.width) {
            
            let characterWidth = this.ctx.measureText(this.textArray[currentCharacter]).width;
    
            this.charArray.push({
                char: this.textArray[currentCharacter],
                x: parseInt(widthOfSentence),
                w: characterWidth
            });
    
            widthOfSentence += characterWidth + this.spaceBetweenChar;
    
            currentCharacter++;
            totalCharacters++;            
    
            if (currentCharacter == this.textArray.length) { currentCharacter = 0; }
        }
    
        this.firstSentence = { totalCharacters: totalCharacters, widthOfSentence: widthOfSentence}
    }

    createSentenceInLeft = () => {

        for(let i = 0; i < this.textArray.length; i++) {
            
            let characterWidth = this.ctx.measureText(this.textArray[this.textArray.length - 1 - i]).width;
    
            this.charArray.unshift({
                char: this.textArray[this.textArray.length - 1 - i],
                x: this.charArray[0].x - this.spaceBetweenChar - characterWidth,
                w: characterWidth
            });
        }
        
    }
    
    createSentenceInRight = () => {
    
        for(let i = 0; i < this.textArray.length; i++) {
            
            let characterWidth = this.ctx.measureText(this.textArray[i]).width;
    
            this.charArray.push({
                char: this.textArray[i],
                x: this.charArray[this.charArray.length - 1].x + this.charArray[this.charArray.length - 1].w + this.spaceBetweenChar,
                w: characterWidth
            });
        }
    }

    getCurrentCharInLeft = () => {

        if (Math.sign(this.speed.velocity) == -1) {
            if (this.charArray[this.currentCharInLeft].x + this.charArray[this.currentCharInLeft].w < 0) {
                this.currentCharInLeft++;
            }
        }
    }

    getCurrentCharInRight = () => {

        if (Math.sign(this.speed.velocity) == 1) {
            if (this.charArray[this.charArray.length - 1 - this.currentCharInRight].x > this.canvas.width) {
                this.currentCharInRight++;
            }
        }
    }

    removeSentenceFirst = () => {

        for (let i = 0; i < this.firstSentence.totalCharacters; i++) {
            this.charArray.shift();
        }

    }

    addAutomaticllyText = () => {

        if (Math.sign(this.speed.velocity) == 1 && this.charArray[0].x > 0) {
            this.createSentenceInLeft();
        }

        if (Math.sign(this.speed.velocity) == -1 && this.charArray[this.charArray.length - 1].x < this.canvas.width) {

            // if (this.charArray.length > this.firstSentence.totalCharacters) {
            //     this.removeSentenceFirst();
            // }

            this.createSentenceInRight();
        }
    }

    start = (event) => {
        // this.speed.velocity = event.deltaY;
    }

    animate = () => {

        this.deltaTime = Date.now() - this.time;
        this.timePassed += this.deltaTime;
        this.time = Date.now();

        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.speed.translateX += this.speed.velocity;
    
        this.charArray.forEach((char, index) => { char.x = char.x + this.speed.velocity; });
        
        this.charactersDraw();

        this.getCurrentCharInLeft();
        this.getCurrentCharInRight();

        // console.log(this.currentCharInLeft)

        this.addAutomaticllyText();
        
        return requestAnimationFrame(this.animate);
    }

}

export default ScrollingText;
/*
let ratio = canvas.width / canvas.height;

let text = 'Hello World',
    textArray = text.replace(/\s/g,'').toUpperCase().split('');
    charArray = [], // { char: 'N', x: 0, y: 0, width: 0 }
    spaceBetweenChar = 25;

let speed = {velocity: -1, translateX: 0},
    iSpeed = 0;

ctx.font = "8rem Cardo";
ctx.strokeStyle = "#fff";
ctx.lineWidth = 1.4;
ctx.textAlign = 'left';
ctx.textBaseline = 'center';
ctx.direction = 'ltr';

let firstSentence = {};

// Create all visible characters
export const createSentenceVisible = () => {
    let widthOfSentence = 0,
        currentCharacter = 0,
        totalCharacters = 0;

    while (widthOfSentence < window.innerWidth) {
        let characterWidth = ctx.measureText(textArray[currentCharacter]).width;

        charArray.push({
            char: textArray[currentCharacter],
            x: widthOfSentence,
            w: characterWidth
        });

        widthOfSentence += characterWidth + spaceBetweenChar;

        currentCharacter++;
        totalCharacters++;

        if (currentCharacter == textArray.length) { currentCharacter = 0; }
    }

    firstSentence = { totalCharacters: totalCharacters, widthOfSentence: widthOfSentence}
}

// createSentenceVisible();

const createSentenceInLeft = () => {

    for(let i = 0; i < textArray.length; i++) {
        
        let characterWidth = ctx.measureText(textArray[textArray.length - 1 - i]).width;

        charArray.unshift({
            char: textArray[textArray.length - 1 - i],
            x: charArray[0].x - spaceBetweenChar - characterWidth,
            w: characterWidth
        });
    }
    
}
// createSentenceInLeft();

const createSentenceInRight = () => {

    for(let i = 0; i < textArray.length; i++) {
        
        let characterWidth = ctx.measureText(textArray[i]).width;

        charArray.push({
            char: textArray[i],
            x: charArray[charArray.length - 1].x + charArray[charArray.length - 1].w + spaceBetweenChar,
            w: characterWidth
        });
    }
}

let currentCharInLeft = 0;
const getCurrentCharInLeft = () => {

    if (charArray[currentCharInLeft] == undefined) { return currentCharInRight = null; }

    if (charArray[currentCharInLeft].x + charArray[currentCharInLeft].w < 0) {
        currentCharInLeft++;
    }
}

let currentCharInRight = charArray.length - 1;
const getCurrentCharInRight = () => {

    if (charArray[currentCharInRight] == undefined) { return currentCharInRight = null; }

    if (charArray[currentCharInRight].x > window.innerWidth) {
        currentCharInRight--;
    }
}

const charactersDraw = () => {
    charArray.forEach((char, index) => {

        ctx.save();

        ctx.translate(char.x, 100);
                
        ctx.transform(1, 0, speed * 0.01, 1, 0, 0);
        // ctx.clip();

        ctx.strokeText(char.char, 0, window.innerHeight / 2 - 75);

        ctx.restore();
    });
}

charactersDraw();

const animation = () => {

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    speed.translateX += speed.velocity;

    charArray.forEach((char, index) => { char.x = char.x + speed.velocity; });
    
    charactersDraw();

    // createAutomaticallyChar();

    //clearArrayChar();

    window.requestAnimationFrame(animation);
}
animation();

// document.addEventListener('wheel', (event) => {
//     speed = event.deltaY;
// });

document.addEventListener('keyup', (event) => {

    if (event.key != 'Enter') { return; }

    text = 'NicolasMichot',
        textArray = text.replace(/\s/g,'').toUpperCase().split('');

    createSentenceInRight();

    anime({
        targets: speed,
        velocity: [speed.velocity, -10, speed.velocity],
        duration: 400,
        easing: 'easeInOutBack'
    });

}, false);

window.addEventListener('resize', () => {

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
});
*/

/*
ctx.globalCompositeOperation = 'source-out';

ctx.fillStyle = "blue";
ctx.fillText('A', window.innerWidth / 2, window.innerHeight / 2);

ctx.fillStyle = "red";
ctx.fillRect(window.innerWidth / 2-100, window.innerHeight / 2-100, 200, 200);
*/

/*
ctx.globalCompositeOperation = 'destination-atop';
ctx.fillStyle = "red";
ctx.fillRect(window.innerWidth / 2-100, window.innerHeight / 2-100, 200, 200);

ctx.strokeStyle = "blue";
ctx.strokeText('A', window.innerWidth / 2, window.innerHeight / 2);
*/
