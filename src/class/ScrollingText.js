import Anime from 'animejs';

class ScrollingText {

    constructor(canvasRef) {
        
        this.canvas = canvasRef;
        this.ctx = canvasRef.getContext('2d');

        this.canvas.width = canvasRef.width = window.innerWidth;
        this.canvas.height = canvasRef.height = window.innerHeight;

        this.radio = this.canvas.width / this.canvas.height;

        this.text = 'Hello World';
        this.letters = this.text.replace(/\s/g,'').toUpperCase().split('');
        this.lettersSettings = []; // { char: 'N', x: 0, y: 0, width: 0 }
        this.spaceBetweenChar = 25;

        this.speed = { velocity: 1, translateX: 0 };

        this.timePassed = 0;
        this.time = Date.now();
        this.deltaTime = 0;

        this.ctx.font = "8rem Playfair Display";
        this.ctx.strokeStyle = "rgb(255, 255, 255)";
        this.ctx.lineWidth = 1;
        this.ctx.textAlign = 'left';
        this.ctx.textBaseline = 'center';
        this.ctx.direction = 'ltr';

        this.currentCharInLeft = 0;
        this.currentCharInRight = 0;
        this.numberAutomaticlly = null;

        this.globalAlpha = { value: 0.1 };
     
        this.letterVisibleSettings = this.createSentenceVisible();

        this.triggerChangeProject = {
            waitTime: 1000
        };

        document.addEventListener('mousemove', event => this.handleMouse(event));
    }

    charactersDraw = () => {
        this.lettersSettings.forEach((char, index) => {

            this.ctx.save();

            this.ctx.globalAlpha = this.globalAlpha.value;
    
            this.ctx.translate(char.x, this.letterVisibleSettings.heightOfLetter - 5);

            this.ctx.transform(1, 0, this.speed.velocity * 0.015, 1, 0, 0);
            // this.ctx.clip();
    
            this.ctx.strokeText(char.char, 0, 0);
    
            this.ctx.restore();
        });
    }

    createSentenceVisible = () => {
        let widthOfSentence = 0,
            currentLetter = 0,
            totalLetterWidth = 0;
    
        while (widthOfSentence < this.canvas.width) {
            
            let characterWidth = this.ctx.measureText(this.letters[currentLetter]).width;
    
            this.lettersSettings.push({
                char: this.letters[currentLetter],
                x: parseInt(widthOfSentence),
                w: characterWidth
            });
    
            widthOfSentence += characterWidth + this.spaceBetweenChar;
    
            currentLetter++;
            totalLetterWidth++;            
    
            if (currentLetter == this.letters.length) { currentLetter = 0; }
        }

        let heightOfLetter = parseInt(this.ctx.font.match(/\d+/), 10),
            heightOfAllLetter = 0,
            totalLetterHeight = 0;

        while (heightOfAllLetter < this.canvas.height) {
            heightOfAllLetter += heightOfLetter;
            totalLetterHeight++;
        }
    
        return {
            totalLetterWidth: totalLetterWidth,
            totalLetterHeight: totalLetterHeight,
            heightOfLetter: heightOfLetter
        };
    }

    createSentenceInLeft = () => {

        for(let i = 0; i < this.letters.length; i++) {
            
            let characterWidth = this.ctx.measureText(this.letters[this.letters.length - 1 - i]).width;
    
            this.lettersSettings.unshift({
                char: this.letters[this.letters.length - 1 - i],
                x: this.lettersSettings[0].x - this.spaceBetweenChar - characterWidth,
                w: characterWidth
            });
        }
        
    }
    
    createSentenceInRight = () => {
    
        for(let i = 0; i < this.letters.length; i++) {
            
            let characterWidth = this.ctx.measureText(this.letters[i]).width;
    
            this.lettersSettings.push({
                char: this.letters[i],
                x: this.lettersSettings[this.lettersSettings.length - 1].x + this.lettersSettings[this.lettersSettings.length - 1].w + this.spaceBetweenChar,
                w: characterWidth
            });
        }
    }

    getCurrentCharInLeft = () => {

        if (Math.sign(this.speed.velocity) == -1) {
            if (this.lettersSettings[this.currentCharInLeft].x + this.lettersSettings[this.currentCharInLeft].w < 0) {
                this.currentCharInLeft++;
            }
        }
    }

    getCurrentCharInRight = () => {

        if (Math.sign(this.speed.velocity) == 1) {
            if (this.lettersSettings[this.lettersSettings.length - 1 - this.currentCharInRight].x > this.canvas.width) {
                this.currentCharInRight++;
            }
        }
    }

    removeSentenceFirst = () => {

        for (let i = 0; i < this.firstSentence.totalLetter; i++) {
            this.lettersSettings.shift();
        }

    }

    addAutomaticllyText = () => {

        if (Math.sign(this.speed.velocity) == 1 && this.lettersSettings[0].x > 0) {
            this.createSentenceInLeft();
        }

        if (Math.sign(this.speed.velocity) == -1 && this.lettersSettings[this.lettersSettings.length - 1].x < this.canvas.width) {

            // if (this.lettersSettings.length > this.firstSentence.totalLetter) {
            //     this.removeSentenceFirst();
            // }

            this.createSentenceInRight();
        }
    }

    duplicateLine = () => {

        let heightOfLetter = this.letterVisibleSettings.heightOfLetter;

        for (let i = 1; i < this.letterVisibleSettings.totalLetterHeight; i++) {

            this.ctx.save();

            if (i%2 == 1) {
                this.ctx.translate(this.canvas.width, 0);
                this.ctx.scale(-1, 1);
            }

            this.ctx.drawImage(this.canvas, 0, 0, this.canvas.width, heightOfLetter, 0, heightOfLetter * i, this.canvas.width, heightOfLetter);

            this.ctx.restore();
        }
    }

    changeProject = (event) => {

        // Create trigger
        // if (this.triggerChangeProject.lastTimeStamp == undefined) {
        //     this.triggerChangeProject.lastTimeStamp = event.timeStamp - this.triggerChangeProject.waitTime;
        // }

        // if (event.timeStamp < this.triggerChangeProject.lastTimeStamp + this.triggerChangeProject.waitTime) {
        //     return;
        // }

        this.triggerChangeProject.lastTimeStamp = event.timeStamp;

        // if (Math.sign(event.deltaY) == -1) {
        //     console.log('Up');

        //     Anime({
        //         targets: this.speed,
        //         velocity: [this.speed.velocity, -this.letterVisibleSettings.totalLetterWidth * 4, (Math.sign(this.speed.velocity) == 1) ? -this.speed.velocity : this.speed.velocity],
        //         duration: 800,
        //         easing: 'easeOutCirc',
        //     });
        // }

        // if (Math.sign(event.deltaY) == 1) {

        //     this.text = 'Nicolas';
        //     this.letters = this.text.replace(/\s/g,'').toUpperCase().split('');

        //     Anime({
        //         targets: this.speed,
        //         velocity: [this.speed.velocity, this.letterVisibleSettings.totalLetterWidth * 4, (Math.sign(this.speed.velocity) == 1) ? this.speed.velocity : -this.speed.velocity],
        //         duration: 12000,
        //         easing: 'easeOutCirc',
        //     });
        // }

        this.text = 'Nicolas';
            this.letters = this.text.replace(/\s/g,'').toUpperCase().split('');

            Anime({
                targets: this.speed,
                velocity: [this.speed.velocity, this.letterVisibleSettings.totalLetterWidth * 4, (Math.sign(this.speed.velocity) == 1) ? this.speed.velocity : -this.speed.velocity],
                duration: 1200,
                easing: 'easeOutQuart',
            });

        Anime({
            targets: this.globalAlpha,
            value: [this.globalAlpha.value, this.globalAlpha.value * 2, this.globalAlpha.value],
            duration: 800,
            easing: 'easeOutCirc',
        });

        Anime({
            targets: this.ctx,
            lineWidth: [this.ctx.lineWidth, 3, this.ctx.lineWidth],
            duration: 1000,
            easing: 'easeOutBounce',
        });

    }

    animate = () => {

        this.deltaTime = Date.now() - this.time;
        this.timePassed += this.deltaTime;
        this.time = Date.now();

        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.speed.translateX += this.speed.velocity;
    
        this.lettersSettings.forEach((char, index) => { char.x = char.x + this.speed.velocity; });
        
        this.charactersDraw();

        this.getCurrentCharInLeft();
        this.getCurrentCharInRight();

        this.addAutomaticllyText();

        this.duplicateLine();
        
        
        return requestAnimationFrame(this.animate);
    }

    handleMouse(event) {
        let x = ( event.clientX / window.innerWidth ) * 2 - 1;
        let y = ( event.clientY / window.innerHeight ) * 2 - 1;
        
        if (x < 0) {
            this.speed.velocity = -1 + x * 3;
        } else {
            this.speed.velocity = 1 + x * 3;
        }
        
    }

}

export default ScrollingText;

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
