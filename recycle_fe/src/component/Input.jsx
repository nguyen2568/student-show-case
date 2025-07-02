import styled from "styled-components";

const InputStyled = styled.input`
    display: block;
    width: 100%;
    margin-bottom: 10px;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 5px;
`;

const Input = ({ type, placeholder, value, onChange }) => {
  return (
    <InputStyled
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
    />
  );
}

export default Input;