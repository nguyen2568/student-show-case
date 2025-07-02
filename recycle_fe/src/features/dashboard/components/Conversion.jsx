import styled from "styled-components";
import { BadgeInfo } from "lucide-react";
import { Description, Dialog, DialogPanel, DialogTitle } from '@headlessui/react'
import { useState } from 'react'
import { Button } from '@headlessui/react'


const Div = styled.div.attrs({
    className: "relative flex mt-4 shadow-lg bg-white rounded-lg p-4 space-x-6 items-center"
})`
box-shadow: rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;`;

const TextLowerCase = styled.span`
    text-transform: lowercase;
`;

const Info = styled.div.attrs({
    className: "absolute top-5 right-5 p-2 w-5 h-5"
})``;
const Conversion = function ({ info, cans, bottles }) {
    
    const { icon, description, unit, number, explain, Details, References } = info; 
    
    let [isOpen, setIsOpen] = useState(false)


    return (
        <Div>
            <div className="icon p-2 bg-[#c7f4ff] rounded flex items-center justify-center w-1/6">
                <img src={icon} alt="Bottle" />
            </div>
            <div className="content w-5/6">
                <p style={{ color: "#079CC0" }} className='text-xl font-semibold'>{number(cans,bottles)} {unit}</p>
                <p>{description}</p>
            </div>
            <Info>
                <BadgeInfo onClick={() => setIsOpen(true)} />
            </Info>
            <Dialog
                open={isOpen}
                onClose={() => setIsOpen(false)}
                transition
                className="fixed inset-0 flex w-screen items-center justify-center bg-black/30 transition duration-300 ease-out data-closed:opacity-0">
                <div className="fixed inset-0 w-screen overflow-y-auto p-4">
                    <div className="flex min-h-full items-center justify-center">
                        <DialogPanel className="max-w-lg rounded-xl space-y-4 bg-white p-6">
                            <DialogTitle className="font-bold">Your recycling amount is equivalent to {number(cans,bottles)} {unit} <TextLowerCase>{description}</TextLowerCase> </DialogTitle>
                            <Description>{explain}</Description>
                            {Details}
                            {References}
                            <div className="flex justify-end">
                                <Button className="rounded bg-sky-600 px-4 py-2 text-sm text-white data-active:bg-sky-700 data-hover:bg-sky-500" onClick={() => setIsOpen(false)}>  
                                    Close</Button>
                            </div>
                        </DialogPanel>
                    </div>
                </div>

            </Dialog>
        </Div>
    )
}

export default Conversion;  