import { Cross1Icon } from "@radix-ui/react-icons";
import _ from "lodash";
import React, { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";

const FileRenameOverlay = ({
  editFileId,
  setEditFileId,
  editFileOverlay,
  setEditFileOverlay,
  items,
  setItems,
}) => {
  // serach the file with the id it will be present in the items array at top level or  maybe nested isnide the children properties so you have to search recursively

  const inputRef = useRef(null);
  const [newFileName, setNewFileName] = useState("");
  useEffect(() => {
    setNewFileName("");

    const item = findItem(items, editFileId);

    setNewFileName(item?.value || "");
    if (editFileOverlay) {
      inputRef.current?.focus();
    }
  }, [editFileOverlay, editFileId, items]);

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
  const updateItem = (items, id, value) => {
    const allItems = _.cloneDeep(items);
    return allItems.map((item) => {
      if (item.id === id) {
        return {
          ...item,
          value,
        };
      }
      if (item.children) {
        return {
          ...item,
          children: updateItem(item.children, id, value),
        };
      }
      return item;
    });
  };
  const handleRenameFile = () => {
    if (newFileName.trim() === "") {
      toast.error("Please enter a file name");
      return;
    }
    setItems((prev) => {
      return updateItem(prev, editFileId , newFileName);
    });
    setEditFileOverlay(false);
    setNewFileName("");
  };
  return (
    <div
      className={`${
        editFileOverlay
          ? "opacity-100 visible transform translate-x-0 translate-y-0 scale-100"
          : "opacity-0 invisible"
      } create-module-overlay fixed inset-0 flex items-center bg-black bg-opacity-50 z-50 transition-all duration-300`}
    >
      <div className="create-module relative space-y-5 bg-white p-8 rounded-xl w-[460px] h-fit mx-auto ">
        <div className="flex items-center justify-between">
          <div className="font-bold text-lg">Rename File</div>
          <button
            onClick={() => {
              setEditFileOverlay(false);
              setNewFileName("");
            }}
            className="text-gray-600 hover:text-[#d33852] transition-all duration-300"
          >
            <Cross1Icon className="size-4" />
          </button>
        </div>
        <div className="file space-y-2">
          <label htmlFor="file-name" className="text-sm font-semibold">
            File name
          </label>
          <input
            ref={inputRef}
            value={newFileName}
            onChange={(e) => {
              setNewFileName(e.target.value);
            }}
            name="file-name"
            id="file-name"
            type="text"
            placeholder="File name"
            className="w-full border-2 border-slate-100 p-2 rounded-md"
          />
        </div>
        <div className="buttons  text-sm font-medium flex justify-end items-center gap-x-5">
          <button
            onClick={() => {
              setEditFileOverlay(false);
              setNewFileName("");
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

export default FileRenameOverlay;
