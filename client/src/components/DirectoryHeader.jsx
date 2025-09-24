import { FaFolderPlus, FaUpload, FaUser } from "react-icons/fa";
import { LogOut } from "lucide-react";
import  { useState, useRef, useEffect } from "react";


function DirectoryHeader({
  directoryName,
  onCreateFolderClick,
  onUploadFilesClick,
  fileInputRef,
  handleFileSelect,
  user,
  onLogout
}) {
   const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown if click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // const initial = user?.name ? user.name.charAt(0).toUpperCase() : "U";

  //  console.log(initial);
  return (
    <header className="directory-header">
      <h1>{directoryName}</h1>
      <div className="header-links">
        {/* Create Folder (icon button) */}
        <button
          className="icon-button"
          title="Create Folder"
          onClick={onCreateFolderClick}
        >
          <FaFolderPlus />
        </button>

        {/* Upload Files (icon button) - multiple files */}
        <button
          className="icon-button"
          title="Upload Files"
          onClick={onUploadFilesClick}
        >
          <FaUpload />
        </button>
        <input
          ref={fileInputRef}
          id="file-upload"
          type="file"
          style={{ display: "none" }}
          multiple // Allows multiple file selection
          onChange={handleFileSelect}
        />

         {/* Action buttons + Profile */}
      <div className=" icon-button profile"  ref={dropdownRef}>
         {/* User Profile Avatar */}
        <button title="Profile"
          onClick={() => setOpen(!open)}
          className="icon-button"
        >
         <FaUser />
        </button>

        {/* Dropdown Menu */}
        {open && (
          <div className="text-color">
            <div className="px-4 py-3 border-b">
              <span>UserName: </span><br />
              <p className="userid">{user?.name}</p>
              <span>Email-Id: </span><br />
              <p className="userid">{user?.email}</p>
            </div>
           
            <button
              className="logout"
              onClick={() => {
                onLogout();
                setOpen(false);
              }}
            >
              <LogOut size={16} /> Logout
            </button>
         </div>
        )}
      </div>
      </div>
    </header>
  );
}

export default DirectoryHeader;
