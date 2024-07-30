import { EventDispatcher } from "./EventDispatcher";

export const Globals = {
    resources: {},
    initResponseReceived: false,
    spinResponseReceived: false,
    spinButtonClicked: false,
    gameIdleText : "PRESS SPIN TO PLAY",
    gameWaitText : "GOOD LUCK!",
    gameTotalWinText : "TOTAL WIN: ",
    serverResponseWaitTimer: 1000,
    lineWinPresntationDelay: 1000,
    line_win: true
};

export const dispatcher = new EventDispatcher();

export const ReelConfig = {
    x: 400,
    y: 120,
    row: 5,
    column:3,
    symbolWidth: 200,
    symbolHeight: 200,
    columnPadding: 5
}
export const symbolYPos = [0, 200, 400]
export const symbolDdownPos = [610, 810, 1010]


export const ButtonPanelConfig = {
    x: 1000,
    y: 270
}
export const WinTextPosition = {
    x: 670,
    y: -100
}
export const MessageTextPosition = {
    x: 670,
    y: 0
}
export const WinLinePanelConfig = {
    x: 320,
    y: 480
}
export const SymbolId = {
    0: "HV1",
    1: "HV2",
    2: "HV3",
    3: "HV4",
    4: "LV1",
    5: "LV2",
    6: "LV3",
    7: "LV4"
}