import { css } from "@emotion/css";
import { BRAND_COLOR } from "../theme";

export function Button({ buttonText, onClick }) {
  return (
    <button className={buttonStyle} onClick={onClick}>
      {buttonText}
    </button>
  );
}

const buttonStyle = css`
  border: none;
  outline: none;
  margin-left: 15px;
  color: white;
  padding: 17px;
  border-radius: 25px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  background-color: rgb(${BRAND_COLOR});
  transition: all 0.35s;
  width: 240px;
  letter-spacing: 0.75px;
  &:hover {
    background-color: rgba(${BRAND_COLOR}, 0.75);
  }
`;
