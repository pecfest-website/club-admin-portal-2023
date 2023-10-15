import { ExpandMore, FileDownload, PeopleAlt } from "@mui/icons-material";
import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Button,
    Card,
    CardActions,
    CardContent,
    CardHeader,
    CardMedia,
    Dialog,
    DialogContent,
    DialogTitle,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Tooltip,
    Typography,
} from "@mui/material";
import { useRouter } from "next/router";
import React, { useState } from "react";


const EventCard = ({ id, image, event_name, event_id, type }: any) => {
    const router = useRouter();

    const openEvent = () => {
        router.push(`/events/${event_id}`);
    };

    return (
        <div className="max-w-[900px]">
           
            <Card variant="outlined" sx={{background: 'transparent'}} className="">
                <CardContent>
                    <CardHeader
                        titleTypographyProps={{
                            fontSize: `1.5rem`,
                            textAlign: `center`,
                            fontWeight: 600,
                            color: 'white'
                        }}
                        title={
                            event_name.length > 20
                                ? `${event_name.slice(0, 20)}...`
                                : event_name
                        }
                    ></CardHeader>
                    <CardMedia
                        component="img"
                        sx={{ height: 300, width: 300 }}
                        height={190}
                        width={50}
                        image={image}
                        alt="Event Photo"
                    />
                </CardContent>
                <CardActions sx={{ justifyContent: "center" }}>
                    <button onClick={openEvent} className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">
                        View Event
                    </button>
                    
                    <Tooltip title="View Participants">
                        <PeopleAlt
                            onClick={() => {
                                router.push(`/events/${event_id}/registrations`)
                            }}
                            sx={{
                                color: "white",
                                fontSize: "2.4rem",
                                padding: 0,
                                margin: "5px",
                                cursor: "pointer",
                            }}
                        />
                    </Tooltip>
                </CardActions>
            </Card>
        </div>
    );
};

export default EventCard;
