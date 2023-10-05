import Layout from '@/components/Layout';
import Navbar from '@/components/Navbar';
import { db } from '@/serverless/config';
import { Event } from '@/types/event';
import { doc, getDoc } from 'firebase/firestore';
import Image from 'next/image';
import { useRouter } from 'next/router'
import React from 'react'

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

  return (
    <Layout>
      <div className="h-full bg-[url('/bg1.png')] w-full bg-cover h-screen overflow-hidden scrollbar-hide">
        <div className="w-[80vw] mx-auto my-40 grid grid-cols-5 justify-items-center items-center p-2 glassmorphism text-white">
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

const getDateTimeString = (date: string) => {
  return `${new Date(date).toLocaleDateString()} ${new Date(date).toLocaleTimeString()}`
}