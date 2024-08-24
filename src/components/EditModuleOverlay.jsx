import { Cross1Icon } from "@radix-ui/react-icons";
import React, {
  useEffect,
  useRef,
  useState
} from "react";
import { toast } from "react-toastify";

const EditModuleOverlay = ({
  setItems,
  editModuleOverlay,
  setEditModuleOverlay,
  editModuleId,
  items,
}) => {
  const item = items.find((item) => item.id === editModuleId);
  const inputRef = useRef(null);
  const [newModuleName, setNewModuleName] = useState(item?.value || "");
  useEffect(() => {
    setNewModuleName(item?.value || "");

    if (editModuleOverlay) {
      inputRef.current?.focus();
    }
  }, [editModuleOverlay, item]);


  const handleEditModule = () => {
    if (newModuleName.trim() === "") {
      toast.error("Please enter a module name");
      return;
    }
    setItems((prev) => {
      return prev.map((item) => {
        if (item.id === editModuleId) {
          return {
            ...item,
            value: newModuleName,
          };
        }
        return item;
      });
    });
    setEditModuleOverlay(false);
    setNewModuleName("");
  };
  return (
    <div
      className={`${
        editModuleOverlay
          ? "opacity-100 visible transform translate-x-0 translate-y-0 scale-100"
          : "opacity-0 invisible"
      } create-module-overlay fixed inset-0 flex items-center bg-black bg-opacity-50 z-50 transition-all duration-300`}
    >
      <div className="create-module relative space-y-5 bg-white p-8 rounded-xl w-[460px] h-fit mx-auto ">
        <div className="flex items-center justify-between">
          <div className="font-bold text-lg">Edit module</div>
          <button
            onClick={() => {
              setEditModuleOverlay(false);
              setNewModuleName("");
            }}
            className="text-gray-600 hover:text-[#d33852] transition-all duration-300"
          >
            <Cross1Icon className="size-4" />
          </button>
        </div>
        <div className="module space-y-2">
          <label htmlFor="module-name" className="text-sm font-semibold">
            Module name
          </label>
          <input
            ref={inputRef}
            value={newModuleName}
            onChange={(e) => {
              setNewModuleName(e.target.value);
            }}
            name="module-name"
            id="module-name"
            type="text"
            placeholder="Module name"
            className="w-full border-2 border-slate-100 p-2 rounded-md"
          />
        </div>
        <div className="buttons  text-sm font-medium flex justify-end items-center gap-x-5">
          <button
            onClick={() => {
              setEditModuleOverlay(false);
              setNewModuleName("");
            }}
            className=" text-gray-600 border border-slate-200 p-3 rounded-lg w-fit"
          >
            Cancel
          </button>
          <button
            onClick={handleEditModule}
            className=" text-white bg-[#008392] border border-slate-200 p-3 rounded-lg w-fit"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditModuleOverlay;
