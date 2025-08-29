export declare class TrackEventDto {
    contentId: number;
    contentType: 'reel' | 'article' | 'short_video';
    watchTime?: number;
    totalTime?: number;
    watchPercentage?: number;
    scrollPercentage?: number;
    liked?: boolean;
    commented?: boolean;
    followed?: boolean;
    shared?: boolean;
    saved?: boolean;
    sessionId?: string;
}
