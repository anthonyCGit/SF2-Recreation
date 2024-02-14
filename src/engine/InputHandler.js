import { Control, controls, GamepadThumbstick } from "../constants/control.js";
import { FIGHTER_DIRECTION } from "../constants/fighter.js";

const heldKeys = new Set();
const gamepads = new Map();

const mappedKeys = controls.map(({ keyboard }) => Object.values(keyboard)).flat();

function handleKeyDown(event) {
    if (!mappedKeys.includes(event.code)) return;

    event.preventDefault();
    heldKeys.add(event.code);
}

function handleKeyUp(event) {
    if (!mappedKeys.includes(event.code)) return;
    
    event.preventDefault();
    heldKeys.delete(event.code);
}

function handleGamepadConnected(event) {
    const { gamepad: { index, axes, buttons }} = event;
    gamepads.set(index, { axes, buttons });
}

function handleGamepadDisonnected(event) {
    const { gamepad: { index }} = event;
    gamepads.delete(index);
}

export function registerKeyboardEvents() {
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
}

export function registerGamepadEvents() {
    window.addEventListener('gamepadconnected', handleGamepadConnected);
    window.addEventListener('gamepaddisconnected', handleGamepadDisonnected);
}

export function pollGamepads() {
    for (const gamepad of navigator.getGamepads()) {
        if(!gamepad) continue;

        if (gamepads.has(gamepad.index)) {
            const { index, axes, buttons } = gamepad;
            gamepads.set(index, { axes, buttons });
        }
    }
}

export const isKeyDown = (code) => heldKeys.has(code);
export const isKeyUp = (code) => !heldKeys.has(code);

export const isButtonDown = (padID, button) => gamepads.get(padID)?.buttons[button].pressed;
export const isButtonUp = (padID, button) => !gamepads.get(padID)?.buttons[button].pressed;

export const isAxeGreater = (padID, axeID, value) => gamepads.get(padID)?.axes[axeID] >= value;
export const isAxeLower = (padID, axeID, value) => gamepads.get(padID)?.axes[axeID] <= value;

export const isLeft = (id) => isKeyDown(controls[id].keyboard[Control.LEFT])
    || isButtonDown(id, controls[id].gamepad[Control.LEFT])
    || isAxeLower(id, controls[id].gamepad[GamepadThumbstick.HORIZONTAL_AXE_ID], -controls[id].gamepad[GamepadThumbstick.DEAD_ZONE]);

export const isRight = (id) => isKeyDown(controls[id].keyboard[Control.RIGHT])
    || isButtonDown(id, controls[id].gamepad[Control.RIGHT])
    || isAxeGreater(id, controls[id].gamepad[GamepadThumbstick.HORIZONTAL_AXE_ID], controls[id].gamepad[GamepadThumbstick.DEAD_ZONE]);

export const isUp = (id) => isKeyDown(controls[id].keyboard[Control.UP])
    || isButtonDown(id, controls[id].gamepad[Control.UP])
    || isAxeLower(id, controls[id].gamepad[GamepadThumbstick.VERTICAL_AXE_ID], -controls[id].gamepad[GamepadThumbstick.DEAD_ZONE]);
    
export const isDown = (id) => isKeyDown(controls[id].keyboard[Control.DOWN])
    || isButtonDown(id, controls[id].gamepad[Control.DOWN])
    || isAxeGreater(id, controls[id].gamepad[GamepadThumbstick.VERTICAL_AXE_ID], controls[id].gamepad[GamepadThumbstick.DEAD_ZONE]);

export const isForward = (id, direction) => direction == FIGHTER_DIRECTION.RIGHT ? isRight(id) : isLeft(id);
export const isBackward = (id, direction) => direction == FIGHTER_DIRECTION.LEFT ? isRight(id) : isLeft(id);

export const isIdle = (id) => !(isLeft(id) || isRight(id) || isUp(id) || isDown(id));