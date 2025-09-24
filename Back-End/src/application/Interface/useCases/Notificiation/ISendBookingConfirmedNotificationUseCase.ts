export interface SendBookingConfirmedInput {
    userId: string;
    title: string;
    message: string;
    metadata: any;
}

export interface ISendBookingConfirmedNotificationUseCase { 
    execute( input: SendBookingConfirmedInput ): Promise<void> 
}


