import { Dialog } from "@headlessui/react";
import { ExclamationCircleIcon, XIcon } from "@heroicons/react/outline";
import { useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { api } from "../../../../environments/Api";
import { fetchProducts, selectAllProducts } from "../../../../stores/slices/productSlice";
import { getAllSites, selectAllSites } from "../../../../stores/slices/siteSlice";
import { getASiteStock, selectCurrSiteStock } from "../../../../stores/slices/stocklevelSlice";
import { createStockTransfer, editStockTransfer } from "../../../../stores/slices/stocktransferSlice";
import { selectUserSite } from "../../../../stores/slices/userSlice";
import ErrorModal from "../../../components/Modals/ErrorModal";
import { SimpleModal } from "../../../components/Modals/SimpleModal";
import { ClickableRowTable, EditableCell, SelectColumnFilter } from "../../../components/Tables/ClickableRowTable";
import { SimpleTable } from "../../../components/Tables/SimpleTable";

const cols =
    [
        {
            Header: "Site Code",
            accessor: "siteCode"
        },
        {
            Header: "Name",
            accessor: "name"
        },
        {
            Header: "Company",
            accessor: "company.name",
            Filter: SelectColumnFilter,
            filter: "includes"
        },
        {
            Header: "Country",
            accessor: "company.address.country",
            Filter: SelectColumnFilter,
            filter: "includes"
        },
    ];

function isObjectEmpty(obj) {
    return Object.keys(obj).length === 0
}

export const SelectSiteModal = ({ open, closeModal, data, from, to, setFrom, setTo }) => {

    const columns = useMemo(() => cols, []);
    const fromRef = useRef(null);
    const toRef = useRef(null);
    const [error, setError] = useState(false);

    function handleFocus(ref) {
        ref.current.focus();
    }

    const onRowClick = (row) => {
        if (!isObjectEmpty(to) && to.id === from.id) {
            setError(true);
        } else {
            setError(false);
        }

        if (isObjectEmpty(from)) {
            //check if from and to sites are the same
            if (row.id === to.id) {
                setError(true);
            } else {
                setFrom(row);
            }

            if (isObjectEmpty(to)) {
                handleFocus(toRef);
            }

        } else if (isObjectEmpty(to)) {
            //check if from and to sites are the same
            if (row.id === from.id) {
                setError(true);
            } else {
                setTo(row);
            }

            if (isObjectEmpty(from)) {
                handleFocus(fromRef);
            }
        }
    }

    return (
        <SimpleModal open={open} closeModal={closeModal}>
            <div className="inline-block align-middle bg-white rounded-lg px-4 pt-4 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-sm sm:min-w-full sm:p-6 md:min-w-full lg:min-w-fit">
                <div>
                    <div className="flex justify-between">
                        <Dialog.Title
                            as="h3"
                            className="m-3 text-center text-lg leading-6 font-medium text-gray-900"
                        >
                            Select Sites
                        </Dialog.Title>
                        <button
                            type="button"
                            className="relative h-full inline-flex items-center space-x-2 px-2 py-2 text-sm font-medium rounded-full text-gray-700"
                            onClick={closeModal}
                        >
                            <XIcon className="h-5 w-5" />
                        </button>
                    </div>

                    <div className="grid grid-cols-2 mb-7 gap-5 border-t border-b border-gray-200 px-4 py-5 sm:px-6">
                        <div className="col-span-1 space-y-6 sm:space-y-5">
                            <div>
                                <label
                                    htmlFor="from"
                                    className="block text-sm font-bold text-gray-900 sm:mt-px sm:pt-2"
                                >
                                    From Site
                                </label>

                                <div className="mt-3 flex rounded-md shadow-sm">
                                    <div className="relative flex items-stretch flex-grow focus-within:z-10 h-9">
                                        <input
                                            name="from"
                                            id="from"
                                            ref={fromRef}
                                            type="text"
                                            value={isObjectEmpty(from) ? "" : from.name}
                                            className="block w-full h-full rounded-md border-gray-300 shadow-sm focus:border-cyan-500 focus:ring focus:ring-cyan-500 focus:ring-opacity-20"
                                            placeholder="Select From Site"
                                            readOnly
                                            autoFocus
                                        >
                                        </input>
                                        <button
                                            type="button"
                                            className="-ml-px relative h-full inline-flex items-center space-x-2 px-2 py-2 border border-gray-300 text-sm font-medium rounded-r-md text-gray-700 bg-gray-50 hover:bg-gray-100"
                                            onClick={() => { setFrom({}); handleFocus(fromRef) }}
                                        >
                                            <XIcon className="h-5 w-5" />
                                        </button>

                                    </div>
                                </div>

                                {error ?
                                    <div className="flex mt-2">
                                        <span className="mr-1 ml-1 text-sm text-red-600" id="same-site-error">
                                            From and To Site cannot be the same.

                                        </span>
                                        <ExclamationCircleIcon className="h-5 w-5 text-red-500" aria-hidden="true" />
                                    </div> : ""}

                            </div>
                        </div>

                        <div className="col-span-1 space-y-6 sm:space-y-5">
                            <div>
                                <label
                                    htmlFor="from"
                                    className="block text-sm font-bold text-gray-900 sm:mt-px sm:pt-2"
                                >
                                    To Site
                                </label>

                                <div className="mt-3 flex rounded-md shadow-sm">
                                    <div className="relative flex items-stretch flex-grow focus-within:z-10 h-9">
                                        <input
                                            name="to"
                                            id="to"
                                            ref={toRef}
                                            type="text"
                                            value={isObjectEmpty(to) ? "" : to.name}
                                            className="block w-full h-full rounded-md border-gray-300 shadow-sm focus:border-cyan-500 focus:ring focus:ring-cyan-500 focus:ring-opacity-20"
                                            placeholder="Select To Site"
                                            readOnly
                                        >
                                        </input>
                                        <button
                                            type="button"
                                            className="-ml-px relative h-full inline-flex items-center space-x-2 px-2 py-2 border border-gray-300 text-sm font-medium rounded-r-md text-gray-700 bg-gray-50 hover:bg-gray-100"
                                            onClick={() => { setTo({}); handleFocus(toRef); }}
                                        >
                                            <XIcon className="h-5 w-5" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <ClickableRowTable columns={columns} data={data} onRowClick={onRowClick} />
                </div>
            </div>
        </SimpleModal>
    );

}


const convertData = (data) =>
    Object.entries(data.products).map((key) => ({
        sku: key[0],
        qty: key[1],
    }))

const ItemsList = ({ cols, data, rowSelect = false, selectedRows, setRowSelect }) => {
    return (
        <SimpleTable
            columns={cols}
            data={data}
            rowSelect={rowSelect}
            selectedRows={selectedRows}
            setSelectedRows={setRowSelect}
        />
    )
}

const AddItemsModal = ({ items, open, closeModal, data, setData,
    selectedRows, setRowSelect, onAddItemsClicked }) => {

    const itemCols = useMemo(() => {
        return [
            {
                Header: "SKU Code",
                accessor: "sku"
            },
            {
                Header: "Name",
                accessor: "name"
            },
            {
                Header: "Color",
                accessor: (row) =>
                    row.product?.productFields.find((field) => field.fieldName === "COLOUR").fieldValue,
            },
            {
                Header: "Size",
                accessor: (row) =>
                    row.product?.productFields.find((field) => field.fieldName === "SIZE").fieldValue,
            },
            {
                Header: "In Stock",
                accessor: "qty"
            },
        ]
    }, [])


    return (
        <SimpleModal open={open} closeModal={closeModal}>
            <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-sm sm:min-w-full sm:p-6 md:min-w-full lg:min-w-max">
                <div>
                    <div className="mt-3 sm:mt-5">
                        <Dialog.Title
                            as="h3"
                            className="text-center text-lg leading-6 font-medium text-gray-900"
                        >
                            Add Items
                        </Dialog.Title>
                        <ItemsList
                            cols={itemCols}
                            data={data}
                            rowSelect={true}
                            selectedRows={selectedRows}
                            setRowSelect={setRowSelect}
                        />
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
                            onClick={onAddItemsClicked}
                        >
                            Save{/* {!Boolean(items.length) ? "Add" : "Save"} items */}
                        </button>
                    </div>
                </div>
            </div>
        </SimpleModal>
    );
}

function prepareStockLevel(stocklevel, allModels) {
    stocklevel.map((stock) => {
        let model = allModels?.find((model) => model.modelCode === stock.sku.slice(0, -2));
        stock.name = model?.name;
        stock.product = model?.products.find((prod) => prod.sku === stock.sku);
    })
    return stocklevel;
}

const LineItemsTable = ({ data, setLineItems }) => {
    const [skipPageReset, setSkipPageReset] = useState(false);

    const columns = useMemo(() => {
        const updateMyData = (rowIndex, columnId, value) => {
            setSkipPageReset(true);
            setLineItems((old) =>
                old.map((row, index) => {
                    if (index === rowIndex) {
                        return {
                            ...old[rowIndex],
                            [columnId]: value,
                        };
                    }
                    return row;
                })
            );
        };
        return [
            {
                Header: "SKU",
                accessor: "product.sku",
            },
            {
                Header: "Name",
                accessor: "name",
            },
            {
                Header: "Color",
                accessor: (row) =>
                    row.product.productFields.find(
                        (field) => field.fieldName === "COLOUR"
                    ).fieldValue,
            },
            {
                Header: "Size",
                accessor: (row) =>
                    row.product.productFields.find((field) => field.fieldName === "SIZE")
                        .fieldValue,
            },
            {
                Header: "In Stock",
                accessor: "qty",
            },
            {
                Header: "Request Qty",
                accessor: "requestedQty",
                disableSortBy: true,
                Cell: (row) => {
                    return (
                        <EditableCell
                            value={row.row.original.requestedQty}
                            row={row.row}
                            column={row.column}
                            updateMyData={updateMyData}
                        />
                    );
                },
            },
        ];
    }, [setLineItems]);

    return (
        <SimpleTable columns={columns} data={data} skipPageReset={skipPageReset} />
    );

}

export const StockTransferForm = (subsys) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { id } = useParams();
    let isEditing = false;
    const [from, setFrom] = useState({});
    const [to, setTo] = useState({});
    const [openSites, setOpenSites] = useState(false);
    const [openItems, setOpenItems] = useState(false);
    const [openErrorModal, setErrorModal] = useState(false);
    const [lineItems, setLineItems] = useState([]);
    const [selectedRows, setSelectedRows] = useState([]);
    const [originalOrder, setOriginalOrder] = useState({});
    const currSite = useSelector(selectUserSite);

    //get stock level and product information
    const stocklevel = useSelector(selectCurrSiteStock);
    const allModels = useSelector(selectAllProducts);
    const prodTableData = isObjectEmpty(stocklevel) ? [] : prepareStockLevel(convertData(stocklevel), allModels);


    useEffect(() => {
        if (id === undefined || id === null) {
            isEditing = true;
        }
        dispatch(getAllSites());
        if (!isObjectEmpty(from)) {
            dispatch(getASiteStock(from.id));
        }
        dispatch(fetchProducts());
    }, [from])

    //editing 
    function mapLineItemsToSelectedRows(data) {
        let selectedRows = {};
        data.map((item) => {
            let product = prodTableData.find((data) => data.sku === item.product.sku);
            item.name = product.name;
            item.qty = product.qty;

            //update selectedRows
            let index = prodTableData.findIndex((data) => data.sku === item.product.sku);
            selectedRows[index] = true;
        })
        setSelectedRows(selectedRows);
        return data;
    }

    useEffect(() => {
        Boolean(id) &&
            api.get("store/stockTransfer", id)
                .then((response) => {
                    const { lineItems, fromSite, toSite } = response.data;
                    console.log(lineItems);
                    setOriginalOrder(response.data)
                    setLineItems(mapLineItemsToSelectedRows(lineItems));
                    setFrom(fromSite);
                    setTo(toSite);
                })
                .catch((error) => {
                    alert(error.message);
                })
    }, [])


    //selecting sites
    const sites = useSelector(selectAllSites);
    const openSitesModal = () => setOpenSites(true);
    const closeSitesModal = () => setOpenSites(false);

    //open items modal
    const openItemsModal = () => {
        if (isObjectEmpty(from)) {
            setErrorModal(true);
        } else {
            setOpenItems(true);
            // dispatch(getASiteStock(from.id));
        }
    }
    const closeItemsModal = () => setOpenItems(false);
    const closeErrorModal = () => setErrorModal(false);

    //Handle add line items

    const onAddItemsClicked = (e) => {
        e.preventDefault();
        const selectedRowKeys = Object.keys(selectedRows).map((key) => parseInt(key));
        const lineItems = [];
        selectedRowKeys.map((key) => lineItems.push((prodTableData[key])));
        setLineItems(
            lineItems.map((item) => ({
                ...item,
                requestedQty: 1,
            }))
        )
        closeItemsModal();
    }


    //Handle Create Order product
    const handleSubmit = (e) => {
        e.preventDefault();
        const stockTransferLI =
            lineItems.map((item) => ({
                product: item.product,
                requestedQty: parseInt(item.requestedQty)
            })
            );
        const stockTransferOrder = {
            lineItems: stockTransferLI,
            fromSite: from,
            toSite: to
        }
        console.log("Order created: ", stockTransferOrder)
        dispatch(createStockTransfer({ order: stockTransferOrder, siteId: currSite }))
            .unwrap()
            .then(() => {
                alert("Successfully created stock transfer order");
                navigate(`/${subsys.subsys}/stocktransfer`);
            })
            .catch((error) => {
                alert(error.message);
            })
    }

    //save edit
    const handleSaveEdit = (e) => {
        e.preventDefault();
        const stockTransferLI =
            lineItems.map((item) => ({
                product: item.product,
                requestedQty: parseInt(item.requestedQty)
            })
            );
        originalOrder.lineItems = stockTransferLI;
        originalOrder.fromSite = from;
        originalOrder.toSite = to;
        dispatch(editStockTransfer({ order: originalOrder, siteId: currSite }))
            .unwrap()
            .then(() => {
                alert("Successfully edited stock transfer order");
                navigate(`/${subsys.subsys}/stocktransfer/${id}`);
            })
            .catch((error) => alert(error.message))
    }

    //cancel 
    const onCancelClicked = () => {
        if (isEditing) {
            navigate(`/${subsys.subsys}/stocktransfer/${id}`);
        } else {
            navigate(`/${subsys.subsys}/stocktransfer`);
        }
    }

    return (
        Boolean(originalOrder) && (<>
            <div className="mt-4 max-w-3xl mx-auto px-4 sm:px-6 lg:max-w-7xl lg:px-8">
                <div className="mt-4 grid grid-cols-1 gap-4 items-start lg:gap-8">
                    <section aria-labelledby="stocktransfer-form">
                        <div className="rounded-lg bg-white overflow-hidden shadow">
                            <div className="p-8 space-y-8 divide-y divide-gray-200">
                                <div className="space-y-8 divide-y divide-gray-200 sm:space-y-5">
                                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                                        {isEditing ? "Edit" : "Create"} Stock Transfer Order
                                    </h3>
                                    <div className="grid grid-cols-2">
                                        <div className="col-span-1 mt-6 sm:mt-5 space-y-6 sm:space-y-5">
                                            <div>
                                                <label
                                                    htmlFor="from"
                                                    className="block text-sm font-bold text-gray-900 sm:mt-px sm:pt-2"
                                                >
                                                    From Site
                                                </label>

                                                <div className="mt-3 flex rounded-md shadow-sm">
                                                    <div className="relative flex items-stretch flex-grow focus-within:z-10 h-9">
                                                        <input
                                                            name="from"
                                                            id="from"
                                                            type="text"
                                                            value={isObjectEmpty(from) ? "" : from.name}
                                                            className="block w-3/5 h-full rounded-l-md border-gray-300 shadow-sm focus:border-cyan-500 focus:ring focus:ring-cyan-500 focus:ring-opacity-20"
                                                            placeholder="Select"
                                                            readOnly
                                                        >
                                                        </input>
                                                        <button
                                                            type="button"
                                                            className="-ml-px relative h-full inline-flex items-center space-x-2 px-4 py-2 border border-gray-300 text-sm font-medium rounded-r-md text-gray-700 bg-gray-50 hover:bg-gray-100 focus:outline-none focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500"
                                                            onClick={openSitesModal}
                                                        >
                                                            Select
                                                        </button>
                                                    </div>
                                                </div>

                                            </div>
                                        </div>

                                        <div className="col-span-1 mt-6 sm:mt-5 space-y-6 sm:space-y-5">
                                            <div>
                                                <label
                                                    htmlFor="from"
                                                    className="block text-sm font-bold text-gray-900 sm:mt-px sm:pt-2"
                                                >
                                                    To Site
                                                </label>

                                                <div className="mt-3 flex rounded-md shadow-sm">
                                                    <div className="relative flex items-stretch flex-grow focus-within:z-10 h-9">
                                                        <input
                                                            name="to"
                                                            id="to"
                                                            type="text"
                                                            value={isObjectEmpty(to) ? "" : to.name}
                                                            className="block w-3/5 h-full rounded-l-md border-gray-300 shadow-sm focus:border-cyan-500 focus:ring focus:ring-cyan-500 focus:ring-opacity-20"
                                                            placeholder="Search Site"
                                                            readOnly
                                                        >
                                                        </input>
                                                        <button
                                                            type="button"
                                                            className="-ml-px relative h-full inline-flex items-center space-x-2 px-4 py-2 border border-gray-300 text-sm font-medium rounded-r-md text-gray-700 bg-gray-50 hover:bg-gray-100 focus:outline-none focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500"
                                                            onClick={openSitesModal}
                                                        >
                                                            Select
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="pt-8">
                                        <div className="md:flex md:items-center md:justify-between">
                                            <h3 className="text-md leading-6  font-bold text-gray-900">
                                                Items List
                                            </h3>
                                            <div className="mt-6 flex space-x-3 md:mt-0 md:ml-4">
                                                <button
                                                    type="button"
                                                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-cyan-600 hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500"
                                                    onClick={openItemsModal}
                                                >
                                                    Add Items
                                                </button>
                                            </div>
                                        </div>
                                        <div className="m-2">
                                            <LineItemsTable data={lineItems} setLineItems={setLineItems} />
                                        </div>
                                        <div className="flex justify-end">
                                            <button
                                                type="button"
                                                className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500"
                                                onClick={onCancelClicked}
                                            >
                                                Cancel
                                            </button>
                                            {!isEditing ? <button
                                                type="submit"
                                                className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-cyan-600 hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500"
                                                onClick={handleSubmit}
                                            >
                                                Create
                                            </button> :
                                                <button
                                                    type="submit"
                                                    className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-cyan-600 hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500"
                                                    onClick={handleSaveEdit}
                                                >
                                                    Save Edit
                                                </button>}
                                        </div>
                                    </div>

                                </div>
                            </div>
                        </div>
                    </section>
                </div>
            </div>

            <SelectSiteModal
                open={openSites}
                closeModal={closeSitesModal}
                from={from}
                to={to}
                setFrom={setFrom}
                setTo={setTo}
                data={sites} />

            <AddItemsModal
                data={prodTableData}
                setData={setLineItems}
                open={openItems}
                closeModal={closeItemsModal}
                selectedRows={selectedRows}
                setRowSelect={setSelectedRows}
                onAddItemsClicked={onAddItemsClicked}
            />

            <ErrorModal open={openErrorModal} closeModal={closeErrorModal}
                title="From Site Not Selected"
                message="Please choose a from site before adding items." />

        </>
    ))
}