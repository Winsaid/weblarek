import { IBuyer, TBuyerData, TBuyerErrors, TPayment } from '../../types';
import { buyerErrorMessages } from '../../utils/constants';

export class Buyer {
    private payment: TPayment | null = null;
    private email = '';
    private phone = '';
    private address = '';

    setData(data: Partial<IBuyer>): void {
        if (data.payment !== undefined) this.payment = data.payment;
        if (data.email !== undefined) this.email = data.email;
        if (data.phone !== undefined) this.phone = data.phone;
        if (data.address !== undefined) this.address = data.address;
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
