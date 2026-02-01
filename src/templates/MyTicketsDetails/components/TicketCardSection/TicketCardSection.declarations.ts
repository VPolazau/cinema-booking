import { ITicketVM } from '../../MyTicketsDetails.declarations';


export interface ITicketCardSection {
    title: string;
    items: ITicketVM[];
    paymentSeconds: number;
    isPaying: boolean;
    onPay: (bookingId: string) => void;
    movieTitleById: Map<number, string>;
    cinemaById: Map<number, { name: string; address: string }>;
}