import React from "react";


//Note: Original tutorial recommended a more involved set up that used
//'portals', which essentially render the modal outside the typical
//dom element of root.

//It's not clear this implementation is needed, but if so, can check the tutorial:
// https://www.youtube.com/watch?v=LyLa7dU5tp8


function Modal({isOpen, toggle}) {


  if (!isOpen) return null;

  return (
    <>
      <div class="modal-overlay"></div>
      <div class="modal-instructions">
        <p>
          Testing some Modal Instructions
        </p>
        <button onClick={toggle}>Close Me</button>
      </div>
    </>
  )
}

export default Modal;