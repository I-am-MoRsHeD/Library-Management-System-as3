export interface BookType {
    title: string,
    author: string,
    genre: 'FICTION' | 'NON-FICTION' | 'SCIENCE' | 'HISTORY' | 'FANTASY' | 'BIOGRAPHY',
    isbn: string,
    description?: string,
    copies: number,
    available: boolean,
    [key: string]: any
};

export interface BookModel extends BookType {
    updateAvailability (bookId : string) : void;
};