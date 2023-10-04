import { RestartAlt } from "@mui/icons-material";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  FormControl,
  FormHelperText,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Snackbar,
  TextField,
} from "@mui/material";
import { DateTimePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DropzoneArea } from "mui-file-dropzone";
import React, { useState } from "react";

type EventDialogPropType = {
  onClose: any;
  open: any;
}

const EventDialog = ({ onClose, open }: EventDialogPropType) => {
  const [eventName, setEventName] = useState();
  const [eventStart, setEventStart] = useState(
    new Date(`2023-11-3T00:00:00Z`)
  );
  const [eventEnd, setEventEnd] = useState(new Date(`2023-11-5T00:00:00Z`));
  const [eventVenue, setEventVenue] = useState();
  const [minTeamSize, setMinTeamSize] = useState();
  const [maxTeamSize, setMaxTeamSize] = useState();
  const [rulesLink, setRulesLink] = useState();
  const [eventPoster, setEventPoster] = useState();
  const [eventDescription, setEventDescription] = useState();
  const [eventType, setEventType] = useState(`INDIVIDUAL`);
  const [eventCategory, setEventCategory] = useState(`CULTURAL`);
  const [eventCategorySubType, setEventCategorySubType] = useState(`DANCE`);
  const [pocName, setPocName] = useState();
  const [pocNumber, setPocNumber] = useState();
  // work-around for file clear in dropzone
  const [dropzoneKey, setDropzoneKey] = useState(1);
  const [imgDimError, setImgDimError] = useState(false);

  const [dateError, setDateError] = useState(false);
  const [eventCreationStatus, setEventCreationStatus] = useState(false);
  const [teamSizeError, setTeamSizeError] = useState();
  const [isLoading, setIsLoading] = useState(false);

  const handleEventSubmit = () => {

  }

  const handleEventChange = (e: any) => {

  }


  const handleSnackbarClose = (e: any) => {
    setEventCreationStatus(false);
  }

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-evenly' }}>
        Add a New Event
      </DialogTitle>
      <DialogContent>
        <Box
          component="form"
          sx={{
            '& .MuiTextField-root': { mt: 1 },
          }}
          autoComplete="off"
          onSubmit={handleEventSubmit}
        >
          <Grid container spacing={2}>
            <Grid item xs={12} sm={12}>
              <TextField
                name="eventName"
                required
                fullWidth
                id="eventName"
                label="Event Name"
                autoFocus
                onChange={handleEventChange}
                value={eventName}
                inputProps={{ maxLength: 50 }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DateTimePicker
                  label="Event Start Date and Time"
                  value={eventStart}
                  onChange={(e: any) => handleEventChange(e)}
                  // renderInput={(params: any) => (
                  //   <TextField
                  //     name="eventStart"
                  //     required
                  //     fullWidth
                  //     {...params}
                  //   />
                  // )}
                />
                {dateError && (
                  <FormHelperText>
                    Event should start before it ends 😐
                  </FormHelperText>
                )}
              </LocalizationProvider>
            </Grid>
            <Grid item xs={12} sm={6}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DateTimePicker
                  label="Event End Date and Time"
                  value={eventEnd}
                  onChange={(e: any) => handleEventChange(e)}
                  // renderInput={(params: any) => (
                  //   <TextField name="eventEnd" fullWidth {...params} />
                  // )}
                />
                {dateError && (
                  <FormHelperText>
                    Event should end after it starts 😐
                  </FormHelperText>
                )}
              </LocalizationProvider>
            </Grid>
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">Type</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={eventType}
                  label="Type"
                  name="eventType"
                  onChange={(e: any) => handleEventChange(e)}
                >
                  <MenuItem value={`INDIVIDUAL`}>Individual</MenuItem>
                  <MenuItem value={`TEAM`}>Team</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">Category</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={eventCategory}
                  label="Category"
                  name="eventCategory"
                  onChange={handleEventChange}
                >
                  <MenuItem value={`CULTURAL`}>Cultural</MenuItem>
                  <MenuItem value={`MEGASHOWS`}>Mega Shows</MenuItem>
                  <MenuItem value={`TECHNICAL`}>Technical</MenuItem>
                  <MenuItem value={`WORKSHOPS`}>Workshops</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">
                  Sub-Category
                </InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={eventCategorySubType}
                  label="Sub-Category"
                  name="eventSubCategory"
                  onChange={handleEventChange}
                  MenuProps={{ PaperProps: { sx: { maxHeight: 200 } } }}
                >
                  <MenuItem value={`DANCE`}>Dance</MenuItem>
                  <MenuItem value={`MUSIC`}>Music</MenuItem>
                  <MenuItem value={`CODING`}>Coding</MenuItem>
                  <MenuItem value={`HARDWARE`}>Hardware</MenuItem>
                  <MenuItem value={`ART`}>Art</MenuItem>
                  <MenuItem value={`PHOTOGRAPHY`}>Photography</MenuItem>
                  <MenuItem value={`CINEMATOGRAPHY`}>Cinematography</MenuItem>
                  <MenuItem value={`LITERARY`}>Literary</MenuItem>
                  <MenuItem value={`QUIZ`}>Quiz</MenuItem>
                  <MenuItem value={`DRAMATICS`}>Dramatics</MenuItem>
                  <MenuItem value={`GAMING`}>Gaming</MenuItem>
                  <MenuItem value={`FUN`}>Fun</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                onChange={handleEventChange}
                label="Event Venue"
                name="eventVenue"
                value={eventVenue}
                inputProps={{ maxLength: 25 }}
              />
            </Grid>
            {eventType == `TEAM` && (
              <Grid item xs={6} sm={3}>
                <TextField
                  required
                  fullWidth
                  type={'number'}
                  label="Min Team Size"
                  onChange={(e: any) => handleEventChange(e)}
                  name="minTeamSize"
                  value={minTeamSize}
                />
              </Grid>
            )}
            {eventType == `TEAM` && (
              <Grid item xs={6} sm={3}>
                <TextField
                  required
                  fullWidth
                  type={'number'}
                  label="Max Team Size"
                  onChange={(e: any) => handleEventChange(e)}
                  name="maxTeamSize"
                  value={maxTeamSize}
                />
              </Grid>
            )}
            {eventType == `TEAM` && teamSizeError && (
              <Grid item>
                <Alert severity="error">
                  Min Team Size should be less than Max Team Size. 😐
                </Alert>
              </Grid>
            )}
            <Grid item xs={12} sm={12}>
              <TextField
                fullWidth
                onChange={(e: any) => handleEventChange(e)}
                label="Link to the Rulebook"
                name="rulesLink"
                value={rulesLink}
              />
            </Grid>
            <Grid item xs={12} sm={12}>
              <DropzoneArea
                acceptedFiles={['image/*']}
                dropzoneText={'Attach Event Poster'}
                filesLimit={1}
                fileObjects={undefined}
                Icon={UploadFileIcon}
                maxFileSize={204800}
                onChange={(e:any) => handleEventChange(e)}
                // name="eventPoster"
                clearOnUnmount
                key={dropzoneKey}
              />
              {imgDimError && (
                <Alert severity="warning">
                  Please Upload Posters In A 1:1 Aspect Ratio
                </Alert>
              )}
            </Grid>
            <Grid item xs={12} sm={12}>
              <TextField
                fullWidth
                multiline
                label="Event Description"
                minRows={12}
                maxRows={12}
                required
                onChange={(e: any) => handleEventChange(e)}
                name="eventDescription"
                value={eventDescription}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                type={'text'}
                label="Point of Contact Name"
                onChange={(e: any) => handleEventChange(e)}
                name="pocName"
                value={pocName}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                type={'number'}
                label="Point of Contact Number"
                onChange={(e: any) => handleEventChange(e)}
                name="pocNumber"
              />
            </Grid>
            <Grid item xs={12} sm={12}>
              <Button fullWidth variant="contained" type="submit">
                {!isLoading ? (
                  `Add Event`
                ) : (
                  <RestartAlt />
                )}
              </Button>
            </Grid>
          </Grid>
        </Box>
      </DialogContent>
      <Snackbar
        open={eventCreationStatus}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity="success"
          sx={{ width: '100%' }}
        >
          {eventCreationStatus}
        </Alert>
      </Snackbar>
    </Dialog>);
};

export default EventDialog;
