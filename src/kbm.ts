// kbm-parsing code

export { Keymap, parseKbm, defaultMap };

class Keymap {
    size: number;
    firstNote: number;
    lastNote: number;
    middleNote: number;
    referenceNote: number;
    frequency: number;
    formalOctave: number;
    mapping: Array<number | null>;
}

function parseKbm(text: string): Keymap {
    const lines = text.split('\n').filter((s) => !s.startsWith('!'));
    if (lines.length < 7) {
        throw new Error('Invalid mapping file')
    }
    const keymap = new Keymap();
    keymap.size = parseInt(lines[0]);
    keymap.firstNote = parseInt(lines[1]);
    keymap.lastNote = parseInt(lines[2]);
    keymap.middleNote = parseInt(lines[3]);
    keymap.referenceNote = parseInt(lines[4]);
    keymap.frequency = parseFloat(lines[5]);
    keymap.formalOctave = parseInt(lines[6]);
    keymap.mapping = lines.slice(7).map((s) =>
        s.trim() == 'x' ? null : parseInt(s));
    if (keymap.mapping.length != keymap.size) {
        throw new Error('Wrong number of keys in mapping');
    }
    return keymap;
}

function defaultMap(size: number): Keymap {
    const keymap = new Keymap();
    keymap.size = size;
    keymap.firstNote = 0;
    keymap.lastNote = 127;
    keymap.middleNote = 60;
    keymap.referenceNote = 69;
    keymap.frequency = 440.0;
    keymap.formalOctave = size;
    keymap.mapping = [...new Array(size).keys()];
    return keymap;
}
