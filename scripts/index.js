// State of the processors:
const processorState = {
    p1: {
        1: {
            tag: '0000',
            state: 'Invalid',
            cycle: 0,
            c00: 0,
            c01: 0,
            c10: 0,
            c11: 0,
        },
        2: {
            tag: '0000',
            state: 'Invalid',
            cycle: 0,
            c00: 0,
            c01: 0,
            c10: 0,
            c11: 0,
        },
        3: {
            tag: '0000',
            state: 'Invalid',
            cycle: 0,
            c00: 0,
            c01: 0,
            c10: 0,
            c11: 0,
        },
    },
    p2: {
        1: {
            tag: '0000',
            state: 'Invalid',
            cycle: 0,
            c00: 0,
            c01: 0,
            c10: 0,
            c11: 0,
        },
        2: {
            tag: '0000',
            state: 'Invalid',
            cycle: 0,
            c00: 0,
            c01: 0,
            c10: 0,
            c11: 0,
        },
        3: {
            tag: '0000',
            state: 'Invalid',
            cycle: 0,
            c00: 0,
            c01: 0,
            c10: 0,
            c11: 0,
        },
    },
    p3: {
        1: {
            tag: '0000',
            state: 'Invalid',
            cycle: 0,
            c00: 0,
            c01: 0,
            c10: 0,
            c11: 0,
        },
        2: {
            tag: '0000',
            state: 'Invalid',
            cycle: 0,
            c00: 0,
            c01: 0,
            c10: 0,
            c11: 0,
        },
        3: {
            tag: '0000',
            state: 'Invalid',
            cycle: 0,
            c00: 0,
            c01: 0,
            c10: 0,
            c11: 0,
        },
    },
    p4: {
        1: {
            tag: '0000',
            state: 'Invalid',
            cycle: 0,
            c00: 0,
            c01: 0,
            c10: 0,
            c11: 0,
        },
        2: {
            tag: '0000',
            state: 'Invalid',
            cycle: 0,
            c00: 0,
            c01: 0,
            c10: 0,
            c11: 0,
        },
        3: {
            tag: '0000',
            state: 'Invalid',
            cycle: 0,
            c00: 0,
            c01: 0,
            c10: 0,
            c11: 0,
        },
    }


}

const memoryData = {
    m0000: {
        m00: 0,
        m01: 0,
        m10: 0,
        m11: 0,
    },
    m0001: {
        m00: 0,
        m01: 0,
        m10: 0,
        m11: 0,
    },
    m0010: {
        m00: 0,
        m01: 0,
        m10: 0,
        m11: 0,
    },
    m0011: {
        m00: 0,
        m01: 0,
        m10: 0,
        m11: 0,
    },
    m0100: {
        m00: 0,
        m01: 0,
        m10: 0,
        m11: 0,
    },
    m0101: {
        m00: 0,
        m01: 0,
        m10: 0,
        m11: 0,
    },
    m0110: {
        m00: 0,
        m01: 0,
        m10: 0,
        m11: 0,
    },
    m0111: {
        m00: 0,
        m01: 0,
        m10: 0,
        m11: 0,
    },
    m1000: {
        m00: 0,
        m01: 0,
        m10: 0,
        m11: 0,
    },
    m1001: {
        m00: 0,
        m01: 0,
        m10: 0,
        m11: 0,
    },
    m1010: {
        m00: 0,
        m01: 0,
        m10: 0,
        m11: 0,
    },
    m1011: {
        m00: 0,
        m01: 0,
        m10: 0,
        m11: 0,
    },
    m1100: {
        m00: 0,
        m01: 0,
        m10: 0,
        m11: 0,
    },
    m1101: {
        m00: 0,
        m01: 0,
        m10: 0,
        m11: 0,
    },
    m1110: {
        m00: 0,
        m01: 0,
        m10: 0,
        m11: 0,
    },
    m1111: {
        m00: 0,
        m01: 0,
        m10: 0,
        m11: 0,
    },
}
let clockCycles = 0;

document.addEventListener('DOMContentLoaded', () => {
    initProcessor(1);
    initProcessor(2);
    initProcessor(3);
    initProcessor(4);
})





const initProcessor = (processorNumber) => {
    const getSaveBtn = document.getElementById(`save-btn-${processorNumber}`);
    const getLoadBtn = document.getElementById(`load-btn-${processorNumber}`);

    getSaveBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const getAddress = document.getElementById(`address-${processorNumber}`).value;
        const getValue = document.getElementById(`value-${processorNumber}`).value;
        processorSave(processorNumber, getAddress, getValue, 'green');
    })

    getLoadBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const getAddress = document.getElementById(`address-${processorNumber}`).value;
        processorLoad(processorNumber, getAddress, 'orange');
    })
}





const processorSave = (processorNumber, address, value, color) => {
    const otherProcessors = [1, 2, 3, 4].filter(element => element !== processorNumber);
    updateClockCycle(1);
    // Clearh the colors: 
    clearTheColors();
    // Since I've decided that we will deal with 6 bits.
    // 4 bits will be the tag, the last two bits will be the offset
    // We need to make sure first that the length of address is 6, if not 6 preappend zeros
    address = appendZerosToAddress(address);
    const tag = address.slice(0, 4);
    const offset = address.slice(4);
    // Determine which cache line we will use: 
    // the line is not used yet, if its cycle is zero
    let lineToUse = -1;
    let lineWithLowestCycle = 1;
    let lineWithLowestCycleValue = processorState['p1'][1].cycle;
    const processorData = processorState['p' + processorNumber];
    for (const lineNumber in processorData) {
        ld = processorData[lineNumber];
        if (ld.cycle === 0 || ld.tag === tag) {
            lineToUse = lineNumber;
            break;
        }
        if (ld.cycle < lineWithLowestCycleValue) {
            lineWithLowestCycle = lineNumber;
        }
    }

    if (lineToUse === -1) {
        // All lines are used, LRU should be used now to free a blcok, and flush its data to the memory
        // we will flush and replace the line with the lowest cycle
        const lineWillBeFlushedAndReplaced = processorState[`p${processorNumber}`][lineWithLowestCycle];
        updateMemory(lineWillBeFlushedAndReplaced);
        document.getElementsByClassName(`c${processorNumber}-ca${lineWithLowestCycle}-00`)[0].innerText = '0';
        document.getElementsByClassName(`c${processorNumber}-ca${lineWithLowestCycle}-01`)[0].innerText = '0';
        document.getElementsByClassName(`c${processorNumber}-ca${lineWithLowestCycle}-10`)[0].innerText = '0';
        document.getElementsByClassName(`c${processorNumber}-ca${lineWithLowestCycle}-11`)[0].innerText = '0';
        lineToUse = lineWithLowestCycle;
    }

    const theState = 'Modified'
    // THERE'S a line to be used
    const lineData = processorData[lineToUse];
    // get the block from the memory, then write your new value - if anyone have a valid value: 
    if (lineData.state === 'Invalid' || lineData.state === 'Shared' || lineData.state === 'Modified') {
        notifyBus('busRdX', tag, offset, otherProcessors, processorNumber, lineToUse)
    }
    // Update the corresponding value:
    lineData['c' + offset] = value;
    const getOffsetTagValue = document.getElementsByClassName(`c${processorNumber}-ca${lineToUse}-${offset}`)[0];
    getOffsetTagValue.classList.add(`${color}-background`);
    getOffsetTagValue.innerText = value;
    // Update the corresponding Tag:
    lineData.tag = tag;
    const getTag = document.getElementsByClassName(`c${processorNumber}-ca${lineToUse}-tag`)[0];
    getTag.classList.add(`${color}-background`);
    getTag.innerText = tag;
    // Update the corresponding State:
    lineData.state = theState
    const getState = document.getElementsByClassName(`c${processorNumber}-ca${lineToUse}-state`)[0];
    getState.classList.add(`${color}-background`);
    getState.innerText = theState
    // Update the corresponding clock:
    lineData.cycle = clockCycles;
    const getClock = document.getElementsByClassName(`c${processorNumber}-ca${lineToUse}-clock`)[0];
    getClock.classList.add(`${color}-background`);
    getClock.innerText = clockCycles;
}



const processorLoad = (processorNumber, address, color) => {
    const otherProcessors = [1, 2, 3, 4].filter(element => element !== processorNumber);
    updateClockCycle(2);
    // Clearh the colors: 
    clearTheColors();
    // Since I've decided that we will deal with 6 bits.
    // 4 bits will be the tag, the last two bits will be the offset
    // We need to make sure first that the length of address is 6, if not 6 preappend zeros
    address = appendZerosToAddress(address);
    const tag = address.slice(0, 4);
    const offset = address.slice(4);
    // Determine which cache line we will use: 
    // the line is not used yet, if its cycle is zero
    let lineToUse = -1;
    let lineContainData = -1;
    let lineWithLowestCycle = 1;
    let lineWithLowestCycleValue = processorState['p1'][1].cycle;
    const processorData = processorState['p' + processorNumber];
    for (const lineNumber in processorData) {
        ld = processorData[lineNumber];
        if (ld.cycle !== 0 && ld.tag === tag) {
            lineContainData = lineNumber;
            break;
        }
        if (ld.cycle === 0) {
            lineToUse = lineNumber;
            break;
        }
        if (ld.cycle < lineWithLowestCycleValue) {
            lineWithLowestCycle = lineNumber;
        }
    }

    if (lineToUse === -1 && lineContainData === -1) {
        // All lines are used, LRU should be used now to free a blcok, and flush its data to the memory
        // we will flush and replace the line with the lowest cycle
        const lineWillBeFlushedAndReplaced = processorState[`p${processorNumber}`][lineWithLowestCycle];
        updateMemory(lineWillBeFlushedAndReplaced);
        document.getElementsByClassName(`c${processorNumber}-ca${lineWithLowestCycle}-00`)[0].innerText = '0';
        document.getElementsByClassName(`c${processorNumber}-ca${lineWithLowestCycle}-01`)[0].innerText = '0';
        document.getElementsByClassName(`c${processorNumber}-ca${lineWithLowestCycle}-10`)[0].innerText = '0';
        document.getElementsByClassName(`c${processorNumber}-ca${lineWithLowestCycle}-11`)[0].innerText = '0';
        lineWithLowestCycle;
        const theState = 'Shared'
        // THERE'S a line to be used
        const lineData = processorData[lineWithLowestCycle];
        const isFoundCached = notifyBus('busRd', tag, offset, otherProcessors, processorNumber, lineWithLowestCycle)
        if (isFoundCached) {
            // Update the corresponding Tag:
            lineData.tag = tag;
            const getTag = document.getElementsByClassName(`c${processorNumber}-ca${lineWithLowestCycle}-tag`)[0];
            getTag.classList.add(`${color}-background`);
            getTag.innerText = tag;
            // Update the corresponding State:
            lineData.state = theState
            const getState = document.getElementsByClassName(`c${processorNumber}-ca${lineWithLowestCycle}-state`)[0];
            getState.classList.add(`${color}-background`);
            getState.innerText = theState
            // Update the corresponding clock:
            lineData.cycle = clockCycles;
            const getClock = document.getElementsByClassName(`c${processorNumber}-ca${lineWithLowestCycle}-clock`)[0];
            getClock.classList.add(`${color}-background`);
            getClock.innerText = clockCycles;
        } else {
            getFromMemoryUpdate(tag, processorNumber, lineWithLowestCycle, lineData);
        }
    } else {
        const lineNumber = lineContainData === -1 ? lineToUse : lineContainData;
        const theState = 'Shared'
        // THERE'S a line to be used
        const lineData = processorData[lineNumber];
        if (lineData.state === 'Invalid') {
            const isFoundCached = notifyBus('busRd', tag, offset, otherProcessors, processorNumber, lineNumber);
            if (isFoundCached) {
                // Update the corresponding Tag:
                lineData.tag = tag;
                const getTag = document.getElementsByClassName(`c${processorNumber}-ca${lineNumber}-tag`)[0];
                getTag.classList.add(`${color}-background`);
                getTag.innerText = tag;
                // Update the corresponding State:
                lineData.state = theState
                const getState = document.getElementsByClassName(`c${processorNumber}-ca${lineNumber}-state`)[0];
                getState.classList.add(`${color}-background`);
                getState.innerText = theState
                // Update the corresponding clock:
                lineData.cycle = clockCycles;
                const getClock = document.getElementsByClassName(`c${processorNumber}-ca${lineNumber}-clock`)[0];
                getClock.classList.add(`${color}-background`);
                getClock.innerText = clockCycles;
            } else {
                getFromMemoryUpdate(tag, processorNumber, lineNumber, lineData, 'blue');
            }

        }
    }
}



const appendZerosToAddress = (address) => {
    const lengthOfAddress = address.length;
    const diff = 6 - lengthOfAddress;
    if (diff !== 0) {
        for (let index = 0; index < diff; index++) {
            address = 0 + address;
        }
    }
    return address;
}




const updateClockCycle = (number) => {
    let getClockElement = document.getElementById('clock-value');
    let newValue = clockCycles += number;
    getClockElement.innerText = newValue;
    return newValue;
}

const clearTheColors = () => {
    const colors = ['green-background', 'red-background', 'yellow-background', 'orange-background', 'blue-background']
    colors.forEach(color => {
        const coloredElement = document.getElementsByClassName(color);
        lengthOfElements = coloredElement.length;
        while (coloredElement[0]) {
            coloredElement[0].classList.remove(color);
        }
    });
}


const updateMemory = (lineData) => {
    document.getElementById(`cd-${lineData.tag}-00`).innerText = lineData['c00'];
    document.getElementById(`cd-${lineData.tag}-01`).innerText = lineData['c01'];
    document.getElementById(`cd-${lineData.tag}-10`).innerText = lineData['c10'];
    document.getElementById(`cd-${lineData.tag}-11`).innerText = lineData['c11'];
    memoryData['m' + lineData.tag]['m00'] = lineData['c00'];
    memoryData['m' + lineData.tag]['m01'] = lineData['c01'];
    memoryData['m' + lineData.tag]['m10'] = lineData['c10'];
    memoryData['m' + lineData.tag]['m11'] = lineData['c11']

    const memElement = document.getElementById(`mr-${lineData.tag}`)
    memElement.classList.add(`yellow-background`);
}

const getFromMemoryUpdate = (tag, processorNumber, lineNumber, lineData, color) => {
    const theState = 'Exclusive';
    const v00 = document.getElementById(`cd-${tag}-00`).innerText
    const v01 = document.getElementById(`cd-${tag}-01`).innerText
    const v10 = document.getElementById(`cd-${tag}-10`).innerText
    const v11 = document.getElementById(`cd-${tag}-11`).innerText

    lineData['c00'] = v00;
    lineData['c01'] = v01;
    lineData['c10'] = v10;
    lineData['c11'] = v11;

    // Update values: 
    const elm00 = document.getElementsByClassName(`c${processorNumber}-ca${lineNumber}-00`)[0];
    elm00.classList.add(`${color}-background`);
    elm00.innerText = v00
    const elm01 = document.getElementsByClassName(`c${processorNumber}-ca${lineNumber}-01`)[0];
    elm01.classList.add(`${color}-background`);
    elm01.innerText = v01
    const elm10 = document.getElementsByClassName(`c${processorNumber}-ca${lineNumber}-10`)[0];
    elm10.classList.add(`${color}-background`);
    elm10.innerText = v10
    const elm11 = document.getElementsByClassName(`c${processorNumber}-ca${lineNumber}-11`)[0];
    elm11.classList.add(`${color}-background`);
    elm11.innerText = v11

    // Update the corresponding Tag:
    lineData.tag = tag;
    const getTag = document.getElementsByClassName(`c${processorNumber}-ca${lineNumber}-tag`)[0];
    getTag.classList.add(`${color}-background`);
    getTag.innerText = tag;
    // Update the corresponding State:
    lineData.state = theState
    const getState = document.getElementsByClassName(`c${processorNumber}-ca${lineNumber}-state`)[0];
    getState.classList.add(`${color}-background`);
    getState.innerText = theState
    // Update the corresponding clock:
    lineData.cycle = clockCycles;
    const getClock = document.getElementsByClassName(`c${processorNumber}-ca${lineNumber}-clock`)[0];
    getClock.classList.add(`${color}-background`);
    getClock.innerText = clockCycles;
}


const notifyBus = (busTrans, tag, offset, otherProcessors, myProcessorNumber, mylineToUse) => {
    if (busTrans === 'busRdX') {
        const getBusContainer = document.getElementById(`bus-container`);
        getBusContainer.innerText = `Cycle: ${clockCycles}:: Processor Number (${myProcessorNumber}) => BusRdx`
        // Let's check whether there's any processor else have an old value or not. 
        otherProcessors.forEach(processorNumber => {
            let lineToUse = -1;
            const processorData = processorState['p' + processorNumber];
            for (const lineNumber in processorData) {
                ld = processorData[lineNumber];
                if (ld.tag === tag) {
                    lineToUse = lineNumber;
                    break;
                }
            }

            if (lineToUse !== -1) {
                const lineData = processorData[lineToUse];
                let offsetValue = lineData['cycle'];
                if (offsetValue !== 0) {
                    // Update the corresponding State:
                    if (lineData.state !== 'Invalid') {
                        lineData.state = 'Invalid';
                        const getState = document.getElementsByClassName(`c${processorNumber}-ca${lineToUse}-state`)[0];
                        getState.classList.add('red-background');
                        getState.innerText = 'Invalid';

                        const myProcessLineObject = processorState['p' + myProcessorNumber][mylineToUse];
                        for (const key in myProcessLineObject) {
                            if (key !== 'cycle' && key !== 'tag' && key !== 'state') {
                                myProcessLineObject[key] = lineData[key];
                                const getElem = document.getElementsByClassName(`c${myProcessorNumber}-ca${mylineToUse}-${key.slice(1)}`)[0];
                                getElem.classList.add(`green-background`);
                                getElem.innerText = myProcessLineObject[key];
                            }
                        }
                    }
                }
            }
        });
    }

    if (busTrans === 'busRd') {
        const getBusContainer = document.getElementById(`bus-container`);
        getBusContainer.innerText = `Cycle: ${clockCycles}:: Processor Number (${myProcessorNumber}) => BusRd`
        // Let's check whether there's any processor else have an old value or not. 
        let isFoundInOtherCaches = 0;
        for (let i = 0; i < otherProcessors.length; i++) {
            const processorNumber = otherProcessors[i];
            let lineToUse = -1;
            const processorData = processorState['p' + processorNumber];
            for (const lineNumber in processorData) {
                ld = processorData[lineNumber];
                if (ld.tag === tag && ld.state !== 'Invalid') {
                    ld.state = 'Shared';
                    //
                    const getState = document.getElementsByClassName(`c${processorNumber}-ca${lineNumber}-state`)[0];
                    getState.classList.add(`green-background`);
                    getState.innerText = 'Shared';
                    //
                    lineToUse = lineNumber;
                    break;
                }
            }

            if (lineToUse !== -1) {
                const lineData = processorData[lineToUse];
                let offsetValue = lineData['cycle'];
                if (offsetValue !== 0) {
                    const myProcessLineObject = processorState['p' + myProcessorNumber][mylineToUse];
                    for (const key in myProcessLineObject) {
                        if (key !== 'cycle' && key !== 'tag' && key !== 'state') {
                            myProcessLineObject[key] = lineData[key];
                            const getElem = document.getElementsByClassName(`c${myProcessorNumber}-ca${mylineToUse}-${key.slice(1)}`)[0];
                            getElem.classList.add(`green-background`);
                            getElem.innerText = myProcessLineObject[key];
                        }
                    }
                }
                isFoundInOtherCaches = 1;
                break;
            }
        }
        return isFoundInOtherCaches;
    }
}