import { SearchService } from './search.service';
export declare class SearchController {
    private readonly searchService;
    constructor(searchService: SearchService);
    search(name: string, req: any): Promise<{
        id: number;
        name: string;
        type: string;
    }[]>;
}
