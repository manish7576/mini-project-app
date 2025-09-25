import { useEffect, useRef, useState } from "react";
import {
  FaCopy,
} from "react-icons/fa";

 function SharingModel(
  {
  linkValue,
  onClose,
  }
) {
  const [copied, setCopied] = useState(false);
  // console.log(navigator.clipboard);
  const handleCopy = () => {
    if(navigator.clipboard){
      navigator.clipboard.writeText(linkValue).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000); // Reset after 2s
      });
    }
    else{
      // Fallback for insecure contexts for ip not loopback address 
    const textArea = document.createElement("textarea");
    textArea.value = linkValue;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand("copy");
    document.body.removeChild(textArea);

    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }
    
  };
useEffect(() => {
    // Listen for "Escape" key to close the modal
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    // Cleanup keydown event listener on unmount
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  // Stop propagation when clicking inside the content
  const handleContentClick = (e) => {
    e.stopPropagation();
  };
  // Close when clicking outside the modal content
  const handleOverlayClick = () => {
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal-content" onClick={handleContentClick}>
       <h4>Copy Link to Share File</h4>
       
     <div className="input-container" style={{ display: "flex", alignItems: "center" }}>
          <input
            type="text"
            className="modal-input"
            placeholder="Please Wait..."
            value={linkValue}
            readOnly
            style={{ flex: 1, marginRight: "8px" }}
          />

          {linkValue && (
            <button
              onClick={handleCopy}
              className="copy-btn"
              title="copy"
              style={{
                border: "none",
                background: "transparent",
                cursor: "pointer",
                color:"green",
                fontSize: "18px"
              }}
            >
              <FaCopy />
            </button>
          )}
        </div>


    {copied && <p style={{ color: "green", fontSize: "12px",fontWeight:"bold",margin:0 }}>Copied!</p>}
         
         <div className="modal-buttons">
          <button
              className="secondary-button"
              type="button"
              onClick={onClose}
            >
            Close
            </button>
          </div>    
      </div>
    </div>
  );
}

 export default SharingModel