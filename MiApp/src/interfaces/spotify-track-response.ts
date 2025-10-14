export interface SpotifyTrackResponse {

    id: string,
    name: string,
    artist: [
        {
            id: string,
            href: string,
            name: string
        }
    ],
    duration_ms: number,
    track_number: number,

}
