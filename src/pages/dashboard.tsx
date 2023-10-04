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

const DashboardPage = () => {
    const [currentUser, setCurrentUser] = useState();
    const [currentToken, setCurrentToken] = useState();
    const { user } = useAuth();
    // const { data: session } = useSession();
    // useEffect(() => {
    //   const { data } = getCookieData(session);
    //   if (data) {
    //     setCurrentUser(() => data.user);
    //     setCurrentToken(() => data.token);
    //   }
    // }, []);

    const [eventDialogOpen, setEventDialogOpen] = useState(false);
    // const event_list = props.evts;

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
                <div className="flex py-2  h-full w-full bg-[url('/bg2.png')] bg-cover bg-opacity-60">
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
                                sx={{ width: `100%`, textAlign: `center` }}
                                variant={`h5`}
                                className={
                                    "text-white text-lg font-bold text-center"
                                }
                            >
                                Events by: {user?.email}
                                {/* {currentUser && currentUser.first_name} */}
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
                                user_token={currentToken}
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
                            {/* {event_list &&
                                event_list.map((curr_event, idx) => (
                                    <div key={idx}>
                                        <EventCard
                                            event_name={curr_event.name}
                                            id={idx}
                                            image={curr_event.image_url}
                                            event_id={curr_event.id}
                                            token={currentToken}
                                            type={curr_event.type}
                                        />
                                    </div>
                                ))} */}
                        </Grid>
                    </Container>
                </div>
            </Layout>
        </ProtectedRoute>
    );
};

export default DashboardPage;
