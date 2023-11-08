import { db } from "@/serverless/config";
import { addDoc, collection } from "@firebase/firestore";

export async function addTeamRoboRace(
    name: string,
    phoneNumber: string,
    email: string
) {
    await addDoc(collection(db, "events/qKNahJvTKIOkvmMHM9w6/registrations"), {
        teamName: name,
        teamSize: 1,
        usersData: [
            {
                name,
                phoneNumber,
                userId: email,
            },
        ],
    });
    console.log("added yay");
}

export async function copyData(data: any) {
    await addDoc(
        collection(db, "events/qKNahJvTKIOkvmMHM9w6/registrations"),
        data
    );
    console.log("added yay");
}
