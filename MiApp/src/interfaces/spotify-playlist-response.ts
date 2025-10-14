import { SpotifyImageResponse } from "./spotify-image-response.js";
import { SpotifyTrackResponse } from "./spotify-track-response.js";

export interface SpotifyPlaylistResponse {

    id: string,
    name: string,
    description: string,
    href:string,
    images: SpotifyImageResponse[],
    tracks: {
        items: [
            track: SpotifyTrackResponse
        ]
    }

}
