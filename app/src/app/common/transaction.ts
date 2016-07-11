export class Transaction {
    constructor(
        public id: number,
        public date: string,
        public username: string,
        public amount: number) { }
}