
import React from "react";
import Image from "next/image";
import {Button} from "@/components/util/button";
import ticketIcon from '../../public/event-ticket.svg'
import {TagPill} from "@/components/util/TagPill";

type EventCardProps = {
    image?: string,
    title: string,
    description: string
    badges?: string[]
}

export const Card = ({ image, title, description, badges = [] }: EventCardProps) => (
    <div className="bg-superlightgr rounded-lg overflow-hidden shadow-md">
        {image && (
            <Image src={image} alt={title} width={250} height={250} className="w-full h-48 object-cover" />
        )}
        <div className="p-4">
            <h4 className="text-lg font-semibold mb-2">{title}</h4>
            <p className="text-gray-600">{description}</p>
            {/* Rendering TagPills */}
            <div className="flex flex-wrap gap-2 mt-2">
                {badges.map((badge, index) => (
                    <TagPill key={index} tag={{ name: badge }} />
                ))}
            </div>
            <Button>
                <Image src={ticketIcon} alt={'ticket-icon'} />
            </Button>
        </div>
    </div>
);