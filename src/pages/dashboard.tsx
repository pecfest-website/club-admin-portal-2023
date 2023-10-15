import Layout from "@/components/Layout";
import {
    Box,
    Button,
    Container,
    CssBaseline,
    Grid,
    Typography,
} from "@mui/material";
import AddBoxOutlinedIcon from "@mui/icons-material/AddBoxOutlined";
import Head from "next/head";
import { useState } from "react";
import EventDialog from "@/components/events/EventDialog";
import { Event } from "@/types/event";
import EventCard from "@/components/events/EventCard";
import { collection, getDocs, orderBy, query, where } from "firebase/firestore";
import { db } from "@/serverless/config";
import { getSession, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import GalleryDialog from "@/components/events/GalleryDialog";
import * as XLSX from "xlsx";
import { Download } from "@mui/icons-material";

interface DashboardPageProps {
    events: Event[];
}
const DashboardPage = (props: DashboardPageProps) => {
    const router = useRouter();
    const session = useSession({
        required: true,
        onUnauthenticated() {
            router.replace("/login");
        },
    });
    const [eventDialogOpen, setEventDialogOpen] = useState(false);
    const [galleryDialogOpen, setGalleryDialogOpen] = useState<boolean>(false);

    const openGalleryDialog = () => {
        setGalleryDialogOpen(true);
    };

    const handleGalleryDialogClose = () => {
        setGalleryDialogOpen(false);
    };

    const event_list = props.events;

    const handleAddEventOpen = () => {
        setEventDialogOpen(true);
    };

    const handleAddEventClose = () => {
        setEventDialogOpen(false);
    };

    const [loading, setLoading] = useState(false);

    const saveExcel = async () => {
        setLoading(true);
        const users = (await getDocs(collection(db, "registrations"))).docs.map(
            (doc) => {
                return {
                    id: doc.id,
                    ...doc.data(),
                };
            }
        );
        const heading = [["Name", "Email Id", "College", "Contact"]];
        const file = users.map((user: any) => [
            `${user.name}`,
            user.email,
            user.college ? user.college : "",
            user.mobile ? user.mobile : "",
        ]);
        const worksheet = XLSX.utils.json_to_sheet(file, {
            skipHeader: false,
        });
        const workbook = XLSX.utils.book_new();
        XLSX.utils.sheet_add_aoa(worksheet, heading, { origin: "A1" });
        XLSX.utils.book_append_sheet(workbook, worksheet, `Total`);
        XLSX.writeFile(workbook, `PecfestRegistrations.xlsx`);
        setLoading(false);
    };

    return (
        <Layout>
            <Head>
                <title>Admin Panel | PECFEST&apos;23</title>
            </Head>
            <div className="flex h-full w-full bg-cover bg-[url('/bg2.png')] items-center justify-center">
                <Container
                    component={`main`}
                    className="h-full w-full p-4 m-0 scrollbar-hide overflow-y-scroll"
                >
                    <CssBaseline />
                    <Box
                        component={"div"}
                        className="space-y-2 w-full"
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            flexDirection: "column",
                            justifyContent: "center",
                            gap: "1em",
                            margin: "auto",
                            marginTop: 8,
                        }}
                    >
                        <Typography
                            sx={{
                                width: `100%`,
                                textAlign: `center`,
                                fontFamily: "serif",
                                fontWeight: 800,
                            }}
                            variant={`h5`}
                            className={
                                "text-white text-lg font-extrabold font-sans drop-shadow-xl glassmorphism py-2 rounded-xl"
                            }
                        >
                            Events by: {session && session.data?.user?.email}
                        </Typography>

                        <div>
                            <button
                                type="submit"
                                className="text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mb-2 dark:bg-blue-600 darkbg-blue-700 focus:outline-none dark:focus:ring-blue-800 ml-5 mr-5"
                                onClick={handleAddEventOpen}
                            >
                                Add an Event <AddBoxOutlinedIcon />
                            </button>
                            <button
                                type="submit"
                                className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800 ml-5"
                                onClick={openGalleryDialog}
                            >
                                Upload to Gallery <CloudUploadIcon />
                            </button>
                            <button
                                type="submit"
                                className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800 ml-5"
                                onClick={saveExcel}
                                disabled={loading}
                            >
                                {loading ? "Loading" : "Download registrations"}{" "}
                                <Download />
                            </button>
                        </div>
                        <EventDialog
                            open={eventDialogOpen}
                            setOpen={setEventDialogOpen}
                            onClose={handleAddEventClose}
                        />

                        <GalleryDialog
                            open={galleryDialogOpen}
                            setOpen={setGalleryDialogOpen}
                            onClose={handleGalleryDialogClose}
                        />
                    </Box>
                    <div className="w-full">
                        <Grid
                            sx={{
                                mt: 8,
                                justifyContent: "center",
                                gap: "2em",
                                mb: 4,
                                width: "full",
                            }}
                            container
                        >
                            {event_list &&
                                event_list.map((curr_event, idx) => (
                                    <div key={idx}>
                                        <EventCard
                                            event_name={curr_event.name}
                                            id={idx}
                                            image={curr_event.image}
                                            event_id={curr_event.id}
                                            type={curr_event.type}
                                        />
                                    </div>
                                ))}
                        </Grid>
                    </div>
                </Container>
            </div>
        </Layout>
    );
};

export default DashboardPage;

export async function getServerSideProps(context: any) {
    const { req } = context;
    const session = await getSession({ req });
    if (session == null) {
        return {
            redirect: {
                destination: "/",
                permanent: true,
            },
        };
    }
    const email = session.user?.email;
    const eventsRef = query(
        collection(db, "events"),
        where("adminEmail", "==", email)
    );
    const eventsSnapshot = await getDocs(eventsRef);

    let events: Event[] = [];

    eventsSnapshot.docs.map((doc) => {
        const e = {
            id: doc.id,
            ...doc.data(),
        };
        events.push(e as Event);
    });
    return {
        props: {
            events,
        },
    };
}
