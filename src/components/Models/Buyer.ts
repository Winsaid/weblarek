import { IBuyer, TBuyerData, TBuyerErrors, TPayment } from '../../types';
import { buyerErrorMessages } from '../../utils/constants';
import { IEvents } from '../base/Events';

export class Buyer {
    private payment: TPayment | null = null;
    private email = '';
    private phone = '';
    private address = '';
    private events: IEvents;

    constructor(events: IEvents) {
        this.events = events;
    }

    setData(data: Partial<IBuyer>): void {
        if (data.payment !== undefined) this.payment = data.payment;
        if (data.email !== undefined) this.email = data.email;
        if (data.phone !== undefined) this.phone = data.phone;
        if (data.address !== undefined) this.address = data.address;
        this.events.emit('buyer:changed');
    }

    getData(): TBuyerData {
        return {
            payment: this.payment,
            email: this.email,
            phone: this.phone,
            address: this.address,
        };
    }

    clear(): void {
        this.payment = null;
        this.email = '';
        this.phone = '';
        this.address = '';
        this.events.emit('buyer:changed');
    }

    validate(): TBuyerErrors {
        const errors: TBuyerErrors = {};

        if (!this.payment) errors.payment = buyerErrorMessages.payment;
        if (!this.email.trim()) errors.email = buyerErrorMessages.email;
        if (!this.phone.trim()) errors.phone = buyerErrorMessages.phone;
        if (!this.address.trim()) errors.address = buyerErrorMessages.address;

        return errors;
    }
}
