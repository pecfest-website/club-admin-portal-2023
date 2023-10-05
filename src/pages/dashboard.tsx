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
    const event_list = props.events;

    const handleAddEventOpen = () => {
        setEventDialogOpen(true);
    };

    const handleAddEventClose = () => {
        setEventDialogOpen(false);
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
                        <Button
                            sx={{
                                display: "flex",
                                gap: "1em",
                                alignItems: "center",
                            }}
                            variant={`contained`}
                            onClick={handleAddEventOpen}
                        >
                            Add an Event <AddBoxOutlinedIcon />
                        </Button>
                        <EventDialog
                            open={eventDialogOpen}
                            setOpen={setEventDialogOpen}
                            onClose={handleAddEventClose}
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
