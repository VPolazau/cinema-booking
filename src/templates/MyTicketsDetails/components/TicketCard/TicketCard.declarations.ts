import { ITicketVM } from '../../MyTicketsDetails.declarations';


export interface ITicketCard {
    vm: ITicketVM;
    paymentSeconds: number;
    onPay: (bookingId: string) => void;
    isPaying: boolean;
    movieTitle?: string;
    cinemaName?: string;
    cinemaAddress?: string;
}