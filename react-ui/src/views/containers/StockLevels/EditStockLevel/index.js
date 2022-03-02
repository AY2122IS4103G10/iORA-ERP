import { useToasts } from "react-toast-notifications";
import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";

import { editStock } from "../../../../stores/slices/stocklevelSlice";
import { selectUserSite } from "../../../../stores/slices/userSlice";


const actions = [
    {
      id: 1,
      name: "Add"
    },
    {
      id: 2,
      name: 'Remove'
    }
  ]


const EditStockForm = ({open, closeModal}) => {

    return (
        <div className="mt-4 max-w-3xl mx-auto px-4 sm:px-6 lg:max-w-7xl lg:px-8">
            <h1 className="sr-only">Edit Stock Level</h1>
            <div className="grid grid-cols-1 gap-4 lg:col-span-2">
                {/* Form */}
                <section aria-labelledby="profile-overview-title">
                    <div className="rounded-lg bg-white overflow-hidden shadow">
                        <form>
                            <div className="p-8 space-y-8 divide-y divide-gray-200">
                                <div className="space-y-8 divide-y divide-gray-200 sm:space-y-5">
                                    <div>
                                        <div>
                                            <h3 className="text-lg leading-6 font-medium text-gray-900">
                                                Edit Stock Level
                                            </h3>
                                        </div>
                                        <div className="mt-6 sm:mt-5 space-y-6 sm:space-y-5">
                                            {/* <SimpleInputGroup
                                                label="Action"
                                                inputField="title"
                                                className="relative rounded-md sm:mt-0 sm:col-span-2"
                                            >
                                                <SimpleInputBox
                                                    type="text"
                                                    name="title"
                                                    id="title"
                                                    autoComplete="title"
                                                    // value={title}
                                                    // onChange={onTitleChanged}
                                                    required
                                                />
                                            </SimpleInputGroup>
                                            <SimpleInputGroup
                                                label="Job Description"
                                                inputField="description"
                                                className="relative rounded-md sm:mt-0 sm:col-span-2"
                                            >
                                                <SimpleInputBox
                                                    type="text"
                                                    name="description"
                                                    id="description"
                                                    // value={description}
                                                    // onChange={onDescriptionChanged}
                                                    required
                                                />
                                            </SimpleInputGroup> */}

                                        </div>
                                    </div>
                                </div>

                                <div className="pt-5">
                                    <div className="flex justify-end">
                                        <button
                                            type="button"
                                            className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500"
                                            onClick={closeModal}
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-cyan-600 hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500"
                                            // onClick={onAddJobTitleClicked}
                                        >
                                            
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                </section>
            </div>
        </div>
    )
}



export const EditStockLevel = () => {
    const dispatch = useDispatch();
    const siteId = useSelector(selectUserSite);
    const [open, setOpen] = useState(false);
    const [rfid, setRfid] = useState("");
    const [selected, setSelected] = useState(actions[0]);
    const {addToast} = useToasts();

    const openModal = () => setOpen(true);
    const closeModal = () => setOpen(false);

    const handleEditStock = (e) => {
        e.preventDefault();
        let toUpdate = {};
        const rfidArr = rfid.trim().split(" ");
        // console.log(rfidArr);
        // add 
        if (selected.id === 1) {
          Object.entries(rfidArr).forEach(([key, value]) => {
            toUpdate[value] = siteId;
          });
    
        // remove
        } else if (selected.id === 2) {
          Object.entries(rfidArr).forEach(([key, value]) => {
            toUpdate[value] = 0;
          });
        }
        // console.log(toUpdate);
    
        dispatch(editStock({toUpdate: toUpdate, siteId: siteId}))
          .unwrap()
          .then((response) => {
            alert("Successfully edited stock levels");
            closeModal();
          })
          .catch((err) => alert(err.message))
      }

      return (
          <EditStockForm/>
        )


}