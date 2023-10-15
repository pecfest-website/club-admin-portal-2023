export interface Team {
    paymentProof: string;
    paymentId: string;
    teamName: string;
    teamSize: string | number;
    usersData: TeamMember[];
}

export interface TeamMember {
    name: string;
    phoneNumber: string;
    userId: string;
}
