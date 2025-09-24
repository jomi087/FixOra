export interface SendBookingCancelledInput {
    userId: string;
    title: string;
    message: string;
    metadata: any;
}

export interface ISendBookingCancelledNotificationUseCase { 
    execute( input: SendBookingCancelledInput ): Promise<void> 
}


