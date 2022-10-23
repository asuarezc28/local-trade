export class Search {
    constructor(
        public searchByTerm: boolean,
        public pageNumber: number,
        public categorie?: string,
        public term?: string
    ) { }
}