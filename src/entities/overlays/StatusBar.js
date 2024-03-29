import { TIME_DELAY, TIME_FLASH_DELAY, TIME_FRAME_KEYS } from "../../constants/battle.js";
import { drawFrame } from "../../utils/context.js";

export class StatusBar {
    constructor(fighters) {
        this.image = document.querySelector('img[alt="misc"]');

        this.time = 99;
        this.timeTimer = 0;
        this.timeFlashTimer = 0;
        this.useFlashFrames = false;

        this.fighters = fighters;
        
        this.frames = new Map([
            ['health-bar', [16, 18, 145, 11]],

            ['ko-white', [161, 16, 32, 14]],

            [`${TIME_FRAME_KEYS[0]}-0`, [16, 32, 14, 16]],
            [`${TIME_FRAME_KEYS[0]}-1`, [32, 32, 14, 16]],
            [`${TIME_FRAME_KEYS[0]}-2`, [48, 32, 14, 16]],
            [`${TIME_FRAME_KEYS[0]}-3`, [64, 32, 14, 16]],
            [`${TIME_FRAME_KEYS[0]}-4`, [80, 32, 14, 16]],
            [`${TIME_FRAME_KEYS[0]}-5`, [96, 32, 14, 16]],
            [`${TIME_FRAME_KEYS[0]}-6`, [112, 32, 14, 16]],
            [`${TIME_FRAME_KEYS[0]}-7`, [128, 32, 14, 16]],
            [`${TIME_FRAME_KEYS[0]}-8`, [144, 32, 14, 16]],
            [`${TIME_FRAME_KEYS[0]}-9`, [160, 32, 14, 16]],

            [`${TIME_FRAME_KEYS[1]}-0`, [16, 192, 14, 16]],
            [`${TIME_FRAME_KEYS[1]}-1`, [32, 192, 14, 16]],
            [`${TIME_FRAME_KEYS[1]}-2`, [48, 192, 14, 16]],
            [`${TIME_FRAME_KEYS[1]}-3`, [64, 192, 14, 16]],
            [`${TIME_FRAME_KEYS[1]}-4`, [80, 192, 14, 16]],
            [`${TIME_FRAME_KEYS[1]}-5`, [96, 192, 14, 16]],
            [`${TIME_FRAME_KEYS[1]}-6`, [112, 192, 14, 16]],
            [`${TIME_FRAME_KEYS[1]}-7`, [128, 192, 14, 16]],
            [`${TIME_FRAME_KEYS[1]}-8`, [144, 192, 14, 16]],
            [`${TIME_FRAME_KEYS[1]}-9`, [160, 192, 14, 16]],

            // Numeric
            ['score-0', [17, 101, 10, 10]],
            ['score-1', [29, 101, 10, 10]],
            ['score-2', [41, 101, 10, 10]],
            ['score-3', [53, 101, 10, 10]],
            ['score-4', [65, 101, 10, 10]],
            ['score-5', [77, 101, 10, 10]],
            ['score-6', [89, 101, 10, 10]],
            ['score-7', [101, 101, 10, 10]],
            ['score-8', [113, 101, 10, 10]],
            ['score-9', [125, 101, 10, 10]],

            // Alphabet
            ['score-@', [17, 113, 10, 10]],
            ['score-A', [29, 113, 11, 10]],
            ['score-B', [41, 113, 10, 10]],
            ['score-C', [53, 113, 10, 10]],
            ['score-D', [65, 113, 10, 10]],
            ['score-E', [77, 113, 10, 10]],
            ['score-F', [89, 113, 10, 10]],
            ['score-G', [101, 113, 10, 10]],
            ['score-H', [113, 113, 10, 10]],
            ['score-I', [125, 113, 9, 10]],
            ['score-J', [136, 113, 10, 10]],
            ['score-K', [149, 113, 10, 10]],
            ['score-L', [161, 113, 10, 10]],
            ['score-M', [173, 113, 10, 10]],
            ['score-N', [185, 113, 11, 10]],
            ['score-O', [197, 113, 10, 10]],
            ['score-P', [17, 125, 10, 10]],
            ['score-Q', [29, 125, 10, 10]],
            ['score-R', [41, 125, 10, 10]],
            ['score-S', [53, 125, 10, 10]],
            ['score-T', [65, 125, 10, 10]],
            ['score-U', [77, 125, 10, 10]],
            ['score-V', [89, 125, 10, 10]],
            ['score-W', [101, 125, 10, 10]],
            ['score-X', [113, 125, 10, 10]],
            ['score-Y', [125, 125, 10, 10]],
            ['score-Z', [136, 125, 10, 10]],

            // Name Tags
            ['tag-ken', [128, 56, 30, 9]],
            ['tag-ryu', [16, 56, 28, 9]],
        ])

        const [{ name: name1 }, { name: name2 }] = this.fighters;
        this.names = [`tag-${name1.toLowerCase()}`, `tag-${name2.toLowerCase()}`];
    }
    
    updateTime(time) {
        if(time.previous > this.timeTimer + TIME_DELAY) {
            this.time -= 1;
            this.timeTimer = time.previous;
        }
        
        if (this.time < 15 && this.time > -1 && time.previous > this.timeFlashTimer + TIME_FLASH_DELAY) {
            this.useFlashFrames = !this.useFlashFrames;
            this.timeFlashTimer = time.previous;
        }
    }
    
    update(time) {
        this.updateTime(time);
    }
    
    drawFrame(context, frameKey, x, y, direction=1) {
        drawFrame(context, this.image, this.frames.get(frameKey), x, y, direction);
    }

    drawHealthBars(context) { 
        this.drawFrame(context, 'health-bar', 31, 20);
        this.drawFrame(context, 'ko-white', 176, 18);
        this.drawFrame(context, 'health-bar', 353, 20, -1);
    }

    drawNameTags(context) {
        const [name1, name2] = this.names;
        this.drawFrame(context, name1, 32, 33);
        this.drawFrame(context, name2, 322, 33);
    }

    drawTime(context) {
        const timeString = String(Math.max(this.time, 0)).padStart(2, '00');
        const flashFrame = TIME_FRAME_KEYS[Number(this.useFlashFrames)];

        this.drawFrame(context, `${flashFrame}-${timeString.charAt(0)}`, 178, 33);
        this.drawFrame(context, `${flashFrame}-${timeString.charAt(1)}`, 194, 33);
    }

    drawScore(context, score, x) {
        const strValue = String(score);
        const buffer = ((6 * 12) - strValue.length * 12);
        
        for (let i = 0; i < strValue.length; i++) {
            this.drawFrame(context, `score-${strValue[i]}`, x + buffer + i * 12, 1);
        }
    }

    drawScoreLabel(context, label, x) {
        for (const index in label) {
            this.drawFrame(context, `score-${label.charAt(index)}`, x + index * 12, 1);
        }
    }

    drawScores(context) {
        this.drawScoreLabel(context, 'P1', 4);
        this.drawScore(context, 1, 45);

        this.drawScoreLabel(context, 'WRX', 133);
        this.drawScore(context, 50000, 177);

        this.drawScoreLabel(context, 'P2', 269);
        this.drawScore(context, 1, 309);
    }

    draw(context) {
        this.drawScores(context);
        this.drawHealthBars(context);
        this.drawNameTags(context);
        this.drawTime(context);
    }
}