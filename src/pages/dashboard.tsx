import Layout from "@/components/Layout";
import ProtectedRoute from "@/components/ProtectedRoute";
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
import { useAuth } from "@/context/AuthContext";
import { Event } from "@/types/event";
import EventCard from "@/components/events/EventCard";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/serverless/config";

interface DashboardPageProps {
    events: Event[];
}
const DashboardPage = (props: DashboardPageProps) => {
    const { user } = useAuth();

    const [eventDialogOpen, setEventDialogOpen] = useState(false);
    const event_list = props.events;

    console.log(event_list)

    const handleAddEventOpen = () => {
        setEventDialogOpen(true);
    };

    const handleAddEventClose = () => {
        setEventDialogOpen(false);
    };

    return (
        <ProtectedRoute>
            <Layout>
                <Head>
                    <title>Admin Panel | PECFEST&apos;23</title>
                </Head>
                <div className="flex py-2  h-full w-full  bg-cover bg-opacity-60 bg-[url('/bg2.png')]">
                    <Container component={`main`}>
                        <CssBaseline />
                        <Box
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                flexWrap: "wrap",
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
                                Events by: {user && user.email}
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
                                onClose={handleAddEventClose}
                            />
                        </Box>
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
                    </Container>
                </div>
            </Layout>
        </ProtectedRoute>
    );
};

export default DashboardPage;

export async function getServerSideProps(context: any) {
    const eventsRef = collection(db, "events");
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
