export enum TransactionType {
    INCOME = 'INCOME',
    EXPENSE = 'EXPENSE'
}

export interface Transaction {
    id: number;
    text: string;
    amount: number;
    type: TransactionType;
    category: string;
}

export interface GroundingChunk {
    web?: {
        uri: string;
        title: string;
    };
}

export interface Budget {
    category: string;
    amount: number;
}
