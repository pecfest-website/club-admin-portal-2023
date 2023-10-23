import { db } from "@/serverless/config";
import { addDoc, collection } from "@firebase/firestore";

export async function addTeam(name: string, phoneNumber: string, email: string) {
    await addDoc(collection(db, "events/18fhiEImPDSWzf8gwTv8/registrations"), {
        teamName: name,
        teamSize: 1,
        usersData: [
            {
                name,
                phoneNumber,
                userId: email
            }
        ]
    })
    console.log("added yay")
}