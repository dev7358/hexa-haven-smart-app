import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  activeDevices: [], // Cards with switches
  cardNames: [], // Array of objects to store card names
  nextDeviceId: 1,
  timers: {}, // Counter for numeric IDs
};

const switchSlice = createSlice({
  name: 'switches',
  initialState,
  reducers: {
    addDevice: (state, action) => {
      const newDevice = {
        ...action.payload,
        id: state.nextDeviceId, // Assign the next numeric ID
      };
      state.activeDevices.push(newDevice);
      // Add a default name for the card
      state.cardNames.push({
        id: state.nextDeviceId,
        name: `Smart Switch ${state.nextDeviceId}`,
      });
      state.nextDeviceId += 1; // Increment the counter
    },
    removeDevice: (state, action) => {
      const deviceId = action.payload;
      state.activeDevices = state.activeDevices.filter(
        device => device.id !== deviceId,
      );
      // Remove the corresponding card name
      state.cardNames = state.cardNames.filter(card => card.id !== deviceId);
    },
    updateDevice: (state, action) => {
      const {id, switches, regulators} = action.payload;
      const device = state.activeDevices.find(device => device.id === id);
      if (device) {
        if (switches) device.switches = switches;
        if (regulators) device.regulators = regulators;
      }
    },
    updateCardName: (state, action) => {
      const {id, name} = action.payload;
      const card = state.cardNames.find(card => card.id === id);
      if (card) {
        card.name = name;
      }
    },
    setTimer: (state, action) => {
      const {deviceId, switchIndex, timeLeft} = action.payload;
      if (!state.timers[deviceId]) state.timers[deviceId] = {}; // Initialize timers for the device if not already present
      state.timers[deviceId][switchIndex] = timeLeft; // Set the timer for the specific switch
    },

    // Decrement the timer for a specific switch of a device
    decrementTimer: (state, action) => {
      const {deviceId, switchIndex} = action.payload;
      if (state.timers[deviceId] && state.timers[deviceId][switchIndex] > 0) {
        state.timers[deviceId][switchIndex] -= 1; // Decrement the timer
      }
    },

    // Reset the timer for a specific switch of a device
    resetTimer: (state, action) => {
      const {deviceId, switchIndex} = action.payload;
      if (
        state.timers[deviceId] &&
        state.timers[deviceId][switchIndex] !== undefined
      ) {
        delete state.timers[deviceId][switchIndex]; // Remove the timer for the switch
      }
    },

    // Reset all timers for a specific device (optional)
    resetAllTimers: (state, action) => {
      const {deviceId} = action.payload;
      if (state.timers[deviceId]) {
        state.timers[deviceId] = {}; // Reset all timers for the device
      }
    },
  },
});

export const {
  addDevice,
  removeDevice,
  updateDevice,
  updateCardName,
  setTimer,
  decrementTimer,
  resetTimer,
  resetAllTimers,
} = switchSlice.actions;
export default switchSlice.reducer;
