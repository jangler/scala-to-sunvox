// front-end

import { parseScl } from './scl';
import { parseKbm, defaultMap } from './kbm';
import { generateCurve } from './curve';

const sclInput =
    document.querySelector('#sclInput') as HTMLInputElement;
const kbmInput =
    document.querySelector('#kbmInput') as HTMLInputElement;
const convertButton =
    document.querySelector('#convertButton') as HTMLButtonElement;
const messageArea =
    document.querySelector('#messageArea') as HTMLParagraphElement;

function reportError(err: Error) {
    messageArea.setAttribute('style', 'display: block;');
    messageArea.innerText = err.message + '.';
}

function clearError() {
    messageArea.setAttribute('style', 'display: none;')
}

// https://stackoverflow.com/questions/19327749/
function download(blob: Blob, filename: string) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('style', 'display: none');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
        URL.revokeObjectURL(url);
        document.body.removeChild(a);
    });
}

convertButton.addEventListener('click', (event) => {
    const scl = sclInput.files?.item(0);
    const kbm = kbmInput.files?.item(0);
    if (scl) {
        scl.text().then((sclText) => {
            try {
                const scale = parseScl(sclText);
                if (kbm) {
                    kbm.text().then((kbmText) => {
                        const keymap = parseKbm(kbmText);
                        const buf = generateCurve(scale, keymap);
                        finish(buf, scl.name);
                    })
                } else {
                    const keymap = defaultMap(scale.notes.length);
                    const buf = generateCurve(scale, keymap);
                    finish(buf, scl.name);
                }
            } catch (err) {
                reportError(err);
            }
        });
    } else {
        reportError(new Error('No scale selected'));
    }
});

function finish(buf: Uint8Array, filename: string) {
    clearError();
    try {
        const blob = new Blob([buf], { type: 'application/octet-stream' });
        console.log(buf);
        console.log(blob);
        blob.arrayBuffer().then((x) => console.log(x.slice(0, 256)));
        download(blob, filename.replace('.scl', '.curve16bit'));
    } catch (err) {
        reportError(err);
    }
}
