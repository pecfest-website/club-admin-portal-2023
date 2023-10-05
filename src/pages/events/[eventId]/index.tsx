import Layout from '@/components/Layout';
import Navbar from '@/components/Navbar';
import EditEventDialog from '@/components/events/EditEventDiaglog';
import { db } from '@/serverless/config';
import { Event } from '@/types/event';
import { Button, CardActions } from '@mui/material';
import { doc, getDoc } from 'firebase/firestore';
import Image from 'next/image';
import { useRouter } from 'next/router'
import React, { useState } from 'react'
import dayjs, { Dayjs } from 'dayjs';
import Head from 'next/head';


const badge = (text: string, key: number) => {
  return <span key={key} className="py-1 px-3 align-middle text-white bg-blue-700 text-xs font-medium mr-2 rounded-full">{text}</span>
}

const unroundedBage = (text: string) => {
  return (
    <span className="inline-flex items-center px-2 py-1 mr-2 text-sm font-medium rounded text-white bg-gradient-to-br from-purple-600 to-blue-500">
      {text}
    </span>
  )
}

interface Props {
  event: Event
}

function Index({ event }: Props) {
  const [eventDialogOpen, setEventDialogOpen] = useState<boolean>(false);
  const handleAddEventOpen = () => {
    setEventDialogOpen(true);
  };

  const handleAddEventClose = () => {
    setEventDialogOpen(false);
  };

  const router = useRouter()
  const { eventId } = router.query;
  const heading = event.name;
  const description = event.description;
  const timeline = `${getDateTimeString(event.startDate)} - ${getDateTimeString(event.endDate)}`;
  const ruleBookLink = event.ruleBook;
  const pocName = event.pocName;
  const pocNumber = event.pocNumber;
  const tags = event.tags;
  const category = event.category;
  const venue = event.venue;
  const maxTeamSize = event.maxTeamSize;
  const minTeamSize = event.minTeamSize;
  const type = event.type;
  const image = event.image;
  const titleClass = 'mb-2 text-md font-medium text-white';

  const eventDefaultValue = () => {
    return {
      eventName: heading,
      eventStart: dayjs(event.startDate),
      eventEnd: dayjs(event.endDate),
      eventType: type,
      eventCategory: category,
      eventSubcategory: tags,
      eventVenue: venue,
      rulesLink: ruleBookLink,
      eventDescription: description,
      pocName: pocName,
      pocNumber: pocNumber,
      dropzoneKey: 1,
      minTeamSize: minTeamSize,
      maxTeamSize: maxTeamSize,
      eventPoster: undefined,
    }
  }

  const formValues = eventDefaultValue();

  return (
    <Layout>
      {
        eventDialogOpen &&
        <EditEventDialog
          onClose={handleAddEventClose}
          open={eventDialogOpen}
          setOpen={handleAddEventOpen}
          defaultEventValue={formValues}
          eventId={eventId as string}
        />
      }

      <Head>
        <title>{`${heading} | PECFEST'23`}</title>
      </Head>
      <div className="h-full bg-[url('/bg1.png')] w-full bg-cover h-screen overflow-hidden scrollbar-hide">
        <div className="w-[80vw] mx-auto my-40 grid grid-cols-5 justify-items-center items-center p-5 glassmorphism text-white">
          <div className='col-span-2'>
            <Image
              src={image}
              alt={`${heading} Logo`}
              height={300}
              width={300}
            />
          </div>

          <div className="w-[100%] col-span-3 flex flex-col justify-evenly">
            <h1 className='font-bold text-3xl border-b-[1px] border-rose-300'>{heading}</h1>
            <p className='text-sm'>{timeline}</p>
            <p className='pt-2'>
              <span className={titleClass}>Venue: </span>
              {venue}
            </p>

            <p className='py-3'>{description}</p>
            {ruleBookLink.length && (
              <p className='pb-1 font-bold text-lg font-mono'>
                <a href={ruleBookLink} className='text-blue-700 hover:underline dark:text-blue-500'>Rule Book</a>
              </p>)
            }

            <div className='py-1'>
              {unroundedBage(type)}
              {unroundedBage(category)}
            </div>

            <div className='pb-1'>
              {
                tags.length && (
                  tags.map((tag, id) => badge(tag, id))
                )
              }
            </div>

            {
              (minTeamSize !== maxTeamSize && minTeamSize !== 1) && (
                <div className='py-2'>
                  <div>
                    <span className={titleClass}>Minimum Team Size: </span>
                    <span>{maxTeamSize}</span>
                  </div>
                  <div>
                    <span className={titleClass}>Maximum Team Size:</span>
                    <span>{maxTeamSize}</span>
                  </div>
                </div>
              )
            }

            <hr className='mt-6 border-b-[2px] border-red-400' />

            <div className='py-1'>
              <div>
                <span className={titleClass}>Point of Contact: </span>
                <span>{pocName}</span>
              </div>

              <div>
                <span className={titleClass}>Contact Number: </span>
                <span>{pocNumber}</span>
              </div>
            </div>

            <CardActions sx={{ justifyContent: 'center' }}>
              <button
                onClick={handleAddEventOpen}
                className='text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800'
              >
                Edit Event
              </button>
            </CardActions>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default Index;

export async function getServerSideProps(context: any) {
  const eventId = context.query.eventId;

  const docRef = doc(db, `events/${eventId}`)

  const eventData = await getDoc(docRef)

  const event = {
    id: eventData.id,
    ...eventData.data()
  } as Event;

  return {
    props: {
      event
    }
  }
}

const get = (dateObj: Dayjs, key: string) => {
  return dateObj[key as keyof typeof dateObj];
}

const getDateTimeString = (dateString: string) => {
  const dateObj = dayjs(dateString);
  console.log(dateObj)
  const date = get(dateObj, '$D');
  const month = get(dateObj, '$M');
  const year = get(dateObj, '$y');

  let hour = get(dateObj, '$H').toString();
  let minute = get(dateObj, '$m').toString();

  if (hour.length === 1) hour = '0' + hour;
  if (minute.length === 1) minute = '0' + minute;

  return `${date}/${month}/${year} ${hour}:${minute}`;
}