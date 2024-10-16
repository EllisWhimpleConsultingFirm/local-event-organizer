'use client'

import {Button} from "@/components/util/button";
import {IconFilterFunnel} from "@/public/icon-filter-funnel";
import React, {useState} from "react";
import {Modal} from "@/components/util/modal";
import {DistanceSlider} from "@/components/filter/distance-slider";
import DatePicker from "react-datepicker";
import {DatePickerLeo} from "@/components/filter/date-picker";

export const FilterModal = () => {
    const [isOpen, setIsOpen] = useState(false);
    const toggleModal = () => {
        setIsOpen((prevState) => !prevState);
    }

    return (
        <>
            <Button style={'p-2'} onClick={toggleModal}>
                <IconFilterFunnel color={'#000'}/>
            </Button>

            <Modal isOpen={isOpen} onClose={toggleModal} title={"Filters"}>
                <div className="flex flex-col">
                    <DistanceSlider/>
                    <DatePickerLeo/>
                </div>
            </Modal>
        </>
    )
}