export interface Event {
    name: string;
    type: "individual" | "team";
    category: "technical" | "cultural" | "megashows" | "workshop";
    description: string;
    startDate: Date;
    endDate: Date;
    venue: string;
    club: string; // TODO : add all clubs here
    clubType: "cultural" | "techincal";
    ruleBook: string;
    tags: Array<
        | "dance"
        | "music"
        | "coding"
        | "hardware"
        | "art"
        | "photography"
        | "cinematography"
        | "literary"
        | "quiz"
        | "dramatics"
        | "gaming"
    >;
}
