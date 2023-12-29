import React from "react";

function ModalDemo({isOpen, toggle}) {

  return (
    <>
      <p>
        Testing some Modal Instructions
      </p>
      <button onClick={toggle}>Close Me</button>
    </>
  )

}

export default ModalDemo;