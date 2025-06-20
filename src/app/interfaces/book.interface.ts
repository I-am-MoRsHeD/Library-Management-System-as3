export interface Book {
    title: string,
    author: string,
    genre: 'FICTION' | 'NON-FICTION' | 'SCIENCE' | 'HISTORY' | 'FANTASY' | 'BIOGRAPHY',
    isbn: string,
    description?: string,
    copies: number,
    available: boolean
}