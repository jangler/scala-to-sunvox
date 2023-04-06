// curve generation code

export { generateCurve };

import { Scale } from "./scl";
import { Keymap } from "./kbm";

const TOTAL_KEYS = 128;
const C5_UNITS = 0x7c00;
const C5_KEY = 60;
const CENTS_PER_SEMITONE = 100;
const UNITS_PER_SEMITONE = 0x100;
const MIN_UNITS = 0;
const MAX_UNITS = 0xffff;

function generateCurve(scale: Scale, keymap: Keymap): Uint8Array {
    const buf = new Uint8Array(TOTAL_KEYS * 2);
    for (let key = 0; key < TOTAL_KEYS; key++) {
        const units = (key >= keymap.firstNote && key <= keymap.lastNote) ?
            calcPitch(scale, keymap, key) :
            C5_UNITS + (key - C5_KEY) * UNITS_PER_SEMITONE;
        buf[key * 2] = units & 0xff;
        buf[key * 2 + 1] = units >> 8;
    }
    return buf;
}

function calcPitch(scale: Scale, keymap: Keymap, key: number): number {
    const offset = key - 1 - keymap.middleNote;
    const octave = Math.floor(offset / keymap.size);
    let index = offset % keymap.size;
    while (index < 0) {
        index += keymap.size;
    }
    const units = C5_UNITS + Math.round(
        (scale.notes[index] + octave * scale.notes[scale.notes.length - 1]) *
        UNITS_PER_SEMITONE / CENTS_PER_SEMITONE
    );
    return Math.max(MIN_UNITS, Math.min(MAX_UNITS, units));
}
