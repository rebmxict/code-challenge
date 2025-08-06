import React from "react";

interface ErrorMessageProps {
  message: string;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ message }) => {
  return (
    <div style={{ color: "red", margin: "1em 0" }}>
      {message}
    </div>
  );
};

export default ErrorMessage;
