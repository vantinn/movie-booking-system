import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface BookingState {
    selectedSeats: string[];
}

const initialState: BookingState = {
    selectedSeats: [],
};

const bookingSlice = createSlice({
    name: 'booking',
    initialState,
    reducers: {
        setSelectedSeats(state, action: PayloadAction<string[]>) {
            state.selectedSeats = action.payload;
        },
        clearSelectedSeats(state) {
            state.selectedSeats = [];
        },
    },
});

export const { setSelectedSeats, clearSelectedSeats } = bookingSlice.actions;
export default bookingSlice.reducer;

