import React from "react";
import Image from "next/image";
import {Button} from "@/components/util/button";
import ticketIcon from '../../public/event-ticket.svg'

type EventCardProps = {
    image: string,
    title: string,
    description: string
}

export const Card = ({image, title, description}: EventCardProps) => (

    <div className="bg-white rounded-lg overflow-hidden shadow-md">
        <Image src={image} alt={title} width={250} height={250} className="w-full h-48 object-cover" />
        <div className="p-4">
            <h4 className="text-lg font-semibold mb-2">{title}</h4>
            <p className="text-gray-600">{description}</p>
            <Button>
                <Image src={ticketIcon} alt={'ticket-icon'}/>
            </Button>
        </div>
    </div>
);
