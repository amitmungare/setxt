import { ContentList } from "@/components/ContentList";
import { Card, type CardProps } from "@/components/Card";

import { getContentBySlug } from "@/data/loaders";
import { EventProps } from "@/types";
import { notFound } from "next/navigation";
import { EventSignupForm } from "@/components/EventSignupForm";

async function loader(slug: string) {
  const { data } = await getContentBySlug(slug, "/api/events");
  const event = data[0];
  if (!event) throw notFound();
  return { event: event as EventProps, blocks: event?.blocks };
}

interface ParamsProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string; query?: string }>;
}

const EventCard = (props: Readonly<CardProps>) => (
  <Card {...props} basePath="events" />
);

export default async function AllEventsRoute({
  params,
  searchParams,
}: ParamsProps) {
  const slug = (await params).slug;
  const { query, page } = await searchParams;
  const { event, blocks } = await loader("stay-in-touch");

  return (
    <div className="container">
      <EventSignupForm blocks={blocks} eventId={event.documentId} />
      <ContentList
        headline="All Events"
        path="/api/events"
        query={query}
        page={page}
        showSearch
        showPagination
        component={EventCard}
      />
    </div>
  );
}