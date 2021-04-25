
import { readFileSync } from 'fs';
import marked from 'marked';
import { sanitizeHtml } from './sanitizer';
import { ParsedRequest } from './types';
const twemoji = require('twemoji');
const twOptions = { folder: 'svg', ext: '.svg' };
const emojify = (text: string) => twemoji.parse(text, twOptions);

const rglr = readFileSync(`${__dirname}/../_fonts/Circular-Medium.ttf`).toString('base64');
const bold = readFileSync(`${__dirname}/../_fonts/Circular-Bold.ttf`).toString('base64');
const heading = readFileSync(`${__dirname}/../_fonts/Ambit-Bold.otf`).toString('base64');

function getCss(theme: string, fontSize: string) {
    let background = 'white';
    let foreground = '#000000';
    let alt = '#2442D8';
    let radial = 'lightgray';

    if (theme === 'dark') {
        background = '#000000';
        foreground = 'white';
        alt = '#FFBAB9';
        radial = 'dimgray';
    }
    return `
    @font-face {
        font-family: 'Circular';
        font-style:  normal;
        font-weight: normal;
        src: url(data:font/truetype;charset=utf-8;base64,${rglr}) format('truetype');
    }

    @font-face {
        font-family: 'Circular';
        font-style:  normal;
        font-weight: bold;
        src: url(data:font/truetype;charset=utf-8;base64,${bold}) format('truetype');
    }

    @font-face {
        font-family: 'Ambit';
        font-style: normal;
        font-weight: bold;
        src: url(data:font/woff2;charset=utf-8;base64,${heading})  format("opentype");
    }

    body {
        background: ${background};
        background-image: radial-gradient(circle at 25px 25px, ${radial} 2%, transparent 0%), radial-gradient(circle at 75px 75px, ${radial} 2%, transparent 0%);
        background-size: 100px 100px;
        height: 100vh;
        display: flex;
        text-align: center;
        align-items: center;
        justify-content: center;
        font-family: 'Circular', sans-serif;
    }

    code {
        color: #D400FF;
        font-family: 'Vera';
        white-space: pre-wrap;
        letter-spacing: -5px;
    }

    code:before, code:after {
        content: '\`';
    }

    .logo-wrapper {
        display: flex;
        align-items: center;
        justify-content: center;
        position: absolute;
        top: 15px;
        left: 0;
        width: 100%;
    }

    .logo {
        width: 100px;
    }

    .plus {
        color: #BBB;
        font-family: Times New Roman, Verdana;
        font-size: 100px;
    }

    .spacer {
        margin: 150px;
    }

    .emoji {
        height: 1em;
        width: 1em;
        margin: 0 .05em 0 .1em;
        vertical-align: -0.1em;
    }
    
    .heading {
        font-family: 'Ambit', sans-serif;
        font-size: ${sanitizeHtml(fontSize)};
        font-style: normal;
        color: ${foreground};
        line-height: 1.25;
    }
    
    .heading strong {
        color: ${alt};
    }
    
    p.url {
        font-family: 'Circular', sans-serif;
        font-style: bold;
        color: ${foreground};
        line-height: 1.25;
        position: absolute;
        bottom: 15px;
        left: 0;
        width: 100%;
        font-size: 32px;
        text-align: center;
    }
    `;
}

export function getHtml(parsedReq: ParsedRequest) {
    const { text, theme, md, fontSize, images  } = parsedReq;
    return `<!DOCTYPE html>
<html>
    <meta charset="utf-8">
    <title>Generated Image</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <style>
        ${getCss(theme, fontSize)}
    </style>
    <body>
        <div>
            <div class="spacer">
            <div class="logo-wrapper">
                ${images.map((img, i) =>
                    getPlusSign(i) + getImage(img)
                ).join('')}
            </div>
            <div class="spacer">
            <div class="heading">${emojify(
                md ? marked(text) : sanitizeHtml(text)
            )}
            </div>
        </div>
        <p class="url">thefuture.build</p>
    </body>
</html>`;
}

function getImage(src: string) {
    return `<img
        class="logo"
        alt="Generated Image"
        src="${sanitizeHtml(src)}"
    />`
}

function getPlusSign(i: number) {
    return i === 0 ? '' : '<div class="plus">+</div>';
}
