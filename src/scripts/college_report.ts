import { db } from "@/serverless/config";
import * as XLSX from "xlsx";
import { collection, getDocs } from "firebase/firestore";

export const getCollegeReport = async (loading: boolean, setLoading: any) => {
    setLoading(true);

    const eventIds = (await getDocs(collection(db, "events"))).docs.map(
        (doc) => {
            return { id: doc.id, name: doc.data()["name"] };
        }
    );

    const userIds = (await getDocs(collection(db, "registrations"))).docs.map(
        (doc) => {
            return {
                id: doc.id,
                name: doc.data()?.name ?? "pec student",
                college: doc.data()?.college ?? "pec",
            };
        }
    );

    // console.log(eventIds);
    // console.log(userIds);

    let eventMap: any = {};

    userIds.map(async (userId) => {
        (
            await getDocs(collection(db, `registrations/${userId.id}/events`))
        ).docs.map((eventRegDoc) => {
            if (!eventMap[eventRegDoc.data()["name"]]) {
                eventMap[eventRegDoc.data()["name"]] = [
                    {
                        id: userId.id,
                        userName: userId.name,
                        collegename: userId.college,
                        eventId: eventRegDoc.data()["eventId"],
                    },
                ];
            } else {
                eventMap[eventRegDoc.data()["name"]].push({
                    id: userId.id,
                    userName: userId.name,
                    collegename: userId.college,
                    eventId: eventRegDoc.data()["eventId"],
                });
            }

            console.log(eventRegDoc.data()["name"], eventMap[eventRegDoc.data()["name"]]);
        });

        // console.log(userId.name);
    });

    console.log(Object.keys(eventMap));
    const heading = [["Event Name", "Name", "Email Id", "College", "Contact"]];

    const file = Object.keys(eventMap).map((event: any) => {
        console.log(event)
        return [
            `${event}`,
            eventMap[event].name,
            eventMap[event].id,
            eventMap[event].college,
            "",
        ];
    });
    const worksheet = XLSX.utils.json_to_sheet(file, {
        skipHeader: false,
    });
    const workbook = XLSX.utils.book_new();
    XLSX.utils.sheet_add_aoa(worksheet, heading, { origin: "A1" });
    XLSX.utils.book_append_sheet(workbook, worksheet, `Total`);
    XLSX.writeFile(workbook, `PecfestRegistrationsCollegeWise.xlsx`);

    setLoading(false);
};
