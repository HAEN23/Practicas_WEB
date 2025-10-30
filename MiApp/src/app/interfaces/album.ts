export interface Album {
    id: string;
    name: string;
    artists: Array<{
        id: string;
        name: string;
        href: string;
    }>;
    images: Array<{
        url: string;
        height: number;
        width: number;
    }>;
    release_date: string;
    total_tracks: number;
    tracks?: {
        items: Array<{
            id: string;
            name: string;
            duration_ms: number;
            preview_url?: string;
        }>;
    };
}