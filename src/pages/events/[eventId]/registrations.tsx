import React from "react";
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
    IconButton,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Tooltip,
    Typography,
} from "@mui/material";
import { GetServerSidePropsContext } from "next";
import * as XLSX from "xlsx";
import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import { db } from "@/serverless/config";
import { Event } from "@/types/event";
import { Participant } from "@/types/participant";
import { Team, TeamMember } from "@/types/team";
import Layout from "@/components/Layout";
import Head from "next/head";

interface Props {
    event: Event;
    // participants: Participant[] | Team[];
    participants: any;
}
function Registrations({ event, participants }: Props) {
    const saveAsExcel = () => {
        if (participants && participants.length > 0) {
            if (event.type == "Individual" && event.category != "Mega Shows") {
                const heading = [["Name", "Email Id", "College", "Contact"]];
                const file = participants.map((user: Participant) => [
                    `${user.name}`,
                    user.email,
                    user.college ? user.college : "",
                    user.contact ? user.contact : "",
                ]);
                const worksheet = XLSX.utils.json_to_sheet(file, {
                    skipHeader: false,
                });
                const workbook = XLSX.utils.book_new();
                XLSX.utils.sheet_add_aoa(worksheet, heading, { origin: "A1" });
                XLSX.utils.book_append_sheet(
                    workbook,
                    worksheet,
                    `${event.name}`
                );
                XLSX.writeFile(workbook, `${event.name}.xlsx`);
            } else {
                const heading = [
                    [
                        "Team Name",
                        "Name",
                        "Email Id",
                        "Contact",
                        "Payment Id",
                        "Payment Proof",
                    ],
                ];
                const file = participants
                    .map((user: Team) =>
                        user.usersData.map((member: TeamMember) => [
                            user.teamName,
                            `${member.name}`,
                            member.userId,
                            // member.college ? member.college : "",
                            member.phoneNumber ? member.phoneNumber : "",
                            user.paymentId,
                            user.paymentProof,
                        ])
                    )
                    .flat();
                const worksheet = XLSX.utils.json_to_sheet(file, {
                    // origin: 'A2',
                    skipHeader: false,
                });
                const workbook = XLSX.utils.book_new();
                XLSX.utils.sheet_add_aoa(worksheet, heading, { origin: "A1" });
                XLSX.utils.book_append_sheet(
                    workbook,
                    worksheet,
                    `${event.name}`
                );
                XLSX.writeFile(workbook, `${event.name}.xlsx`);
                console.log(file);
            }
        }
    };

    return (
        <Layout>
            <div className="h-full w-full p-4 m-0 scrollbar-hide overflow-y-scroll">
                <Head>
                    <title>{`${event.name} | PECFEST'23`}</title>
                </Head>
                <div className="flex items-center justify-center flex-col pt-20">
                    <h1 className="text-center text-4xl py-4 glassmorphism w-full text-white font-extrabold">
                        {event.name}
                    </h1>
                    {event.type == "Individual" &&
                    event.category != "Mega Shows" ? (
                        <div>
                            <DialogTitle>
                                Registered Users -{" "}
                                {participants ? participants?.length : ""}{" "}
                                {participants && participants.length && (
                                    <IconButton onClick={() => saveAsExcel()}>
                                        <FileDownload color="primary" />
                                    </IconButton>
                                )}
                            </DialogTitle>
                            <DialogContent>
                                <TableContainer>
                                    <Table
                                        sx={{ minWidth: 650 }}
                                        aria-label="simple table"
                                    >
                                        <TableHead>
                                            <TableRow>
                                                <TableCell align="center">
                                                    Name
                                                </TableCell>
                                                <TableCell align="center">
                                                    Email Id
                                                </TableCell>
                                                <TableCell align="center">
                                                    College
                                                </TableCell>
                                                <TableCell align="center">
                                                    Contact
                                                </TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {participants &&
                                                participants.length &&
                                                participants.map(
                                                    (
                                                        user: Participant,
                                                        idx: number
                                                    ) => (
                                                        <TableRow
                                                            key={user.id}
                                                            sx={{
                                                                "&:last-child td, &:last-child th":
                                                                    {
                                                                        border: 0,
                                                                    },
                                                            }}
                                                        >
                                                            <TableCell align="center">
                                                                {user.name}{" "}
                                                            </TableCell>
                                                            <TableCell align="center">
                                                                {user.email}
                                                            </TableCell>
                                                            {user.college && (
                                                                <TableCell align="center">
                                                                    {
                                                                        user.college
                                                                    }
                                                                </TableCell>
                                                            )}
                                                            {user.contact && (
                                                                <TableCell align="center">
                                                                    {
                                                                        user.contact
                                                                    }
                                                                </TableCell>
                                                            )}
                                                        </TableRow>
                                                    )
                                                )}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </DialogContent>
                        </div>
                    ) : (
                        <div>
                            <DialogTitle>
                                Registered Teams -{" "}
                                {participants ? participants.length : ""}{" "}
                                {participants && participants.length && (
                                    <IconButton onClick={() => saveAsExcel()}>
                                        <FileDownload color="primary" />
                                    </IconButton>
                                )}
                            </DialogTitle>
                            <DialogContent>
                                {participants &&
                                    participants.length &&
                                    participants.map(
                                        (user: Team, idx: number) => (
                                            <Accordion key={idx}>
                                                <AccordionSummary
                                                    expandIcon={<ExpandMore />}
                                                    aria-controls="team-content"
                                                    id="team-header"
                                                >
                                                    <div className="flex justify-between w-full items-center">
                                                        <Typography>
                                                            Team-name:{" "}
                                                            {user.teamName}
                                                        </Typography>
                                                        <Typography>
                                                            Size:{" "}
                                                            {user.teamSize}
                                                        </Typography>
                                                        <Typography>
                                                            Payment ID :{" "}
                                                            {user.paymentId}
                                                        </Typography>
                                                        <Button>
                                                            <a
                                                                href={
                                                                    user.paymentProof
                                                                }
                                                                target="_blank"
                                                                referrerPolicy="no-referrer"
                                                            >
                                                                Payment Proof
                                                            </a>
                                                        </Button>
                                                    </div>
                                                </AccordionSummary>
                                                <AccordionDetails>
                                                    <Table
                                                        sx={{ minWidth: 650 }}
                                                        aria-label="simple table"
                                                    >
                                                        <TableHead>
                                                            <TableRow>
                                                                <TableCell align="center">
                                                                    Name
                                                                </TableCell>
                                                                <TableCell align="center">
                                                                    Email Id
                                                                </TableCell>
                                                                <TableCell align="center">
                                                                    Contact
                                                                </TableCell>
                                                            </TableRow>
                                                        </TableHead>
                                                        <TableBody>
                                                            {user.usersData &&
                                                                user.usersData
                                                                    .length &&
                                                                user.usersData.map(
                                                                    (
                                                                        member: TeamMember,
                                                                        id: any
                                                                    ) => (
                                                                        <TableRow
                                                                            key={
                                                                                id
                                                                            }
                                                                            sx={{
                                                                                "&:last-child td, &:last-child th":
                                                                                    {
                                                                                        border: 0,
                                                                                    },
                                                                            }}
                                                                        >
                                                                            <TableCell align="center">
                                                                                {
                                                                                    member.name
                                                                                }
                                                                            </TableCell>
                                                                            <TableCell align="center">
                                                                                {
                                                                                    member.userId
                                                                                }
                                                                            </TableCell>
                                                                            {member.phoneNumber && (
                                                                                <TableCell align="center">
                                                                                    {
                                                                                        member.phoneNumber
                                                                                    }
                                                                                </TableCell>
                                                                            )}
                                                                        </TableRow>
                                                                    )
                                                                )}
                                                        </TableBody>
                                                    </Table>
                                                </AccordionDetails>
                                            </Accordion>
                                        )
                                    )}
                            </DialogContent>
                        </div>
                    )}
                </div>
            </div>
        </Layout>
    );
}

export default Registrations;

export async function getServerSideProps(context: GetServerSidePropsContext) {
    const eventId = context.query.eventId;

    const docRef = doc(db, `events/${eventId}`);
    const regRef = collection(db, `events/${eventId}/registrations`);

    const eventData = await getDoc(docRef);

    const registrations = await getDocs(regRef);

    const event = {
        id: eventData.id,
        ...eventData.data(),
    } as Event;

    const participants = registrations.docs.map((doc) => {
        return {
            id: doc.id,
            ...doc.data(),
        };
    });

    console.log(participants);

    return {
        props: {
            event,
            participants,
        },
    };
}
