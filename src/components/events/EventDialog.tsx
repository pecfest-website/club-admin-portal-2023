import UploadFileIcon from "@mui/icons-material/UploadFile";
import {
    Alert,
    Button,
    Checkbox,
    Dialog,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    SelectChangeEvent,
    Snackbar,
    TextField,
} from "@mui/material";
import { MobileDateTimePicker } from "@mui/x-date-pickers";
import dayjs, { Dayjs } from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DropzoneArea } from "mui-file-dropzone";
import React, { ChangeEvent, useState, useEffect } from "react";
import CloseIcon from "@mui/icons-material/Close";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import "dayjs/locale/en-gb";
import { addDoc, collection } from "firebase/firestore";
import { db, storage } from "@/serverless/config";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";

type EventDialogPropType = {
    onClose: any;
    open: any;
    setOpen: any;
};

const ITEM_HEIGHT = 32;
const ITEM_PADDING_TOP = 6;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250,
        },
    },
};

const EventDialog = ({ onClose, open, setOpen }: EventDialogPropType) => {
    const router = useRouter();
    const { data: session } = useSession();

    const [formValues, setFormValues] = useState({
        eventName: "",
        eventStart: dayjs(),
        eventEnd: dayjs(),
        eventType: eventTypes[0],
        eventCategory: categories[0],
        eventSubcategory: [] as string[],
        eventVenue: "",
        rulesLink: "",
        clubName: "",
        eventPoster: null as any,
        eventDescription: "",
        pocName: "",
        pocNumber: "" as any,
        dropzoneKey: 1,
        minTeamSize: 1,
        maxTeamSize: 1,
    });

    const [imageDimensionError, setImageDimensionError] = useState(false);
    const [dateError, setDateError] = useState(false);
    const [teamSizeError, setTeamSizeError] = useState();
    const [loading, setLoading] = useState(false);
    const [eventCreationStatus, setEventCreationStatus] = useState<
        string | null
    >(null);
    const [eventSubCateg, setEventSubCateg] = useState<string[]>([]);

    const handleChange = (
        event:
            | ChangeEvent<HTMLInputElement>
            | SelectChangeEvent
            | React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
            | File[]
    ) => {
        if ("target" in event) {
            event.preventDefault();
            const name = event.target.name;
            let value;
            if (name === "minTeamSize" || name === "maxTeamSize") {
                value = event.target.value
                    ? Number.parseInt(event.target.value)
                    : 0;
            } else {
                value = event.target.value;
            }
            setFormValues({
                ...formValues,
                [name]: value,
            });
            console.log(typeof value);
        } else {
            const img = document.createElement("img");
            let is_square = true;
            if (event && "length" in event && event[length]) {
                img.onload = function (ev) {
                    if (img.width !== img.height) {
                        is_square = false;
                    }

                    if (is_square) {
                        setImageDimensionError(false);
                        setFormValues({
                            ...formValues,
                            eventPoster: event[0],
                        });
                    } else {
                        setImageDimensionError(true);
                        const prev = formValues.dropzoneKey;
                        setFormValues({
                            ...formValues,
                            dropzoneKey: 1 - prev,
                        });
                    }
                };
                img.src = URL.createObjectURL(event[0]);
            }
        }
    };

    const handleSubcategoryChange = (
        event: SelectChangeEvent<typeof eventSubCateg>
    ) => {
        const {
            target: { value },
        } = event;
        setEventSubCateg(
            // On autofill we get a stringified value.
            typeof value === "string" ? value.split(",") : value
        );

        setFormValues({
            ...formValues,
            eventSubcategory: typeof value === "string" ? [value] : value,
        });
    };

    const handleStartDateTimeChange = (newDate: any) => {
        setFormValues({
            ...formValues,
            eventStart: newDate,
        });
    };

    const handleEndDateTimeChange = (newDate: any) => {
        setFormValues({
            ...formValues,
            eventEnd: newDate,
        });
    };

    const uploadImage = async () => {
        const storageRef = ref(storage, `events/${formValues.eventName}.jpeg`);
        await uploadBytes(storageRef, formValues.eventPoster, {
            contentType: "image/jpeg",
        });
        const downloadUrl = await getDownloadURL(storageRef);
        return downloadUrl;
    };

    useEffect(() => {
        if (formValues.eventStart > formValues.eventEnd) {
            setDateError(true);
        } else {
            setDateError(false);
        }
    }, [formValues]);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setLoading(true);

        let eventPosterUrl = "";
        if (formValues.eventPoster) {
            eventPosterUrl = await uploadImage();
        }

        const eventData = {
            name: formValues.eventName,
            type: formValues.eventType,
            category: formValues.eventCategory,
            description: formValues.eventDescription,
            startDate: formValues.eventStart.format(),
            endDate: formValues.eventEnd.format(),
            venue: formValues.eventVenue,
            ruleBook: formValues.rulesLink,
            image: eventPosterUrl,
            tags: formValues.eventSubcategory,
            pocName: formValues.pocName,
            pocNumber: formValues.pocNumber,
            minTeamSize: formValues.minTeamSize,
            maxTeamSize: formValues.maxTeamSize,
            adminEmail: session?.user?.email,
        };

        const eventsRef = collection(db, "events");
        const docRef = await addDoc(eventsRef, eventData);

        const id = docRef.id;
        setEventCreationStatus("SUCCESS: Event Creation Successful");
        setLoading(false);
        setFormValues(getDefaultFormValue());
        router.push(`/events/${id}`);
    };

    const handleSnackbarClose = () => {
        setEventCreationStatus(null);
        setOpen(false);
    };

    return (
        <Dialog
            fullWidth={true}
            maxWidth={"md"}
            open={open}
            onClose={onClose}
            sx={{ padding: "0", margin: "0", backdropFilter: "blur(5px)" }}
            PaperProps={{ sx: { borderRadius: "10px" } }}
        >
            <div className="p-4">
                <form className="" onSubmit={handleSubmit}>
                    {/* Heading */}
                    <div className="flex justify-between font-bold text-2xl pl-2 pr-2 pt-2 border-b-[1px] border-rose-300">
                        <h1 className="w-[95%]"> ADD AN EVENT </h1>
                        <div
                            className="flex justify-center items-center rounded-lg hover:bg-orange-200/100 w-[30px] h-[30px] hover:cursor-pointer"
                            onClick={onClose}
                        >
                            <CloseIcon sx={{ color: "#FF5E0E" }} />
                        </div>
                    </div>

                    <div className="pt-3 flex flex-col justify-evenly">
                        {/* Event Name */}
                        <div className="p-2">
                            <TextField
                                name="eventName"
                                label="Event Name"
                                variant="outlined"
                                onChange={handleChange}
                                value={formValues.eventName}
                                fullWidth={true}
                                required={true}
                            />
                        </div>

                        {/* Event Date and Time */}
                        <div className="grid grid-cols-2 p-2">
                            <div className="pr-1">
                                <LocalizationProvider
                                    dateAdapter={AdapterDayjs}
                                    adapterLocale="en-gb"
                                >
                                    <MobileDateTimePicker
                                        label="Event Start Date and Time"
                                        orientation="landscape"
                                        slotProps={{
                                            textField: { fullWidth: true },
                                        }}
                                        onChange={handleStartDateTimeChange}
                                    />
                                </LocalizationProvider>
                            </div>

                            <div className="pl-1">
                                <LocalizationProvider
                                    dateAdapter={AdapterDayjs}
                                    adapterLocale="en-gb"
                                >
                                    <MobileDateTimePicker
                                        label="Event End Date and Time"
                                        orientation="landscape"
                                        slotProps={{
                                            textField: { fullWidth: true },
                                        }}
                                        onChange={handleEndDateTimeChange}
                                    />
                                </LocalizationProvider>
                            </div>
                        </div>

                        {dateError && (
                            <p className="px-2 mt-[-5px] mb-[5px] text-red-500 font-bold text-sm">
                                <span>
                                    <ErrorOutlineIcon fontSize="small" />
                                </span>{" "}
                                Make sure that event end date time is after
                                event start time!
                            </p>
                        )}

                        {/* Event Type, Category and Subcategory dropdown */}
                        <div className="grid grid-rows-1 grid-cols-1 sm:grid-cols-3 gap-3 p-2">
                            <div className="">
                                <FormControl
                                    size="small"
                                    fullWidth
                                    variant="filled"
                                >
                                    <InputLabel>Type</InputLabel>
                                    <Select
                                        name="eventType"
                                        onChange={handleChange}
                                        value={formValues.eventType}
                                        sx={{ height: "4em" }}
                                    >
                                        {eventTypes.map((eventType, id) => (
                                            <MenuItem
                                                value={eventType}
                                                key={id}
                                            >
                                                {eventType}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </div>

                            <FormControl
                                size="small"
                                fullWidth
                                variant="filled"
                            >
                                <InputLabel>Category</InputLabel>
                                <Select
                                    name="eventCategory"
                                    onChange={handleChange}
                                    value={formValues.eventCategory}
                                    sx={{ height: "4em" }}
                                >
                                    {categories.map((category, id) => (
                                        <MenuItem value={category} key={id}>
                                            {category}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>

                            <FormControl
                                size="small"
                                fullWidth
                                variant="filled"
                            >
                                <InputLabel>Sub-category</InputLabel>
                                <Select
                                    name="eventSubcategory"
                                    onChange={handleSubcategoryChange}
                                    value={formValues.eventSubcategory}
                                    renderValue={(selected: string[]) =>
                                        selected.join(", ")
                                    }
                                    sx={{ height: "4em" }}
                                    MenuProps={MenuProps}
                                    multiple
                                >
                                    {subCategories.map((subCategory, id) => (
                                        <MenuItem value={subCategory} key={id}>
                                            <Checkbox
                                                checked={
                                                    eventSubCateg.indexOf(
                                                        subCategory
                                                    ) > -1
                                                }
                                            />
                                            {subCategory}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </div>

                        {/* If Team Competition ask for min and max team size */}
                        {formValues.eventType === eventTypes[1] && (
                            <div className="grid grid-cols-2">
                                <div className="p-2">
                                    <TextField
                                        name="minTeamSize"
                                        label="Minimum Team Size"
                                        variant="outlined"
                                        onChange={handleChange}
                                        value={formValues.minTeamSize}
                                        fullWidth={true}
                                        required={true}
                                    />
                                </div>

                                <div className="p-2">
                                    <TextField
                                        name="maxTeamSize"
                                        label="Maximum Team Size"
                                        variant="outlined"
                                        onChange={handleChange}
                                        value={formValues.maxTeamSize}
                                        fullWidth={true}
                                        required={true}
                                    />
                                </div>
                            </div>
                        )}

                        {/* Event Venue and Rulebook */}
                        <div className="p-2">
                            <TextField
                                required
                                fullWidth
                                name="eventVenue"
                                value={formValues.eventVenue}
                                onChange={handleChange}
                                variant="outlined"
                                label="Event Venue"
                            />
                        </div>
                        <div className="p-2">
                            <TextField
                                fullWidth
                                name="rulesLink"
                                value={formValues.rulesLink}
                                onChange={handleChange}
                                variant="outlined"
                                label="Link to Rule Book"
                            />
                        </div>
                        <div className="p-2">
                            <TextField
                                fullWidth
                                name="clubName"
                                value={formValues.clubName}
                                onChange={handleChange}
                                variant="outlined"
                                label="Club organising the event"
                                helperText="Enter official Acronym of club (ACM, SCC, SAASC etc)"
                            />
                        </div>

                        {/* Attach Event Poster (WORKING! SO DIDN'T TOUCH)*/}
                        <div className="p-2">
                            <DropzoneArea
                                // name="eventPoster"
                                acceptedFiles={["image/jpeg"]}
                                dropzoneText={"Attach Event Poster"}
                                filesLimit={1}
                                Icon={UploadFileIcon}
                                maxFileSize={204800}
                                clearOnUnmount
                                key={formValues.dropzoneKey}
                                fileObjects={undefined}
                                onChange={handleChange}
                            />

                            {imageDimensionError && (
                                <Alert severity="warning">
                                    Please Upload Posters In A 1:1 Aspect Ratio
                                </Alert>
                            )}
                        </div>

                        <div className="p-2">
                            <TextField
                                name="eventDescription"
                                value={formValues.eventDescription}
                                onChange={handleChange}
                                fullWidth={true}
                                multiline
                                rows={8}
                                variant="outlined"
                                label="Event Description"
                            />
                        </div>

                        <div className="grid grid-cols-2">
                            <div className="p-2">
                                <TextField
                                    name="pocName"
                                    value={formValues.pocName}
                                    onChange={handleChange}
                                    fullWidth
                                    label="Point of Contact Name"
                                />
                            </div>
                            <div className="p-2">
                                <TextField
                                    name="pocNumber"
                                    value={formValues.pocNumber}
                                    onChange={handleChange}
                                    fullWidth
                                    label="Point of Contact Number"
                                />
                            </div>
                        </div>

                        <div className="w-[120px] m-auto py-2">
                            <Button
                                variant="outlined"
                                fullWidth={false}
                                type="submit"
                                disabled={loading}
                            >
                                {loading ? "Loading..." : "ADD EVENT"}
                            </Button>
                        </div>
                    </div>
                </form>
            </div>
            <Snackbar
                open={eventCreationStatus ? true : false}
                autoHideDuration={6000}
                onClose={handleSnackbarClose}
            >
                <Alert
                    onClose={handleSnackbarClose}
                    severity="success"
                    sx={{ width: "100%" }}
                >
                    {eventCreationStatus}
                </Alert>
            </Snackbar>
        </Dialog>
    );
};

export default EventDialog;

const eventTypes = ["Individual", "Team"];

const categories = ["Cultural", "Mega Shows", "Technical", "Workshops"];

const subCategories = [
    "Dance",
    "Music",
    "Coding",
    "Hardware",
    "Art",
    "Photography",
    "Cinematography",
    "Literary",
    "Quiz",
    "Dramatics",
    "Gaming",
    "Fun",
];

const getDefaultFormValue = () => {
    return {
        eventName: "",
        eventStart: dayjs(),
        eventEnd: dayjs(),
        eventType: eventTypes[0],
        eventCategory: categories[0],
        eventSubcategory: [] as string[],
        eventVenue: "",
        rulesLink: "",
        eventPoster: {} as object,
        eventDescription: "",
        pocName: "",
        clubName: "",
        pocNumber: "" as any,
        dropzoneKey: 1,
        minTeamSize: 1,
        maxTeamSize: 1,
    };
};
