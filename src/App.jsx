import {
  CaretDownIcon,
  DotsVerticalIcon,
  DownloadIcon,
  ExternalLinkIcon,
  FileTextIcon,
  ImageIcon,
  Link2Icon,
  Pencil1Icon,
  PlusIcon,
  TrashIcon,
  UploadIcon,
  ViewHorizontalIcon,
} from "@radix-ui/react-icons";
import {
  SimpleTreeItemWrapper,
  SortableTree
} from "dnd-kit-sortable-tree";
import React, { useEffect, useState } from "react";
import { v4 as uuid } from "uuid";
import CreateModuleOverlay from "./components/CreateModuleOverLay";
import EditModuleOverlay from "./components/EditModuleOverlay";
import FileRenameOverlay from "./components/FileRenameOverlay";

import * as _ from "lodash";
import { toast } from "react-toastify";
import AddLinkOverlay from "./components/LinkOverlay";
import EditLinkOverlay from "./components/EditLinkOverlay";
import ImageComponent from "./components/ImageComponent";




export default function App() {

  const [items, setItems] = useState([]);


  const [createModuleOverlay, setCreateModuleOverlay] = useState(false);
  const [editModuleOverlay, setEditModuleOverlay] = useState(false);
  const [editModuleId, setEditModuleId] = useState(null);


  const [addLinkOverlay, setAddLinkOverlay] = useState(false);
  const [editLinkOverlay, setEditLinkOverlay] = useState(false);
  const [editLinkId, setEditLinkId] = useState(null);


  const [editFileOverlay, setEditFileOverlay] = useState(false);
  const [editFileId, setEditFileId] = useState(null);

  const [dropdownMenu, setDropdownMenu] = useState(false);


  const [activeResourceId, setActiveResourceId] =
    useState(null);
  const [activeResourceType, setActiveResourceType] = useState();


  const [editDropdownMenu, setEditDropdownMenu] = useState(false);

  useEffect(() => {
    const storedItems = localStorage.getItem("items");
    if (storedItems) {
      setItems(JSON.parse(storedItems));
    }
  }, []);

 
  useEffect(() => {
    localStorage.setItem("items", JSON.stringify(items));
  }, [items]);

  // listens for any outside click which  will close the dropdown menu and overlay
  useEffect(() => {
    const handleClick = (e) => {
      const target = e.target;
      const addBtn = document.querySelector(".add-button");
      const dropdownMenu = document.querySelector(".dropdown-menu");
      const form = document.querySelector(".create-module");

      // Check if the click is inside the form or any relevant overlay
      if (
        addBtn?.contains(target) ||
        dropdownMenu?.contains(target) ||
        form?.contains(target)
      ) {
        return;
      }

      
      setDropdownMenu(false);
      setEditDropdownMenu(false);
      setCreateModuleOverlay(false);
      setEditModuleOverlay(false);
      setEditFileOverlay(false);
      setAddLinkOverlay(false);
      setEditLinkOverlay(false);
      setActiveResourceId(null);
      setActiveResourceType(undefined);
    };

    
    document.addEventListener("click", handleClick);

    return () => {
      document.removeEventListener("click", handleClick);
    };
  }, []);


  const handleUploadFile = (e) => {
    const file = e.target.files?.[0];
    const reader = new FileReader();
    if (!file) {
      toast.error("Please select a file");
      return;
    }

    reader.onloadend = () => {
      const fileType = file.type.split("/")[1]

      const nameOfFile = file.name.split(".")[0];

      const item = {
        id: uuid(),
        value: nameOfFile,
        url: reader.result,
        type: fileType,
      };

      setItems((prev) => [...prev, item]);
    };
    reader.readAsDataURL(file);
    setDropdownMenu(false);
  };

  // Function for deleting resources
  const handleDeleteResource = (id, items) => {
    const allItems = _.cloneDeep(items);
    const updatedItems = allItems.map((item) => {
      // If the item is in top level then ignore it
      if (item.id === id) {
        return false;
      }
      // If the item has children then filter out the children
      if (item.children) {
        return {
          ...item,
          children: item.children.filter((child) => child.id !== id),
        };
      }
      return item;
    });

    const filtered = updatedItems?.filter(Boolean);
    setItems(filtered);
    setEditDropdownMenu(false);
    setActiveResourceId(null);
  };

  // This is the one that will be rendered for each item in the tree
  const TreeItem = React.forwardRef((props, ref) => {
    return (
      <SimpleTreeItemWrapper
        {...props}
        ref={ref}
        className={`bg-white ${props.item.parentId !== null
          ? "!mt-0 rounded-tl-none rounded-tr-none shadow-none !pl-[25px]"
          : props.item.parentId === null &&
            (props?.item?.children?.length ?? 0) > 0
            ? "rounded-bl-none rounded-br-none border-b-[1px] border-b-gray-200"
            : ""
          } border-slate-100 relative type-file w-full flex items-center  gap-x-3 p-1 shadow-sm shadow-[#ebebeb]  border-[1px] rounded-lg`}
      >
        {/* ________ Icon accoring to the type _______ */}
        {props.item.type !== "module" && (
          <div
            className={`icon rounded-md  p-2 
          ${props.item.type === "pdf"
                ? "bg-[#fff5f7] text-red-400"
                : props.item?.type === "link"
                  ? "bg-[#ebfcff] text-[#05b2c7]"
                  : ["jpg", "png", "jpeg"].includes(
                    props.item.type
                  ) && "bg-yellow-100 text-yellow-400"
              } `}
          >
            {props.item.type === "pdf" ? (
              <FileTextIcon className="size-5" />
            ) : props.item.type === "link" ? (
              <Link2Icon className="size-5" />
            ) : (
              ["jpg", "png", "jpeg"].includes(
                props.item.type
              ) && <ImageIcon className="size-5" />
            )}
          </div>
        )}

        {/*_______ Name  and info of file _______*/}
        <div className="flex flex-col">
          <span className="font-medium text-sm">
            {props.item.type === "link"
              ? props.item.displayName
              : props.item.value}
          </span>
          <span className="text-xs text-gray-600">
            {props.item.type === "module" ? (
              <>
                {props.item.children?.length ?? 0 > 0
                  ? `${props.item.children?.length} items`
                  : "Add items to this module"}
              </>
            ) : (
              <>{props.item.type}</>
            )}{" "}
          </span>
        </div>
        {/* _______ Three dots  _______ */}

        <div className="three-dots flex items-center justify-center absolute right-0">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setDropdownMenu(false);
              if (activeResourceId === props.item.id) {
                setActiveResourceId(null);
                setEditDropdownMenu(false);
                return;
              }
              setActiveResourceId(props.item.id.toString()); // Convert props.item.id to a string
              setEditDropdownMenu(!editDropdownMenu);
              setActiveResourceType(props.item.type);
            }}
            className={`text-gray-600 rounded-md p-2 hover:bg-gray-200 absolute right-5 transition-all duration-300
            ${activeResourceId === props.item.id ? "bg-gray-200" : "bg-white "}
            `}
          >
            <DotsVerticalIcon className="size-4" />
          </button>
          {/* ______ Dropdown _____ */}
          {activeResourceId === props.item.id && (
            <div
              className={`dropdown-menu z-30 absolute w-[262px] bg-white p-2 rounded-md top-5  shadow-lg border-2 border-slate-100 right-2 transition-all duration-300 transform origin-top-right -translate-y-2 scale-95`}
            >
              {activeResourceType !== "module" &&
                activeResourceType !== "link" ? (
                <>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setEditFileOverlay(true);
                      setEditFileId(props.item.id);
                      setEditDropdownMenu(false);
                      setActiveResourceType(props.item.type);
                      setActiveResourceId(null);
                    }}
                    className="flex text-sm items-center gap-x-2 p-2 text-[#717171] hover:text-[#222222] hover:bg-gray-100 rounded-md w-full"
                  >
                    <Pencil1Icon className="size-4" />
                    Rename
                  </button>
                  <button
                    onClick={(e) => handleDownloadFile(e, props.item)}
                    className="flex text-sm items-center gap-x-2 p-2 text-[#717171] hover:text-[#222222] hover:bg-gray-100 rounded-md w-full"
                  >
                    <DownloadIcon className="size-4" />
                    Download
                  </button>
                </>
              ) : activeResourceType === "module" ? (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setEditModuleId(props.item.id);
                    setEditModuleOverlay(true);
                    setEditDropdownMenu(false);
                    setActiveResourceId(null);
                    setActiveResourceType(undefined);
                  }}
                  className="flex text-sm items-center gap-x-2 p-2 text-[#717171] hover:text-[#222222] hover:bg-gray-100 rounded-md w-full"
                >
                  <Pencil1Icon className="size-4" />
                  Edit module
                </button>
              ) : (
                activeResourceType === "link" && (
                  <>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditLinkOverlay(true);
                        setEditLinkId(props.item.id);
                        setEditDropdownMenu(false);
                        setActiveResourceId(null);
                        setActiveResourceType(undefined);
                      }}
                      className="flex text-sm items-center gap-x-2 p-2 text-[#717171] hover:text-[#222222] hover:bg-gray-100 rounded-md w-full"
                    >
                      <Pencil1Icon className="size-4" />
                      Edit
                    </button>
                    <a
                      href={props.item.value}
                      target="_blank"
                      rel="noreferrer"
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditDropdownMenu(false);
                        setActiveResourceId(null);
                        setActiveResourceType(undefined);
                      }}
                      className="flex text-sm items-center gap-x-2 p-2 text-[#717171] hover:text-[#222222] hover:bg-gray-100 rounded-md w-full"
                    >
                      <ExternalLinkIcon className="size-4" />
                      Go to link
                    </a>
                  </>
                )
              )}
              {/* This delte button is common for any resource type */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteResource(props.item.id, items);
                }}
                className="flex text-red-500 text-sm items-center gap-x-2 p-2  hover:bg-gray-100 rounded-md w-full"
              >
                <TrashIcon className="size-4" />
                Delete
              </button>
            </div>
          )}
        </div>
      </SimpleTreeItemWrapper>
    );
  });

  // function for finding the item.
  const findItem = (items, id) => {
    for (let i = 0; i < items.length; i++) {
      if (items[i].id === id) {
        return items[i];
      }
      if (items[i].children) {
        const item = findItem(items[i].children, id);
        if (item) {
          return item;
        }
      }
    }
  };

  const handleDownloadFile = (e, item) => {
    e.stopPropagation();
    setEditDropdownMenu(false);
    setActiveResourceId(null);
    setActiveResourceType(undefined);

   

    const link = document.createElement("a");
    const resource = findItem(items, item.id);
    link.href = resource?.url;
    link.download = item.value;
    link.click();
  };

  return (
    <>
      <div className="wrapper flex justify-center w-full p-10 min-h-[92vh]">
        <div className="screen w-full lg:w-[65%] md:w-[80%] space-y-8">
          {/* __________________ Header Area _____________________ */}
          <div className="header flex items-center justify-between border border-[#d33852] p-4 rounded-lg">
            <div className="brand font-bold text-xl">Course builder</div>
            <div className="add-button relative">
              <button
                onClick={() => {
                  setEditDropdownMenu(false);
                  setActiveResourceId(null);
                  setActiveResourceType(undefined);
                  setDropdownMenu(!dropdownMenu);
                }}
                className="bg-[#d33852] add-button text-white flex gap-x-2 text-sm items-center p-2 rounded-md"
              >
                <PlusIcon className="size-5" />
                Add
                <CaretDownIcon className="font-bold size-5" />
              </button>

              <div
                className={`${dropdownMenu
                  ? "opacity-100 visible transform translate-x-0 translate-y-0 scale-100"
                  : "opacity-0 invisible"
                  }  z-30 absolute w-[262px] bg-white p-2 rounded-md top-12 shadow-lg border-2 border-slate-100 right-0 transition-all duration-300 transform origin-top-right -translate-y-2 scale-95`}
              >
                <button
                  onClick={() => {
                    setCreateModuleOverlay(true);
                    setDropdownMenu(false);
                    setEditDropdownMenu(false);
                  }}
                  className="flex text-sm items-center gap-x-2 p-2 text-[#717171] hover:text-[#222222] hover:bg-gray-100 rounded-md w-full"
                >
                  <ViewHorizontalIcon className="size-4" />
                  Create module
                </button>
                <button
                  onClick={() => {
                    setAddLinkOverlay(true);
                    setDropdownMenu(false);
                    setEditDropdownMenu(false);
                  }}
                  className="flex text-sm items-center gap-x-2 p-2 text-[#717171] hover:text-[#222222] hover:bg-gray-100 rounded-md w-full"
                >
                  <Link2Icon className="size-4" />
                  Add a link
                </button>
                <button
                  onClick={() => {
                    document.getElementById("file-upload")?.click();
                    setDropdownMenu(false);
                    setEditDropdownMenu(false);
                  }}
                  className="flex text-sm items-center gap-x-2 p-2 text-[#717171] hover:text-[#222222] hover:bg-gray-100 rounded-md w-full"
                >
                  <input
                    type="file"
                    id="file-upload"
                    accept=".pdf,.png,.jpg,.jpeg"
                    onChange={(e) => handleUploadFile(e)}
                    className="hidden text-sm items-center gap-x-2 p-2 text-[#717171] hover:text-[#222222] hover:bg-gray-100 rounded-md w-full"
                  />
                  <UploadIcon className="size-4" />
                  Upload
                </button>
              </div>
            </div>
          </div>
          
          <SortableTree
            items={items}
            onItemsChanged={setItems}
            TreeItemComponent={TreeItem}
            pointerSensorOptions={{
              activationConstraint: {
                distance: 3,
              },
            }}
          />

          {/* _______________ Empty state _______________ */}
          {Array.isArray(items) && items.length === 0 && (
            <div className="flex items-center justify-center min-h-[70vh]  p-4 rounded-lg">
              <ImageComponent />
            </div>
          )}
        </div>
        {/* _______________ Create module overlay _______________ */}
        {createModuleOverlay && (
          <CreateModuleOverlay
            createModuleOverlay={createModuleOverlay}
            setCreateModuleOverlay={setCreateModuleOverlay}
            setItems={
              setItems
            }
          />
        )}
        {/*_______________ Edit module overlay _______________ */}
        {editModuleOverlay && (
          <EditModuleOverlay
            editModuleOverlay={editModuleOverlay}
            setEditModuleOverlay={setEditModuleOverlay}
            editModuleId={editModuleId}
            items={items}
            setItems={
              setItems
            }
          />
        )}
        
        {editFileOverlay && (
          <FileRenameOverlay
            editFileOverlay={editFileOverlay}
            setEditFileOverlay={setEditFileOverlay}
            editFileId={editFileId}
            setEditFileId={setEditFileId}
            items={items}
            setItems={
              setItems
            }
          />
        )}
        
        {addLinkOverlay && (
          <AddLinkOverlay
            addLinkOverlay={addLinkOverlay}
            setAddLinkOverlay={setAddLinkOverlay}
            setItems={
              setItems
            }
          />
        )}
        
        {editLinkOverlay && (
          <EditLinkOverlay
            editLinkOverlay={editLinkOverlay}
            setEditLinkOverlay={setEditLinkOverlay}
            editLinkId={editLinkId}
            setEditLinkId={setEditLinkId}
            items={items}
            setItems={
              setItems
            }
          />
        )}
      </div>
      
    </>
  );
}
