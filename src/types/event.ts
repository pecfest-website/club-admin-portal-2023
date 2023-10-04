export interface Event {
    id: string;
    name: string;
    type: "INDIVIDUAL" | "TEAM";
    category: "TECHNICAL" | "CULTURAL" | "MEGASHOWS" | "WORKSHOP";
    description: string;
    startDate: Date;
    endDate: Date;
    venue: string;
    club: string; // TODO : add all clubs here
    clubType: "CULTURAL" | "TECHINCAL";
    ruleBook: string;
    image: string;
    tags: Array<
        | "DANCE"
        | "MUSIC"
        | "CODING"
        | "HARDWARE"
        | "ART"
        | "PHOTOGRAPHY"
        | "CINEMATOGRAPHY"
        | "LITERARY"
        | "QUIZ"
        | "DRAMATICS"
        | "GAMING"
    >;
}
