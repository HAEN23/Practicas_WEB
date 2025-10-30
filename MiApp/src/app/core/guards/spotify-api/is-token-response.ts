import { TokenResponse } from "../../../../interfaces/spotify-token-response";

export function isTokenResponse(body: unknown): body is TokenResponse{
    if(typeof body !== 'object' || body === null)
        return false

    return 'access_token' in body && typeof (body as {access_token: unknown}).access_token === 'string'
}