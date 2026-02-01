export interface ISeatMap {
    rows: number;
    seatsPerRow: number;
    isAuthed: boolean;
    bookedSet: Set<string>;
    selectedKeySet: Set<string>;
    onToggleSeat: (rowNumber: number, seatNumber: number) => void;
}
