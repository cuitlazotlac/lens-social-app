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
  color: white;
  margin-left: 15px;
  padding: 12px;
  border-radius: 10px;
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
