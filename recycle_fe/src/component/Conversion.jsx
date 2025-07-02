import styled from "styled-components";

const Div = styled.div.attrs({
    className: "flex mt-4 bg-white p-4 space-x-6 items-center"
})`
border: 1px solid #E2E8F0;
border-top: 4px solid #079CC0;
`;
const Conversion = function ({icon, number, description}) {
    return (
        <Div>
            <div className="icon p-2 bg-[#c7f4ff] rounded flex items-center justify-center">
                <img src={icon} alt="Bottle" className="w-10 h-10" />
            </div>
            <div className="content">
                <p style={{ color: "#079CC0" }} className='text-xl font-semibold'>{number}</p>
                <p>{description}</p>
            </div>
        </Div>
    )
}

export default Conversion;