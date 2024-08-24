import { Cross1Icon } from "@radix-ui/react-icons";
import _ from "lodash";
import React, { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";

const EditLinkOverlay = ({
  editLinkOverlay,
  editLinkId,
  setEditLinkId,
  setEditLinkOverlay,
  items,
  setItems,
}) => {
  // serach the file with the id it will be present in the items array at top level or  maybe nested isnide the children properties so you have to search recursively

  const inputRef = useRef(null);
  const [urlName, setUrlName] = useState("");
  const [displayName, setDisplayName] = useState("");
  useEffect(() => {
    setUrlName("");

    const item = findItem(items, editLinkId );

    setUrlName(item?.value || "");
    setDisplayName(item?.displayName || "");
    if (editLinkOverlay) {
      inputRef.current?.focus();
    }
  }, [editLinkOverlay, editLinkId, items]);

  const findItem = (items, id) => {
    for (let item of items) {
      if (item.id === id) {
        return item;
      }
      if (item.children) {
        const found = findItem(item.children, id) ;
        if (found) {
          return found;
        }
      }
    }
    return null;
  };
  const updateItem = (
    items,
    id,
    value,
    displayName
  ) => {
    const allItems = _.cloneDeep(items);
    return allItems.map((item) => {
      if (item.id === id) {
        return {
          ...item,
          value,
          displayName,
        };
      }
      if (item.children) {
        return {
          ...item,
          children: updateItem(item.children, id, value, displayName),
        };
      }
      return item;
    });
  };
  const handleRenameFile = () => {
    if (urlName.trim() === "" || displayName.trim() === "") {
      toast.error("Please enter a link name");
      return;
    }
    setItems((prev) => {
      return updateItem(prev, editLinkId, urlName, displayName);
    });
    setEditLinkOverlay(false);
    setUrlName("");
  };
  return (
    <div
      className={`${
        editLinkOverlay
          ? "opacity-100 visible transform translate-x-0 translate-y-0 scale-100"
          : "opacity-0 invisible"
      } create-module-overlay fixed inset-0 flex items-center bg-black bg-opacity-50 z-50 transition-all duration-300`}
    >
      <div className="create-module relative space-y-5 bg-white p-8 rounded-xl w-[460px] h-fit mx-auto ">
        <div className="flex items-center justify-between">
          <div className="font-bold text-lg">Edit link</div>
          <button
            onClick={() => {
              setEditLinkOverlay(false);
              setUrlName("");
            }}
            className="text-gray-600 hover:text-[#d33852] transition-all duration-300"
          >
            <Cross1Icon className="size-4" />
          </button>
        </div>
        <div className="link space-y-2">
          <label htmlFor="link-name" className="text-sm font-semibold">
            URL
          </label>
          <input
            ref={inputRef}
            value={urlName}
            onChange={(e) => {
              setUrlName(e.target.value);
            }}
            name="link-name"
            id="link-name"
            type="text"
            placeholder="Link name"
            className="w-full border-2 border-slate-100 p-2 rounded-md"
          />
        </div>
        <div className="display space-y-2">
          <label htmlFor="display-name" className="text-sm font-semibold">
            Display name
          </label>
          <input
            value={displayName}
            onChange={(e) => {
              setDisplayName(e.target.value);
            }}
            name="display-name"
            id="display-name"
            type="text"
            placeholder="Display name"
            className="w-full border-2 border-slate-100 p-2 rounded-md"
          />
        </div>
        <div className="buttons  text-sm font-medium flex justify-end items-center gap-x-5">
          <button
            onClick={() => {
              setEditLinkOverlay(false);
              setUrlName("");
            }}
            className=" text-gray-600 border border-slate-200 p-3 rounded-lg w-fit"
          >
            Cancel
          </button>
          <button
            onClick={handleRenameFile}
            className=" text-white bg-[#008392] border border-slate-200 p-3 rounded-lg w-fit"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditLinkOverlay;
